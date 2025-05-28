const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const fs = require("fs");
const path = require("path");

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const schemaPath = path.join(__dirname, "..", "schemas", "agent.schema.json");
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

const validate = ajv.compile(schema);

function validateAgentData(data) {
  const valid = validate(data);
  if (!valid) {
    return validate.errors;
  }
  return null;
}

module.exports = { validateAgentData, validate };

// Example usage:
// const dataDirectory = path.join(__dirname, "..", "data");
// fs.readdirSync(dataDirectory).forEach(file => {
//   if (path.extname(file) === ".json") {
//     const filePath = path.join(dataDirectory, file);
//     const agentData = JSON.parse(fs.readFileSync(filePath, "utf8"));
//     const errors = validateAgentData(agentData);
//     if (errors) {
//       console.error(`Validation failed for ${file}:`);
//       console.error(JSON.stringify(errors, null, 2));
//     } else {
//       console.log(`${file} is valid.`);
//     }
//   }
// });
