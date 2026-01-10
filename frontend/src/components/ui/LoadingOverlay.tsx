"use client";

import Spinner from "@/components/ui/Spinner";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  subMessage?: string;
}

/**
 * A full-screen, loading overlay.
 * Uses a high z-index to sit on top of everything.
 */
export default function LoadingOverlay({ 
  isVisible, 
  message = "Loading...", 
  subMessage = "Please wait a moment..." // Default fallback
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
        {/* Large Spinner */}
        <div className="text-blue-600 mb-4 scale-150">
          <Spinner />
        </div>
        
        {/* Text with simple pulse animation */}
        <h2 className="text-xl font-bold text-gray-800 animate-pulse">
          {message}
        </h2>
        
        {/* Dynamic sub-message */}
        <p className="text-sm text-gray-500 mt-2 font-medium">
          {subMessage}
        </p>
        
      </div>
    </div>
  );
}