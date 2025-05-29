// scripts/promote-drafts.js
require('dotenv').config(); // For potential API keys for the LLM
const fs = require('fs').promises;
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const OpenAI = require('openai');
const agentSchema = require('../schemas/agent.schema.json'); // Load the schema
const PROMPT_TEMPLATE_PATH = path.join(__dirname, 'config', 'promote-drafts.prompt.txt'); // Path to the new prompt file

const DRAFTS_DIR = path.join(__dirname, '..', 'data', 'drafts');
const DATA_DIR = path.join(__dirname, '..', 'data');
// const FAILED_PROMOTION_DIR = path.join(__dirname, '..', 'data', 'failed_promotions'); // Optional: for files that fail LLM/validation

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(agentSchema);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define which fields the LLM should attempt to fill if they are empty
const LLM_TARGET_FIELDS = [
    { name: 'highlight', type: 'string' },
    { name: 'purpose', type: 'string' },
    { name: 'principle', type: 'string' },
    { name: 'reusability', type: 'string' },
    { name: 'limitations', type: 'string' },
    { name: 'category', type: 'string', isEnum: true }, // Added category
    { name: 'status', type: 'string', isEnum: true },
    { name: 'language', type: 'string' },
    { name: 'stack', type: 'array' },
    { name: 'tags', type: 'array' },
    { name: 'useful_links', type: 'array' }, // Renamed from demo_links - broader scope for important repository links
    { name: 'platforms', type: 'array' }
];

const PLACEHOLDER_STRINGS = ["N/A", "TODO", ""];

/**
 * Checks if a field's value is considered empty.
 * @param {*} value - The value of the field.
 * @param {string} type - The expected type of the field ('string' or 'array').
 * @returns {boolean} True if the field is empty, false otherwise.
 */
function isFieldEmpty(value, type) {
    if (value === null || value === undefined) {
        return true;
    }
    if (type === 'string') {
        return PLACEHOLDER_STRINGS.includes(String(value).trim());
    }
    if (type === 'array') {
        return Array.isArray(value) && value.length === 0;
    }
    return false;
}

let promptTemplate = ''; // To cache the prompt template

/**
 * Calls OpenAI LLM to fill specified empty fields based on repository content.
 * @param {object} agentData - The current agent data from a draft file.
 * @param {string} repositoryUrl - The repository URL to analyze.
 * @returns {Promise<object>} The agent data, potentially updated by the LLM.
 */
