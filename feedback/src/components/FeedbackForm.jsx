import { useState } from "react";

export default function FeedbackForm({ extensionData, onSubmit }) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  const reasons = [
    "I didn't understand how to use it",
    "It wasn't working correctly",
    "It slowed down my browser",
    "I no longer need this extension",
    "I found a better alternative",
    "It was missing features I need",
    "Other"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!reason) {
      setFormError("Please select a reason for uninstalling");
      return;
    }
    
    if (reason === "Other" && !otherReason) {
      setFormError("Please specify your reason");
      return;
    }
    
    setFormError("");
    
    // Prepare form data
    const formData = {
      reason: reason === "Other" ? otherReason : reason,
      additionalFeedback,
      email: email || "Not provided",
      timestamp: new Date().toISOString()
    };
    
    // Submit form data
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{extensionData.name}</h2>
      <div className="flex items-center mb-6">
        {extensionData.logo && (
          <img 
            src={extensionData.logo} 
            alt={`${extensionData.name} logo`} 
            className="w-16 h-16 mr-4"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            We're sorry to see you go!
          </h1>
          <p className="text-gray-600">
            Would you mind taking a moment and telling us why you've uninstalled {extensionData.name}?
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Why did you uninstall {extensionData.name}?
          </label>
          
          <div className="space-y-2">
            {reasons.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={option}
                  name="reason"
                  value={option}
                  checked={reason === option}
                  onChange={(e) => setReason(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor={option} className="text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
          
          {reason === "Other" && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Please specify"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Is there anything else you'd like to tell us? (Optional)
          </label>
          <textarea
            value={additionalFeedback}
            onChange={(e) => setAdditionalFeedback(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Your feedback helps us improve"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Email (Optional)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="If you'd like us to respond to your feedback"
          />
        </div>
        
        {formError && (
          <div className="mb-4 text-red-500">{formError}</div>
        )}
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Submit Feedback
          </button>
        </div>
      </form>
    </div>
  );
}