const fs = require('fs').promises;
const path = require('path');

const DRAFTS_DIR = path.join(__dirname, '..', 'data', 'drafts');
const OUTPUT_FILE = path.join(__dirname, '..', 'drafts-summary.md');

async function summarizeDrafts() {
  console.log(`Reading draft files from ${DRAFTS_DIR}...`);
  let summaryContent = '# Draft Agents Summary\\n\\n';
  summaryContent += '| Filename | Name | Description | Purpose |\\n';
  summaryContent += '|----------|------|-------------|---------|\\n';
  let filesProcessed = 0;
  let filesSkipped = 0;

  try {
    const files = await fs.readdir(DRAFTS_DIR);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
      console.log('No JSON files found in the drafts directory.');
      summaryContent = '# Draft Agents Summary\\n\\nNo draft agent files found.\\n'; // Reset for empty case
      await fs.writeFile(OUTPUT_FILE, summaryContent);
      console.log(`Empty summary file created at ${OUTPUT_FILE}`);
      return;
    }

    for (const file of jsonFiles) {
      const filePath = path.join(DRAFTS_DIR, file);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        const agentData = JSON.parse(content);

        const name = agentData.name || 'N/A';
        const description = (agentData.description || 'N/A').replace(/\\r?\\n/g, ' '); // Replace newlines for table cell
        const purpose = (agentData.purpose || 'N/A').replace(/\\r?\\n/g, ' '); // Replace newlines for table cell

        summaryContent += `| \\\`${file}\\\` | ${name} | ${description} | ${purpose} |\\n`;
        filesProcessed++;
      } catch (err) {
        console.warn(`Skipping file ${file} due to error: ${err.message}`);
        // Add a note about skipped files outside the table or handle as a special row if preferred
        filesSkipped++;
      }
    }

    if (filesSkipped > 0) {
      summaryContent += `\\n**Note:** ${filesSkipped} file(s) could not be processed due to errors (see console logs for details).\\n`;
    }

    await fs.writeFile(OUTPUT_FILE, summaryContent);
    console.log(`Summary successfully created at: ${OUTPUT_FILE}`);
    console.log(`Processed ${filesProcessed} files, skipped ${filesSkipped} files.`);

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: Drafts directory ${DRAFTS_DIR} not found.`);
      summaryContent = '# Draft Agents Summary\\n\\n# Error\\n'; // Reset for error case
      summaryContent += `Drafts directory ${DRAFTS_DIR} not found.\\n`;
      try {
        await fs.writeFile(OUTPUT_FILE, summaryContent);
        console.log(`Error summary written to ${OUTPUT_FILE}`);
      } catch (writeErr) {
        console.error(`Failed to write error summary to ${OUTPUT_FILE}: `, writeErr);
      }
    } else {
      console.error('Error creating summary file:', error);
    }
  }
}

if (require.main === module) {
  summarizeDrafts().catch(error => {
    console.error("Unhandled error in summarizeDrafts:", error);
    process.exit(1);
  });
}

module.exports = { summarizeDrafts };