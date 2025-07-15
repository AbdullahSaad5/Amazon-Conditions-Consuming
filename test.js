const { validateFromFile } = require("./validate");

// const payload = {
//   bullet_point: [
//     {
//       value: "Latitude 11th Generation Core i7-1165G7 processor with Intel Iris Xe Graphics",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//     {
//       value: "32GB LPDDR4x RAM and 256GB PCIe NVMe SSD storage",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//     {
//       value: "13.3-inch FHD (1920x1080) InfinityEdge non-touch display",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//     {
//       value: "Wi-Fi 6 AX1650 and Bluetooth 5.1 connectivity",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//     {
//       value: "Windows 11 PRO pre-installed with premium build quality",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   solid_state_storage_drive: [
//     {
//       marketplace_id: "A1F83G8C2ARO7P",
//       capacity: {
//         value: 256,
//         unit: "gigabyte",
//       },
//       form_factor: "2_5_inches",
//       interface: "m_sata",
//       maximum_random_read: {
//         value: 30000,
//         unit: "gigabyte",
//       },
//       maximum_random_write: {
//         value: 25000,
//         unit: "gigabyte",
//       },
//       maximum_sequential_read: {
//         value: 3500,
//         unit: "megabits_per_second",
//       },
//       maximum_sequential_write: {
//         value: 3000,
//         unit: "megabits_per_second",
//       },
//     },
//   ],
//   flash_memory: [
//     {
//       installed_size: [
//         {
//           value: 16.0,
//           unit: "MB",
//         },
//       ],
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   ram_memory: [
//     {
//       marketplace_id: "A1F83G8C2ARO7P",
//       installed_size: [
//         {
//           value: 32.0,
//           unit: "GB",
//         },
//       ],
//       maximum_size: [
//         {
//           value: 64.0,
//           unit: "GB",
//         },
//       ],
//       technology: [
//         {
//           value: "DDR4",
//           language_tag: "en_GB",
//         },
//       ],
//     },
//   ],
//   computer_memory: [
//     {
//       size: [
//         {
//           value: 16.0,
//           unit: "GB",
//         },
//         {
//           value: 32.0,
//           unit: "GB",
//         },
//       ],
//     },
//   ],
//   merchant_suggested_asin: [
//     {
//       value: "0123456329",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   // "child_parent_sku_relationship": [
//   //     {
//   //         "child_relationship_type": "variation",
//   //         "marketplace_id": "A1F83G8C2ARO7P",
//   //         "parent_sku": "12323123223131"
//   //     }
//   // ],
//   hard_disk: [
//     {
//       marketplace_id: "A1F83G8C2ARO7P",
//       description: [
//         {
//           value: "Hybrid Drive",
//           language_tag: "en_GB",
//         },
//       ],
//       interface: [
//         {
//           value: "ata_4",
//         },
//       ],
//       rotational_speed: [
//         {
//           value: "7200",
//           unit: "rpm",
//         },
//       ],
//       size: [
//         {
//           value: 256,
//           unit: "GB",
//         },
//         {
//           value: 512,
//           unit: "GB",
//         },
//       ],
//     },
//   ],
//   processor_description: [
//     {
//       value: "AMD Radeon 535",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//     {
//       value: "AMD Ryzen PRO",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   graphics_coprocessor: [
//     {
//       value: "AMD Radeon 535",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   total_usb_2_0_ports: [
//     {
//       value: 2,
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   total_usb_3_0_ports: [
//     {
//       value: 2,
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   specific_uses_for_product: [
//     {
//       value: "Business",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   accepted_voltage_frequency: [
//     {
//       value: "100v_120v_50hz",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   graphics_card_interface: [
//     {
//       value: "integrated",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   optical_storage: [
//     {
//       device_description: [
//         {
//           value: "CD-ROM",
//           language_tag: "en_GB",
//         },
//       ],
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   version_for_country: [
//     {
//       value: "GB",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   processor_count: [
//     {
//       value: 2,
//     },
//   ],
//   cpu_model: [
//     {
//       marketplace_id: "A1F83G8C2ARO7P",
//       codename: [
//         {
//           value: "Amber Lake",
//           language_tag: "en_GB",
//         },
//       ],
//       family: [
//         {
//           value: "a10",
//         },
//       ],
//       generation: [
//         {
//           value: "11th Generation",
//           language_tag: "en_GB",
//         },
//       ],
//       l1_cache_size: [
//         {
//           value: 192,
//           unit: "KB",
//         },
//       ],
//       l2_cache_size: [
//         {
//           value: 5,
//           unit: "MB",
//         },
//       ],
//       l3_cache_size: [
//         {
//           value: 12,
//           unit: "MB",
//         },
//       ],
//       manufacturer: [
//         {
//           value: "Intel",
//           language_tag: "en_GB",
//         },
//       ],
//       model_number: [
//         {
//           value: "i7-1165G7",
//           language_tag: "en_GB",
//         },
//       ],
//       speed: [
//         {
//           value: 2.8,
//           unit: "GHz",
//         },
//       ],
//       speed_maximum: [
//         {
//           value: 4.7,
//           unit: "GHz",
//         },
//       ],
//     },
//   ],
//   gdpr_risk: [
//     {
//       value: "no_electronic_information_stored",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   model_year: [
//     {
//       value: "2017",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   display: [
//     {
//       marketplace_id: "A1F83G8C2ARO7P",
//       resolution_maximum: [
//         {
//           value: "1920x1080",
//           unit: "pixels",
//           language_tag: "en_GB",
//         },
//       ],
//       size: [
//         {
//           value: 13.3,
//           unit: "inches",
//         },
//       ],
//       technology: [
//         {
//           value: "LED",
//           language_tag: "en_GB",
//         },
//       ],
//       type: [
//         {
//           value: "LCD",
//           language_tag: "en_GB",
//         },
//       ],
//     },
//   ],
//   manufacturer: [
//     {
//       value: "Dell Inc.",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   warranty_description: [
//     {
//       value: "1 Year Test Warranty",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   graphics_description: [
//     {
//       value: "Dedicated",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   model_name: [
//     {
//       value: "XPS 13 9310",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   model_number: [
//     {
//       value: "XPS13-9310-i7-16-512",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   list_price: [
//     {
//       currency: "GBP",
//       value_with_tax: 1200.0,
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   // "parentage_level": [
//   //     {
//   //         "value": "parent",
//   //         "marketplace_id": "A1F83G8C2ARO7P"
//   //     }
//   // ],
//   //   "externally_assigned_product_identifier": [
//   //     {
//   //         "type": "gtin",
//   //         "value": "01234567890512",
//   //         "marketplace_id": "A1F83G8C2ARO7P"
//   //     }
//   // ],
//   number_of_items: [
//     {
//       value: 1,
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   target_region: [
//     {
//       value: "Europe",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   operating_system: [
//     {
//       value: "Windows 10 Pro",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   graphics_processor_manufacturer: [
//     {
//       value: "AMD",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   graphics_ram: [
//     {
//       size: [
//         {
//           value: 6.0,
//           unit: "GB",
//         },
//       ],
//       type: [
//         {
//           value: "dram",
//         },
//       ],
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   power_plug_type: [
//     {
//       value: "no_plug",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   included_components: [
//     {
//       value: "Mouse",
//       marketplace_id: "A1F83G8C2ARO7P",
//       language_tag: "en_GB",
//     },
//   ],
//   condition_type: [
//     {
//       value: "new_new",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   color: [
//     {
//       value: "black",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   memory_storage_capacity: [
//     {
//       marketplace_id: "A1F83G8C2ARO7P",
//       value: 320000,
//       unit: "MB",
//     },
//   ],
//   item_weight: [
//     {
//       value: "3",
//       unit: "pounds",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   supplier_declared_has_product_identifier_exemption: [
//     {
//       value: false,
//     },
//   ],
//   generic_keyword: [
//     {
//       value: "laptop computer notebook ultrabook portable",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   max_order_quantity: [
//     {
//       value: 10,
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   fulfillment_availability: [
//     {
//       fulfillment_channel_code: "DEFAULT",
//       lead_time_to_ship_max_days: 20,
//       // "quantity": 0,
//       is_inventory_available: false,
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   recommended_browse_nodes: [
//     {
//       value: "3234343",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   // "variation_theme": [
//   //     {
//   //         "name": "COLOR/DISPLAY_SIZE/MEMORY_STORAGE_CAPACITY/RAM_MEMORY_INSTALLED_SIZE/GRAPHICS_COPROCESSOR/OPERATING_SYSTEM"
//   //     }
//   // ],
//   country_of_origin: [
//     {
//       value: "CN",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   supplier_declared_dg_hz_regulation: [
//     {
//       value: "not_applicable",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   purchasable_offer: [
//     {
//       audience: "ALL",
//       marketplace_id: "A1F83G8C2ARO7P",
//       currency: "GBP",
//       our_price: [
//         {
//           schedule: [
//             {
//               value_with_tax: 1200.0,
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   item_length_width_thickness: [
//     {
//       length: {
//         value: "144.64",
//         unit: "centimeters",
//       },
//       width: {
//         value: "8.82",
//         unit: "centimeters",
//       },
//       thickness: {
//         value: "8",
//         unit: "centimeters",
//       },
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
//   item_display_weight: [
//     {
//       value: "7.82",
//       unit: "pounds",
//       marketplace_id: "A1F83G8C2ARO7P",
//     },
//   ],
// };

const payload = {
  recommended_browse_nodes: [
    {
      value: "123456",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  bullet_point: [
    {
      value: "Intel 11th Generation Core i7-1165G7 processor with Intel Iris Xe Graphics",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  processor_description: [
    {
      value: "processor 1",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  country_of_origin: [
    {
      value: "AL",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  supplier_declared_dg_hz_regulation: [
    {
      value: "not_applicable",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  merchant_suggested_asin: [
    {
      value: "1234567890",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  model_name: [
    {
      value: "model name 1",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  manufacturer: [
    {
      value: "Dell INc",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  model_year: [
    {
      value: 2017,
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  fulfillment_availability: [
    {
      fulfillment_channel_code: "DEFAULT",
      is_inventory_available: false,
    },
  ],
  condition_type: [
    {
      value: "new_new",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  list_price: [
    {
      currency: "GBP",
      marketplace_id: "A1F83G8C2ARO7P",
      value_with_tax: 1200,
    },
  ],
  number_of_items: [
    {
      value: 3,
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  display: [
    {
      marketplace_id: "A1F83G8C2ARO7P",
      size: [
        {
          value: 13.3,
          unit: "centimeters",
        },
      ],
      type: [
        {
          value: "LCD",
          language_tag: "en_GB",
        },
      ],
    },
  ],
  graphics_processor_manufacturer: [
    {
      value: "AMD",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  graphics_description: [
    {
      value: "Graphics Description example",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  processor_count: [
    {
      value: 2,
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  power_plug_type: [
    {
      value: "16_a_5_pin",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  accepted_voltage_frequency: [
    {
      value: "100v_120v_50hz",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  operating_system: [
    {
      value: "window 10",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  graphics_card_interface: [
    {
      value: "agp",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  ram_memory: [
    {
      installed_size: [
        {
          value: 4,
          unit: "bytes",
        },
      ],
      marketplace_id: "A1F83G8C2ARO7P",
      maximum_size: [
        {
          value: 3,
          unit: "GB",
        },
      ],
      technology: [
        {
          value: "DDR3",
          language_tag: "en_GB",
        },
      ],
    },
  ],
  included_components: [
    {
      value: "Mouse",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  specific_uses_for_product: [
    {
      value: "Business",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  cpu_model: [
    {
      codename: [
        {
          value: "Tiger Lake",
          language_tag: "en_GB",
        },
      ],
      family: [
        {
          value: "5x86",
        },
      ],
      generation: [
        {
          value: "11th Generatiom",
          language_tag: "en_GB",
        },
      ],
      manufacturer: [
        {
          value: "Intel",
          language_tag: "en_GB",
        },
      ],
      marketplace_id: "A1F83G8C2ARO7P",
      model_number: [
        {
          value: "i7-1165G7",
          language_tag: "en_GB",
        },
      ],
      speed: [
        {
          value: 2.8,
          unit: "GHz",
        },
      ],
    },
  ],
  flash_memory: [
    {
      installed_size: [
        {
          value: 8,
          unit: "GB",
        },
      ],
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  graphics_ram: [
    {
      marketplace_id: "A1F83G8C2ARO7P",
      size: [
        {
          value: 5,
          unit: "GB",
        },
      ],
      type: [
        {
          value: "72_pin_edo_simm",
        },
      ],
    },
  ],
  hard_disk: [
    {
      marketplace_id: "A1F83G8C2ARO7P",
      size: [
        {
          value: 234,
          unit: "GB",
        },
        {
          value: 500,
          unit: "GB",
        },
        {
          value: 150,
          unit: "GB",
        },
      ],
    },
  ],
  solid_state_storage_drive: [
    {
      capacity: {
        value: 345,
        unit: "gigabyte",
      },
      form_factor: "2_5_inches",
      interface: "m2",
      marketplace_id: "A1F83G8C2ARO7P",
      maximum_random_read: {
        value: 123,
        unit: "exabyte",
      },
      maximum_random_write: {
        value: 123,
        unit: "exabyte",
      },
      maximum_sequential_read: {
        value: 123,
        unit: "exabyte",
      },
      maximum_sequential_write: {
        value: 123,
        unit: "exabyte",
      },
    },
  ],
  optical_storage: [
    {
      device_description: [
        {
          value: "CD-ROM",
          language_tag: "en_GB",
        },
      ],
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  target_region: [
    {
      value: "Europe",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  version_for_country: [
    {
      value: "AF",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  total_usb_2_0_ports: [
    {
      value: 2,
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  total_usb_3_0_ports: [
    {
      value: 4,
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  gdpr_risk: [
    {
      value: "cloud_account_connectivity",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  item_length_width_thickness: [
    {
      length: {
        value: 23,
        unit: "centimeters",
      },
      marketplace_id: "A1F83G8C2ARO7P",
      thickness: {
        value: 87,
        unit: "centimeters",
      },
      width: {
        value: 23,
        unit: "centimeters",
      },
    },
  ],
  warranty_description: [
    {
      value: "2 years",
      language_tag: "en_GB",
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  batteries_required: [
    {
      value: false,
      marketplace_id: "A1F83G8C2ARO7P",
    },
  ],
  fulfillment_availability: [
    {
      fulfillment_channel_code: "AMAZON_EU",
      restock_date: "2020-05-05",
    },
  ],
};

let validateResult;

validateResult = validateFromFile("./amazon_schema_LAPTOP.json", payload, ["color", "hard_disk.size"]);
console.log("----------------------- VALIDATE RESULT FOR LAPTOP -----------------------");
console.log(JSON.stringify(validateResult, null, 2));
console.log("----------------------- END VALIDATE RESULT FOR LAPTOP -----------------------");

// validateResult = validateFromFile("./amazon_schema_GAMING_PC.json", payload);
// console.log("----------------------- VALIDATE RESULT FOR GAMING PC -----------------------");
// console.log(validateResult);
// console.log("----------------------- END VALIDATE RESULT FOR GAMING PC -----------------------");

// validateResult = validateFromFile("./amazon_schema_VIDEO_PROJECTOR.json", payload);
// console.log("----------------------- VALIDATE RESULT FOR VIDEO PROJECTOR -----------------------");
// console.log(validateResult);
// console.log("----------------------- END VALIDATE RESULT FOR VIDEO PROJECTOR -----------------------");

console.log("----------------------- END TESTING VARIATIONS -----------------------");
