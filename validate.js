/**
 * Very–lightweight JSON-Schema validator specialised for Amazon Selling Partner
 * product-type schemas (draft-07 like style with $defs, allOf, array/item rules,
 * custom keywords such as `editable`, `hidden`, `enumNames`, etc.).
 *
 * No external dependencies and fully synchronous.
 */

// Public API ---------------------------------------------------------------

/**
 * Validate `data` against `schema`.
 * @param {Object} schema – JSON schema to validate against.
 * @param {*}      data   – Arbitrary user payload.
 * @returns {{valid:boolean,errors:Array<{path:string,message:string}>}}
 */
function validate(schema, data) {
  const errors = [];
  validateSchema(schema, data, "root", schema, errors);
  return { valid: errors.length === 0, errors };
}

// -------------------------------------------------------------------------
// Core dispatchers
// -------------------------------------------------------------------------

/**
 * Generic validator that dispatches to specialised routines based on schema
 * contents (type, allOf/oneOf/anyOf, $ref, etc.).
 */
function validateSchema(schema, data, path, rootSchema, errors) {
  if (!schema || typeof schema !== "object") {
    errors.push({ path, message: "Invalid or empty schema node" });
    return;
  }

  // $ref handling – resolve and replace
  if (schema.$ref) {
    const resolved = resolveRef(schema.$ref, rootSchema);
    if (!resolved) {
      errors.push({ path, message: `Unable to resolve $ref ${schema.$ref}` });
      return;
    }
    validateSchema(resolved, data, path, rootSchema, errors);
    return;
  }

  // Handle meta-keywords first (allOf/anyOf/oneOf)
  if (schema.allOf) {
    validateAllOf(schema.allOf, data, path, rootSchema, errors);
  }
  if (schema.anyOf) {
    validateAnyOf(schema.anyOf, data, path, rootSchema, errors);
  }
  if (schema.oneOf) {
    validateOneOf(schema.oneOf, data, path, rootSchema, errors);
  }

  // Type-based validation – infer if missing
  const expectedType = schema.properties
    ? "object"
    : schema.items || schema.contains
    ? "array"
    : schema.required
    ? "object"
    : undefined;

  switch (expectedType) {
    case "object":
      validateObject(schema, data, path, rootSchema, errors);
      break;
    case "array":
      validateArray(schema, data, path, rootSchema, errors);
      break;
    case "string":
    case "number":
    case "integer":
    case "boolean":
    case "null":
      validatePrimitive(schema, data, path, errors);
      break;
    default:
      // If no explicit type, still allow recursion for nested keywords.
      if (schema.properties || schema.items) {
        validateObject(schema, data, path, rootSchema, errors);
      } else if (schema.enum || schema.pattern || schema.const !== undefined) {
        // Primitive constraints without explicit type
        validatePrimitive({ ...schema, type: getJsonType(data) }, data, path, errors);
      }
  }

  // Custom Amazon vocab – warn only
  handleCustomVocabulary(schema, path);
}

// -------------------------------------------------------------------------
// $ref resolver
// -------------------------------------------------------------------------

function resolveRef(ref, rootSchema) {
  if (!ref.startsWith("#/")) return null;
  const parts = ref
    .substring(2)
    .split("/")
    .map((p) => decodeURIComponent(p));
  let target = rootSchema;
  for (const segment of parts) {
    if (target && Object.prototype.hasOwnProperty.call(target, segment)) {
      target = target[segment];
    } else {
      return null;
    }
  }
  return target;
}

// -------------------------------------------------------------------------
// Object validation
// -------------------------------------------------------------------------

function validateObject(schema, data, path, rootSchema, errors) {
  const actualType = getJsonType(data);
  if (schema.type === "object") {
    if (actualType !== "object") {
      errors.push({ path, message: `Expected object but got ${actualType}` });
      return;
    }
  } else {
    // For schemas without explicit type, if data isn't an object, skip deeper
    if (actualType !== "object") {
      return; // cannot validate nested properties against non-object value
    }
  }

  if (schema.required && Array.isArray(schema.required)) {
    for (const req of schema.required) {
      // Support Amazon's dotted path notation like "display.size"
      if (req.includes(".")) {
        const segments = req.split(".");
        if (!existsByPath(data, segments)) {
          errors.push({ path: `${path}.${req}`, message: "Required property missing" });
        }
      } else {
        if (!(req in data)) {
          errors.push({ path: `${path}.${req}`, message: "Required property missing" });
        }
      }
    }
  }

  const props = schema.properties || {};
  for (const [key, propSchema] of Object.entries(props)) {
    if (key in data) {
      validateSchema(propSchema, data[key], `${path}.${key}`, rootSchema, errors);
    }
  }
}

