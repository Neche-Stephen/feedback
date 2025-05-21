const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const os = require('os');

const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

// Configuration
const sourceDir = './extension-dir'; // Directory containing all JSON files
const targetBaseDir = './partitioned_extensions'; // Where to create partition directories
const progressFilePath = './partition_progress.json'; // File to track progress
const MAX_WORKERS = Math.max(1, os.cpus().length - 1); // Use all but one CPU core
const BATCH_SIZE = 100; // Number of files to process per worker batch

/**
 * Progress tracking
 */
const ProgressTracker = {
  // Load existing progress
  async load() {
    try {
      if (fs.existsSync(progressFilePath)) {
        const data = await readFile(progressFilePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (err) {
      console.error(`Error loading progress file: ${err.message}`);
    }
    
    // Default progress state
    return {
      binsCreated: false,
      processedFiles: [],
      binSizesCalculated: false,
      lastUpdate: Date.now()
    };
  },
  
  // Save current progress
  async save(progress) {
    progress.lastUpdate = Date.now();
    try {
      await writeFile(progressFilePath, JSON.stringify(progress, null, 2));
    } catch (err) {
      console.error(`Error saving progress file: ${err.message}`);
    }
  },
  
  // Check if a file has already been processed
  isFileProcessed(progress, filename) {
    return progress.processedFiles.includes(filename);
  },
  
  // Add a file to the processed list
  async markFileProcessed(progress, filename) {
    if (!progress.processedFiles.includes(filename)) {
      progress.processedFiles.push(filename);
      
      // Save progress periodically (every 100 files)
      if (progress.processedFiles.length % 100 === 0) {
        await this.save(progress);
        console.log(`Progress saved: ${progress.processedFiles.length} files processed so far`);
      }
    }
  }
};

/**
 * Create directories for all possible two-letter prefixes
 */
async function createBinDirectories() {
  console.log('Creating bin directories...');
  
  // Characters used in Chrome extension IDs (a-p)
  const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
  
  // Create the base target directory if it doesn't exist
  if (!fs.existsSync(targetBaseDir)) {
    await mkdir(targetBaseDir);
  }
  
  // Create all possible two-letter combinations (256 directories)
  let created = 0;
  for (const firstChar of chars) {
    for (const secondChar of chars) {
      const prefix = firstChar + secondChar;
      const binPath = path.join(targetBaseDir, prefix);
      
      if (!fs.existsSync(binPath)) {
        await mkdir(binPath);
        created++;
      }
    }
  }
  
  console.log(`Created ${created} bin directories`);
}

/**
 * Worker process function - executed in separate threads
 */
function workerProcess() {
  try {
    const { fileBatch, sourceDir, targetBaseDir } = workerData;
    
    // Process each file in the batch
    const results = fileBatch.map(file => {
      try {
        // Get extension ID (filename without extension)
        const extensionId = path.basename(file, '.json');
        
        // Determine which bin it belongs to (first two characters)
        const bin = extensionId.substring(0, 2);
        
        // Set up paths
        const sourcePath = path.join(sourceDir, file);
        const targetDir = path.join(targetBaseDir, bin);
        const targetPath = path.join(targetDir, file);
        
        // Check if source file exists
        if (!fs.existsSync(sourcePath)) {
          return { file, success: false, error: 'Source file does not exist' };
        }
        
        // Copy the file to its bin
        fs.copyFileSync(sourcePath, targetPath);
        
        return { file, success: true, bin };
      } catch (err) {
        return { file, success: false, error: err.message };
      }
    });
    
    // Send results back to main thread
    parentPort.postMessage(results);
  } catch (err) {
    // Handle any unexpected errors in the worker
    parentPort.postMessage({ 
      error: true, 
      message: `Worker encountered an error: ${err.message}`,
      stack: err.stack 
    });
  }
}

/**
 * Process files in batches using worker threads for concurrency
 */
async function partitionExtensionFiles(progress) {
  console.log('Starting to partition extension files...');
  console.log(`Using ${MAX_WORKERS} concurrent workers with batch size of ${BATCH_SIZE}`);
  
  // If running in worker thread, process the assigned batch
  if (!isMainThread) {
    return workerProcess();
  }
  
  try {
    // Verify source directory exists
    if (!fs.existsSync(sourceDir)) {
      throw new Error(`Source directory '${sourceDir}' does not exist!`);
    }
    
    // Get all files from the source directory
    console.log(`Reading source directory: ${sourceDir}`);
    const files = await readdir(sourceDir);
    
    // Filter to just get JSON files
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
    
    // Remove already processed files
    const filesToProcess = jsonFiles.filter(file => !ProgressTracker.isFileProcessed(progress, file));
    
    console.log(`Found ${jsonFiles.length} total JSON files`);
    console.log(`Already processed: ${progress.processedFiles.length} files`);
    console.log(`Remaining to process: ${filesToProcess.length} files`);
    
    if (filesToProcess.length === 0) {
      console.log('All files have already been processed!');
      return;
    }
    
    // Process counter
    let processed = 0;
    let errors = 0;
    
    // Track sizes of each bin
    const binSizes = {};
    
    // Time tracking
    const startTime = Date.now();
    let lastLogTime = startTime;
    
    // Process files in batches using worker threads
    for (let i = 0; i < filesToProcess.length; i += BATCH_SIZE * MAX_WORKERS) {
      const workerPromises = [];
      
      // Create workers for each batch
      for (let w = 0; w < MAX_WORKERS && i + (w * BATCH_SIZE) < filesToProcess.length; w++) {
        // Calculate the batch for this worker
        const startIdx = i + (w * BATCH_SIZE);
        const endIdx = Math.min(startIdx + BATCH_SIZE, filesToProcess.length);
        const fileBatch = filesToProcess.slice(startIdx, endIdx);
        
        console.log(`Creating worker ${w+1} to process ${fileBatch.length} files (${startIdx}-${endIdx})`);
        
        // Create worker promise
        const workerPromise = new Promise((resolve, reject) => {
          const worker = new Worker(__filename, {
            workerData: { fileBatch, sourceDir, targetBaseDir }
          });
          
          worker.on('message', async (results) => {
            try {
              // Check if we received an error object instead of results
              if (results.error) {
                console.error(`Worker error: ${results.message}`);
                console.error(results.stack);
                errors += fileBatch.length;
                resolve();
                return;
              }
              
              // Process results from worker
              for (const result of results) {
                if (result.success) {
                  // Track bin size
                  if (!binSizes[result.bin]) {
                    binSizes[result.bin] = 0;
                  }
                  binSizes[result.bin]++;
                  
                  processed++;
                  
                  // Mark file as processed
                  await ProgressTracker.markFileProcessed(progress, result.file);
                } else {
                  console.error(`Error processing file ${result.file}: ${result.error}`);
                  errors++;
                }
              }
              resolve();
            } catch (err) {
              console.error(`Error handling worker message: ${err.message}`);
              reject(err);
            }
          });
          
          worker.on('error', (err) => {
            console.error(`Worker error: ${err}`);
            errors += fileBatch.length;
            reject(err);
          });
          
          worker.on('exit', (code) => {
            if (code !== 0) {
              const errorMsg = `Worker exited with non-zero code ${code}`;
              console.error(errorMsg);
              reject(new Error(errorMsg));
            }
          });
        });
        
        workerPromises.push(workerPromise);
      }
      
      try {
        // Wait for all workers to complete
        await Promise.all(workerPromises);
        
        // Calculate elapsed time and processing rate
        const currentTime = Date.now();
        const elapsedMs = currentTime - startTime;
        const elapsedMinutes = elapsedMs / 60000;
        const rate = processed / elapsedMinutes;
        
        // Log progress if it's been more than 5 seconds since last log
        if (currentTime - lastLogTime > 5000) {
          console.log(`Processed ${processed}/${filesToProcess.length} files (${(processed/filesToProcess.length*100).toFixed(2)}%) - Rate: ${rate.toFixed(2)} files/min`);
          
          // Estimate time remaining
          const remaining = filesToProcess.length - processed;
          const minutesRemaining = remaining / rate;
          console.log(`Estimated time remaining: ${minutesRemaining.toFixed(2)} minutes`);
          
          lastLogTime = currentTime;
        }
        
        // Save progress periodically
        await ProgressTracker.save(progress);
      } catch (err) {
        console.error(`Error processing batch: ${err.message}`);
        // Continue with next batch
      }
    }
    
    // Final progress save
    await ProgressTracker.save(progress);
    
    console.log('\nPartitioning complete!');
    console.log(`Successfully processed: ${processed} files`);
    console.log(`Errors encountered: ${errors} files`);
    
    // Print distribution stats
    if (Object.keys(binSizes).length > 0) {
      console.log('\nBin distribution:');
      const bins = Object.keys(binSizes).sort();
      for (const bin of bins) {
        console.log(`Bin ${bin}: ${binSizes[bin]} files`);
      }
      
      // Find min, max, avg bin sizes
      const sizes = Object.values(binSizes);
      if (sizes.length > 0) {
        const minSize = Math.min(...sizes);
        const maxSize = Math.max(...sizes);
        const avgSize = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
        
        console.log(`\nMin bin size: ${minSize} files`);
        console.log(`Max bin size: ${maxSize} files`);
        console.log(`Average bin size: ${avgSize.toFixed(2)} files`);
      }
    }
    
  } catch (err) {
    console.error(`Failed to partition files: ${err.message}`);
    console.error(err.stack);
  }
}

/**
 * Calculate the total size of each bin directory
 */
async function calculateBinSizes(progress) {
  // Skip if bin sizes were already calculated
  if (progress.binSizesCalculated) {
    console.log('Bin sizes were already calculated in a previous run, skipping...');
    return;
  }
  
  console.log('\nCalculating bin sizes...');
  
  try {
    const bins = await readdir(targetBaseDir);
    
    // Track progress
    let calculated = 0;
    const totalBins = bins.length;
    const startTime = Date.now();
    
    // Process bins in parallel using worker threads
    const batchSize = Math.ceil(totalBins / MAX_WORKERS);
    const binSizes = [];
    
    // Create worker tasks
    const tasks = [];
    
    for (let i = 0; i < totalBins; i += batchSize) {
      const binBatch = bins.slice(i, i + batchSize);
      
      // Create a promise for each batch
      const task = new Promise(async (resolve) => {
        const batchResults = [];
        
        for (const bin of binBatch) {
          const binPath = path.join(targetBaseDir, bin);
          
          try {
            const files = await readdir(binPath);
            
            let totalSize = 0;
            for (const file of files) {
              const filePath = path.join(binPath, file);
              const fileStat = await stat(filePath);
              totalSize += fileStat.size;
            }
            
            batchResults.push({
              bin,
              files: files.length,
              size: totalSize,
              sizeInMB: (totalSize / (1024 * 1024)).toFixed(2)
            });
            
            calculated++;
            
            // Log progress periodically
            if (calculated % 10 === 0 || calculated === totalBins) {
              const percentComplete = ((calculated / totalBins) * 100).toFixed(2);
              console.log(`Calculated sizes for ${calculated}/${totalBins} bins (${percentComplete}%)`);
            }
          } catch (err) {
            console.error(`Error calculating size for bin ${bin}: ${err.message}`);
            batchResults.push({
              bin,
              files: 0,
              size: 0,
              sizeInMB: '0.00',
              error: err.message
            });
          }
        }
        
        resolve(batchResults);
      });
      
      tasks.push(task);
    }
    
    // Wait for all tasks to complete
    const results = await Promise.all(tasks);
    
    // Flatten results
    results.forEach(batchResults => {
      binSizes.push(...batchResults);
    });
    
    // Sort by size descending
    binSizes.sort((a, b) => b.size - a.size);
    
    console.log('\nBin sizes (sorted by size):');
    binSizes.forEach(({ bin, files, sizeInMB }, index) => {
      // Only print top 10 and bottom 5 for readability
      if (index < 10 || index >= binSizes.length - 5) {
        console.log(`Bin ${bin}: ${files} files, ${sizeInMB} MB`);
      } else if (index === 10) {
        console.log('...');
      }
    });
    
    // Calculate total size
    const totalSizeBytes = binSizes.reduce((sum, bin) => sum + bin.size, 0);
    const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
    console.log(`\nTotal size of all bins: ${totalSizeMB} MB`);
    
    // Update progress
    progress.binSizesCalculated = true;
    await ProgressTracker.save(progress);
    
  } catch (err) {
    console.error(`Failed to calculate bin sizes: ${err.message}`);
    console.error(err.stack);
  }
}

/**
 * Main function to execute the partitioning process
 */
async function main() {
  console.log('=== Chrome Extension Partitioning Tool ===');
  console.log(`Started at: ${new Date().toLocaleString()}`);
  console.log(`Source directory: ${path.resolve(sourceDir)}`);
  console.log(`Target directory: ${path.resolve(targetBaseDir)}`);
  console.log(`Using up to ${MAX_WORKERS} concurrent workers\n`);
  
  try {
    // Load progress from file
    const progress = await ProgressTracker.load();
    console.log(`Loading progress file: Last updated ${new Date(progress.lastUpdate).toLocaleString()}`);
    
    // Create directories for all possible two-letter prefixes
    await createBinDirectories(progress);
    
    // Partition all extension files into the appropriate bins
    await partitionExtensionFiles(progress);
    
    // Calculate the size of each bin
    await calculateBinSizes(progress);
    
    console.log(`\nPartitioning process complete! Finished at: ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error(`A critical error occurred in the main process: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  }
}

// Check if this is the main thread or a worker thread
if (isMainThread) {
  // Execute the main function
  main().catch(err => {
    console.error(`An error occurred in main: ${err.message}`);
    console.error(err.stack);
    process.exit(1);
  });
} else {
  // This is a worker thread, execute the worker process
  workerProcess();
}