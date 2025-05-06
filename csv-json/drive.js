/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
const bucketName = 'json-bucket1';

// The local directory to upload
const directoryName = 'extension-dir';

// Imports the Google Cloud client library
const {Storage, TransferManager} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

// Creates a transfer manager client
const transferManager = new TransferManager(storage.bucket(bucketName));

async function uploadDirectoryWithTransferManager() {
  // Uploads the directory
  await transferManager.uploadManyFiles(directoryName);

  console.log(`${directoryName} uploaded to ${bucketName}.`);
}

uploadDirectoryWithTransferManager().catch(console.error);