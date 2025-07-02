const fs = require("fs");
const path = require("path");

/**
 * -----------------------------------------------------------------------------
 * generateRules.js
 * -----------------------------------------------------------------------------
 * A small utility that scans an Amazon Selling-Partner JSON-Schema, extracts
 * every rule of the shape `{ if: { allOf: [...] }, then: {...} }` and emits
 * plain-JavaScript `if … else` conditions that you can run to validate an input
 * payload.
 *
 * Usage:
 *   node generateRules.js <path/to/schema.json>   > laptopRules.js
 *   node generateRules.js                         # falls back to ./schema.json
 *
 * The generated file exports a single `validate(data)` function which throws a
 * descriptive Error whenever one of the extracted rules is violated.
 * -------------------------------------------------------------------------- */

const SCHEMA_PATH = process.argv[2] || path.join(__dirname, "amazon_schema_LAPTOP.json");
// Optional 2nd argument: custom output filename. Falls back to <schemaBase>_rules.js
const OUTPUT_PATH =
  process.argv[3] ||
  path.join(path.dirname(SCHEMA_PATH), path.basename(SCHEMA_PATH, path.extname(SCHEMA_PATH)) + "_rules.js");

if (!fs.existsSync(SCHEMA_PATH)) {
  console.error(`Schema file not found: ${SCHEMA_PATH}`);
  process.exit(1);
}

const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));

/******************************************************************
 *  Step-1 —— gather every  { if: { allOf: [...] }, then: {...} }
 ******************************************************************/
function collectAllOfRules(node, pathSeg = "$", bucket = []) {
  if (node && typeof node === "object") {
    if (node.if?.allOf && node.then) {
      bucket.push({ path: pathSeg, allOf: node.if.allOf, then: node.then });
    }
    for (const [k, v] of Object.entries(node)) {
      collectAllOfRules(v, `${pathSeg}.${k}`, bucket);
    }
  }
  return bucket;
}

/******************************************************************
 *  Step-2 —— convert a (sub-)schema into a JS boolean expression
 ******************************************************************/
function jsTest(schemaPart, dataVar = "data") {
  if (!schemaPart || typeof schemaPart !== "object") return "true";

  if (schemaPart.allOf) {
    return "(" + schemaPart.allOf.map((s) => jsTest(s, dataVar)).join(" && ") + ")";
  }
  if (schemaPart.anyOf) {
    return "(" + schemaPart.anyOf.map((s) => jsTest(s, dataVar)).join(" || ") + ")";
  }
  if (schemaPart.not) {
    return "!" + jsTest(schemaPart.not, dataVar);
  }
  if (schemaPart.required) {
    // Build conjunction: every "required" field must satisfy its property rules
    return schemaPart.required
      .map((field) => {
        const propRules = schemaPart.properties?.[field];
        let test = `${dataVar}.${field} !== undefined`;

        // Handle objects/arrays with "contains" sub-rules
        if (propRules?.contains) {
          const arrVar = `${dataVar}.${field}`;
          test = `${arrVar} && Array.isArray(${arrVar}) && ${arrVar}.some(item => ${jsTest(
            propRules.contains,
            "item"
          )})`;
        } else if (propRules?.enum) {
          test = propRules.enum.map((v) => `${dataVar}.${field} === ${JSON.stringify(v)}`).join(" || ");
        }
        return `(${test})`;
      })
      .join(" && ");
  }
  if (schemaPart.enum) {
    return "(" + schemaPart.enum.map((v) => `${dataVar} === ${JSON.stringify(v)}`).join(" || ") + ")";
  }
  // Unknown/unsupported keyword – treat as passthrough
  return "true";
}

/******************************************************************
 *  Step-3 —— create the entire validate() function as a string
 ******************************************************************/
function buildValidator(schemaRoot) {
  const rules = collectAllOfRules(schemaRoot);
  let out = "";
  out += "/** Generated from Amazon Schema — DO NOT EDIT by hand */\n";
  out += "function validate(data) {\n";

  rules.forEach((rule, idx) => {
    const condition = jsTest({ allOf: rule.allOf });
    const thenReq = rule.then.required || [];
    const thenCheck = thenReq.length ? thenReq.map((f) => `data.${f} !== undefined`).join(" && ") : "true";

    out += `  // Rule ${idx + 1} — extracted from ${rule.path}\n`;
    out += `  if (${condition}) {\n`;
    out += `    if (!(${thenCheck})) {\n`;
    out += `      throw new Error('Rule ${idx + 1} violated — required fields: ${thenReq.join(", ")}');\n`;
    out += "    }\n";
    out += "  }\n\n";
  });

  out += "  return true;\n";
  out += "}\n\n";

  // ----- Extras: helper that lists which fields are missing right now -----
  out += "function getMissingFields(data) {\n";
  out += "  const missing = [];\n";

  rules.forEach((rule, idx) => {
    const condition = jsTest({ allOf: rule.allOf });
    const thenReq = rule.then.required || [];
    const thenReqLiteral = JSON.stringify(rule.then.required || []);
    out += `  // Rule ${idx + 1}\n`;
    out += `  if (${condition}) {\n`;
    out += `    ${thenReqLiteral}.forEach(f => { if (data[f] === undefined) missing.push(f); });\n`;
    out += "  }\n\n";
  });

  out += "  return [...new Set(missing)];\n";
  out += "}\n\n";

  out += "module.exports = { validate, getMissingFields };\n";
  return out;
}

/******************************************************************
 *  Step-4 —— output code to stdout so the caller can redirect it
 ******************************************************************/
const generatedCode = buildValidator(schema);

// 1) Write to file so the user can immediately import it.
fs.writeFileSync(OUTPUT_PATH, generatedCode, "utf8");

// 2) Also print to stdout (handy for piping / quick inspection)
console.log(generatedCode);

// 3) Notify where we saved the file.
console.error(`\nValidator written to: ${OUTPUT_PATH}`);
