import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Bell, User } from './Icons';
import ProfilePage from './ProfilePage';
import FullChatPage from './FullChatPage';
import CommandCenter from './CommandCenter';
import BottomNav from './BottomNav';
import TasksPage from './TasksPage';
import DocumentsPage from './DocumentsPage';
import ClientsPage from './ClientsPage';

/**
 * The main component that orchestrates the entire dashboard layout and navigation.
 * It acts as a single-page application router, switching between different views.
 * @returns {React.ReactElement} The rendered Dashboard component.
 */
const Dashboard: React.FC = () => {
  // State for the command center's input field.
  const [input, setInput] = useState("");
  // State to track if voice recording is active in the command center.
  const [isRecording, setIsRecording] = useState(false);
  // State to manage the currently displayed page/view. Defaults to 'dashboard'.
  const [activeView, setActiveView] = useState('dashboard');

  /**
   * Renders the main content based on the `activeView` state.
   * This function acts as a simple router.
   * @returns {React.ReactElement} The component for the active view.
   */
  const renderContent = () => {
    switch(activeView) {
      case 'profile':
        return <ProfilePage onBack={() => setActiveView('dashboard')} />;
      case 'chat':
        return <FullChatPage onBack={() => setActiveView('dashboard')} />;
      case 'tasks':
        return <TasksPage onBack={() => setActiveView('dashboard')} />;
      case 'documents':
        return <DocumentsPage onBack={() => setActiveView('dashboard')} />;
      case 'clients':
        return <ClientsPage onBack={() => setActiveView('dashboard')} />;
      case 'dashboard':
      default:
        // The default view is the main dashboard screen.
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Dashboard Header */}
            <header className="p-4 text-white flex justify-between items-center shadow-md bg-white/10 backdrop-blur-md rounded-b-2xl">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => setActiveView('profile')}
                  aria-label="Open Profile"
                >
                  <User className="w-7 h-7" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold">Good Afternoon, Sarah</h1>
                  <p className="text-xs text-gray-200">3 follow-ups pending today</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white" aria-label="View Notifications">
                <Bell className="w-6 h-6" />
              </Button>
            </header>
            
            {/* Main Dashboard Content */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Meetings Card */}
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent>
                    <h2 className="text-sm font-semibold mb-2 text-[#0a2a43]">Meetings</h2>
                    <p className="text-xs">Call Mr. Khan – Palm Jumeirah</p>
                    <p className="text-xs">Follow-up with RERA inspector</p>
                  </CardContent>
                </Card>

                {/* Recently Sold Card */}
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent>
                    <h2 className="text-sm font-semibold mb-2 text-[#0a2a43]">Recently Sold</h2>
                    <p className="text-xs">Palm Jumeirah – 3BR – AED 12M</p>
                    <p className="text-xs">Downtown Dubai – 2BR – AED 3.5M</p>
                  </CardContent>
                </Card>

                {/* Market News Card */}
                <Card className="bg-white/90 backdrop-blur-sm col-span-2">
                  <CardContent>
                    <h2 className="text-sm font-semibold mb-2 text-[#0a2a43]">Market News</h2>
                    <ul className="list-disc list-inside text-xs space-y-1 text-[#1c3f66]">
                      <li>Palm Jumeirah rental yields up 3% this week</li>
                      <li>Dubai Marina sales up 15% MoM</li>
                      <li>Expo City Dubai launches new district</li>
                    </ul>
                  </CardContent>
                </Card>

                {/* Smart Follow-up Card */}
                <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white col-span-2">
                  <CardContent className="p-5 flex justify-between items-center">
                    <div>
                      <h2 className="text-sm font-semibold mb-1">Smart Follow-up Engine</h2>
                      <p className="text-xs">5 leads awaiting response</p>
                    </div>
                    <Button size="sm" className="bg-white text-indigo-600 rounded-full px-3 py-1 text-xs hover:bg-gray-200">
                      View
                    </Button>
                  </CardContent>
                </Card>

                {/* Command Center Component */}
                <CommandCenter input={input} setInput={setInput} isRecording={isRecording} setIsRecording={setIsRecording} />
              </div>
            </main>
          </div>
        );
    }
  }

  return (
    // Main application container with a gradient background and flex layout.
    <div className="min-h-screen h-screen bg-gradient-to-br from-[#0a2a43] via-[#12395a] to-[#1c3f66] flex flex-col">
      {/* Render the active content */}
      {renderContent()}
      {/* Render the bottom navigation bar */}
      <BottomNav 
        activeView={activeView}
        onOpenHome={() => setActiveView('dashboard')}
        onOpenChat={() => setActiveView('chat')} 
        onOpenTasks={() => setActiveView('tasks')} 
        onOpenDocuments={() => setActiveView('documents')} 
        onOpenClients={() => setActiveView('clients')} 
      />
    </div>
  );
};

export default Dashboard;
