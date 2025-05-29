const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DRAFTS_DIR = path.join(__dirname, '..', 'data', 'drafts');

async function revertPromotedFiles() {
    console.log('Starting process to move files from data/ back to data/drafts/...');

    try {
        await fs.mkdir(DRAFTS_DIR, { recursive: true });
        const filesInData = await fs.readdir(DATA_DIR);
        const jsonFiles = filesInData.filter(file => file.endsWith('.json') && file !== 'agent-template.json' && file !== 'example-agent.json' && file !== 'x402.json'); // Exclude specific non-agent files and x402.json

        if (jsonFiles.length === 0) {
            console.log(`No JSON files (excluding templates and x402.json) found in ${DATA_DIR} to move.`);
            return;
        }

        console.log(`Found the following JSON files to move: ${jsonFiles.join(', ')}`);

        let filesMoved = 0;
        let filesFailed = 0;

        for (const fileName of jsonFiles) {
            const sourcePath = path.join(DATA_DIR, fileName);
            const destinationPath = path.join(DRAFTS_DIR, fileName);

            try {
                await fs.rename(sourcePath, destinationPath);
                console.log(`Moved ${fileName} from ${DATA_DIR} to ${DRAFTS_DIR}`);
                filesMoved++;
            } catch (moveError) {
                console.error(`Failed to move ${fileName}: ${moveError.message}`);
                filesFailed++;
            }
        }

        console.log('\nRevert process complete.');
        console.log(`Successfully moved: ${filesMoved} files.`);
        if (filesFailed > 0) {
            console.log(`Failed to move: ${filesFailed} files.`);
        }

    } catch (error) {
        if (error.code === 'ENOENT' && error.path === DATA_DIR) {
            console.log(`Source directory ${DATA_DIR} not found. Nothing to revert.`);
        } else {
            console.error('An error occurred during the revert process:', error.message, error.stack);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    revertPromotedFiles().catch(error => {
        console.error("Unhandled error in revertPromotedFiles script:", error.message, error.stack);
        process.exit(1);
    });
}

module.exports = { revertPromotedFiles };