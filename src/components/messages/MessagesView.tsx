import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Sparkles,
  Paperclip,
  CheckCheck,
  Building2,
  FileCheck2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    messages,
    activeThreadId,
    setActiveThreadId,
    sendMessage,
    openAiDrawer,
    activeProject,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [aiNegotiationTip, setAiNegotiationTip] = useState<string | null>(null);

  const currentThread = messages.find((t) => t.id === activeThreadId) || messages[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !currentThread) return;
    sendMessage(currentThread.id, inputMessage);
    setInputMessage('');
  };

  const handleAskNextQuestion = () => {
    setAiNegotiationTip(
      `AI Supply Chain Co-Founder Suggestion:
Ask Apex: "What is your standard yield scrap allowance percentage during startup runs, and do you retain backup batch retain samples for 24 months in your QA cold storage?"`
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-left">
      <div className="h-[750px] rounded-2xl border border-white/[0.08] bg-[#0E1019] shadow-2xl flex overflow-hidden">
        {/* Left Side: Threads list */}
        <div className="w-72 sm:w-80 border-r border-white/[0.08] bg-[#0B0D15] flex flex-col">
          <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#FF5533]" />
              <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                RFQ Discussions
              </h2>
            </div>
            <span className="text-[11px] font-mono text-white/40">{messages.length} Active</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04]">
            {messages.map((thread) => {
              const isActive = thread.id === currentThread?.id;
              return (
                <button
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`w-full p-4 text-left transition flex items-start gap-3 ${
                    isActive ? 'bg-[#FF5533]/10 text-white' : 'hover:bg-white/[0.02] text-white/70'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5 text-white/80 font-mono font-bold text-xs">
                    {thread.manufacturerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">
                        {thread.manufacturerName}
                      </h4>
                      <span className="text-[10px] text-white/40 font-mono whitespace-nowrap ml-1">
                        {thread.timestamp.split(' at ')[0]}
                      </span>
                    </div>
                    {thread.projectTitle && (
                      <span className="text-[10px] font-mono text-[#FF5533] block truncate mt-0.5">
                        {thread.projectTitle}
                      </span>
                    )}
                    <p className="text-[11px] text-white/50 truncate mt-1">
                      {thread.lastMessage}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Thread View */}
        {currentThread ? (
          <div className="flex-1 flex flex-col bg-[#0F111B]">
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.01]">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentThread.manufacturerName}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Verified Direct Facility
                  </span>
                </h3>
                <p className="text-xs text-white/40 font-mono mt-0.5">
                  Project: {currentThread.projectTitle || activeProject?.title || 'General Discovery'}
                </p>
              </div>

              {/* Contextual AI button: "Ask Bizovist what I should ask next" */}
              <button
                onClick={handleAskNextQuestion}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FF5533]/15 hover:bg-[#FF5533]/25 text-[#FF5533] border border-[#FF5533]/30 transition flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>What should I ask next?</span>
              </button>
            </div>

            {/* AI Suggestion Bar if triggered */}
            {aiNegotiationTip && (
              <div className="p-3 bg-gradient-to-r from-[#FF5533]/10 to-[#1A1826] border-b border-[#FF5533]/20 flex items-start justify-between gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF5533] shrink-0 mt-0.5" />
                  <p className="text-white/80 leading-relaxed font-mono text-[11px]">
                    {aiNegotiationTip}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setInputMessage(
                      'What is your standard yield scrap allowance percentage during startup runs, and do you retain backup batch retain samples for 24 months in your QA cold storage?'
                    );
                    setAiNegotiationTip(null);
                  }}
                  className="px-2.5 py-1 rounded bg-[#FF5533] text-white font-medium hover:bg-[#E04626] shrink-0 text-[11px]"
                >
                  Insert prompt
                </button>
              </div>
            )}

            {/* Message Bubble Feed */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {currentThread.messages.map((msg) => {
                const isMe = msg.sender === 'founder';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm space-y-2 leading-relaxed ${
                        isMe
                          ? 'bg-[#FF5533] text-white shadow-lg shadow-[#FF5533]/20 rounded-tr-none'
                          : 'bg-[#181B28] text-white/90 border border-white/[0.08] rounded-tl-none'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* RFQ Spec attachment widget */}
                      {msg.rfqAttachment && (
                        <div className="p-3 rounded-xl bg-black/30 border border-white/10 text-xs font-mono space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-white">
                            <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{msg.rfqAttachment.title}</span>
                          </div>
                          <div className="text-[11px] text-white/70">
                            Target Run: {msg.rfqAttachment.moq} • {msg.rfqAttachment.specsCount} Tolerances Attached
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-white/40 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/[0.08] bg-[#0B0D15]">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type inquiry, ask about MOQ trade-offs, or discuss tooling milestones..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#FF5533]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-3 rounded-xl bg-[#FF5533] text-white hover:bg-[#E04626] active:scale-95 disabled:opacity-30 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-white/40">
            Select a conversation on the left.
          </div>
        )}
      </div>
    </div>
  );
};
