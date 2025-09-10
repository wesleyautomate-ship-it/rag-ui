import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { Mic, Send } from './Icons';

/**
 * Props for the CommandCenter component.
 */
interface CommandCenterProps {
  input: string; // The current text in the input field
  setInput: React.Dispatch<React.SetStateAction<string>>; // Function to update the input text
  isRecording: boolean; // Boolean indicating if voice recording is active
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle recording state
}

/**
 * The primary input component on the main dashboard.
 * It provides a textarea for typing commands and a button for voice input.
 * @param {CommandCenterProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered CommandCenter component.
 */
const CommandCenter: React.FC<CommandCenterProps> = ({ input, setInput, isRecording, setIsRecording }) => {
  return (
    <Card className="rounded-2xl shadow-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white col-span-2">
      <CardContent className="p-5 space-y-3">
        <h2 className="text-sm font-semibold mb-1">Command Center</h2>
        <p className="text-xs mb-2 opacity-90">
          Type or speak commands, have full conversations, and let the system handle follow-ups.
        </p>
        <div className="relative bg-white rounded-2xl shadow-md p-2">
          {/* Auto-resizing textarea for user input */}
          <Textarea
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full pr-20 border-none focus:ring-0 text-[#0a2a43] text-sm bg-transparent resize-none overflow-y-auto rounded-2xl"
            rows={1}
            style={{ minHeight: "40px" }}
            // This onInput handler dynamically adjusts the textarea height based on content.
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = `${target.scrollHeight}px`;
            }}
          />

          {/* Action buttons positioned absolutely within the input area */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1">
            <button
              onClick={() => setIsRecording(!isRecording)}
              // Apply a shadow effect when recording to provide visual feedback.
              className={`p-2 rounded-full transition-shadow ${isRecording ? 'shadow-[0_0_10px_red]' : ''}`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <Mic className={`w-5 h-5 transition-colors ${isRecording ? "text-red-500" : "text-blue-600"}`} />
            </button>

            <Button variant="ghost" size="icon" className="hover:bg-blue-100" aria-label="Send message">
              <Send className="w-5 h-5 text-blue-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommandCenter;
