// Import necessary libraries from React.
import React from 'react';
import ReactDOM from 'react-dom/client';
// Import the main App component which serves as the root of the application.
import App from './App';

/**
 * Entry point for the React application.
 * This file is responsible for rendering the main App component into the DOM.
 */

// Find the root DOM element where the React app will be mounted.
// The 'root' element is defined in index.html.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // If the root element is not found, throw an error to halt execution.
  // This is a critical failure as the app cannot be rendered.
  throw new Error("Could not find root element to mount to");
}

// Create a React root for the found element.
// This enables the concurrent rendering features of React 18.
const root = ReactDOM.createRoot(rootElement);

// Render the application.
// <React.StrictMode> is a wrapper that helps with highlighting potential problems in an application.
// It activates additional checks and warnings for its descendants.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
