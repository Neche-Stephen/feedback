import { AlertCircle } from "lucide-react";

export default function ErrorPage({ message }) {
  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6 text-center mx-auto mt-8">
      <div className="flex justify-center mb-4">
        <AlertCircle size={64} className="text-red-500" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Something Went Wrong
      </h1>
      
      <p className="text-gray-600 mb-6">
        {message || "We couldn't process your request. Please try again later."}
      </p>
      
      <button 
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}