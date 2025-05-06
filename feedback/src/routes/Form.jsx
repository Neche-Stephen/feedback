import { useState, useEffect } from "react";
import ThankYouPage from "../components/ThankYouPage";
import ErrorPage from "../components/ErrorPage";
import LoadingSpinner from "../components/LoadingSpinner";
import FeedbkForm from "../components/FeedbkForm";

export default function Form() {
  const [extensionData, setExtensionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const fetchExtensionData = async () => {
      try {
        // Get extension ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const extensionId = urlParams.get("id");

        if (!extensionId) {
          throw new Error("No extension ID provided in URL");
        }

        // Fetch extension data from JSON file
        const gcsUrl = `https://storage.googleapis.com/json-bucket4/${extensionId}.json`;
        const response = await fetch(gcsUrl);

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType?.includes("application/json")) {
          throw new Error(`Extension data not found for ID: ${extensionId}`);
        }

        const data = await response.json();
        setExtensionData(data);
      } catch (err) {
        console.error("Error fetching extension data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExtensionData();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);

      // Add extension ID and name to form data
      const dataToSubmit = {
        ...formData,
        extensionId: extensionData.id,
        extensionName: extensionData.name,
      };

      console.log("Submitting form data:", dataToSubmit);
      // Send data to cloud function
      const response = await fetch(
        "https://us-central1-extension-feedback-form.cloudfunctions.net/submitFormToSheet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      setFormSubmitted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorPage message={error} />;
  }

  if (formSubmitted) {
    return <ThankYouPage extensionName={extensionData.name} />;
  }

  return (
    <div className="min-h-screen">
      {extensionData && (
        <FeedbkForm extensionData={extensionData} onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}
// AIzaSyC7C84NpWvnOU8Jj7Ic3pcJq-T6GcDe0YY
