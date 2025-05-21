// The ID of your GCS bucket
const bucketName = 'json-bucket4';

// The local directory to upload
const directoryName = 'extension-dir';

// File to track progress
const progressFile = './upload-progress.json';

// Maximum number of concurrent uploads
const MAX_CONCURRENT_UPLOADS = 30;

// Imports the Google Cloud client library and fs
const {Storage, TransferManager} = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// Creates a client
const storage = new Storage();

// Creates a transfer manager client
const transferManager = new TransferManager(storage.bucket(bucketName));

async function uploadDirectoryWithTransferManager() {
  console.log(`Starting upload of ${directoryName} to ${bucketName}...`);
  
  // Load progress from file if it exists
  let completedFiles = [];
  try {
    if (fs.existsSync(progressFile)) {
      const progressData = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
      completedFiles = progressData.completedFiles || [];
      console.log(`Loaded progress: ${completedFiles.length} files already uploaded.`);
    }
  } catch (error) {
    console.error(`Error loading progress file: ${error.message}`);
    completedFiles = [];
  }
  
  // Get list of all files to upload
  const allFiles = await getFilesRecursively(directoryName);
  console.log(`Found ${allFiles.length} total files.`);
  
  // Filter out already completed files
  const filesToUpload = allFiles.filter(filePath => {
    const relativePath = path.relative(directoryName, filePath);
    return !completedFiles.includes(relativePath);
  });
  
  console.log(`${filesToUpload.length} files remaining to upload.`);
  
  // Shared counters for progress tracking
  const progress = {
    uploaded: 0,
    failed: 0,
    total: filesToUpload.length,
    completedFiles: completedFiles,
    mutex: false // Simple mutex for progress file updates
  };
  
  try {
    // Process files in batches for parallel uploads
    for (let i = 0; i < filesToUpload.length; i += MAX_CONCURRENT_UPLOADS) {
      const batch = filesToUpload.slice(i, i + MAX_CONCURRENT_UPLOADS);
      console.log(`Processing batch ${Math.floor(i/MAX_CONCURRENT_UPLOADS) + 1}/${Math.ceil(filesToUpload.length/MAX_CONCURRENT_UPLOADS)}, files ${i+1}-${Math.min(i+MAX_CONCURRENT_UPLOADS, filesToUpload.length)} of ${filesToUpload.length}`);
      
      // Create upload promises for each file in the batch
      const uploadPromises = batch.map(filePath => processAndUploadFile(filePath, progress));
      
      // Wait for all uploads in this batch to complete
      await Promise.all(uploadPromises);
      
      // Save progress after each batch
      await saveProgress(progress.completedFiles);
      
      console.log(`Batch complete. Overall progress: ${progress.completedFiles.length}/${allFiles.length} (${Math.round(progress.completedFiles.length/allFiles.length*100)}%)`);
    }
    
    console.log(`\nUpload complete: ${progress.completedFiles.length}/${allFiles.length} files uploaded successfully (${progress.failed} failed in this session)`);
  } catch (error) {
    console.error(`\nTransfer failed: ${error}`);
  }
}

// Process and upload a single file
async function processAndUploadFile(filePath, progress) {
  const relativePath = path.relative(directoryName, filePath);
  const fileNumber = progress.uploaded + progress.failed + 1;
  
  try {
    console.log(`Starting upload ${fileNumber}/${progress.total}: ${relativePath}`);
    
    // Read and minify JSON file
    const jsonContent = await fs.promises.readFile(filePath, 'utf8');
    let jsonObj;
    try {
      jsonObj = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error(`Error parsing JSON file ${relativePath}: ${parseError.message}`);
      throw parseError;
    }
    
    // Convert to single-line JSON
    const minifiedJson = JSON.stringify(jsonObj);
    
    // Upload the minified content
    await uploadMinifiedContent(relativePath, minifiedJson);
    
    // Update progress atomically
    await updateProgressAtomic(progress, async () => {
      // Mark as completed
      if (!progress.completedFiles.includes(relativePath)) {
        progress.completedFiles.push(relativePath);
      }
      progress.uploaded++;
    });
    
    // Calculate size reduction
    const originalSize = jsonContent.length;
    const minifiedSize = minifiedJson.length;
    const reductionPercent = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
    
    console.log(`Completed: ${relativePath} (${progress.uploaded}/${progress.total}, ${progress.failed} failed)`);
    console.log(`Size reduction: ${originalSize} → ${minifiedSize} bytes (${reductionPercent}% smaller)`);
    
    return relativePath;
  } catch (error) {
    // Update failure count atomically
    await updateProgressAtomic(progress, async () => {
      progress.failed++;
    });
    
    console.error(`Failed to upload ${relativePath}: ${error.message}`);
    console.log(`Progress: ${progress.uploaded} completed, ${progress.failed} failed, ${progress.total - progress.uploaded - progress.failed} remaining`);
    throw error;
  }
}

// Helper function to get all files recursively
async function getFilesRecursively(dir) {
  const files = [];
  
  async function scanDir(directory) {
    const entries = await fs.promises.readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        await scanDir(fullPath);
      } else if (fullPath.endsWith('.json')) {
        files.push(fullPath);
      }
    }
  }
  
  await scanDir(dir);
  return files;
}

// Function to upload minified content
async function uploadMinifiedContent(destinationPath, content) {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(destinationPath);
  
  return new Promise((resolve, reject) => {
    const stream = file.createWriteStream({
      resumable: true,
      contentType: 'application/json'
    });
    
    stream.on('error', (err) => {
      reject(err);
    });
    
    stream.on('finish', () => {
      resolve();
    });
    
    stream.end(content);
  });
}

// Function to save progress to file
async function saveProgress(completedFiles) {
  try {
    fs.writeFileSync(progressFile, JSON.stringify({ completedFiles }));
  } catch (error) {
    console.error(`Error saving progress: ${error.message}`);
  }
}

// Simple mutex implementation for updating progress
async function updateProgressAtomic(progress, updateFn) {
  // Wait for mutex to be free
  while (progress.mutex) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  // Acquire mutex
  progress.mutex = true;
  
  try {
    // Perform the update
    await updateFn();
  } finally {
    // Release mutex
    progress.mutex = false;
  }
}

uploadDirectoryWithTransferManager().catch(console.error);