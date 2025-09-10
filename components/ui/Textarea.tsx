import React from 'react';

/**
 * Props for the Textarea component.
 * Extends the standard HTML textarea attributes.
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * A reusable, styled Textarea component.
 * It provides a consistent look and feel for multi-line text inputs.
 * @param {TextareaProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered Textarea component.
 */
export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      // Combines base classes with any custom classes passed via props.
      className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};
