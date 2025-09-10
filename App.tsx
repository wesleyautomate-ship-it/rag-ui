// Import necessary libraries from React.
import React from 'react';
// Import the main Dashboard component, which contains the entire application layout and logic.
import Dashboard from './components/Dashboard';

/**
 * The root component of the application.
 * It sets up the basic structure and renders the main Dashboard.
 * @returns {React.ReactElement} The rendered App component.
 */
const App: React.FC = () => {
  return (
    // The main container div with base text styling.
    // "antialiased" provides smoother font rendering.
    // "text-slate-500" sets a default text color.
    <div className="antialiased text-slate-500">
      <Dashboard />
    </div>
  );
};

export default App;
