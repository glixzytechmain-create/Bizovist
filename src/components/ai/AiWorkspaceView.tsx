import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Send,
  Cpu,
  Layers,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { aiService } from '../../services/aiService';

export const AiWorkspaceView: React.FC = () => {
  const { activeProject, userRole, setActiveView } = useApp();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string; timestamp: string }>
  >([
    {
      role: 'assistant',
      text: `Welcome to Bizovist AI Co-Founder Workspace.
I have access to your active manufacturing journey: "${activeProject?.title || 'General Hardware'}".
I can analyze:
• Tooling costs & amortization options (e.g., impact extrusion dies vs injection molds)
• Batch scrap allowances & acceptable tolerance standards
• Contract clauses: Master Service Agreement (MSA) intellectual property retention
• Golden sample physical stress test protocols
• Negotiation strategies for pilot batch minimum quantities.`,
      timestamp: 'Just now',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || query;
    if (!text.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: 'user', text, timestamp: 'Just now' },
    ]);
    if (!customPrompt) setQuery('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.text }));
      const res = await aiService.chatCoFounder(
        text,
        { activeProject, userRole },
        history
      );
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.reply, timestamp: 'Just now' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Technical recommendation: Ensure the supplier guarantees mold tooling replacement at zero expense if cavitation or tool steel wear exceeds specified tolerances during the first 250,000 cycles.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF5533] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#FF5533]" />
            <span>EXECUTIVE ADVISOR</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Manufacturing AI Co-Founder
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Active Project Context: <span className="text-white font-medium">{activeProject?.title}</span>
          </p>
        </div>

        <button
          onClick={() => setActiveView('projects')}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] hover:bg-white/[0.1] text-white transition flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Switch Project Specs</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="h-[650px] rounded-2xl border border-white/[0.08] bg-[#0E1019] shadow-2xl flex flex-col overflow-hidden">
        {/* Quick prompt suggestions */}
        <div className="p-3 border-b border-white/[0.06] bg-white/[0.01] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-white/40 font-mono text-[11px] uppercase whitespace-nowrap">
            Deep Inquiries:
          </span>
          {[
            'How do I negotiate a 20,000 pilot run when MOQ is 50,000?',
            'What specific lab tests are required for FSSAI cleanroom certification?',
            'Review our water activity aw < 0.62 moisture barrier requirement',
            'Draft an RFQ email for golden sample formulation',
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSend(promptText)}
              className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white whitespace-nowrap transition border border-white/[0.06] text-[11px]"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Chat message stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={i}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-[#FF5533] text-white rounded-tr-none shadow-md shadow-[#FF5533]/20'
                      : 'bg-[#151724] text-white/90 border border-white/[0.08] rounded-tl-none font-mono text-xs'
                  }`}
                >
                  {m.text}
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
              <span>Analyzing engineering tolerances & commercial contracts...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-white/[0.08] bg-[#0A0C13] flex items-center gap-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your manufacturing co-founder anything..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF5533]"
          />
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="p-3 rounded-xl bg-[#FF5533] text-white hover:bg-[#E04626] active:scale-95 disabled:opacity-30 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
