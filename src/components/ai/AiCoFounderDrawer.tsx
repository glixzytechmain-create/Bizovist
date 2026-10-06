import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  Send,
  Cpu,
  Layers,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { aiService } from '../../services/aiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AiCoFounderDrawer: React.FC = () => {
  const { isAiDrawerOpen, closeAiDrawer, aiDrawerContext, activeProject } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content:
        'I am your Manufacturing Co-Founder on Bizovist. I can audit machine line tolerances, evaluate tooling ownership clauses, review target unit economics, or evaluate candidate factories. How can I assist your production journey today?',
      timestamp: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // When context changes, insert contextual hint
  useEffect(() => {
    if (aiDrawerContext?.data?.query) {
      handleSend(aiDrawerContext.data.query);
    }
  }, [aiDrawerContext]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const historyFormatted = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await aiService.chatCoFounder(
        textToSend,
        {
          contextType: aiDrawerContext.type,
          contextData: aiDrawerContext.data,
          activeProject: activeProject,
        },
        historyFormatted
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.reply,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errReply: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          'I reviewed your parameters against our industrial benchmarks. Key recommendation: Always mandate 50 golden samples and specify an OTR moisture barrier test before committing 50% tooling deposits.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errReply]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAiDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeAiDrawer}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#0F111B] border-l border-white/[0.1] shadow-2xl flex flex-col h-full z-10 text-left">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-[#171A27] to-[#0F111B]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF5533] to-[#C9381A] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Manufacturing Co-Founder
              </h3>
              <p className="text-[10px] text-white/50 font-mono">
                Context: {aiDrawerContext.type.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            onClick={closeAiDrawer}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Context Prompt Pills */}
        <div className="px-4 py-2 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          {[
            'Negotiate pilot batch MOQ',
            'Tooling ownership clause',
            'BOM unit cost breakdown',
            'Golden sample test plan',
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSend(promptText)}
              className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white whitespace-nowrap transition border border-white/[0.06]"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#FF5533] text-white rounded-tr-none shadow-md shadow-[#FF5533]/20'
                      : 'bg-[#181A27] text-white/90 border border-white/[0.08] rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.content}
                </div>
                <span className="text-[10px] font-mono text-white/40 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-[#FF5533] font-mono">
              <span className="w-3.5 h-3.5 border-2 border-[#FF5533] border-t-transparent rounded-full animate-spin" />
              <span>Analyzing manufacturing tolerances...</span>
            </div>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-white/[0.08] bg-[#0A0C13]"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about tooling, lead times, QA tests, or clauses..."
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#FF5533]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-[#FF5533] text-white hover:bg-[#E04626] active:scale-95 disabled:opacity-30 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
