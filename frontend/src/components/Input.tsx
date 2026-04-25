import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`rounded-xl border px-4 py-2.5 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-100 disabled:opacity-50 ${
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
