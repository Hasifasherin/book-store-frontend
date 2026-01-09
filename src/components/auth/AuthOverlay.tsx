"use client";

import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

interface AuthOverlayProps {
  onClose: () => void;
}

export default function AuthOverlay({ onClose }: AuthOverlayProps) {
  const [isSignup, setIsSignup] = useState(true);

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="bg-[#F8FAFC] w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card Header */}
        <div
          className="bg-[#1E2A5E] text-white text-center px-4 pt-4 pb-10 rounded-b-[10%]"
        >
          <div className="flex justify-center mb-3">
            <div className="bg-[#60A5FA] text-white w-8 h-8 flex items-center justify-center font-bold rounded">
              B
            </div>
          </div>

          <h2 className="text-xl font-semibold">Book-Store</h2>
          <p className="text-sm mt-1 opacity-90">
            Unlock Book Club Benefits
          </p>
        </div>

        {/* Card Body */}
        <div className="px-8 py-8 -mt-10 pt-13">
          {isSignup ? (
            <SignupForm onCancel={onClose} />
          ) : (
            <LoginForm onCancel={onClose} />
          )}

          {/* Switch */}
          <div className="text-center mt-4 text-sm text-[#1E2A5E]">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  className="text-[#60A5FA] font-semibold"
                  onClick={() => setIsSignup(false)}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  className="text-[#60A5FA] font-semibold"
                  onClick={() => setIsSignup(true)}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
