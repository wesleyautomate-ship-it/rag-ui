import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  return (
    <div className="flex-1 overflow-y-auto text-white flex flex-col animate-slide-in">
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.4s ease-in-out; }
      `}</style>
      <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md rounded-b-2xl">
        <h1 className="text-lg font-semibold">Profile & Preferences</h1>
        <Button variant="ghost" size="sm" className="text-white" onClick={onBack}>
          Back
        </Button>
      </header>

      <main className="p-6 space-y-6">
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl text-[#0a2a43] shadow-lg">
          <CardContent>
            <h2 className="font-semibold mb-3">User Info</h2>
            <p className="text-sm">Name: Sarah</p>
            <p className="text-sm">Role: Agent</p>
          </CardContent>
        </Card>

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