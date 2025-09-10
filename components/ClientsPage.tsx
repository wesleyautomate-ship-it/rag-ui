import React, { useState } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeft } from './Icons';

/**
 * Defines the structure for a single client object.
 */
interface Client {
  id: number;
  name: string;
  status: 'Hot Lead' | 'Active Buyer' | 'Warm Lead' | 'Past Client' | 'Cold Lead';
  lastContact: string; // Date in YYYY-MM-DD format
  propertyOfInterest: string;
}

// Mock data for clients, for demonstration purposes.
const mockClients: Client[] = [
  { id: 1, name: 'Ahmed Al-Mansoori', status: 'Hot Lead', lastContact: '2024-07-29', propertyOfInterest: 'Palm Jumeirah Villa' },
  { id: 2, name: 'Fatima Al-Sayed', status: 'Active Buyer', lastContact: '2024-07-28', propertyOfInterest: 'Downtown 2BR' },
  { id: 3, name: 'John Smith', status: 'Warm Lead', lastContact: '2024-07-25', propertyOfInterest: 'Dubai Marina Penthouse' },
  { id: 4, name: 'Chen Wei', status: 'Past Client', lastContact: '2024-05-10', propertyOfInterest: 'JLT 1BR (Sold)' },
  { id: 5, name: 'Maria Garcia', status: 'Cold Lead', lastContact: '2024-06-15', propertyOfInterest: 'Arabian Ranches' },
];

// Maps client status to corresponding Tailwind CSS classes for styling the status badge.
const statusColors: Record<Client['status'], string> = {
    'Hot Lead': 'bg-red-500 text-white',
    'Active Buyer': 'bg-indigo-500 text-white',
    'Warm Lead': 'bg-yellow-400 text-black',
    'Past Client': 'bg-green-500 text-white',
    'Cold Lead': 'bg-gray-400 text-white',
};

/**
 * A full-page component for viewing and managing a list of clients.
 * @param {{ onBack: () => void }} props - The props for the component.
 * @returns {React.ReactElement} The rendered ClientsPage component.
 */
const ClientsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // State to hold the list of clients.
    const [clients] = useState<Client[]>(mockClients);
    // State to hold the current value of the search input field.
    const [searchQuery, setSearchQuery] = useState('');

    /**
     * Calculates a human-readable string for the time elapsed since a given date.
     * @param {string} dateString - The date string in YYYY-MM-DD format.
     * @returns {string} A relative time string (e.g., "3 days ago").
     */
    const timeSince = (dateString: string) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        // Check if the interval is greater than 1 to correctly label "1 day ago" vs "Today"
        if (interval > 1) return Math.floor(interval) + " days ago";
        return "Today";
    };

    // Filter the clients array based on the search query.
    // The filter is case-insensitive.
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 text-white flex flex-col animate-slide-in overflow-y-auto">
           {/* CSS for the slide-in animation */}
           <style>{`
            @keyframes slide-in {
              from { transform: translateX(-100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-in { animation: slide-in 0.4s ease-in-out; }
          `}</style>
          {/* Page Header */}
          <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md rounded-b-2xl shrink-0">
            <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-semibold">Client Management</h1>
            <div className="w-10"></div> {/* Spacer to center the title */}
          </header>

          {/* Main Content Area: List of Client Cards */}
          <main className="flex-1 overflow-y-auto p-6">
            {/* Search Bar for filtering clients */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search clients by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/70 border border-transparent rounded-md px-4 py-2 text-sm text-[#0a2a43] placeholder:text-gray-500 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-shadow shadow-sm"
                aria-label="Search clients"
              />
            </div>
            
            {/* Conditionally render the list of clients or a 'not found' message */}
            <div className="space-y-4">
                {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                        <Card key={client.id} className="bg-white/90 backdrop-blur-sm text-[#0a2a44]">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                        <h3 className="font-bold text-lg">{client.name}</h3>
                                        <p className="text-xs text-gray-600">Interested in: {client.propertyOfInterest}</p>
                                        <p className="text-xs text-gray-500">Last Contact: {timeSince(client.lastContact)}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                        {/* Status Badge with dynamic color */}
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[client.status]}`}>{client.status}</span>
                                        <Button size="sm" variant="outline" className="text-xs border-indigo-500 text-indigo-500 hover:bg-indigo-50">View Details</Button>
                                </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-white/80">No clients found matching your search.</p>
                    </div>
                )}
            </div>
          </main>
        </div>
    );
};

export default ClientsPage;