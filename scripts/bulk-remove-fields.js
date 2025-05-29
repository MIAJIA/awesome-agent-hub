const fs = require('fs').promises;
const path = require('path');

const DRAFTS_DIR = path.join(__dirname, '..', 'data', 'drafts');
const FIELDS_TO_REMOVE = [
  'maintainer_verified',
  'quality_grade',
  'license_grade',
  'security_grade',
  'badge'
];

async function bulkRemoveFields() {
  console.log(`Starting bulk field removal from JSON files in ${DRAFTS_DIR}...`);
  console.log(`Fields to remove: ${FIELDS_TO_REMOVE.join(', ')}`);

  let filesProcessed = 0;
  let filesModified = 0;
  let filesFailed = 0;
  let draftFiles = [];

  try {
    draftFiles = await fs.readdir(DRAFTS_DIR);
    draftFiles = draftFiles.filter(file => file.endsWith('.json'));

    if (draftFiles.length === 0) {
      console.log(`No JSON files found in ${DRAFTS_DIR}. Nothing to do.`);
      return;
    }

    console.log(`Found ${draftFiles.length} JSON files to process.`);

    for (const fileName of draftFiles) {
      filesProcessed++;
      const filePath = path.join(DRAFTS_DIR, fileName);
      console.log(`\nProcessing ${fileName}...`);

      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        let jsonData = JSON.parse(fileContent);
        let modified = false;

        for (const field of FIELDS_TO_REMOVE) {
          if (jsonData.hasOwnProperty(field)) {
            delete jsonData[field];
            console.log(`  - Removed field: ${field}`);
            modified = true;
          }
        }

        if (modified) {
          await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
          console.log(`  Successfully updated ${fileName}.`);
          filesModified++;
        } else {
          console.log(`  No fields to remove in ${fileName}. Skipped writing.`);
        }
      } catch (error) {
        console.error(`  Error processing ${fileName}: ${error.message}`);
        filesFailed++;
      }
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`Error: Directory ${DRAFTS_DIR} not found.`);
    } else {
      console.error('An error occurred during the process:', err.message, err.stack);
    }
    process.exit(1);
  }

  console.log('\nBulk field removal complete.');
  console.log(`Total files scanned: ${filesProcessed}`);
  console.log(`Files modified: ${filesModified}`);
  console.log(`Files failed: ${filesFailed}`);
}

if (require.main === module) {
  bulkRemoveFields().catch(error => {
    console.error("Unhandled error in bulkRemoveFields script:", error.message, error.stack);
    process.exit(1);
  });
}

module.exports = { bulkRemoveFields, FIELDS_TO_REMOVE }; // Export for potential testing