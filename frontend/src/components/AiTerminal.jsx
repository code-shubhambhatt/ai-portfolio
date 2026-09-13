import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { sendChatMessage } from '../services/api';

const DEFAULT_SUGGESTIONS = [
  "What backend architectures and systems has Shubham built?",
  "Tell me about the Astro platform and its architecture.",
  "What are Shubham's core strengths in Python, FastAPI, and PostgreSQL?",
  "Evaluate Shubham's suitability for a Senior/Mid Python Backend role.",
];

export default function AiTerminal() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed && !selectedFile) return;

    const userMessageText = trimmed || (selectedFile ? `Analyze attached file: ${selectedFile.name}` : '');
    
    // Build conversation history format for backend
    // backend expects conversation in role/content format
    const conversationPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Add user message to UI immediately
    const updatedMessages = [...messages, { role: 'user', content: userMessageText, fileName: selectedFile?.name }];
    setMessages(updatedMessages);
    setQuery('');
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(userMessageText, conversationPayload, selectedFile);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.answer || 'No response returned from model.' },
      ]);
      // Clear attached file after successful send
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || 'Failed to query the AI assistant. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (prompt) => {
    setQuery(prompt);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section id="chat" className="py-16 md:py-24 border-b border-[#272A30]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#8FA89B] tracking-wider uppercase">01 //</span>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#E6E9EB]">
              interactive context layer
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8FA89B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8FA89B]"></span>
            </span>
            <span className="font-mono text-xs text-[#949BA4]">
              groq inference // portfolio-aware
            </span>
          </div>
        </div>

        {/* Terminal Container */}
        <div className="bg-[#121419] border border-[#272A30] rounded-lg p-4 sm:p-6 space-y-6">
          {/* Top Bar inside Terminal */}
          <div className="flex items-center justify-between border-b border-[#272A30] pb-3 text-xs font-mono text-[#949BA4]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#272A30]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#272A30]"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#272A30]"></span>
              <span className="ml-2 text-[#E6E9EB]">ai-session:~$ ask_shubham</span>
            </div>
            {messages.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 hover:text-[#E6E9EB] transition-colors"
                title="Clear conversation"
              >
                <RefreshCw className="w-3 h-3" />
                <span>clear_session</span>
              </button>
            )}
          </div>

          {/* Conversation History */}
          <div className="min-h-[140px] max-h-[420px] overflow-y-auto space-y-4 pr-2 font-mono text-xs sm:text-sm">
            {messages.length === 0 && (
              <div className="py-6 text-center space-y-2">
                <p className="text-[#949BA4]">
                  This AI agent is connected to Shubham's live portfolio context (skills, database projects, architecture, and experience).
                </p>
                <p className="text-[#525866] text-xs">
                  Ask a question below, or select a suggested prompt to test reasoning.
                </p>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded border leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#16191F] border-[#272A30] text-[#E6E9EB]'
                    : 'bg-[#0F1115] border-[#272A30] text-[#E6E9EB]'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 text-xs text-[#949BA4] border-b border-[#272A30]/50 mb-2">
                  <span className={m.role === 'user' ? 'text-[#8FA89B]' : 'text-[#B3CCBF]'}>
                    {m.role === 'user' ? 'guest@terminal:~$ query' : 'ai@shubham-core:~$ output'}
                  </span>
                  {m.fileName && (
                    <span className="text-[10px] text-[#949BA4] flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" />
                      {m.fileName}
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            ))}

            {loading && (
              <div className="p-3.5 rounded bg-[#0F1115] border border-[#272A30] text-[#8FA89B] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8FA89B] animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8FA89B] animate-pulse delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8FA89B] animate-pulse delay-200"></span>
                <span className="text-xs text-[#949BA4] ml-2">synthesizing answer from portfolio context...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded bg-red-950/40 border border-red-800/60 text-xs font-mono text-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Prompt Suggestions */}
          <div className="space-y-2 pt-2 border-t border-[#272A30]">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#949BA4]">
              <Sparkles className="w-3 h-3 text-[#8FA89B]" />
              <span>suggested prompts:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_SUGGESTIONS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(item)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded bg-[#16191F] border border-[#272A30] font-mono text-xs text-[#949BA4] hover:text-[#8FA89B] hover:border-[#8FA89B] transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form & Optional JD Upload */}
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            {/* Attached file chip */}
            {selectedFile && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#16191F] border border-[#8FA89B] text-xs font-mono text-[#E6E9EB]">
                <FileText className="w-3.5 h-3.5 text-[#8FA89B]" />
                <span>{selectedFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="hover:text-red-400 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 bg-[#16191F] border border-[#272A30] focus-within:border-[#8FA89B] rounded px-3 py-2 transition-colors">
              <span className="font-mono text-sm text-[#8FA89B] font-bold select-none">&gt;</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about Shubham's backend work, projects, or evaluate a job description..."
                disabled={loading}
                className="w-full bg-transparent font-mono text-xs sm:text-sm text-[#E6E9EB] placeholder:text-[#525866] focus:outline-none"
              />

              {/* Attach File for JD match */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach Job Description (PDF / TXT / DOCX) for semantic role match"
                className="p-1.5 text-[#949BA4] hover:text-[#E6E9EB] hover:bg-[#272A30] rounded transition-colors"
              >
                <FileText className="w-4 h-4" />
              </button>

              {/* Submit Query */}
              <button
                type="submit"
                disabled={loading || (!query.trim() && !selectedFile)}
                className="px-3 py-1.5 rounded bg-[#8FA89B] text-[#0F1115] font-mono text-xs font-semibold hover:bg-[#B3CCBF] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <span>send</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#525866] px-1">
              <span>Supports natural language queries + optional JD file attachment</span>
              <span>Backend powered by Groq LLM</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