async function callLLMToFillEmptyFields(agentData, repositoryUrl) {
    if (!promptTemplate) { // Read template only once
        try {
            promptTemplate = await fs.readFile(PROMPT_TEMPLATE_PATH, 'utf8');
        } catch (err) {
            console.error(`Failed to read prompt template from ${PROMPT_TEMPLATE_PATH}:`, err);
            return agentData; // Cannot proceed without template
        }
    }

    console.log(`[LLM] Analyzing ${repositoryUrl} for agent: ${agentData.name}`);

    const fieldsToRequestFromLLM = [];
    for (const field of LLM_TARGET_FIELDS) {
        if (field.name === 'category') {
            // Force category update if it's experimental OR empty, since we want better categorization
            if (isFieldEmpty(agentData[field.name], field.type) ||
                agentData[field.name] === 'experimental' ||
                !agentData[field.name]) {
                fieldsToRequestFromLLM.push({ name: field.name, type: field.type, isEnum: field.isEnum });
            }
        } else if (field.name === 'stack' && field.type === 'array') {
            // Always try to get stack from LLM if current is empty or only has one item (likely just the language)
            if (isFieldEmpty(agentData[field.name], field.type) || (Array.isArray(agentData[field.name]) && agentData[field.name].length <= 1)) {
                fieldsToRequestFromLLM.push({ name: field.name, type: field.type, isEnum: field.isEnum });
            }
        } else if (isFieldEmpty(agentData[field.name], field.type)) {
            fieldsToRequestFromLLM.push({ name: field.name, type: field.type, isEnum: field.isEnum });
        }
    }

    if (fieldsToRequestFromLLM.length === 0) {
        console.log(`[LLM] No empty target fields found for ${agentData.name}. Skipping LLM call.`);
        return agentData;
    }

    const fieldDescriptionsForPrompt = fieldsToRequestFromLLM.map(f => {
        const schemaProp = agentSchema.properties[f.name];
        let description = schemaProp && schemaProp.description ? schemaProp.description : `Provide content for ${f.name}`;

        // Special handling for category to provide better guidance
        if (f.name === 'category' && f.isEnum && schemaProp && schemaProp.enum) {
            description = `Analyze the repository's README, code, and purpose to determine the most appropriate category. Look at keywords, dependencies, use cases, and main functionality. Available categories: ${schemaProp.enum.join(', ')}. Choose the most SPECIFIC category that matches the agent's PRIMARY purpose - avoid 'experimental' unless it's genuinely research-focused.`;
        } else if (f.isEnum && schemaProp && schemaProp.enum) {
            description += ` (Allowed values: ${schemaProp.enum.join(', ')})`;
        }

        return `- ${f.name} (${f.type}): ${description}`;
    }).join('\\n');

    let prompt = promptTemplate.replace('{{agentName}}', agentData.name || 'N/A');
    prompt = prompt.replace('{{agentDescription}}', agentData.description || 'N/A');
    prompt = prompt.replace('{{repositoryUrl}}', repositoryUrl);
    prompt = prompt.replace('{{existingDataJson}}', JSON.stringify(agentData, null, 2));
    prompt = prompt.replace('{{fieldsToFillList}}', fieldDescriptionsForPrompt);

    console.log(`[LLM] Attempting to fill fields: ${fieldsToRequestFromLLM.map(f => f.name).join(', ')} for ${agentData.name}`);
    // console.log("[LLM] Full prompt:", prompt); // For debugging, can be very verbose

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an expert AI assistant..." }, // Keep existing system prompt
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.5,
        });

        const llmResponseContent = completion.choices[0]?.message?.content;
        if (llmResponseContent) {
            console.log(`[LLM] Raw response for ${agentData.name}: ${llmResponseContent}`);
            let llmGeneratedFields;
            try {
                llmGeneratedFields = JSON.parse(llmResponseContent);
            } catch (parseError) {
                console.error(`[LLM] Error parsing JSON response for ${agentData.name}: ${parseError.message}. Response: ${llmResponseContent}`);
                return agentData;
            }

            let updated = false;
            for (const field of fieldsToRequestFromLLM) {
                if (llmGeneratedFields.hasOwnProperty(field.name)) {
                    const llmValue = llmGeneratedFields[field.name];
                    if (field.type === 'string') {
                        if (typeof llmValue === 'string' && llmValue.trim() !== '' && !PLACEHOLDER_STRINGS.includes(llmValue.trim())) {
                            if (field.isEnum && agentSchema.properties[field.name].enum && !agentSchema.properties[field.name].enum.includes(llmValue.trim())) {
                                console.warn(`[LLM] Returned value "${llmValue.trim()}" for enum field '${field.name}' is not in allowed values. Skipping update for this field.`);
                                continue;
                            }
                            agentData[field.name] = llmValue.trim();
                            updated = true;
                            console.log(`[LLM] Updated '${field.name}' for ${agentData.name}`);
                        }
                    } else if (field.type === 'array') {
                        if (Array.isArray(llmValue) && llmValue.length > 0) {
                            const schemaArrayItems = agentSchema.properties[field.name]?.items;
                            if (schemaArrayItems && schemaArrayItems.type === 'string') {
                                agentData[field.name] = llmValue.filter(item => typeof item === 'string' && item.trim() !== '').map(item => item.trim());
                            } else {
                                agentData[field.name] = llmValue; // Store as is if not array of strings or no item type defined
                            }
                            if (agentData[field.name].length > 0) {
                                updated = true;
                                console.log(`[LLM] Updated '${field.name}' for ${agentData.name}`);
                            }
                        }
                    }
                }
            }
            if (updated) {
                console.log(`[LLM] Successfully enriched data for ${agentData.name}`);
            } else {
                console.log(`[LLM] LLM did not provide updatable content for empty fields of ${agentData.name}`);
            }
        } else {
            console.warn(`[LLM] No content in response for ${agentData.name}`);
        }
    } catch (error) {
        console.error(`[LLM] API call failed for ${agentData.name}: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
    }
    return agentData;
}

async function promoteDrafts() {
    console.log('Starting draft promotion process...');

    // Parse command line arguments for number of files to process
    const args = process.argv.slice(2);
    let maxFiles = 1; // Default to 1 file

    // Look for --count or -c parameter
    const countIndex = args.findIndex(arg => arg === '--count' || arg === '-c');
    if (countIndex !== -1 && args[countIndex + 1]) {
        const parsedCount = parseInt(args[countIndex + 1], 10);
        if (!isNaN(parsedCount) && parsedCount > 0) {
            maxFiles = parsedCount;
        } else {
            console.error('Invalid count parameter. Using default of 1.');
        }
    }

    // Also check for --all flag to process all files
    if (args.includes('--all')) {
        maxFiles = Infinity;
    }

    console.log(`Max files to process: ${maxFiles === Infinity ? 'all' : maxFiles}`);

    if (!process.env.OPENAI_API_KEY) {
        console.error("OPENAI_API_KEY is not set in .env file. Cannot proceed with LLM enrichment.");
        return;
    }
    await fs.mkdir(DATA_DIR, { recursive: true });
    // await fs.mkdir(FAILED_PROMOTION_DIR, { recursive: true }); // Optional

    let filesProcessed = 0;
    let filesPromoted = 0;
    let filesFailed = 0;
    let draftFiles = [];

    try {
        draftFiles = await fs.readdir(DRAFTS_DIR);
        draftFiles = draftFiles.filter(file => file.endsWith('.json')); // Process all JSON files
        if (draftFiles.length === 0) {
            console.log("No JSON files found in drafts directory.");
            return;
        }

        // Limit the number of files to process
        if (maxFiles !== Infinity && draftFiles.length > maxFiles) {
            console.log(`Processing only the first ${maxFiles} files out of ${draftFiles.length} available.`);
            draftFiles = draftFiles.slice(0, maxFiles);
        } else if (maxFiles === Infinity) {
            console.log(`Processing all ${draftFiles.length} files.`);
        } else {
            console.log(`Processing ${draftFiles.length} files (requested ${maxFiles}).`);
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log(`Drafts directory ${DRAFTS_DIR} not found. Nothing to promote.`);
            return;
        }
        throw err; // Re-throw other errors
    }

    for (const fileName of draftFiles) {
        if (!fileName.endsWith('.json')) continue;
        filesProcessed++;
        const draftFilePath = path.join(DRAFTS_DIR, fileName);
        const finalDataPath = path.join(DATA_DIR, fileName);

        console.log(`\nProcessing draft: ${fileName}`);
        try {
            const draftContent = await fs.readFile(draftFilePath, 'utf8');
            let agentData = JSON.parse(draftContent);

            if (!agentData.repository) {
                console.warn(`Skipping ${fileName}: missing repository URL for LLM analysis.`);
                // await fs.rename(draftFilePath, path.join(FAILED_PROMOTION_DIR, `no_repo_${fileName}`)); // Optional
                filesFailed++;
                continue;
            }

            agentData = await callLLMToFillEmptyFields(agentData, agentData.repository);

            // Defaulting badge if empty or invalid, before validation
            const badgeSchema = agentSchema.properties.badge;
            if (badgeSchema && badgeSchema.enum) {
                const allowedBadges = badgeSchema.enum;
                if (!agentData.badge || !allowedBadges.includes(String(agentData.badge))) {
                    const defaultBadge = "community"; // Or choose another default like "experimental"
                    if (allowedBadges.includes(defaultBadge)){
                        agentData.badge = defaultBadge;
                        console.log(`Set default badge to '${defaultBadge}' for ${fileName}`);
                    } else {
                        console.warn(`Default badge '${defaultBadge}' is not in schema allowed values for ${fileName}. Badge not set.`);
                    }
                }
            }

            const isValid = validate(agentData);
            if (!isValid) {
                console.error(`Validation failed for ${fileName} after LLM enrichment:`);
                if (validate.errors) {
                    validate.errors.forEach(err => console.error(`- ${err.instancePath || 'root'}: ${err.message}`));
                } else {
                    console.error("Validation function returned false but no errors array was present.")
                }
                console.error(`File ${fileName} remains in drafts due to validation errors.`);
                // await fs.rename(draftFilePath, path.join(FAILED_PROMOTION_DIR, `validation_failed_${fileName}`)); // Optional
                filesFailed++;
                continue;
            }
            console.log(`${fileName} passed validation after LLM enrichment.`);

            await fs.writeFile(finalDataPath, JSON.stringify(agentData, null, 2));
            console.log(`Successfully promoted ${fileName} to ${DATA_DIR}`);

            await fs.unlink(draftFilePath);
            console.log(`Removed ${fileName} from ${DRAFTS_DIR}`);
            filesPromoted++;

        } catch (error) {
            console.error(`Error processing ${fileName}: ${error.message}`, error.stack);
            // await fs.rename(draftFilePath, path.join(FAILED_PROMOTION_DIR, `error_${fileName}`)); // Optional
            filesFailed++;
        }
    }

    console.log(`\nDraft promotion complete.`);
    console.log(`Total files processed: ${filesProcessed}`);
    console.log(`Successfully promoted: ${filesPromoted}`);
    console.log(`Failed or skipped: ${filesFailed}`);
}

if (require.main === module) {
    promoteDrafts().catch(error => {
        console.error("Unhandled error in promoteDrafts script:", error.message, error.stack);
        process.exit(1);
    });
}

module.exports = { promoteDrafts, callLLMToFillEmptyFields, isFieldEmpty }; // Exporting for potential future testing