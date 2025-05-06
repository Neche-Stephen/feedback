import { Box } from "lucide-react";

export default function Visibility() {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center border-t border-gray-200">
      <div className="bg-blue-500 p-3 rounded-lg mb-6">
        <Box className="w-8 h-8 text-white" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2">
        Increase your team's visibility and alignment
      </h1>
      
      <p className="text-lg text-gray-600 text-center mb-8">
        Start for free, flexible for all teams.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="px-6 py-3 text-gray-800 font-medium border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
          Request a demo
        </button>
        <button className="px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors">
          Start for free
        </button>
      </div>
    </div>
  );
}