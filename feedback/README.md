# Extension Feedback Form Application

A React-based feedback form application that collects user feedback for browser extensions and submits the data to Google Sheets.

## Overview

This application provides a feedback collection system for browser extensions. Users can provide their feedback through a form, which is then submitted to a cloud function and stored in a Google Sheets spreadsheet for easy access and analysis.


## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Google Cloud account (for the cloud function)
- Google Sheet set up to receive the data

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Neche-Stephen/feedback
   cd feedback/feedback
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

### Testing the Form Locally

To test the form locally, you need to access it with proper URL parameters:

```
http://localhost:5173/?id=<extension_id>&name=<extension_name>
```

For example:
```
http://localhost:5173/?id=aaaabkbhklmpmlnjnbicdahijpkgnkfk&name=tdo
```

These parameters are used to:
- `id`: Identify the specific extension

### Form Submission Process

1. Fill out the feedback form with:
   - Your email
   - Reason for uninstallation
   - Additional feedback (optional)

2. Submit the form by clicking the "Submit" button

3. The data is sent to a Google Cloud Function, which then appends it to a Google Sheet

4. After successful submission, a "Thank You" page is displayed

### Viewing Submitted Data

All submitted feedback can be viewed in the Google Sheet at:
[Extension Feedback Google Sheet](https://docs.google.com/spreadsheets/d/1f386mJUbkum8bfWpQNghmh2pivby10jrWtJ1bbGZweY/edit?usp=sharing)

## Project Structure

```
feedback/
├── public/
├── extension-dir/          # Contains extension data JSON files
├── src/
│   ├── components/
│   │   ├── ErrorPage.jsx       # Error display component
│   │   ├── FeedbackForm.jsx    # Main form component
│   │   ├── LoadingSpinner.jsx  # Loading indicator
│   │   └── ThankYouPage.jsx    # Success page component
│   ├── App.jsx                 # Main application component
│   └── main.jsx                # React entry point
├── package.json
└── README.md
```