/**
 * Helper to check existence of nested property path supporting arrays.
 * For arrays, returns true if ANY element satisfies the remainder path.
 * @param {any} obj       – Current data fragment.
 * @param {string[]} segs – Remaining path segments.
 * @returns {boolean}
 */
function existsByPath(obj, segs) {
  if (segs.length === 0) return true;
  if (obj === null || obj === undefined) return false;

  const [first, ...rest] = segs;
  if (Array.isArray(obj)) {
    // At array level: property may exist in ANY element
    return obj.some((item) => existsByPath(item, segs));
  }
  if (typeof obj === "object") {
    if (!Object.prototype.hasOwnProperty.call(obj, first)) return false;
    return existsByPath(obj[first], rest);
  }
  return false;
}

// -------------------------------------------------------------------------
// Array validation
// -------------------------------------------------------------------------

function validateArray(schema, data, path, rootSchema, errors) {
  if (!Array.isArray(data)) {
    errors.push({ path, message: `Expected array but got ${getJsonType(data)}` });
    return;
  }

  const { minItems, maxItems, minUniqueItems, maxUniqueItems } = schema;

  if (typeof minItems === "number" && data.length < minItems) {
    errors.push({ path, message: `Array has fewer items (${data.length}) than minimum ${minItems}` });
  }
  if (typeof maxItems === "number" && data.length > maxItems) {
    errors.push({ path, message: `Array has more items (${data.length}) than maximum ${maxItems}` });
  }

  // Uniqueness – simple JSON.stringify comparison
  if (typeof minUniqueItems === "number" || typeof maxUniqueItems === "number") {
    const unique = new Set(data.map((v) => JSON.stringify(v)));
    if (typeof minUniqueItems === "number" && unique.size < minUniqueItems) {
      errors.push({ path, message: `Array unique items (${unique.size}) less than minimum ${minUniqueItems}` });
    }
    if (typeof maxUniqueItems === "number" && unique.size > maxUniqueItems) {
      errors.push({ path, message: `Array unique items (${unique.size}) greater than maximum ${maxUniqueItems}` });
    }
  }

  // Item validation
  if (schema.items) {
    data.forEach((item, idx) => {
      validateSchema(schema.items, item, `${path}[${idx}]`, rootSchema, errors);
    });
  }

  // Draft-07 `contains` – ensure at least one array element matches sub-schema.
  if (schema.contains) {
    let matchCount = 0;
    data.forEach((item) => {
      const temp = [];
      validateSchema(schema.contains, item, path, rootSchema, temp);
      if (temp.length === 0) matchCount += 1;
    });

    const minContains = typeof schema.minContains === "number" ? schema.minContains : 1;
    const maxContains = typeof schema.maxContains === "number" ? schema.maxContains : undefined;

    if (matchCount < minContains) {
      errors.push({ path, message: `Array must contain at least ${minContains} item(s) matching contains schema` });
    } else if (maxContains !== undefined && matchCount > maxContains) {
      errors.push({ path, message: `Array must contain no more than ${maxContains} items matching contains schema` });
    }
  }
}

// -------------------------------------------------------------------------
// Primitive validation (string, number, boolean, etc.)
// -------------------------------------------------------------------------

function validatePrimitive(schema, data, path, errors) {
  const actualType = getJsonType(data);
  if (!typeMatches(schema.type, data)) {
    errors.push({ path, message: `Expected ${schema.type} but got ${actualType}` });
    return;
  }

  if (schema.enum && !schema.enum.includes(data)) {
    errors.push({ path, message: `Value ${data} not in enum` });
  }

  if (schema.pattern && typeof data === "string") {
    const re = new RegExp(schema.pattern);
    if (!re.test(data)) {
      errors.push({ path, message: `String does not match pattern ${schema.pattern}` });
    }
  }
}

