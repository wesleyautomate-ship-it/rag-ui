import React from 'react';
import { Button } from './ui/Button';
import { Home, Users, ClipboardList, MessageSquare, FileText } from './Icons';

interface BottomNavProps {
  activeView: string;
  onOpenHome: () => void;
  onOpenChat: () => void;
  onOpenTasks: () => void;
  onOpenDocuments: () => void;
  onOpenClients: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onOpenHome, onOpenChat, onOpenTasks, onOpenDocuments, onOpenClients }) => {
  const getButtonClass = (viewName: string) => {
    return activeView === viewName ? 'text-indigo-600' : 'text-[#0a2a43]';
  };
  
  return (
    <nav className="bg-white/90 backdrop-blur-sm border-t shadow-xl p-3 flex justify-around items-center rounded-t-2xl shrink-0">
      <Button variant="ghost" size="icon" onClick={onOpenHome}>
        <Home className={`w-6 h-6 transition-colors ${getButtonClass('dashboard')}`} />
      </Button>
      <Button variant="ghost" size="icon" onClick={onOpenClients}>
        <Users className={`w-6 h-6 transition-colors ${getButtonClass('clients')}`} />
      </Button>

      <Button
        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-4 shadow-lg -mt-8"
        onClick={onOpenChat}
        aria-label="Open Chat"
      >
        <MessageSquare className="w-7 h-7" />
      </Button>

      <Button variant="ghost" size="icon" onClick={onOpenDocuments}>
        <FileText className={`w-6 h-6 transition-colors ${getButtonClass('documents')}`} />
      </Button>
      <Button variant="ghost" size="icon" onClick={onOpenTasks}>
        <ClipboardList className={`w-6 h-6 transition-colors ${getButtonClass('tasks')}`} />
      </Button>
    </nav>
  );
};

export default BottomNav;