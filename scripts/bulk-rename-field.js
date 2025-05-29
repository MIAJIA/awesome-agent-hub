const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DRAFTS_DIR = path.join(__dirname, '..', 'data', 'drafts');

async function renameFieldInFile(filePath, oldFieldName, newFieldName) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(content);

        if (data.hasOwnProperty(oldFieldName)) {
            data[newFieldName] = data[oldFieldName];
            delete data[oldFieldName];

            await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            console.log(`✅ Renamed field in ${path.basename(filePath)}`);
            return true;
        } else {
            console.log(`⚠️  Field '${oldFieldName}' not found in ${path.basename(filePath)}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error processing ${filePath}: ${error.message}`);
        return false;
    }
}

async function renameFieldInDirectory(directory, oldFieldName, newFieldName) {
    console.log(`\nProcessing directory: ${directory}`);
    let processedCount = 0;
    let renamedCount = 0;

    try {
        const files = await fs.readdir(directory);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        console.log(`Found ${jsonFiles.length} JSON files to process...`);

        for (const file of jsonFiles) {
            const filePath = path.join(directory, file);
            processedCount++;

            const renamed = await renameFieldInFile(filePath, oldFieldName, newFieldName);
            if (renamed) {
                renamedCount++;
            }
        }

        console.log(`📊 Processed ${processedCount} files, renamed field in ${renamedCount} files`);
        return { processed: processedCount, renamed: renamedCount };
    } catch (error) {
        console.error(`❌ Error reading directory ${directory}: ${error.message}`);
        return { processed: 0, renamed: 0 };
    }
}

async function bulkRenameField() {
    const oldFieldName = 'demo_links';
    const newFieldName = 'useful_links';

    console.log(`🔄 Starting bulk field rename: '${oldFieldName}' → '${newFieldName}'`);

    // Process data/ directory
    const dataResults = await renameFieldInDirectory(DATA_DIR, oldFieldName, newFieldName);

    // Process data/drafts/ directory
    const draftsResults = await renameFieldInDirectory(DRAFTS_DIR, oldFieldName, newFieldName);

    const totalProcessed = dataResults.processed + draftsResults.processed;
    const totalRenamed = dataResults.renamed + draftsResults.renamed;

    console.log(`\n🎯 Bulk rename complete!`);
    console.log(`📈 Total files processed: ${totalProcessed}`);
    console.log(`✨ Total fields renamed: ${totalRenamed}`);

    if (totalRenamed > 0) {
        console.log(`\n✅ Field '${oldFieldName}' has been successfully renamed to '${newFieldName}' in ${totalRenamed} files.`);
    } else {
        console.log(`\n⚠️  No files required renaming - field '${oldFieldName}' was not found in any files.`);
    }
}

if (require.main === module) {
    bulkRenameField().catch(error => {
        console.error("❌ Unhandled error in bulk rename script:", error.message);
        process.exit(1);
    });
}

module.exports = { bulkRenameField, renameFieldInFile };