function typeMatches(expected, value) {
  const actual = getJsonType(value);
  switch (expected) {
    case "number":
      // Draft-07: "number" includes both integer and non-integer numeric values
      return actual === "number" || actual === "integer";
    case "integer":
      return actual === "integer";
    default:
      return actual === expected;
  }
}

// -------------------------------------------------------------------------
// allOf / anyOf / oneOf handling
// -------------------------------------------------------------------------

function validateAllOf(list, data, path, rootSchema, errors) {
  for (const sub of list) {
    // Conditional support: if/then/else inside allOf element
    if (sub.if) {
      const conditionErrors = [];
      validateSchema(sub.if, data, path, rootSchema, conditionErrors);
      const conditionMet = conditionErrors.length === 0;
      if (conditionMet && sub.then) {
        validateSchema(sub.then, data, path, rootSchema, errors);
      } else if (!conditionMet && sub.else) {
        validateSchema(sub.else, data, path, rootSchema, errors);
      }
    } else {
      validateSchema(sub, data, path, rootSchema, errors);
    }
  }
}

function validateAnyOf(list, data, path, rootSchema, errors) {
  let anyValid = false;
  const collectedErrors = [];
  for (const sub of list) {
    const tempErrors = [];
    validateSchema(sub, data, path, rootSchema, tempErrors);
    if (tempErrors.length === 0) {
      anyValid = true;
      break;
    }
    collectedErrors.push(...tempErrors);
  }
  if (!anyValid) {
    errors.push({ path, message: "Failed to match anyOf schemas", details: collectedErrors });
  }
}

function validateOneOf(list, data, path, rootSchema, errors) {
  let matchCount = 0;
  for (const sub of list) {
    const tempErrors = [];
    validateSchema(sub, data, path, rootSchema, tempErrors);
    if (tempErrors.length === 0) {
      matchCount += 1;
    }
  }
  if (matchCount !== 1) {
    errors.push({ path, message: `Failed oneOf – matched ${matchCount} schemas` });
  }
}

// -------------------------------------------------------------------------
// Custom Amazon vocabulary – warn only
// -------------------------------------------------------------------------

function handleCustomVocabulary(schema, path) {
  const customKeywords = [
    "editable",
    "hidden",
    "enumNames",
    "maxUtf8ByteLength",
    "maxLengthUtf8", // some schemas use variants
  ];
  for (const key of customKeywords) {
    if (schema[key] !== undefined) {
      //TODO: Commented out for now to avoid console.warn
      //   console.warn(`Custom keyword "${key}" found at ${path} – not enforced.`);
    }
  }
}

// -------------------------------------------------------------------------
// Exports (CommonJS & ES Module friendly)
// -------------------------------------------------------------------------

// Detect Node.js environment to enable sync file loading for schemas
const IS_NODE = typeof process !== "undefined" && process.versions && process.versions.node;
let fs;
if (IS_NODE) {
  fs = require("fs");
}

/**
 * Load and parse a JSON schema from disk synchronously (Node.js only).
 * @param {string} filePath – Absolute or relative path to *.json schema.
 * @returns {Object} Parsed schema object.
 * @throws  {Error}  If reading or parsing fails.
 */
function loadSchemaSync(filePath) {
  if (!IS_NODE) {
    throw new Error("loadSchemaSync is only available in Node.js environments");
  }
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

/**
 * Convenience helper that reads the schema file from disk then validates data.
 * @param {string} filePath – Path to schema JSON file.
 * @param {*}      data     – Data to validate.
 * @returns {{valid:boolean,errors:Array<{path:string,message:string}>}}
 */
function validateFromFile(filePath, data) {
  const schema = loadSchemaSync(filePath);
  return validate(schema, data);
}

// Utility to get JSON type label (string,array,object,number,integer,boolean,null)
function getJsonType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "integer" : "number";
  }
  return typeof value; // string, boolean, object, undefined, function
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = { validate, validateFromFile, loadSchemaSync };
  // Preserve named export for ESM via package.json "type": "module" or transpiler
  module.exports.default = module.exports;
} else {
  // Browser global – file-loading helpers not exposed
  window.AmazonSchemaValidator = { validate };
}
