import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  Trash2,
  Paperclip,
  FileText,
  Copy,
  Check,
  Briefcase,
  Terminal,
  Cpu,
  Layers,
  CornerDownLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { streamChatMessage } from '../services/api';

const QUICK_PROMPTS = [
  {
    icon: Briefcase,
    title: 'Match Job Description',
    desc: 'Attach JD to evaluate suitability',
    action: 'upload',
    query: "Please evaluate how Shubham's backend and AI engineering experience matches the attached Job Description.",
  },
  {
    icon: Terminal,
    title: 'Core Backend Skills',
    desc: 'FastAPI, Flask, Django, REST APIs',
    query: "What are Shubham's core backend skills and how are they demonstrated in his work?",
  },
  {
    icon: Layers,
    title: 'Astro Architecture',
    desc: 'Full-stack platform with MongoDB & auth',
    query: 'Tell me about the Astro astrology platform architecture and technical stack.',
  },
  {
    icon: Cpu,
    title: 'AI Inference Work',
    desc: 'Groq, prompt engineering, and LLMs',
    query: 'How does Shubham implement LLM orchestration and AI inference in his applications?',
  },
];

const renderWithLineBreaks = (children) => {
  if (typeof children === 'string') {
    if (/<br\s*\/?>/i.test(children)) {
      return children.split(/<br\s*\/?>/i).map((part, idx, arr) => (
        <React.Fragment key={idx}>
          {part}
          {idx < arr.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    return children;
  }
  if (Array.isArray(children)) {
    return children.map((child, idx) => (
      <React.Fragment key={idx}>{renderWithLineBreaks(child)}</React.Fragment>
    ));
  }
  return children;
};

export default function AiChatWidget({ isOpen, setIsOpen }) {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm Shubham's AI Copilot, grounded on his live portfolio data and repository context. Ask me anything about his engineering systems, backend skills, or attach a **Job Description (.pdf, .docx, .txt)** using the clip below to evaluate role match.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Focus and scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  }, [isOpen, messages, loading]);

  // Global Keyboard shortcuts: Cmd/Ctrl+K to toggle, Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  const handleSend = async (messageText) => {
    const text = (messageText || query).trim();
    if ((!text && !selectedFile) || loading) return;

    const finalMessage =
      text ||
      `Please evaluate the attached job description (${selectedFile?.name}) against Shubham's skills, projects, and backend experience.`;
    const fileToSend = selectedFile;

    const conversationHistory = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Add user message AND an empty assistant message ready to receive streamed tokens
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: finalMessage, fileName: fileToSend?.name },
      { role: 'assistant', content: '' },
    ]);
    setQuery('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLoading(true);
    setError(null);

    try {
      await streamChatMessage(
        finalMessage,
        conversationHistory,
        fileToSend,
        (currentText) => {
          setMessages((prev) => {
            const updated = [...prev];
            if (updated.length > 0) {
              updated[updated.length - 1] = {
                role: 'assistant',
                content: currentText,
              };
            }
            return updated;
          });
        }
      );
    } catch (err) {
      console.error('Chat error:', err);
      setError('Could not connect to the AI assistant. Make sure the backend server is running.');
      setMessages((prev) => {
        if (
          prev.length > 0 &&
          prev[prev.length - 1].role === 'assistant' &&
          !prev[prev.length - 1].content
        ) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setMessages([
      {
        role: 'assistant',
        content:
          "Conversation reset! What would you like to know about Shubham's projects or skills?",
      },
    ]);
  };

  const handleCopyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePromptCardClick = (prompt) => {
    if (prompt.action === 'upload') {
      fileInputRef.current?.click();
    } else {
      handleSend(prompt.query);
    }
  };

  return (
    <>
      {/* Floating Bottom-Right Launcher (When closed) */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative group hover:scale-[1.03] active:scale-[0.97] transition-transform duration-150">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 rounded-full blur-md opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xl hover:shadow-blue-500/30 transition-colors cursor-pointer"
            aria-label="Toggle AI Assistant"
          >
            <Bot className="w-5 h-5 text-blue-100" />
            <span className="text-sm font-medium">Ask Shubham's AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-blue-700/60 text-blue-200 font-mono">
              ⌘K
            </span>
          </button>
        </div>
      </div>

      {/* Right-Side Slide-Over Copilot Panel (Non-centered, leaves portfolio visible!) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Subtle non-intrusive backdrop (dismiss on click, but page stays clearly visible) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 transition-opacity"
            />

            {/* Slide-over Sidecar Panel with Wide & Expandable Layout */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className={`fixed top-0 right-0 bottom-0 z-50 bg-[#161820] border-l border-white/[0.12] shadow-2xl shadow-black/80 flex flex-col overflow-hidden transition-[width] duration-200 ease-out ${
                isExpanded
                  ? 'w-full sm:w-[860px] md:w-[940px] lg:w-[1040px] max-w-[96vw]'
                  : 'w-full sm:w-[620px] md:w-[680px] lg:w-[740px] xl:w-[780px] max-w-[90vw]'
              }`}
            >
              {/* Header */}
              <div className="px-5 py-4 bg-[#1a1d26] border-b border-white/[0.08] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        Shubham's AI Copilot
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[10px] font-semibold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Live
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94a3b8]">
                      Groq • openai/gpt-oss-120b • Grounded on PostgreSQL
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#94a3b8]">
                  {messages.length > 1 && (
                    <button
                      onClick={handleClear}
                      className="p-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                      title="Clear conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden sm:flex p-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                    title={isExpanded ? 'Collapse width' : 'Expand width'}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                    title="Close Copilot (Esc)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-thin">
                {/* Welcome prompt cards when only initial greeting is present */}
                {messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 pt-1 pb-3"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Quick Starters</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {QUICK_PROMPTS.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <motion.button
                            key={idx}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePromptCardClick(item)}
                            className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/40 text-left transition-all group cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-[#94a3b8]">
                                  {item.desc}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-[#64748b] group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Messages */}
                {messages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-7 h-7 rounded-lg bg-[#222530] border border-white/[0.08] text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`group relative max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-sm shadow-md shadow-blue-600/20'
                            : 'bg-[#1b1e27] text-[#e2e8f0] border border-white/[0.08] rounded-tl-sm shadow-sm'
                        }`}
                      >
                        {msg.fileName && (
                          <div className="mb-2 pb-1.5 border-b border-white/20 flex items-center gap-1.5 text-xs text-blue-100 font-medium">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Attached JD: {msg.fileName}</span>
                          </div>
                        )}

                        {isUser ? (
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        ) : (
                          <div className="prose prose-invert max-w-none space-y-2 text-xs sm:text-sm">
                            {msg.content ? (
                              <>
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    table: ({ node, ...props }) => (
                                      <div className="overflow-x-auto my-3 rounded-xl border border-white/[0.1] bg-[#12141a] shadow-inner">
                                        <table className="min-w-full text-xs text-left border-collapse" {...props} />
                                      </div>
                                    ),
                                    thead: ({ node, ...props }) => (
                                      <thead className="bg-[#1f222c] text-white border-b border-white/[0.1]" {...props} />
                                    ),
                                    th: ({ node, children, ...props }) => (
                                      <th className="px-3.5 py-2 font-semibold text-blue-400 whitespace-nowrap border-r last:border-r-0 border-white/[0.08]" {...props}>
                                        {renderWithLineBreaks(children)}
                                      </th>
                                    ),
                                    tbody: ({ node, ...props }) => (
                                      <tbody className="divide-y divide-white/[0.06]" {...props} />
                                    ),
                                    tr: ({ node, ...props }) => (
                                      <tr className="hover:bg-white/[0.02] transition-colors" {...props} />
                                    ),
                                    td: ({ node, children, ...props }) => (
                                      <td className="px-3.5 py-2 text-[#cbd5e1] border-r last:border-r-0 border-white/[0.06] align-top text-xs leading-relaxed" {...props}>
                                        {renderWithLineBreaks(children)}
                                      </td>
                                    ),
                                    h1: ({ node, ...props }) => <h4 className="text-sm font-bold text-white mt-2.5 mb-1" {...props} />,
                                    h2: ({ node, ...props }) => <h4 className="text-xs font-bold text-white mt-2.5 mb-1" {...props} />,
                                    h3: ({ node, ...props }) => <h5 className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide mt-2 mb-0.5" {...props} />,
                                    p: ({ node, children, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-xs sm:text-sm text-[#cbd5e1]" {...props}>{renderWithLineBreaks(children)}</p>,
                                    strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 my-2 text-xs text-[#cbd5e1]" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 my-2 text-xs text-[#cbd5e1]" {...props} />,
                                    li: ({ node, children, ...props }) => <li className="leading-relaxed" {...props}>{renderWithLineBreaks(children)}</li>,
                                    code: ({ node, inline, ...props }) =>
                                      inline ? (
                                        <code className="px-1.5 py-0.5 rounded bg-white/[0.08] text-blue-300 text-xs font-mono" {...props} />
                                      ) : (
                                        <pre className="p-3 rounded-xl bg-[#111318] border border-white/[0.08] overflow-x-auto my-2.5 text-xs text-[#cbd5e1] font-mono leading-relaxed" {...props} />
                                      ),
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>

                                {loading && i === messages.length - 1 && (
                                  <span className="inline-block w-1.5 h-3.5 bg-blue-400 animate-pulse ml-1 align-middle"></span>
                                )}

                                {/* Copy message action button */}
                                <div className="pt-1.5 flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleCopyMessage(msg.content, i)}
                                    className="flex items-center gap-1 text-[11px] text-[#94a3b8] hover:text-white px-2 py-0.5 rounded hover:bg-white/[0.06] transition-colors cursor-pointer"
                                  >
                                    {copiedIndex === i ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400">Copied</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 py-1.5">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></span>
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-150"></span>
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce delay-300"></span>
                                <span className="text-xs text-[#94a3b8] ml-1">Thinking...</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}

                {error && (
                  <div className="p-3 rounded-xl bg-red-900/30 border border-red-700/50 text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Attached file chip preview */}
              {selectedFile && (
                <div className="mx-4 mb-2 px-3 py-1.5 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-between text-xs text-blue-300 animate-in fade-in">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                    <span className="truncate font-medium">{selectedFile.name}</span>
                    <span className="text-[10px] text-[#94a3b8]">({Math.round(selectedFile.size / 1024)} KB)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Bottom Input Capsule */}
              <div className="p-4 bg-[#1a1d26] border-t border-white/[0.08]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2 bg-[#12141a] border border-white/[0.1] focus-within:border-blue-500 rounded-2xl px-3 py-2 transition-all shadow-inner"
                >
                  {/* Hidden native file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                  />

                  {/* Paperclip Button for JD upload */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-xl hover:bg-white/[0.06] text-[#94a3b8] hover:text-blue-400 transition-colors cursor-pointer shrink-0"
                    title="Attach a Job Description (.pdf, .docx, .txt) to evaluate fit"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      selectedFile
                        ? `Ask about ${selectedFile.name}...`
                        : "Ask about Shubham's skills, or attach a JD..."
                    }
                    disabled={loading}
                    className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder:text-[#64748b] focus:outline-none px-1"
                  />

                  <button
                    type="submit"
                    disabled={(!query.trim() && !selectedFile) || loading}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-35 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                {/* Keyboard and context footer */}
                <div className="mt-2 px-1 flex items-center justify-between text-[11px] text-[#64748b]">
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="w-3 h-3" />
                    <span>Enter to send • Esc to close</span>
                  </span>
                  <span>PDF / DOCX / TXT supported</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
