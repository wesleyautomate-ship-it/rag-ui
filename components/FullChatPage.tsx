import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Card, CardContent } from './ui/Card';
import { ArrowLeft, Send, Plus, Trash, Paperclip, FileText, X } from './Icons';
import { mockDocuments, Document } from './data/mockData';
import { GoogleGenAI } from '@google/genai';


/**
 * Defines the structure of a single chat message.
 */
interface Message {
  role: 'user' | 'ai'; // Who sent the message
  content: string; // The text content of the message
  attachedDocumentTitle?: string; // Optional: Title of the attached document
}

/**
 * Defines the structure of a chat session.
 */
interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
}

/**
 * Props for the FullChatPage component.
 */
interface FullChatPageProps {
  // Callback function to navigate back to the previous view.
  onBack: () => void;
}

/**
 * A full-screen chat interface component with a persistent sidebar for session history.
 * It allows for managing multiple conversations, which are stored in localStorage.
 * @param {FullChatPageProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered FullChatPage component.
 */
const FullChatPage: React.FC<FullChatPageProps> = ({ onBack }) => {
  // State to hold all chat sessions.
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  // State to track the currently active session ID.
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  // State for the text in the input field.
  const [input, setInput] = useState("");
  // State to manage sidebar visibility on mobile.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State for AI response loading
  const [isLoading, setIsLoading] = useState(false);
  // State for document attachment modal
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  // State for the currently attached document
  const [attachedDocument, setAttachedDocument] = useState<Document | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Effect to load chat history from localStorage on initial render.
   */
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
            setChatHistory(parsedHistory);
            // Set the most recent session as active.
            setActiveSessionId(parsedHistory[0].id);
            return;
        }
      }
    } catch (error) {
        console.error("Failed to load chat history from localStorage:", error);
    }
    // If no history is found, create a new session.
    const newSession: ChatSession = { id: Date.now().toString(), title: 'New Chat', messages: [] };
    setChatHistory([newSession]);
    setActiveSessionId(newSession.id);
  }, []);

  /**
   * Effect to save chat history to localStorage whenever it changes.
   */
  useEffect(() => {
    if (chatHistory.length > 0) {
        try {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        } catch (error) {
            console.error("Failed to save chat history to localStorage:", error);
        }
    }
  }, [chatHistory]);

  /**
   * Effect to scroll to the bottom of the messages list when new messages are added.
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, activeSessionId]);


  /**
   * Handles starting a new chat session.
   */
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
    };
    setChatHistory(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setIsSidebarOpen(false); // Close sidebar on mobile after creating new chat
  };

  /**
   * Handles selecting a session from the sidebar.
   * @param {string} sessionId - The ID of the session to activate.
   */
  const handleSelectSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  /**
   * Handles deleting a session.
   * @param {React.MouseEvent} e - The mouse event.
   * @param {string} sessionId - The ID of the session to delete.
   */
  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent handleSelectSession from firing.
    
    setChatHistory(prev => {
        const newHistory = prev.filter(session => session.id !== sessionId);
        
        if (activeSessionId === sessionId) {
            if (newHistory.length > 0) {
                setActiveSessionId(newHistory[0].id);
            } else {
                // If no sessions are left, create a new one.
                const newSession: ChatSession = { id: Date.now().toString(), title: 'New Chat', messages: [] };
                setActiveSessionId(newSession.id);
                return [newSession];
            }
        }
        return newHistory;
    });
  };
  
  /**
   * Handles attaching a document to the current message input.
   * @param {Document} doc - The document to attach.
   */
  const handleAttachDocument = (doc: Document) => {
    setAttachedDocument(doc);
    setIsAttachmentModalOpen(false);
  };


  /**
   * Handles sending a message. Adds the message to the active chat session.
   */
  const handleSend = async () => {
    if (input.trim() === "" || !activeSessionId || isLoading) return;
    setIsLoading(true);

    const userMessage: Message = { 
        role: 'user', 
        content: input,
        attachedDocumentTitle: attachedDocument?.title,
    };

    // Add user message to state immediately for responsiveness
    setChatHistory(prev =>
      prev.map(session => {
        if (session.id === activeSessionId) {
          const newTitle = session.messages.length === 0 ? input.substring(0, 25) + (input.length > 25 ? '...' : '') : session.title;
          return { ...session, title: newTitle, messages: [...session.messages, userMessage] };
        }
        return session;
      })
    );
    
    // Construct the prompt for the Gemini API
    const prompt = attachedDocument
        ? `Based on the content of the document titled "${attachedDocument.title}" provided below, please answer the following question. Document Content:\n\n---\n${attachedDocument.content}\n---\n\nQuestion: ${input}`
        : input;

    // Clear inputs
    setInput("");
    setAttachedDocument(null);

    try {
        const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const aiResponseText = response.text;

        const aiMessage: Message = { role: 'ai', content: aiResponseText };
        
        setChatHistory(prev =>
            prev.map(session =>
                session.id === activeSessionId
                    ? { ...session, messages: [...session.messages, aiMessage] }
                    : session
            )
        );

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        const errorMessage: Message = { role: 'ai', content: "Sorry, I encountered an error while processing your request. Please check the API key and try again." };
        setChatHistory(prev =>
            prev.map(session =>
                session.id === activeSessionId
                    ? { ...session, messages: [...session.messages, errorMessage] }
                    : session
            )
        );
    } finally {
        setIsLoading(false);
    }
  };
  
  /**
   * Handles the key down event on the textarea for "Enter to send".
   * @param {React.KeyboardEvent<HTMLTextAreaElement>} event - The keyboard event.
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const activeChat = chatHistory.find(session => session.id === activeSessionId);

  return (
    <div className="flex-1 flex text-white animate-slide-up overflow-hidden h-full">
       <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.4s ease-in-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-in-out; }
        .animate-scale-up { animation: scale-up 0.2s ease-in-out; }
      `}</style>
      
      {/* Sidebar for Chat History */}
      <aside className={`absolute z-20 md:relative flex flex-col h-full w-64 bg-black/20 backdrop-blur-lg p-2 transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 shrink-0`}>
        <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold px-2">History</h2>
            <Button variant="ghost" size="icon" onClick={handleNewChat} className="text-white" aria-label="New Chat">
                <Plus className="w-6 h-6" />
            </Button>
        </div>
        <div className="flex-grow overflow-y-auto space-y-1 pr-1">
            {chatHistory.map(session => (
                <button 
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`w-full text-left p-2 rounded-lg group transition-colors flex justify-between items-center ${activeSessionId === session.id ? 'bg-white/20' : 'hover:bg-white/10'}`}
                    aria-label={`Select chat: ${session.title}`}
                >
                    <span className="truncate text-sm">{session.title}</span>
                    <button onClick={(e) => handleDeleteSession(e, session.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity p-1" aria-label={`Delete chat: ${session.title}`}>
                        <Trash className="w-4 h-4" />
                    </button>
                </button>
            ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md shrink-0">
          <Button variant="ghost" size="icon" className="text-white md:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Toggle chat history">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </Button>
          <Button variant="ghost" size="icon" className="text-white hidden md:inline-flex" onClick={onBack}>
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold truncate px-2">{activeChat?.title || 'AI Chat'}</h1>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        <main className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
          <div className="flex-grow space-y-4">
            {activeChat?.messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400">Attach a document or send a message to start.</p>
                </div>
            )}
            {activeChat?.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col p-3 rounded-2xl max-w-[80%] break-words ${
                    msg.role === "user"
                    ? "bg-indigo-500 ml-auto text-white"
                    : "bg-white/90 text-[#0a2a43]"
                }`}
              >
                 {msg.attachedDocumentTitle && (
                    <div className="flex items-center gap-2 text-xs border-b border-white/30 pb-2 mb-2 font-medium">
                        <FileText className="w-4 h-4 shrink-0" />
                        <span className="truncate">Attached: {msg.attachedDocumentTitle}</span>
                    </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}
             {isLoading && (
                <div className="p-3 rounded-2xl max-w-[80%] bg-white/90 text-[#0a2a43] flex items-center space-x-2">
                    <span className="animate-spin h-5 w-5 border-2 border-transparent border-t-indigo-500 rounded-full"></span>
                    <span>AI is thinking...</span>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        <footer className="p-4 bg-white/10 backdrop-blur-md flex flex-col shrink-0">
          {attachedDocument && (
            <div className="bg-indigo-500/50 text-white text-sm rounded-t-lg p-2 flex justify-between items-center mb-2 animate-fade-in">
                <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">Attaching: {attachedDocument.title}</span>
                </div>
                <button onClick={() => setAttachedDocument(null)} className="p-1 rounded-full hover:bg-white/20" aria-label="Remove attached document">
                    <X className="w-4 h-4" />
                </button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Textarea
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              className={`flex-1 rounded-2xl resize-none text-[#0a2a43] bg-white/90 border-none focus:ring-2 focus:ring-indigo-500 ${attachedDocument ? 'rounded-t-none' : ''}`}
              disabled={isLoading}
            />
            <Button variant="ghost" size="icon" onClick={() => setIsAttachmentModalOpen(true)} className="text-indigo-400 hover:text-indigo-300" aria-label="Attach document" disabled={isLoading}>
                <Paperclip className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSend} className="text-indigo-400 hover:text-indigo-300" aria-label="Send message" disabled={isLoading || input.trim() === ''}>
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </footer>
      </div>
      
      {/* Attachment Modal */}
      {isAttachmentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setIsAttachmentModalOpen(false)}>
            <Card className="bg-white text-[#0a2a43] w-full max-w-lg m-4 animate-scale-up" onClick={e => e.stopPropagation()}>
                <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Attach a Document</h3>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {mockDocuments.map(doc => (
                            <button key={doc.id} onClick={() => handleAttachDocument(doc)} className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors">
                                <p className="font-semibold text-sm">{doc.title}</p>
                                <p className="text-xs text-gray-600">{doc.type}</p>
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button variant="ghost" onClick={() => setIsAttachmentModalOpen(false)} className="text-gray-700 hover:bg-gray-100">Cancel</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
};

export default FullChatPage;