import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

/**
 * Props for the ProfilePage component.
 */
interface ProfilePageProps {
  // Callback function to navigate back to the previous view.
  onBack: () => void;
}

/**
 * A component that displays the user's profile and application preferences.
 * This is a static page for demonstration purposes.
 * @param {ProfilePageProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered ProfilePage component.
 */
const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  return (
    <div className="flex-1 overflow-y-auto text-white flex flex-col animate-slide-in">
      {/* CSS for the slide-in animation */}
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.4s ease-in-out; }
      `}</style>
      
      {/* Page Header */}
      <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md rounded-b-2xl">
        <h1 className="text-lg font-semibold">Profile & Preferences</h1>
        <Button variant="ghost" size="sm" className="text-white" onClick={onBack}>
          Back
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="p-6 space-y-6">
        {/* User Info Card */}
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl text-[#0a2a43] shadow-lg">
          <CardContent>
            <h2 className="font-semibold mb-3">User Info</h2>
            <p className="text-sm">Name: Sarah</p>
            <p className="text-sm">Role: Agent</p>
          </CardContent>
        </Card>

        {/* Preferences Card */}
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl text-[#0a2a43] shadow-lg">
          <CardContent>
            <h2 className="font-semibold mb-3">Preferences</h2>
            <ul className="text-sm space-y-2">
              <li className="flex items-center">🔔 Notifications</li>
              <li className="flex items-center">🎨 Theme Settings</li>
              <li className="flex items-center">🌐 Language Options</li>
            </ul>
          </CardContent>
        </Card>

        {/* App Settings Card */}
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl text-[#0a2a43] shadow-lg">
          <CardContent>
            <h2 className="font-semibold mb-3">App Settings</h2>
            <ul className="text-sm space-y-2">
              <li className="flex items-center">⚙️ Account Settings</li>
              <li className="flex items-center">📦 Storage</li>
              <li className="flex items-center">🚪 Logout</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;
