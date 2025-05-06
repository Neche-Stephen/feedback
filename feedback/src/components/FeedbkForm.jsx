import { useState, useEffect } from "react";
import { MessageSquare, Menu, X, CheckCircle, AlertTriangle } from "lucide-react";

export default function FeedbkForm({ extensionData, onSubmit }) {
  console.log("Extension Data:", extensionData);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const [formData, setFormData] = useState({
    issues: [],
    issueLocation: "",
    additionalDetails: "",
    email: "",
  });

  const [progress, setProgress] = useState(0);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Calculate progress based on form completion
  useEffect(() => {
    let totalFields = 2; // Total number of form fields
    let filledFields = 0;
    
    // Check which fields are filled
    if (formData.issues.length > 0) filledFields++;
    if (formData.additionalDetails.trim()) filledFields++;
    
    // Calculate percentage
    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  }, [formData]);

  const handleIssueSelect = (issue) => {
    if (formData.issues.includes(issue)) {
      setFormData({
        ...formData,
        issues: formData.issues.filter(i => i !== issue)
      });
    } else {
      setFormData({
        ...formData,
        issues: [...formData.issues, issue]
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (formData.issues.length === 0) {
      setErrorMessage("Please select at least one issue before submitting.");
      setShowErrorAlert(true);
      
      // Hide error message after 4 seconds
      setTimeout(() => {
        setShowErrorAlert(false);
      }, 4000);
      
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) return;
    
    console.log("Form Data:", formData);

    // Clear form fields
    setFormData({
      issues: [],
      issueLocation: '',
      additionalDetails: '',
      email: ''
    });
      
    
    // Submit form data
    onSubmit(formData);
  };

  const handleSkip = () => {
    console.log("User skipped the form");
    // we will handle skip logic here
  };

  return (
    <div className="min-h-screen bg-[#E3EFFC]">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 text-white p-4 mb-4 rounded-b-lg md:rounded-b-[40px]">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
          {extensionData.logo && (
          <img 
            src={extensionData.logo} 
            alt={`${extensionData.name} logo`} 
            className="w-16 h-16 mr-4"
          />
        )}
            <span className="font-semibold text-[28.25px]">{extensionData.name}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            <div className="relative group">
              <button className="flex items-center">
                Product
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center">
                Partnerships
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
            <button>Pricing</button>
            <div className="relative group">
              <button className="flex items-center">
                Company
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex space-x-4">
            <button className="bg-slate-100 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-200 transition">
              Sign In
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Get Started
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X size={24} style={{ cursor: "pointer" }} />
            ) : (
              <Menu size={24} style={{ cursor: "pointer" }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-2 border-t border-slate-700">
            <div className="flex flex-col space-y-4">
              <div className="px-4 py-2 hover:bg-slate-800 rounded">
                <button className="flex items-center w-full justify-between">
                  Product
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="px-4 py-2 hover:bg-slate-800 rounded">
                <button className="flex items-center w-full justify-between">
                  Partnerships
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
              <button className="px-4 py-2 text-left hover:bg-slate-800 rounded">
                Pricing
              </button>
              <div className="px-4 py-2 hover:bg-slate-800 rounded">
                <button className="flex items-center w-full justify-between">
                  Company
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="flex flex-col space-y-2 px-4 pt-2 border-t border-slate-700">
                <button className="bg-slate-100 text-slate-800 px-4 py-2 rounded-md hover:bg-slate-200 transition">
                  Sign In
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Feedback Form */}
      <div className="container md:max-w-[83.22%] mx-auto py-8 bg-white px-[26px]">
        <div className="lg:max-w-[66.44%] mx-auto bg-white rounded-lg overflow-hidden">
          {/* Blue Header Section */}
          <div className="bg-[#1671D9] text-white p-8 text-center rounded-t-[23px]">
            <h1 className="text-[36px] font-medium mb-5">
              Help us fix what's not working
            </h1>
            <p className="text-[18px] font-normal">
              Your feedback helps us improve for everyone. This takes less than
              30 seconds.
            </p>
          </div>

          {showErrorAlert && (
            <div className="fixed top-4 right-4 bg-white border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg flex items-center max-w-md animate-fadeIn">
              <AlertTriangle className="mr-2" />
              <div>
                <p className="font-bold">Error</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-6">
            {/* Progress Bar */}
            <div className="mb-[33px]">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Keep the progress going</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Issues Selection */}
            <div className="mb-[45px]">
              <h2 className="text-xl font-medium mb-4">
                What specific issues are you experiencing? <span className="text-red-500">*</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {['Still seeing ads', 'Website broken', 'Slow Browser', 'YouTube Ads', 'Network', 'Login Problem', "I don't like it", 'Label'].map((issue) => (
                  <button
                    key={issue}
                    type="button"
                    className={`py-2 px-4 rounded-md text-sm transition-colors duration-200 ${
                      formData.issues.includes(issue)
                        ? 'bg-[#1671D9] text-white'
                        : 'bg-[#F0F2F5] text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleIssueSelect(issue)}
                  >
                    {issue}
                  </button>
                ))}
              </div>
              {showErrorAlert && formData.issues.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Please select at least one issue.
                </p>
              )}
            </div>

            {/* Additional Details */}
            <div className="mb-[45px]">
              <h2 className="text-xl font-medium mb-4">
                Any additional details that might help us? (Optional)
              </h2>
              <textarea
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                placeholder="The more details you share the better we improve"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between">
              <button
                type="button"
                onClick={handleSubmit}
                className="order-1 md:order-2 bg-[#1671D9] text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}