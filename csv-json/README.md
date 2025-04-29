# Chrome Extension CSV to JSON Converter

This Node.js script converts Chrome extension data from CSV format to individual JSON files, with each file named after its extension ID.

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Place your CSV file in the `data` directory
4. Run the script:
   ```
   npm start
   ```

## Directory Structure

```
project-root/
├── index.js         # Main script
├── package.json     # Dependencies
├── data/            # Place your CSV file here
└── extension-dir/   # Output directory (created automatically)
    ├── [extension-id-1].json
    ├── [extension-id-2].json
    └── ...
```

## How It Works

The script:
1. Reads the first CSV file it finds in the `data` directory
2. Parses each row using PapaParse
3. Creates a JSON file for each extension in the `extension-dir` directory
4. Each file is named with the extension ID and contains all information about that extension

## Requirements

- Node.js
- PapaParse (installed via npm)