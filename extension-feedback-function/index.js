// Google Cloud Function to send form data to Google Sheets
const { google } = require("googleapis");

// Set up authentication credentials
const auth = new google.auth.GoogleAuth({
  keyFile: "service-account-key.json", // Path to your service account key file
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

exports.submitFormToSheet = async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    // Handle preflight request
    res.set("Access-Control-Allow-Methods", "POST");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send("");
    return;
  }

  try {
    // Get form data from request body
    const formData = req.body;

    if (!formData || !formData.extensionId || !formData.extensionName) {
      return res.status(400).json({
        error: "Missing required fields in form submission",
      });
    }

    // Initialize Google Sheets API
    const sheets = google.sheets({ version: "v4", auth });

    // Format the issues array into a string
    let issuesFormatted = "";
    if (Array.isArray(formData.issues)) {
      issuesFormatted = formData.issues.join(", ");
    } else {
      issuesFormatted = formData.issues || "";
    }

    // Format data for Google Sheets
    const values = [
      [
        new Date().toISOString(),
        formData.extensionId,
        formData.extensionName,
        issuesFormatted,
        formData.additionalDetails || "",
      ],
    ];

    // Google Sheets document ID and range
    const spreadsheetId = "1f386mJUbkum8bfWpQNghmh2pivby10jrWtJ1bbGZweY"; // spreadsheet ID
    const range = "Sheet1!A:E"; // range based on data columns

    // Append data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource: { values },
    });

    res.status(200).json({
      success: true,
      message: "Form data successfully submitted to Google Sheets",
      rowsAdded: response.data.updates.updatedRows,
    });
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting form data to Google Sheets",
      error: error.message,
    });
  }
};
