import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { ArrowLeft, History, Send } from './Icons';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface Session {
  id: number;
  title: string;
  messages: Message[];
}

interface FullChatPageProps {
  onBack: () => void;
}

const FullChatPage: React.FC<FullChatPageProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const handleSend = () => {
    if (input.trim() === "") return;
    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...(currentSession?.messages || messages), userMessage];
    setMessages(updatedMessages);
    setInput("");

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
      setSessions([newSession, ...sessions]);
      setCurrentSession(newSession);
    }
  };

  const openSession = (session: Session) => {
    setCurrentSession(session);
    setMessages(session.messages);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col text-white animate-slide-up overflow-hidden">
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-in-out; }
      `}</style>
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

        <main className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
          <div className="flex-grow space-y-4">
            {messages.map((msg, idx) => (
                <div
                key={idx}
                className={`p-3 rounded-2xl max-w-[80%] break-words ${
                    msg.role === "user"
                    ? "bg-indigo-500 ml-auto text-white"
                    : "bg-white/90 text-[#0a2a43]"
                }`}
                >
                {msg.content}
                </div>
            ))}
          </div>
        </main>
      </div>

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