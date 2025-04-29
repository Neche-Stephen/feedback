const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'extension-dir');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Function to read and parse CSV file
function convertCsvToJson() {
  // Read CSV file
  const csvFilePath = path.join(__dirname, 'data');
  
  // Find the first CSV file in the data directory
  const files = fs.readdirSync(csvFilePath);
  const csvFile = files.find(file => file.endsWith('.csv'));
  
  if (!csvFile) {
    console.error('No CSV file found in the data directory');
    return;
  }
  
  const csvData = fs.readFileSync(path.join(csvFilePath, csvFile), 'utf8');
  
  // Parse CSV data
  Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    complete: function(results) {
      console.log(`Found ${results.data.length} extensions to process`);
      
      // Process each row
      results.data.forEach(row => {
        // Skip rows without valid IDs
        if (!row.id) return;
        
        const extensionId = row.id;
        const outputFilePath = path.join(outputDir, `${extensionId}.json`);
        
        // Convert CSV row to JSON and write to file
        fs.writeFileSync(outputFilePath, JSON.stringify(row, null, 2));
        console.log(`Created ${outputFilePath}`);
      });
      
      console.log('CSV to JSON conversion completed successfully!');
    },
    error: function(error) {
      console.error('Error parsing CSV:', error.message);
    }
  });
}

// Run the conversion
convertCsvToJson();