import React from 'react';
import { Button } from './ui/Button';
import { Home, Users, ClipboardList, MessageSquare, FileText } from './Icons';

/**
 * Props for the BottomNav component.
 */
interface BottomNavProps {
  activeView: string; // The name of the currently active view
  // Callback functions to switch to different pages/views.
  onOpenHome: () => void;
  onOpenChat: () => void;
  onOpenTasks: () => void;
  onOpenDocuments: () => void;
  onOpenClients: () => void;
}

/**
 * The main bottom navigation bar for the application.
 * It provides quick access to the primary sections of the app.
 * @param {BottomNavProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered BottomNav component.
 */
const BottomNav: React.FC<BottomNavProps> = ({ activeView, onOpenHome, onOpenChat, onOpenTasks, onOpenDocuments, onOpenClients }) => {
  /**
   * Determines the CSS class for a navigation button based on whether its view is active.
   * @param {string} viewName - The name of the view associated with the button.
   * @returns {string} The Tailwind CSS class for the icon's color.
   */
  const getButtonClass = (viewName: string) => {
    return activeView === viewName ? 'text-indigo-600' : 'text-[#0a2a43]';
  };
  
  return (
    // The navigation bar container with styling.
    <nav className="bg-white/90 backdrop-blur-sm border-t shadow-xl p-3 flex justify-around items-center rounded-t-2xl shrink-0">
      {/* Home Button */}
      <Button variant="ghost" size="icon" onClick={onOpenHome} aria-label="Open Home">
        <Home className={`w-6 h-6 transition-colors ${getButtonClass('dashboard')}`} />
      </Button>
      {/* Clients Button */}
      <Button variant="ghost" size="icon" onClick={onOpenClients} aria-label="Open Clients">
        <Users className={`w-6 h-6 transition-colors ${getButtonClass('clients')}`} />
      </Button>

      {/* Center "Floating Action Button" for Chat */}
      <Button
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-4 shadow-lg -mt-8"
        onClick={onOpenChat}
        aria-label="Open Chat"
      >
        <MessageSquare className="w-7 h-7" />
      </Button>

      {/* Documents Button */}
      <Button variant="ghost" size="icon" onClick={onOpenDocuments} aria-label="Open Documents">
        <FileText className={`w-6 h-6 transition-colors ${getButtonClass('documents')}`} />
      </Button>
      {/* Tasks Button */}
      <Button variant="ghost" size="icon" onClick={onOpenTasks} aria-label="Open Tasks">
        <ClipboardList className={`w-6 h-6 transition-colors ${getButtonClass('tasks')}`} />
      </Button>
    </nav>
  );
};

export default BottomNav;
