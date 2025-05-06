// The ID of your GCS bucket
const bucketName = 'json-bucket4';

// The local directory to upload
const directoryName = 'extension-dir';

// File to track progress
const progressFile = './upload-progress.json';

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
  
  // Track progress
  let uploadedCount = 0;
  let failedFiles = 0;
  
  try {
    // Upload files that haven't been completed yet
    for (const filePath of filesToUpload) {
      try {
        const relativePath = path.relative(directoryName, filePath);
        console.log(`Starting upload (${uploadedCount + failedFiles + 1}/${filesToUpload.length}): ${relativePath}`);
        
        // Upload the file
        await transferManager.uploadFileToStorage(filePath);
        
        // Mark as completed
        completedFiles.push(relativePath);
        uploadedCount++;
        
        // Save progress after each successful upload
        fs.writeFileSync(progressFile, JSON.stringify({ completedFiles }));
        
        console.log(`Completed: ${relativePath} (${uploadedCount}/${filesToUpload.length}, ${failedFiles} failed)`);
        console.log(`Overall progress: ${completedFiles.length}/${allFiles.length} (${Math.round(completedFiles.length/allFiles.length*100)}%)`);
      } catch (error) {
        failedFiles++;
        console.error(`Failed to upload ${filePath}: ${error.message}`);
        console.log(`Progress: ${uploadedCount} completed, ${failedFiles} failed, ${filesToUpload.length - uploadedCount - failedFiles} remaining`);
      }
    }
    
    console.log(`\nUpload complete: ${completedFiles.length}/${allFiles.length} files uploaded successfully (${failedFiles} failed in this session)`);
  } catch (error) {
    console.error(`\nTransfer failed: ${error}`);
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
      } else {
        files.push(fullPath);
      }
    }
  }
  
  await scanDir(dir);
  return files;
}

// If TransferManager doesn't have uploadFileToStorage directly, implement it
TransferManager.prototype.uploadFileToStorage = async function(filePath) {
  const destinationPath = path.relative(directoryName, filePath);
  await this.bucket.upload(filePath, {
    destination: destinationPath,
    resumable: true // Enable resumable uploads for larger files
  });
  return destinationPath;
};

uploadDirectoryWithTransferManager().catch(console.error);