import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeft, Download, FileText } from './Icons';

interface Document {
    id: number;
    title: string;
    type: 'Sales Agreement' | 'Marketing Copy' | 'Market Report' | 'Email Template';
    date: string;
    content: string;
}

const mockDocuments: Document[] = [
    {
        id: 1,
        title: 'Palm Jumeirah Villa - Sales Agreement Draft',
        type: 'Sales Agreement',
        date: '2024-07-28',
        content: `**SALES AND PURCHASE AGREEMENT**

This agreement is made on this 28th day of July, 2024.

BETWEEN:
Mr. Khan (the "Seller")
AND
[Buyer Name] (the "Buyer")

**TERMS:**
1. A deposit of 10% (AED 1,200,000) shall be paid upon signing.
2. The remainder shall be paid upon transfer of title.
3. RERA and DLD fees to be shared equally between both parties.

For official guidelines, please refer to the [DLD website](https://dubailand.gov.ae/).`
    },
    {
        id: 2,
        title: 'Downtown Dubai 2BR Apartment Listing',
        type: 'Marketing Copy',
        date: '2024-07-27',
        content: `**Luxury 2-Bedroom Apartment with Full Burj Khalifa View in Downtown Dubai**

Experience the height of luxury in this stunning 2-bedroom apartment. Offering breathtaking, unobstructed views of the Burj Khalifa.

**Key Features:**
- 2 Spacious Bedrooms with En-suite Bathrooms
- 1,650 sq. ft. of living space
- Floor-to-ceiling windows
- Modern, fully-equipped kitchen

**Price: AED 3,500,000** For more details, [visit our website](https://example.com).`
    },
    {
        id: 3,
        title: 'Weekly Market Report - July Week 4',
        type: 'Market Report',
        date: '2024-07-26',
        content: `**Dubai Real Estate Market Report - Week 4, July 2024**

**Key Highlights:**
- **Palm Jumeirah:** Rental yields have seen a 3% increase.
- **Dubai Marina:** Sales transactions are up by 15% month-on-month.
- **Expo City Dubai:** The launch of the new "Mangrove Residences" has attracted significant interest.`
    },
    {
        id: 4,
        title: 'Automated Follow-up Email Script',
        type: 'Email Template',
        date: '2024-07-25',
        content: `**Subject: Following up on your interest in Downtown Dubai**

Hi [Client Name],

Following up on our recent conversation. Here is a small script to showcase properties dynamically:

\`\`\`javascript
function displayProperties(properties) {
  const container = document.getElementById('property-listings');
  container.innerHTML = ''; // Clear previous listings
  
  properties.forEach(prop => {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = \`
      <h3>\${prop.title}</h3>
      <p>Price: \${prop.price}</p>
    \`;
    container.appendChild(card);
  });
}
\`\`\`

Let me know when would be a good time to discuss these.

Best regards,
Sarah`
    }
];

// Renderer component to handle markdown-like syntax and code blocks
const DocumentRenderer: React.FC<{ content: string }> = ({ content }) => {
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (previewRef.current && (window as any).hljs) {
            const codeBlocks = previewRef.current.querySelectorAll('pre code');
            codeBlocks.forEach((block) => {
                (window as any).hljs.highlightElement(block as HTMLElement);
            });
        }
    }, [content]);
    
    const createMarkup = () => {
        const parts = content.split(/(```(?:[\w-]+)?\n[\s\S]*?\n```)/g);

        const processedHtml = parts.filter(part => part).map((part) => {
            const codeBlockMatch = part.match(/^```([\w-]+)?\n([\s\S]*?)\n```$/);
            if (codeBlockMatch) {
                const lang = codeBlockMatch[1] || 'plaintext';
                const code = codeBlockMatch[2];
                const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                return `<pre><code class="language-${lang}">${escapedCode}</code></pre>`;
            } else {
                let html = '';
                const lines = part.trim().split('\n');
                let inList = null; // 'ul', 'ol', or null
                let currentParagraph = [];

                const processLineContent = (l: string) => l
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

                for (const rawLine of lines) {
                    const line = rawLine.trim();
                    const ulMatch = line.match(/^[-*]\s+(.*)/);
                    const olMatch = line.match(/^\d+\.\s+(.*)/);

                    if (ulMatch || olMatch) {
                        if (currentParagraph.length > 0) {
                            html += `<p>${currentParagraph.join('<br/>')}</p>`;
                            currentParagraph = [];
                        }
                        const listType = ulMatch ? 'ul' : 'ol';
                        const itemContent = ulMatch ? ulMatch[1] : olMatch[1];
                        if (inList !== listType) {
                            if (inList) html += `</${inList}>`;
                            html += `<${listType}>`;
                            inList = listType;
                        }
                        html += `<li>${processLineContent(itemContent)}</li>`;
                    } else {
                        if (inList) {
                            html += `</${inList}>`;
                            inList = null;
                        }
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


const DocumentsPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [documents] = useState<Document[]>(mockDocuments);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(documents[0]);

    const handleSelectDocument = (doc: Document) => {
        setSelectedDocument(doc);
    };

    const generateSnippet = (content: string, length: number = 90): string => {
        const text = content
            .replace(/```[\s\S]*?```/g, '')
            .replace(/(\*\*|\[.*?\]\(.*?\)|[-*]|\d+\.)/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        return text.length > length ? text.substring(0, length).trim() + '...' : text;
    };
    
    const handleDownload = () => {
        if (!selectedDocument) return;

        const blob = new Blob([selectedDocument.content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${selectedDocument.title.replace(/\s/g, '_')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex-1 text-white flex flex-col animate-slide-in overflow-hidden">
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
          <header className="p-4 flex items-center justify-between shadow-md bg-white/10 backdrop-blur-md rounded-b-2xl shrink-0">
            <Button variant="ghost" size="icon" className="text-white" onClick={onBack}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-lg font-semibold">Generated Documents</h1>
            <div className="w-10"></div> {/* Spacer */}
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                <Card className="bg-white/90 backdrop-blur-sm text-[#0a2a44] lg:col-span-1">
                    <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">Documents</h3>
                        <ul className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                           {documents.map(doc => (
                               <li key={doc.id}>
                                   <button 
                                    className={`w-full text-left p-3 rounded-lg transition-colors ${selectedDocument?.id === doc.id ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
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