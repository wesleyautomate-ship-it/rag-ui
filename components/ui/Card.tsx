import React from 'react';

/**
 * Props for the Card component.
 * It accepts all standard HTML div attributes and requires children.
 */
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * A reusable Card component that serves as a container with predefined styling.
 * It provides a consistent look for content blocks throughout the application.
 * @param {CardProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered Card component.
 */
export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
  <div className={`rounded-2xl shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Props for the CardContent component.
 * It accepts all standard HTML div attributes and requires children.
 */
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

/**
 * A component to be used inside a Card for consistent padding.
 * @param {CardContentProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered CardContent component.
 */
export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);
