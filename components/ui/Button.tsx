import React from 'react';

// Define the possible visual styles for the button.
type ButtonVariant = 'default' | 'ghost' | 'destructive' | 'outline';
// Define the possible sizes for the button.
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

/**
 * Props for the Button component.
 * Extends standard HTML button attributes.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

// Maps variant names to their corresponding Tailwind CSS classes.
const variantClasses: Record<ButtonVariant, string> = {
  default: 'bg-indigo-600 text-white hover:bg-indigo-700',
  ghost: 'hover:bg-white/20 hover:text-white',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
};

// Maps size names to their corresponding Tailwind CSS classes.
const sizeClasses: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

/**
 * A customizable, reusable Button component.
 * It supports different visual styles (variants) and sizes.
 * @param {ButtonProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered Button component.
 */
export const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}) => {
  return (
    <button
      // Combines base classes, variant classes, size classes, and any custom classes.
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
