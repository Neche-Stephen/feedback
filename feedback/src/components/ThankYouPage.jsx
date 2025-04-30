import { CheckCircle } from "lucide-react";

export default function ThankYouPage({ extensionName }) {
  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 text-center mx-auto mt-8">
      <div className="flex justify-center mb-4">
        <CheckCircle size={64} className="text-green-500" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Thank You for Your Feedback!
      </h1>
      
      <p className="text-gray-600 mb-6">
        We appreciate you taking the time to help us improve {extensionName}.
        Your feedback is valuable and will be used to enhance our extension.
      </p>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <p className="text-gray-500 text-sm">
          If you ever want to reinstall {extensionName}, you can find it in the Chrome Web Store.
        </p>
      </div>
    </div>
  );
}