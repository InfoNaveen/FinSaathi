"use client";
import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  AlertTriangle,
  Bot,
  User,
} from "lucide-react";
import type { ChatMessage, RiskCardData } from "@/types";
import { STARTER_QUESTIONS } from "@/data/mock";
import { useSpeech } from "@/hooks/useSpeech";

interface ChatbotProps {
  data?: RiskCardData;
}

function LoadingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-slate rounded-full inline-block"
          style={{ animation: `dots 1.4s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

const ESCALATION_TRIGGERS = [
  "lawyer",
  "legal",
  "illegal",
  "sue",
  "court",
  "fraud",
  "rbi complaint",
  "report",
  "ombudsman",
];

function shouldEscalate(text: string): boolean {
  return ESCALATION_TRIGGERS.some((t) => text.toLowerCase().includes(t));
}

// Removed local generateResponse

export function Chatbot({ data }: ChatbotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { startListening, stopListening, isListening } = useSpeech();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const documentText = sessionStorage.getItem("finsaathi-document-text") || "";
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          riskCard: data,
          documentText,
          language: "en", // default or pass from context
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || "Failed to fetch response");
      }

      if (result.escalate) setEscalated(true);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.reply,
        timestamp: new Date(),
        escalated: result.escalate || shouldEscalate(text), // Check client side just in case
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Analysis service temporarily unavailable.",
        timestamp: new Date(),
        escalated: false,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setInput(text);
      });
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="w-14 h-14 bg-amber rounded-full flex items-center justify-center shadow-lg animate-pulse-amber hover:bg-amber-dim transition-colors duration-200"
            aria-label="Open financial assistant"
          >
            <MessageSquare className="w-6 h-6 text-navy" strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-24px)] flex flex-col rounded-card border border-navy-light shadow-2xl bg-navy overflow-hidden animate-slide-up">
          {/* Header */}
          <div
            className={`px-4 py-3 flex items-center gap-3 border-b border-navy-light ${
              escalated ? "bg-risk-critical/20" : "bg-navy-mid"
            }`}
          >
            {escalated ? (
              <AlertTriangle className="w-5 h-5 text-risk-critical" />
            ) : (
              <Bot className="w-5 h-5 text-amber" />
            )}
            <div className="flex-1">
              <p className="text-off-white text-sm font-semibold">FinSaathi Assistant</p>
              <p className={`text-xs ${escalated ? "text-risk-critical" : "text-slate"}`}>
                {escalated ? "Legal matter — seek professional advice" : "Ask about your document"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate hover:text-off-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[360px] min-h-[200px]">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-slate text-xs text-center py-2">
                  Ask me anything about your document
                </p>
                <div className="space-y-2">
                  {STARTER_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left px-3 py-2.5 bg-navy-mid border border-navy-light rounded-card text-xs text-slate-light hover:border-amber/30 hover:text-off-white transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-amber/20" : "bg-navy-light"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-3 h-3 text-amber" />
                  ) : (
                    <Bot className="w-3 h-3 text-slate" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-card text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber/10 text-off-white border border-amber/20 text-right"
                      : msg.escalated
                      ? "bg-risk-critical/10 text-off-white border border-risk-critical/30"
                      : "bg-navy-mid text-slate-light border border-navy-light"
                  }`}
                >
                  {msg.escalated && (
                    <p className="text-risk-critical font-semibold text-xs mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Seek professional advice
                    </p>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-navy-light flex items-center justify-center shrink-0">
                  <Bot className="w-3 h-3 text-slate" />
                </div>
                <div className="bg-navy-mid border border-navy-light px-3 py-2 rounded-card">
                  <LoadingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-navy-light bg-navy-mid">
            <div className="flex items-center gap-2">
              <button
                onClick={handleVoice}
                className={`p-2 rounded-card transition-colors duration-200 ${
                  isListening
                    ? "bg-risk-critical/20 text-risk-critical"
                    : "text-slate hover:text-off-white hover:bg-navy-light"
                }`}
                aria-label={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder={isListening ? "Listening…" : "Ask about a clause…"}
                className="flex-1 bg-navy border border-navy-light rounded-card px-3 py-2 text-xs text-off-white placeholder-slate outline-none focus:border-amber/40 transition-colors duration-200"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="p-2 bg-amber text-navy rounded-card disabled:opacity-40 hover:bg-amber-dim transition-colors duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-risk-critical text-center mt-1.5 animate-pulse">
                Listening — speak now
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
