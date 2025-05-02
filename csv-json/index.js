const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'extension-dir');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Progress tracking file
const progressFilePath = path.join(__dirname, 'conversion-progress.json');

// Function to read and parse CSV file with progress tracking
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
  
  // Initialize or load progress
  let processedIds = [];
  let lastProcessedIndex = -1;
  
  try {
    if (fs.existsSync(progressFilePath)) {
      const progressData = JSON.parse(fs.readFileSync(progressFilePath, 'utf8'));
      processedIds = progressData.processedIds || [];
      lastProcessedIndex = progressData.lastProcessedIndex || -1;
      console.log(`Resuming from index ${lastProcessedIndex + 1}. Already processed ${processedIds.length} extensions.`);
    } else {
      console.log('Starting new conversion process.');
    }
  } catch (error) {
    console.error('Error reading progress file:', error.message);
    console.log('Starting fresh conversion process.');
  }

  // Parse CSV data
  Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    complete: function(results) {
      const totalRows = results.data.length;
      console.log(`Found ${totalRows} extensions to process`);
      
      // Keep track of processed rows for this run
      let processedThisRun = 0;
      let startTime = Date.now();
      
      // Setup interval for progress updates
      const updateInterval = setInterval(() => {
        if (processedThisRun > 0) {
          const elapsedSecs = (Date.now() - startTime) / 1000;
          const rowsPerSec = processedThisRun / elapsedSecs;
          const remaining = totalRows - (lastProcessedIndex + 1 + processedThisRun);
          const estimatedTimeRemaining = remaining / rowsPerSec;
          
          console.log(`Progress: ${lastProcessedIndex + 1 + processedThisRun}/${totalRows} (${((lastProcessedIndex + 1 + processedThisRun) / totalRows * 100).toFixed(2)}%)`);
          console.log(`Processing rate: ${rowsPerSec.toFixed(2)} rows/sec`);
          console.log(`Estimated time remaining: ${formatTime(estimatedTimeRemaining)}`);
        }
      }, 5000); // Update every 5 seconds
      
      // Process each row
      for (let i = lastProcessedIndex + 1; i < results.data.length; i++) {
        const row = results.data[i];
        
        // Skip rows without valid IDs
        if (!row.id) {
          console.log(`Skipping row ${i}: No valid ID found`);
          continue;
        }
        
        const extensionId = row.id;
        
        // Skip already processed extensions
        if (processedIds.includes(extensionId)) {
          console.log(`Skipping already processed extension: ${extensionId}`);
          continue;
        }
        
        const outputFilePath = path.join(outputDir, `${extensionId}.json`);
        
        try {
          // Convert CSV row to JSON and write to file
          fs.writeFileSync(outputFilePath, JSON.stringify(row, null, 2));
          
          // Update progress
          processedIds.push(extensionId);
          lastProcessedIndex = i;
          processedThisRun++;
          
          // Log progress (less frequently for large files)
          if (processedThisRun % 100 === 0 || processedThisRun === 1) {
            console.log(`Processed ${processedThisRun} extensions this run (${lastProcessedIndex + 1}/${totalRows} total)`);
            console.log(`Current: ${extensionId}`);
            
            // Save progress periodically
            saveProgress(processedIds, lastProcessedIndex);
          }
        } catch (error) {
          console.error(`Error processing extension ${extensionId}:`, error.message);
          // Continue with next record despite error
        }
      }
      
      // Clear the update interval
      clearInterval(updateInterval);
      
      // Final progress save
      saveProgress(processedIds, lastProcessedIndex);
      
      const totalDuration = (Date.now() - startTime) / 1000;
      console.log('');
      console.log('=== Conversion Summary ===');
      console.log(`Processed ${processedThisRun} extensions in this run`);
      console.log(`Total processed: ${lastProcessedIndex + 1}/${totalRows}`);
      console.log(`Duration: ${formatTime(totalDuration)}`);
      console.log(`Average processing rate: ${(processedThisRun / totalDuration).toFixed(2)} rows/sec`);
      
      if (lastProcessedIndex >= results.data.length - 1) {
        console.log('CSV to JSON conversion completed successfully!');
      } else {
        console.log(`Conversion paused at index ${lastProcessedIndex}. Run again to continue.`);
      }
    },
    error: function(error) {
      console.error('Error parsing CSV:', error.message);
    }
  });
}

// Save progress to file
function saveProgress(processedIds, lastProcessedIndex) {
  try {
    fs.writeFileSync(progressFilePath, JSON.stringify({
      processedIds,
      lastProcessedIndex,
      lastUpdated: new Date().toISOString()
    }, null, 2));
  } catch (error) {
    console.error('Error saving progress:', error.message);
  }
}

// Format seconds into readable time (HH:MM:SS)
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Handle graceful shutdown to save progress
process.on('SIGINT', function() {
  console.log('\nProcess interrupted. Progress has been saved.');
  process.exit(0);
});

// Run the conversion
convertCsvToJson();