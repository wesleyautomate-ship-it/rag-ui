import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { ArrowLeft, History, Send } from './Icons';

/**
 * Defines the structure of a single chat message.
 */
interface Message {
  role: 'user' | 'ai'; // Who sent the message
  content: string; // The text content of the message
}

/**
 * Defines the structure of a chat session/history.
 */
interface Session {
  id: number; // Unique identifier for the session
  title: string; // A short title, usually from the first message
  messages: Message[]; // Array of messages in the session
}

/**
 * Props for the FullChatPage component.
 */
interface FullChatPageProps {
  // Callback function to navigate back to the previous view.
  onBack: () => void;
}

/**
 * A full-screen chat interface component.
 * It allows for conversations with an AI, and manages chat history/sessions.
 * @param {FullChatPageProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered FullChatPage component.
 */
const FullChatPage: React.FC<FullChatPageProps> = ({ onBack }) => {
  // State to hold messages for the currently active chat view.
  const [messages, setMessages] = useState<Message[]>([]);
  // State for the text in the input field.
  const [input, setInput] = useState("");
  // State to store all chat sessions.
  const [sessions, setSessions] = useState<Session[]>([]);
  // State to track the currently selected session.
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  /**
   * Handles sending a message.
   * It adds the user's message to the state and manages session creation/updating.
   * Note: This is a mock implementation; it doesn't actually call an AI.
   */
  const handleSend = () => {
    if (input.trim() === "") return; // Don't send empty messages
    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...(currentSession?.messages || messages), userMessage];
    setMessages(updatedMessages); // Update the view immediately
    setInput(""); // Clear the input field

    // If there's an active session, update it. Otherwise, create a new one.
    if (currentSession) {
      const updatedSession = { ...currentSession, messages: updatedMessages };
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSession.id ? updatedSession : s))
      );
      setCurrentSession(updatedSession);
    } else {
      const newSession: Session = {
        id: Date.now(),
        title: input.slice(0, 20) + (input.length > 20 ? "..." : ""),
        messages: updatedMessages,
      };
      setSessions([newSession, ...sessions]); // Add new session to the top of the list
      setCurrentSession(newSession);
    }
  };

  /**
   * Switches the chat view to a selected session from the history.
   * @param {Session} session - The session to open.
   */
  const openSession = (session: Session) => {
    setCurrentSession(session);
    setMessages(session.messages);
  };
  
  /**
   * Handles the key down event on the textarea for "Enter to send".
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} event - The keyboard event.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Send on Enter, allow new lines with Shift+Enter
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col text-white animate-slide-up overflow-hidden">
      {/* CSS for the slide-up animation */}
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-in-out; }
      `}</style>

      {/* Page Header */}
      <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md shrink-0">
        <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold">AI Chat</h1>
        <Button variant="ghost" size="icon" className="text-white">
          <History className="w-6 h-6" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Session History Sidebar (visible on medium screens and up) */}
        <aside className="w-1/4 bg-white/10 backdrop-blur-md p-4 overflow-y-auto hidden md:block">
          <h2 className="text-sm font-semibold mb-3">Sessions</h2>
          <ul className="space-y-2">
            {sessions.map((session) => (
              <li
                key={session.id}
                className={`p-2 rounded-lg cursor-pointer text-sm ${
                  currentSession?.id === session.id ? "bg-indigo-500 text-white" : "bg-white/20 hover:bg-white/30"
                }`}
                onClick={() => openSession(session)}
              >
                {session.title}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
          <div className="flex-grow space-y-4">
            {/* Render all messages */}
            {messages.map((msg, idx) => (
                <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[80%] break-words ${
                    msg.role === "user"
                    ? "bg-indigo-500 ml-auto text-white"  // User messages are on the right
                    : "bg-white/90 text-[#0a2a43]"        // AI messages are on the left
                }`}
                >
                {msg.content}
                </div>
            ))}
          </div>
        </main>
      </div>

      {/* Chat Input Footer */}
      <footer className="p-4 bg-white/10 backdrop-blur-md flex items-center space-x-2 shrink-0">
        <Textarea
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          className="flex-1 rounded-2xl resize-none text-[#0a2a43] bg-white/90 border-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button variant="ghost" size="icon" onClick={handleSend} className="text-indigo-400 hover:text-indigo-300">
          <Send className="w-6 h-6" />
        </Button>
      </footer>
    </div>
  );
};

export default FullChatPage;
