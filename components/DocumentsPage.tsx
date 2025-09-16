import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeft, Download, FileText } from './Icons';
import { Document, mockDocuments } from './data/mockData';


/**
 * A component to render document content, parsing markdown-like syntax
 * (bold, links, lists) and highlighting code blocks.
 * @param {{ content: string }} props - The props containing the document content string.
 * @returns {React.ReactElement} The rendered document content.
 */
const DocumentRenderer: React.FC<{ content: string }> = ({ content }) => {
    const previewRef = useRef<HTMLDivElement>(null);

    /**
     * Effect to apply syntax highlighting to code blocks whenever the content changes.
     * It uses the `highlight.js` library, which is loaded in `index.html`.
     */
    useEffect(() => {
        if (previewRef.current && (window as any).hljs) {
            const codeBlocks = previewRef.current.querySelectorAll('pre code');
            codeBlocks.forEach((block) => {
                (window as any).hljs.highlightElement(block as HTMLElement);
            });
        }
    }, [content]);
    
    /**
     * Parses the raw content string and converts it into an HTML string.
     * This uses `dangerouslySetInnerHTML`, so sanitization is important. Here, we manually
     * escape HTML characters in user content before constructing the final HTML.
     * @returns {{ __html: string }} An object suitable for `dangerouslySetInnerHTML`.
     */
    const createMarkup = () => {
        // First, separate code blocks from the rest of the text to process them differently.
        const parts = content.split(/(```(?:[\w-]+)?\n[\s\S]*?\n```)/g);

        const processedHtml = parts.filter(part => part).map((part) => {
            // Check if the part is a code block.
            const codeBlockMatch = part.match(/^```([\w-]+)?\n([\s\S]*?)\n```$/);
            if (codeBlockMatch) {
                const lang = codeBlockMatch[1] || 'plaintext';
                const code = codeBlockMatch[2];
                // Manually escape < and > to prevent HTML injection.
                const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
            } else {
                // Process regular text content line by line for lists, bolding, and links.
                let html = '';
                const lines = part.trim().split('\n');
                let inList = null; // Can be 'ul', 'ol', or null. Tracks if we are inside a list.
                let currentParagraph: string[] = [];

                // Helper to process markdown within a single line.
                const processLineContent = (l: string) => l
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;') // Escape HTML
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'); // Links

                // Iterate over each line to build the HTML structure.
                for (const rawLine of lines) {
                    const line = rawLine.trim();
                    const ulMatch = line.match(/^[-*]\s+(.*)/); // Unordered list item
                    const olMatch = line.match(/^\d+\.\s+(.*)/); // Ordered list item

                    if (ulMatch || olMatch) {
                        // If we encounter a list item, first wrap any preceding text in a paragraph.
                        if (currentParagraph.length > 0) {
                            html += `<p>${currentParagraph.join('<br/>')}</p>`;
                            currentParagraph = [];
                        }
                        const listType = ulMatch ? 'ul' : 'ol';
                        const itemContent = ulMatch ? ulMatch[1] : olMatch![1];
                        // Start a new list if we're not in one or if the type changes.
                        if (inList !== listType) {
                            if (inList) html += `</${inList}>`; // Close previous list
                            html += `<${listType}>`;
                            inList = listType;
                        }
                        html += `<li>${processLineContent(itemContent)}</li>`;
                    } else {
                        // If not a list item, close any open list.
                        if (inList) {
                            html += `</${inList}>`;
                            inList = null;
                        }
                        // An empty line signifies a paragraph break.
                        if (line === '') {
                            if (currentParagraph.length > 0) {
                                html += `<p>${currentParagraph.join('<br/>')}</p>`;
                                currentParagraph = [];
                            }
                        } else {
                            currentParagraph.push(processLineContent(rawLine));
                        }
                    }
                }
                // Close any remaining open tags.
                if (inList) html += `</${inList}>`;
                if (currentParagraph.length > 0) html += `<p>${currentParagraph.join('<br/>')}</p>`;
                
                return html;
            }
        }).join('');

        return { __html: processedHtml };
    };

    return (
        <div
            ref={previewRef}
            className="document-preview-content font-sans leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={createMarkup()}
        />
    );
};


/**
 * A full-page component for browsing and viewing generated documents.
 * @param {{ onBack: () => void }} props - The props for the component.
 * @returns {React.ReactElement} The rendered DocumentsPage component.
 */
const DocumentsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    // State for the list of all documents.
    const [documents] = useState<Document[]>(mockDocuments);
    // State to track the currently selected document for viewing.
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(documents[0]);

    /**
     * Handles selecting a document from the list to display its content.
     * @param {Document} doc - The document that was clicked.
     */
    const handleSelectDocument = (doc: Document) => {
        setSelectedDocument(doc);
    };

    /**
     * Generates a short text snippet from the document content for previewing in the list.
     * It strips out markdown and code blocks.
     * @param {string} content - The full document content.
     * @param {number} [length=90] - The maximum length of the snippet.
     * @returns {string} The generated snippet.
     */
    const generateSnippet = (content: string, length: number = 90): string => {
        const text = content
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/(\*\*|\[.*?\]\(.*?\)|[-*]|\d+\.)/g, '') // Remove markdown syntax
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
        return text.length > length ? text.substring(0, length).trim() + '...' : text;
    };
    
    /**
     * Handles downloading the selected document as a .txt file.
     */
    const handleDownload = () => {
        if (!selectedDocument) return;

        const blob = new Blob([selectedDocument.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedDocument.title.replace(/\s/g, '_')}.txt`; // Create a safe filename
        document.body.appendChild(link);
        link.click(); // Programmatically click the link to trigger download
        document.body.removeChild(link); // Clean up
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex-1 text-white flex flex-col animate-slide-in overflow-hidden">
           {/* CSS for animations, scrollbars, and document preview styling */}
           <style>{`
            @keyframes slide-in {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-in { animation: slide-in 0.4s ease-in-out; }
            /* Custom scrollbar styles */
            .custom-scrollbar::-webkit-scrollbar { width: 8px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(129, 140, 248, 0.6); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(129, 140, 248, 0.8); }
            
            /* Enhanced styles for document preview */
            .document-preview-content pre {
                background-color: #2d3748; /* A dark gray, blends with atom-one-dark */
                border-radius: 8px;
                padding: 16px;
                overflow-x: auto; /* For horizontal scroll on long code lines */
                white-space: pre-wrap;
                word-wrap: break-word;
                margin: 1em 0;
            }
            .document-preview-content p { margin-bottom: 1em; }
            .document-preview-content p:last-child { margin-bottom: 0; }
            .document-preview-content strong { font-weight: 600; color: #1e293b; }
            .document-preview-content code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 0.9em; }
            .document-preview-content ul, .document-preview-content ol { padding-left: 1.5rem; margin-bottom: 1em; }
            .document-preview-content ul { list-style-type: disc; }
            .document-preview-content ol { list-style-type: decimal; }
            .document-preview-content li { margin-bottom: 0.35em; }
            .document-preview-content a { color: #4f46e5; text-decoration: underline; font-weight: 500; }
          `}</style>
          {/* Page Header */}
          <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md rounded-b-2xl shrink-0">
            <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-semibold">Generated Documents</h1>
            <div className="w-10"></div> {/* Spacer */}
          </header>

          {/* Main Content Area with a two-column layout */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Left Column: Document List */}
                <Card className="bg-white/90 backdrop-blur-sm text-[#0a2a44] lg:col-span-1">
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">Documents</h3>
                        <ul className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                           {documents.map(doc => (
                               <li key={doc.id}>
                                   <button 
                                    className={`w-full text-left p-2 rounded-lg transition-colors ${selectedDocument?.id === doc.id ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
                                    onClick={() => handleSelectDocument(doc)}
                                   >
                                       <p className="font-semibold text-sm truncate">{doc.title}</p>
                                       <p className="text-xs text-gray-600 mt-1">{generateSnippet(doc.content)}</p>
                                       <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                                           <span>{doc.type}</span>
                                           <span>{doc.date}</span>
                                       </div>
                                   </button>
                               </li>
                           ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Right Column: Document Viewer */}
                <Card className="bg-white/90 backdrop-blur-sm text-[#0a2a44] lg:col-span-2">
                    <CardContent className="p-4 h-full flex flex-col">
                        {selectedDocument ? (
                            <>
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold truncate">{selectedDocument.title}</h3>
                                        <p className="text-xs text-gray-500">{selectedDocument.type}</p>
                                    </div>
                                    <Button size="sm" onClick={handleDownload} className="shrink-0 ml-4">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                                <div className="flex-grow bg-gray-50 rounded-lg p-4 overflow-y-auto custom-scrollbar border border-gray-200 text-sm">
                                    <DocumentRenderer content={selectedDocument.content} />
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                <FileText className="w-12 h-12 mb-2" />
                                <h3 className="font-semibold">Select a document</h3>
                                <p className="text-sm">Choose a document from the list to view its content.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
          </main>
        </div>
    );
};

export default DocumentsPage;