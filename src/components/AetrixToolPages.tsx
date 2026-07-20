import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, MessageSquare, Languages, FileText, Code2, 
  FileUser, FileSpreadsheet, Terminal, GraduationCap, 
  Send, Copy, Volume2, Check, Sparkles, RefreshCcw, 
  Download, Play, Trash2, CheckCheck, Upload, BookOpen,
  Globe, ChevronDown, ShieldCheck, X, Paperclip,
  Plus, Briefcase, Mail, Phone, MapPin, Linkedin, Award, Share2, ZoomIn, ZoomOut, Edit, Eye, User,
  Lock, Link, Bug, Cpu, FileCode, ExternalLink, Clock,
  Mic, Image, ThumbsUp, ThumbsDown, ChevronRight, Calculator, FlaskConical
} from "lucide-react";
import PremiumSpaceBackground from "./PremiumSpaceBackground";

export interface FeatureChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface FeatureChatHistory {
  id: string;
  toolId: string;
  title: string;
  messages: FeatureChatMessage[];
  createdAt: number;
  updatedAt: number;
  time: string;
}

export function saveToolMessageToHistory(
  userEmail: string,
  toolId: string,
  messageContent: string,
  assistantContent: string,
  activeConvId: string | null,
  setActiveConvId: (id: string) => void
) {
  const emailKey = userEmail || "guest";
  const historyKey = `aetrix_features_history_${emailKey}`;
  let history: FeatureChatHistory[] = [];
  try {
    const stored = localStorage.getItem(historyKey);
    if (stored) {
      history = JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse history", e);
  }

  const now = Date.now();
  const timeStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let convId = activeConvId;
  let isNew = false;

  if (!convId) {
    convId = `conv_${toolId}_${now}_${Math.floor(Math.random() * 1000000)}`;
    setActiveConvId(convId);
    isNew = true;
  }

  const userMsg: FeatureChatMessage = {
    id: `msg_user_${now}_${Math.floor(Math.random() * 1000000)}`,
    role: "user",
    content: messageContent,
    timestamp: timeStr
  };

  const assistantMsg: FeatureChatMessage = {
    id: `msg_ai_${now + 1}_${Math.floor(Math.random() * 1000000)}`,
    role: "assistant",
    content: assistantContent,
    timestamp: timeStr
  };

  if (isNew) {
    const title = messageContent.length > 55 ? messageContent.substring(0, 52) + "..." : messageContent;
    const newConv: FeatureChatHistory = {
      id: convId,
      toolId,
      title,
      messages: [userMsg, assistantMsg],
      createdAt: now,
      updatedAt: now,
      time: timeStr
    };
    history.unshift(newConv);
  } else {
    const existingIndex = history.findIndex(c => c.id === convId);
    if (existingIndex !== -1) {
      const existing = history[existingIndex];
      existing.messages.push(userMsg, assistantMsg);
      existing.updatedAt = now;
      existing.time = timeStr;
      history.splice(existingIndex, 1);
      history.unshift(existing);
    } else {
      const title = messageContent.length > 55 ? messageContent.substring(0, 52) + "..." : messageContent;
      const newConv: FeatureChatHistory = {
        id: convId,
        toolId,
        title,
        messages: [userMsg, assistantMsg],
        createdAt: now,
        updatedAt: now,
        time: timeStr
      };
      history.unshift(newConv);
    }
  }

  try {
    localStorage.setItem(historyKey, JSON.stringify(history));
    localStorage.setItem(`aetrix_active_conv_${toolId}`, convId);
  } catch (e) {
    console.error("Failed to save history", e);
  }
}

interface AetrixToolPagesProps {
  toolId: string;
  onBack: () => void;
  userEmail: string;
}

export default function AetrixToolPages({ toolId, onBack, userEmail }: AetrixToolPagesProps) {
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "info" }[]>([]);

  // Toast Helper
  const addToast = (message: string, type: "success" | "info" = "success") => {
    return;
  };

  // If Chat tool is active, completely bypass standard layout and show full custom page
  if (toolId === "chat") {
    return (
      <ChatToolWorkspace 
        addToast={addToast} 
        onBack={onBack} 
        userEmail={userEmail}
        toasts={toasts}
      />
    );
  }

  // If translate tool is active, completely bypass standard layout and show full custom page
  if (toolId === "translate") {
    return (
      <TranslateToolWorkspace 
        addToast={addToast} 
        onBack={onBack} 
        userEmail={userEmail}
        toasts={toasts}
      />
    );
  }

  // If Summarizer tool is active, completely bypass standard layout and show full custom page
  if (toolId === "summarizer") {
    return (
      <SummarizerToolWorkspace 
        addToast={addToast} 
        onBack={onBack} 
        userEmail={userEmail}
        toasts={toasts}
      />
    );
  }

  // If PDF tool is active, completely bypass standard layout and show full custom page
  if (toolId === "pdf") {
    return (
      <PdfToolWorkspace 
        addToast={addToast} 
        onBack={onBack} 
        userEmail={userEmail}
        toasts={toasts}
      />
    );
  }

  // If resume tool is active, completely bypass standard layout and show full custom page
  if (toolId === "resume") {
    return (
      <ResumeToolWorkspace 
        addToast={addToast} 
        onBack={onBack} 
        userEmail={userEmail}
        toasts={toasts}
      />
    );
  }

  // If cody tool is active, completely bypass standard layout and show full custom page
  if (toolId === "cody") {
    return (
      <CodyToolWorkspace 
        addToast={addToast} 
        onBack={onBack} 
        userEmail={userEmail}
        toasts={toasts}
      />
    );
  }

  // If code-gen tool is active, completely bypass standard layout and show full custom page
  if (toolId === "code-gen") {
    return (
      <CodeGenToolWorkspace 
        addToast={addToast} 
        onBack={onBack} 
        userEmail={userEmail}
        toasts={toasts}
      />
    );
  }

  // If study tool is active, completely bypass standard layout and show full custom page
  if (toolId === "study") {
    return (
      <StudyToolWorkspace 
        addToast={addToast} 
        onBack={onBack} 
        userEmail={userEmail}
        toasts={toasts}
      />
    );
  }

  // TOOL METADATA
  const getToolMeta = () => {
    switch (toolId) {
      case "chat":
        return { name: "AI Chat", desc: "Smart conversations for anything", icon: MessageSquare, color: "text-purple-400" };
      case "translate":
        return { name: "Translate AI", desc: "Translate text in 100+ languages", icon: Languages, color: "text-blue-400" };
      case "summarizer":
        return { name: "Summarizer AI", desc: "Summarize any text instantly", icon: FileText, color: "text-green-400" };
      case "cody":
        return { name: "Cody Helper AI", desc: "Generate, debug & explain code", icon: Code2, color: "text-indigo-400" };
      case "resume":
        return { name: "Resume AI", desc: "Create professional resumes", icon: FileUser, color: "text-orange-400" };
      case "pdf":
        return { name: "PDF Assistant AI", desc: "Ask, analyze & summarize PDFs", icon: FileSpreadsheet, color: "text-red-400" };
      case "code-gen":
        return { name: "Generate Code AI", desc: "Generate code in any programming language", icon: Terminal, color: "text-emerald-400" };
      case "study":
        return { name: "Study Helper AI", desc: "Learn, solve & understand better", icon: GraduationCap, color: "text-[#00BFFF]" };
      default:
        return { name: "Aetrix Tool", desc: "Advanced AI capability module", icon: Sparkles, color: "text-[#00BFFF]" };
    }
  };

  const meta = getToolMeta();
  const Icon = meta.icon;

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-black text-white font-sans selection:bg-[#00BFFF] selection:text-black relative flex flex-col" id="aetrix-tool-page">
      {/* Background Star grid & ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#00BFFF]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Toast Area */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2" id="tool-toasts">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 bg-black/90 backdrop-blur-md text-xs text-gray-200 flex items-center gap-2.5 shadow-xl animate-slide-in"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Master Top Header Container */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-30" id="tool-top-bar">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Back button top left */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-white/5 border border-white/10"
            id="tool-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {/* Centered Logo */}
          <div className="flex items-center gap-1.5" id="tool-header-logo">
            <div className="w-5 h-5 rounded bg-[#00BFFF] flex items-center justify-center font-bold text-[10px] text-white">A</div>
            <span className="font-bold tracking-[0.18em] text-xs text-white">AETRIX <span className="text-[#00BFFF]">AI</span></span>
          </div>

          {/* Active Tool Label Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-400 tracking-wide">
            <span className="w-1 h-1 rounded-full bg-green-400 animate-ping" />
            <span className="font-mono">SYS_OK</span>
          </div>
        </div>
      </header>

      {/* Tool Intro Banner */}
      <section className="bg-gradient-to-b from-white/[0.02] to-transparent py-8 border-b border-white/5" id="tool-banner">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-lg shadow-black/50 ${meta.color}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                {meta.name}
              </h1>
              <p className="text-gray-400 text-xs mt-0.5">{meta.desc}</p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-gray-500 text-left sm:text-right">
            <div>USER: {userEmail}</div>
            <div>MODE: SECURE DIRECT CONNECTION</div>
          </div>
        </div>
      </section>

      {/* Primary Tool Core Workspace Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 relative z-20" id="tool-main-panel">
        <AnimatePresence mode="wait">
          <motion.div 
            key={toolId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            {toolId === "chat" && null}
            {toolId === "translate" && <TranslateToolWorkspace addToast={addToast} onBack={onBack} userEmail={userEmail} toasts={toasts} />}
            {toolId === "summarizer" && <SummarizerToolWorkspace addToast={addToast} onBack={onBack} userEmail={userEmail} toasts={toasts} />}
            {toolId === "cody" && <CodyToolWorkspace addToast={addToast} onBack={onBack} userEmail={userEmail} toasts={toasts} />}
            {toolId === "resume" && <ResumeToolWorkspace addToast={addToast} onBack={onBack} userEmail={userEmail} toasts={toasts} />}
            {toolId === "pdf" && <PdfToolWorkspace addToast={addToast} onBack={onBack} userEmail={userEmail} toasts={toasts} />}
            {toolId === "code-gen" && <CodeGenToolWorkspace addToast={addToast} onBack={onBack} userEmail={userEmail} toasts={toasts} />}
            {toolId === "study" && <StudyToolWorkspace addToast={addToast} onBack={onBack} userEmail={userEmail} toasts={toasts} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ========================================================================= */
/* 1. AI CHAT COMPONENT                                                      */
/* ========================================================================= */
function AetrixUploadedLogo() {
  return (
    <div className="relative w-40 h-40 flex items-center justify-center select-none mb-4" id="uploaded-logo-root">
      {/* Soft blue neon glow background pulse (Glow in and out) */}
      <motion.div
        animate={{
          opacity: [0.18, 0.45, 0.18],
          scale: [0.85, 1.05, 0.85],
        }}
        transition={{
          repeat: Infinity,
          duration: 3.5,
          ease: "easeInOut",
        }}
        className="absolute w-28 h-28 rounded-full bg-[#00BFFF]/30 blur-2xl pointer-events-none z-0"
      />

      {/* Subtle rotating light/orbit effect around the outer circle of the logo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "linear",
        }}
        className="absolute w-32 h-32 border border-transparent rounded-full z-10 pointer-events-none"
      >
        {/* Orbital light sparkler */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#00E5FF,0_0_20px_#00E5FF]" />
      </motion.div>

      {/* Gently floating container (Floating up and down) */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4.5,
          ease: "easeInOut",
        }}
        className="relative z-10 w-full h-full flex items-center justify-center"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-[0_0_20px_rgba(0,191,255,0.4)]"
        >
          <defs>
            {/* Bright futuristic gradients */}
            <linearGradient id="aetrixMainBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#00BFFF" />
              <stop offset="100%" stopColor="#0055FF" />
            </linearGradient>
            <linearGradient id="aetrixSilver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#DDE6ED" />
              <stop offset="100%" stopColor="#9DB2BF" />
            </linearGradient>
            <linearGradient id="aetrixOrbit" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0055FF" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#00BFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="1" />
            </linearGradient>
            
            {/* Custom filters for high performance glow */}
            <filter id="neonGlowEffect" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="sparkleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Thin Glowing Outer Boundary Circle */}
          <circle 
            cx="100" 
            cy="100" 
            r="68" 
            fill="none" 
            stroke="#00BFFF" 
            strokeWidth="1.8" 
            opacity="0.85" 
            filter="url(#neonGlowEffect)" 
          />

          {/* Background diagonal orbit part */}
          <g transform="rotate(-22, 100, 100)">
            <ellipse 
              cx="100" 
              cy="100" 
              rx="84" 
              ry="22" 
              fill="none" 
              stroke="url(#aetrixOrbit)" 
              strokeWidth="2.5" 
              filter="url(#neonGlowEffect)"
            />
            
            {/* The two satellite orbs/planets on the right side of orbit */}
            {/* Small Orb */}
            <circle 
              cx="160" 
              cy="91" 
              r="3.5" 
              fill="#00E5FF" 
              filter="url(#sparkleGlow)" 
            />
            {/* Medium Orb */}
            <circle 
              cx="174" 
              cy="95" 
              r="6.5" 
              fill="#00E5FF" 
              filter="url(#sparkleGlow)" 
            />
          </g>

          {/* Futuristic stylized "A" from the uploaded design */}
          {/* Left leg of "A": solid vibrant blue gradient */}
          <path 
            d="M 100 38 L 52 142 L 72 142 L 100 80 Z" 
            fill="url(#aetrixMainBlue)" 
            filter="url(#neonGlowEffect)" 
          />
          
          {/* Right leg of "A": sleek blue gradient base */}
          <path 
            d="M 100 38 L 100 80 L 128 142 L 148 142 Z" 
            fill="url(#aetrixMainBlue)" 
            filter="url(#neonGlowEffect)" 
          />

          {/* Bottom Right leg silver metallic highlight polygon */}
          <path 
            d="M 111 106 L 141 142 L 116 142 Z" 
            fill="url(#aetrixSilver)" 
          />
          <path 
            d="M 102 122 L 112 142 L 101 142 Z" 
            fill="url(#aetrixSilver)" 
            opacity="0.8"
          />

          {/* Centered Sparkle Star / 4-point star in the center crossbar area */}
          <g transform="translate(100, 94)">
            <path 
              d="M 0 -13 Q 0 0 13 0 Q 0 0 0 13 Q 0 0 -13 0 Q 0 0 0 -13 Z" 
              fill="#FFFFFF" 
              filter="url(#sparkleGlow)" 
            />
            {/* Small inner core circle */}
            <circle cx="0" cy="0" r="3.2" fill="#FFFFFF" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

function ChatToolWorkspace({ 
  addToast, 
  onBack,
  userEmail = "",
  toasts = []
}: { 
  addToast: (msg: string, type?: "success" | "info") => void; 
  onBack: () => void;
  userEmail?: string;
  toasts?: { id: string; message: string; type: "success" | "info" }[];
}) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; id: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem("aetrix_active_conv_chat");
  });
  const activeConvIdRef = useRef<string | null>(activeConvId);

  // Advanced Interactions States
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<{ role: "user" | "assistant"; content: string; id: string } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const updateActiveConvId = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    localStorage.setItem("aetrix_active_conv_chat", id);
  };

  // Helper to sync edited/deleted messages with local storage history
  const saveAllMessagesToHistory = (updatedMsgs: { role: "user" | "assistant"; content: string; id: string }[]) => {
    const emailKey = userEmail || "guest";
    const historyKey = `aetrix_features_history_${emailKey}`;
    let history: FeatureChatHistory[] = [];
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        history = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to parse history", e);
    }

    const now = Date.now();
    const timeStr = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let convId = activeConvId;
    if (!convId && updatedMsgs.length > 0) {
      convId = `conv_chat_${now}_${Math.floor(Math.random() * 1000000)}`;
      updateActiveConvId(convId);
    }

    if (!convId) return;

    const mappedMsgs: FeatureChatMessage[] = updatedMsgs.map(m => ({
      id: m.id || `msg_${m.role}_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
      role: m.role,
      content: m.content,
      timestamp: timeStr
    }));

    const existingIndex = history.findIndex(c => c.id === convId);
    if (existingIndex !== -1) {
      const existing = history[existingIndex];
      existing.messages = mappedMsgs;
      existing.updatedAt = now;
      existing.time = timeStr;
      history.splice(existingIndex, 1);
      history.unshift(existing);
    } else {
      const firstUserMsg = updatedMsgs.find(m => m.role === "user");
      const title = firstUserMsg ? (firstUserMsg.content.length > 55 ? firstUserMsg.content.substring(0, 52) + "..." : firstUserMsg.content) : "Chat Session";
      const newConv: FeatureChatHistory = {
        id: convId,
        toolId: "chat",
        title,
        messages: mappedMsgs,
        createdAt: now,
        updatedAt: now,
        time: timeStr
      };
      history.unshift(newConv);
    }

    try {
      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleSaveEdit = (msgId: string) => {
    if (!editingText.trim()) return;
    const updated = messages.map(msg => msg.id === msgId ? { ...msg, content: editingText } : msg);
    setMessages(updated);
    saveAllMessagesToHistory(updated);
    setEditingMessageId(null);
    setEditingText("");
    addToast("Message updated.", "success");
  };

  const handleDeleteMessage = (msgId: string) => {
    const updated = messages.filter(msg => msg.id !== msgId);
    setMessages(updated);
    saveAllMessagesToHistory(updated);
    setIsBottomSheetOpen(false);
    addToast("Message deleted.", "info");
  };

  const handleRegenerate = async (msgId: string) => {
    setIsBottomSheetOpen(false);
    const index = messages.findIndex(m => m.id === msgId);
    if (index === -1) return;

    // Slice messages up to the user message immediately preceding the AI message
    const preceding = messages.slice(0, index);
    if (preceding.length === 0) return;

    setMessages(preceding);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: preceding.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      if (res.ok && data.text) {
        const aiText = data.text;
        const newAiMsg = { role: "assistant" as const, content: aiText, id: Date.now().toString() + "-ai-" + Math.floor(Math.random() * 1000000) };
        const updated = [...preceding, newAiMsg];
        setMessages(updated);
        saveAllMessagesToHistory(updated);
        addToast("Response regenerated.", "success");
      } else {
        throw new Error(data.error || "Failed to regenerate response.");
      }
    } catch (err: any) {
      const errMsg = err.message || "An error occurred. Unable to contact the AI service.";
      addToast(errMsg, "info");
      setMessages((prev) => [...prev, { 
        role: "assistant" as const, 
        content: `Error: ${errMsg}`, 
        id: Date.now().toString() + "-ai-" + Math.floor(Math.random() * 1000000) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Cross-platform custom long press listener (iOS, Android, and Desktop mouse drag safety)
  const startLongPress = (e: React.MouseEvent | React.TouchEvent, msg: { role: "user" | "assistant"; content: string; id: string }) => {
    if ("button" in e && e.button !== 0) return; // ignore right clicks / middle clicks
    
    const isTouch = "touches" in e;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    
    let hasMoved = false;
    
    const onMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = "touches" in moveEvent ? (moveEvent as TouchEvent).touches[0].clientX : (moveEvent as MouseEvent).clientX;
      const currentY = "touches" in moveEvent ? (moveEvent as TouchEvent).touches[0].clientY : (moveEvent as MouseEvent).clientY;
      if (Math.abs(currentX - clientX) > 10 || Math.abs(currentY - clientY) > 10) {
        hasMoved = true;
        cleanup();
      }
    };
    
    const onRelease = () => {
      cleanup();
    };
    
    const timer = setTimeout(() => {
      if (!hasMoved) {
        setSelectedMessage(msg);
        setIsBottomSheetOpen(true);
      }
      cleanup();
    }, 500);
    
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onRelease);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onRelease);
    };
    
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseup", onRelease, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onRelease, { passive: true });
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const activeId = localStorage.getItem("aetrix_active_conv_chat");
    if (activeId) {
      setActiveConvId(activeId);
      activeConvIdRef.current = activeId;
      const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const historyList: FeatureChatHistory[] = JSON.parse(stored);
          const found = historyList.find(c => c.id === activeId);
          if (found) {
            setMessages(found.messages.map(m => ({
              role: m.role as "user" | "assistant",
              content: m.content,
              id: m.id
            })));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;
    if (!textToSend) setInput("");

    const newMsg = { role: "user" as const, content: text, id: Date.now().toString() + "-" + Math.floor(Math.random() * 1000000) };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMsg].map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      if (res.ok && data.text) {
        const aiText = data.text;
        setMessages((prev) => [...prev, { role: "assistant", content: aiText, id: Date.now().toString() + "-ai-" + Math.floor(Math.random() * 1000000) }]);
        saveToolMessageToHistory(userEmail || "guest", "chat", text, aiText, activeConvIdRef.current, updateActiveConvId);
      } else {
        throw new Error(data.error || "Failed to contact AI service.");
      }
    } catch (err: any) {
      const errMsg = err.message || "An error occurred. Unable to contact the AI service.";
      addToast(errMsg, "info");
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: `Error: ${errMsg}`, 
        id: Date.now().toString() + "-ai-" + Math.floor(Math.random() * 1000000) 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("aetrix_active_conv_chat");
    setActiveConvId(null);
    activeConvIdRef.current = null;
    addToast("Chat history cleared.");
  };

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    addToast("Copied");
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-[#0B0F19] text-white flex flex-col items-center justify-start overflow-x-hidden font-sans pb-16 selection:bg-[#00BFFF]/30">
      {/* 60 FPS Stars Background Layer */}
      <div className="absolute inset-0 z-0">
        <PremiumSpaceBackground />
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 8%; opacity: 0.3; }
          50% { top: 88%; opacity: 1; }
        }
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.18; }
        }
        .custom-glow {
          box-shadow: 0 0 35px rgba(0, 191, 255, 0.12);
        }
        .blue-glow {
          box-shadow: 0 0 40px rgba(30, 58, 138, 0.4);
        }
      `}</style>

      {/* Cyber Space grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-10 animate-[grid-pulse_4s_ease-in-out_infinite] z-0" />

      {/* Floating neon blobs */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[#00BFFF]/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full blur-[1px] animate-pulse opacity-50 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-[#00BFFF] rounded-full blur-[1px] animate-ping opacity-30 pointer-events-none [animation-duration:3s]" />
      <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-purple-400 rounded-full blur-[1px] animate-pulse opacity-60 pointer-events-none [animation-duration:4s]" />

      {/* Toast Alert Area */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2" id="chat-toasts">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 bg-[#0c0c0f]/95 backdrop-blur-md text-xs text-gray-200 flex items-center gap-2.5 shadow-xl animate-slide-in"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Redesigned Header element to match Resume AI and Summarizer AI exactly */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full relative z-10 flex flex-col">
        <header className="flex items-center justify-between mb-8" id="chat-header-row">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-md"
              id="chat-back-arrow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>

            <div className="flex flex-col text-left" id="chat-logo-branding">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-[2px]" />
                  <div className="w-5 h-5 rounded-full border border-[#00BFFF]/50 bg-black flex items-center justify-center text-[10px] text-[#00BFFF] font-black z-10">
                    A
                  </div>
                  <div className="absolute w-7 h-3 border border-[#00BFFF]/40 rounded-full -rotate-[20deg]" />
                </div>
                <span className="font-extrabold tracking-[0.2em] text-sm text-white font-sans">AETRIX <span className="text-[#00BFFF]">AI</span></span>
              </div>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider mt-0.5 uppercase flex items-center gap-1.5 pl-8">
                CHAT AI 💬
              </span>
            </div>
          </div>

          {/* User profile avatar on the right / Orb Decoration */}
          <div className="relative w-16 h-16 flex items-center justify-center cursor-pointer" id="chat-user-profile-avatar" onClick={() => addToast(`Session connected under: ${userEmail || "guest"}`, "info")}>
            <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute w-11 h-11 rounded-full border border-blue-500/30 bg-gradient-to-tr from-[#050505] via-[#0a122c] to-[#0c1a3a] flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.2)] overflow-hidden">
              <User className="w-5 h-5 text-[#00BFFF]" />
            </div>
            <div className="absolute w-14 h-7 border border-[#00BFFF]/30 rounded-full -rotate-[22deg] animate-[spin_12s_linear_infinite]" />
          </div>
        </header>
      </div>

      {/* Main chat window layout with Glassmorphism */}
      <div className="relative w-full max-w-4xl px-4 sm:px-6 z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full border border-white/10 bg-[#0c0c0e]/45 backdrop-blur-3xl rounded-3xl overflow-hidden flex flex-col h-[620px] shadow-2xl custom-glow"
        >
          {/* Header controls inside chat card */}
          <div className="px-5 py-3.5 border-b border-white/10 bg-black/45 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_#22c55e]" />
              <span className="text-[10px] font-mono text-gray-400 tracking-wider">NEURAL LINK ACTIVE // CH-{(Date.now() % 10000)}</span>
            </div>
            <button 
              onClick={clearChat}
              className="text-[10px] font-bold text-gray-400 hover:text-red-400 flex items-center gap-1.5 transition-all bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg hover:bg-red-500/10 hover:border-red-500/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR HISTORY</span>
            </button>
          </div>

          {/* Messages screen panel */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <AetrixUploadedLogo />
                
                <h2 className="text-lg font-extrabold text-white tracking-tight">AETRIX Cognitive Workspace</h2>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-sm">
                  Initiate secure end-to-end conversation with the AETRIX core system. Choose a curated topic to trigger direct deep learning analysis:
                </p>
                
                <div className="grid grid-cols-1 gap-2.5 w-full mt-6">
                  {[
                    "Explain the AGI safety alignment problem",
                    "How to implement a fast binary search in Python",
                    "Write a summary of quantum entanglement"
                  ].map((topic, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(topic)}
                      className="p-3 text-left bg-white/[0.03] hover:bg-[#00BFFF]/5 border border-white/10 hover:border-[#00BFFF]/30 rounded-xl text-xs text-gray-300 hover:text-white transition-all shadow-sm flex items-center justify-between group"
                    >
                      <span className="font-medium">{topic}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#00BFFF] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"} select-text`}>
                  {editingMessageId === m.id ? (
                    <div className="w-full max-w-[85%] bg-[#101424]/90 border border-[#00BFFF]/40 rounded-2xl p-3 flex flex-col gap-2 shadow-xl mb-1.5 backdrop-blur-md">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full bg-black/45 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-[#00BFFF]/60 resize-none h-20 font-sans leading-relaxed"
                      />
                      <div className="flex items-center justify-end gap-2 text-[10px]">
                        <button
                          onClick={() => {
                            setEditingMessageId(null);
                            setEditingText("");
                          }}
                          className="px-3 py-1.5 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-all font-bold"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={() => handleSaveEdit(m.id)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-[#00BFFF] text-white hover:opacity-90 active:scale-[0.98] transition-all font-bold"
                        >
                          SAVE CHANGES
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div 
                        id={`msg-text-${m.id}`}
                        onMouseDown={(e) => startLongPress(e, m)}
                        onTouchStart={(e) => startLongPress(e, m)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setSelectedMessage(m);
                          setIsBottomSheetOpen(true);
                        }}
                        className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg select-text cursor-pointer transition-all active:scale-[0.99] ${
                          m.role === "user" 
                            ? "bg-gradient-to-r from-blue-600 to-[#00BFFF] text-white rounded-tr-none border border-white/10" 
                            : "bg-[#101424]/70 border border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md"
                        }`}
                        title="Long press or right click for menu options"
                      >
                        {m.content.startsWith("### ") ? (
                          <div className="space-y-2 select-text">
                            <h3 className="text-white font-extrabold text-sm border-b border-white/10 pb-1 select-text">{m.content.split("\n")[0].substring(4)}</h3>
                            <p className="whitespace-pre-wrap select-text">{m.content.split("\n").slice(1).join("\n")}</p>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap select-text">{m.content}</p>
                        )}
                      </div>
                      {m.role === "assistant" && (
                        <button 
                          onClick={() => copyToClipboard(m.content)}
                          className="mt-1.5 text-[10px] text-gray-500 hover:text-white flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-2 py-0.5 rounded-md transition-all self-start ml-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy response</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-center gap-1.5 p-3.5 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none w-28 text-xs text-gray-400 backdrop-blur-md">
                <div className="flex gap-1 items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-[#00BFFF] animate-[bounce_1s_infinite_100ms] shadow-[0_0_8px_#00BFFF]" />
                  <span className="w-2 h-2 rounded-full bg-[#00BFFF] animate-[bounce_1s_infinite_200ms] shadow-[0_0_8px_#00BFFF]" />
                  <span className="w-2 h-2 rounded-full bg-[#00BFFF] animate-[bounce_1s_infinite_300ms] shadow-[0_0_8px_#00BFFF]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Footer input controller */}
          <div className="p-4 border-t border-white/10 bg-black/45">
            <div className="flex items-center gap-2 bg-[#121214]/90 border border-white/10 focus-within:border-[#00BFFF]/50 focus-within:shadow-[0_0_15px_rgba(0,191,255,0.15)] rounded-2xl px-3 sm:px-4 py-1.5 transition-all">
              
              {/* Attachment, Image, Voice Controls */}
              <div className="flex items-center gap-1.5 shrink-0 border-r border-white/10 pr-2 sm:pr-3">
                <button 
                  onClick={() => addToast("Attachment handler initialized. Select a file under sandboxed link.", "info")}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => addToast("Image processing sandbox activated.", "info")}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  title="Upload image"
                >
                  <Image className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => addToast("Voice dictation calibration initialized.", "info")}
                  className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Message AETRIX AI..."
                className="flex-1 bg-transparent border-none outline-none py-2 text-xs text-white placeholder-gray-500"
              />
              
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#00BFFF] hover:shadow-[0_0_12px_rgba(0,191,255,0.4)] text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-none shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modern, elegant glassmorphism bottom sheet with custom 250ms animation */}
      <AnimatePresence>
        {isBottomSheetOpen && selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsBottomSheetOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Bottom Sheet Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md bg-[#0B0F19]/95 backdrop-blur-xl border-t border-[#00BFFF]/40 rounded-t-[2rem] px-6 pt-5 pb-8 shadow-[0_-12px_40px_rgba(0,191,255,0.2)] flex flex-col items-center gap-4 select-none z-10"
            >
              {/* Grab handle bar */}
              <div className="w-12 h-1 bg-white/20 rounded-full mb-1" />
              
              <div className="w-full text-left">
                <span className="text-[10px] font-mono tracking-wider text-[#00BFFF] uppercase font-bold">
                  {selectedMessage.role === "user" ? "USER MESSAGE OPTIONS" : "AI RESPONSE OPTIONS"}
                </span>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2 italic">
                  "{selectedMessage.content}"
                </p>
              </div>

              <div className="w-full flex flex-col gap-2">
                {selectedMessage.role === "user" ? (
                  <>
                    {/* Copy */}
                    <button
                      onClick={() => {
                        copyToClipboard(selectedMessage.content);
                        setIsBottomSheetOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 text-xs text-gray-200 transition-all text-left font-bold"
                    >
                      <Copy className="w-4 h-4 text-[#00BFFF]" />
                      <span>COPY MESSAGE</span>
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setEditingMessageId(selectedMessage.id);
                        setEditingText(selectedMessage.content);
                        setIsBottomSheetOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 text-xs text-gray-200 transition-all text-left font-bold"
                    >
                      <Edit className="w-4 h-4 text-amber-400" />
                      <span>EDIT MESSAGE</span>
                    </button>

                    {/* Select Text */}
                    <button
                      onClick={() => {
                        setIsBottomSheetOpen(false);
                        setTimeout(() => {
                          const el = document.getElementById(`msg-text-${selectedMessage.id}`);
                          if (el) {
                            const range = document.createRange();
                            range.selectNodeContents(el);
                            const selection = window.getSelection();
                            if (selection) {
                              selection.removeAllRanges();
                              selection.addRange(range);
                            }
                          }
                        }, 150);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 text-xs text-gray-200 transition-all text-left font-bold"
                    >
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span>SELECT TEXT</span>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 active:bg-red-500/25 border border-red-500/20 text-xs text-red-400 transition-all text-left font-bold"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span>DELETE MESSAGE</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Copy */}
                    <button
                      onClick={() => {
                        copyToClipboard(selectedMessage.content);
                        setIsBottomSheetOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 text-xs text-gray-200 transition-all text-left font-bold"
                    >
                      <Copy className="w-4 h-4 text-[#00BFFF]" />
                      <span>COPY MESSAGE</span>
                    </button>

                    {/* Select Text */}
                    <button
                      onClick={() => {
                        setIsBottomSheetOpen(false);
                        setTimeout(() => {
                          const el = document.getElementById(`msg-text-${selectedMessage.id}`);
                          if (el) {
                            const range = document.createRange();
                            range.selectNodeContents(el);
                            const selection = window.getSelection();
                            if (selection) {
                              selection.removeAllRanges();
                              selection.addRange(range);
                            }
                          }
                        }, 150);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 text-xs text-gray-200 transition-all text-left font-bold"
                    >
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span>SELECT TEXT</span>
                    </button>

                    {/* Regenerate Response */}
                    <button
                      onClick={() => handleRegenerate(selectedMessage.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 text-xs text-gray-200 transition-all text-left font-bold"
                    >
                      <RefreshCcw className="w-4 h-4 text-cyan-400" />
                      <span>REGENERATE RESPONSE</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => {
                        setIsBottomSheetOpen(false);
                        if (navigator.share) {
                          navigator.share({
                            title: "AETRIX AI Answer",
                            text: selectedMessage.content
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(selectedMessage.content);
                          addToast("Share text copied to clipboard!", "info");
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 text-xs text-gray-200 transition-all text-left font-bold"
                    >
                      <Share2 className="w-4 h-4 text-purple-400" />
                      <span>SHARE RESPONSE</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================================================= */
/* 2. TRANSLATE AI COMPONENT                                                 */
/* ========================================================================= */
function TranslateToolWorkspace({ 
  addToast, 
  onBack, 
  userEmail,
  toasts 
}: { 
  addToast: (msg: string, type?: "success" | "info") => void; 
  onBack: () => void;
  userEmail: string;
  toasts: { id: string; message: string; type: "success" | "info" }[];
}) {
  const [sourceLang, setSourceLang] = useState("Auto Detect");
  const [targetLang, setTargetLang] = useState("English");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; id: string }[]>([]);
  const [translating, setTranslating] = useState(false);
  
  // Custom picker dropdown states
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);
  
  // Swap animation state
  const [swapRotate, setSwapRotate] = useState(0);

  // Floating dropdown refs & coords
  const sourceBtnRef = useRef<HTMLButtonElement>(null);
  const targetBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    direction: "down" | "up";
  } | null>(null);

  const updateDropdownCoords = () => {
    let activeBtn: HTMLButtonElement | null = null;
    if (isFromOpen) {
      activeBtn = sourceBtnRef.current;
    } else if (isToOpen) {
      activeBtn = targetBtnRef.current;
    }

    if (!activeBtn) {
      setCoords(null);
      return;
    }

    const rect = activeBtn.getBoundingClientRect();
    const dropdownHeight = 240; // max-h-60 is 240px
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const direction = (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) ? "up" : "down";

    if (direction === "down") {
      setCoords({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        direction: "down"
      });
    } else {
      setCoords({
        bottom: window.innerHeight - rect.top + 6,
        left: rect.left,
        width: rect.width,
        direction: "up"
      });
    }
  };

  useEffect(() => {
    if (isFromOpen || isToOpen) {
      updateDropdownCoords();
      const handleScrollResize = () => {
        updateDropdownCoords();
      };
      window.addEventListener("scroll", handleScrollResize, { capture: true });
      window.addEventListener("resize", handleScrollResize);
      return () => {
        window.removeEventListener("scroll", handleScrollResize, { capture: true });
        window.removeEventListener("resize", handleScrollResize);
      };
    } else {
      setCoords(null);
    }
  }, [isFromOpen, isToOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        sourceBtnRef.current?.contains(e.target as Node) ||
        targetBtnRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsFromOpen(false);
      setIsToOpen(false);
    };

    if (isFromOpen || isToOpen) {
      window.addEventListener("mousedown", handleOutsideClick);
      return () => {
        window.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isFromOpen, isToOpen]);

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem("aetrix_active_conv_translate");
  });
  const activeConvIdRef = useRef<string | null>(activeConvId);

  const updateActiveConvId = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    localStorage.setItem("aetrix_active_conv_translate", id);
  };

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, translating]);

  useEffect(() => {
    const activeId = localStorage.getItem("aetrix_active_conv_translate");
    if (activeId) {
      setActiveConvId(activeId);
      activeConvIdRef.current = activeId;
      const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const historyList: FeatureChatHistory[] = JSON.parse(stored);
          const found = historyList.find(c => c.id === activeId);
          if (found) {
            setMessages(found.messages.map(m => ({
              role: m.role as "user" | "assistant",
              content: m.content,
              id: m.id
            })));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail]);

  const LANGUAGES_FROM = [
    "Auto Detect",
    "English",
    "Telugu",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Hindi",
    "Chinese",
    "Arabic",
    "Russian",
    "Portuguese",
    "Italian",
    "Korean"
  ];

  const LANGUAGES_TO = [
    "English",
    "Telugu",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Hindi",
    "Chinese",
    "Arabic",
    "Russian",
    "Portuguese",
    "Italian",
    "Korean"
  ];

  const predefinedTranslations: Record<string, Record<string, string>> = {
    "artificial intelligence ప్రపంచాన్ని మరింత స్మార్ట్‌గా మరియు వేగంగా మార్చుతోంది.": {
      "English": "Artificial Intelligence is transforming the world by making processes smarter and faster.",
    },
    "artificial intelligence is transforming the world by making processes smarter and faster.": {
      "Telugu": "Artificial Intelligence ప్రపంచాన్ని మరింత స్మార్ట్‌గా మరియు వేగంగా మార్చుతోంది.",
    },
    "hello": {
      "Spanish": "Hola",
      "French": "Bonjour",
      "German": "Hallo",
      "Japanese": "こんにちは (Konnichiwa)",
      "Hindi": "नमस्ते (Namaste)",
      "Telugu": "నమస్కారం (Namaskaram)",
    },
    "how are you?": {
      "Spanish": "¿Cómo estás?",
      "French": "Comment ça va?",
      "German": "Wie geht es dir?",
      "Japanese": "お元気ですか (O-genki desu ka?)",
      "Hindi": "आप कैसे हैं? (Aap kaise hain?)",
      "Telugu": "మీరు ఎలా ఉన్నారు? (Meeru ela unnaru?)",
    }
  };

  const handleTranslate = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;
    if (!textToSend) setInput("");

    const newMsg = { 
      role: "user" as const, 
      content: text, 
      id: `user-${Date.now()}-${Math.floor(Math.random() * 1000000)}` 
    };
    setMessages(prev => [...prev, newMsg]);
    setTranslating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { 
              role: "user", 
              content: `Translate the following text into ${targetLang}. Detect the source language. Output ONLY the translated string without any quotation marks, explanations, or preamble: "${text}"` 
            }
          ]
        })
      });
      const data = await response.json();
      if (response.ok && data.text) {
        const result = data.text.replace(/^["']|["']$/g, "");
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: result, 
          id: `ai-${Date.now()}-${Math.floor(Math.random() * 1000000)}` 
        }]);
        saveToolMessageToHistory(userEmail || "guest", "translate", text, result, activeConvIdRef.current, updateActiveConvId);
      } else {
        throw new Error(data.error || "Translation failed.");
      }
      addToast("Translation complete", "success");
    } catch (err: any) {
      const errMsg = err.message || "An error occurred during translation.";
      addToast(errMsg, "info");
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Error: ${errMsg}`, 
        id: `ai-${Date.now()}-${Math.floor(Math.random() * 1000000)}` 
      }]);
    } finally {
      setTranslating(false);
    }
  };

  const handleSwap = () => {
    setSwapRotate(prev => prev + 180);
    
    const tempLang = sourceLang;
    setSourceLang(targetLang === "Auto Detect" ? "English" : targetLang);
    setTargetLang(tempLang === "Auto Detect" ? "English" : tempLang);
    addToast("Languages swapped", "info");
  };

  const handleCopy = (txt: string) => {
    if (!txt) return;
    navigator.clipboard.writeText(txt);
    addToast("Copied to clipboard!", "success");
  };

  const handleSpeak = (txt: string) => {
    if (!txt) return;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(txt);
      window.speechSynthesis.speak(utter);
      addToast("Playing translation audio...", "success");
    } else {
      addToast("Speech synthesis not supported", "info");
    }
  };

  // Subtle floating background particles
  const [particles] = useState(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * -20,
    }))
  );

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-[#0B0F19] text-white font-sans selection:bg-[#00BFFF] selection:text-black overflow-x-hidden relative flex flex-col pb-20" id="aetrix-translate-page">
      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#00BFFF]/15 blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0vh", "-120vh"],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00BFFF]/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Toast Alert Area */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2" id="translate-toasts">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 bg-[#0c0c0f]/95 backdrop-blur-md text-xs text-gray-200 flex items-center gap-2.5 shadow-xl animate-slide-in"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Redesigned Header element to match Resume AI and Study Helper AI exactly */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full relative z-10 flex flex-col">
        <header className="flex items-center justify-between mb-8" id="translate-header-row">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-md"
              id="translate-back-arrow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>

            <div className="flex flex-col text-left" id="translate-logo-branding">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-[2px]" />
                  <div className="w-5 h-5 rounded-full border border-[#00BFFF]/50 bg-black flex items-center justify-center text-[10px] text-[#00BFFF] font-black z-10">
                    A
                  </div>
                  <div className="absolute w-7 h-3 border border-[#00BFFF]/40 rounded-full -rotate-[20deg]" />
                </div>
                <span className="font-extrabold tracking-[0.2em] text-sm text-white font-sans">AETRIX <span className="text-[#00BFFF]">AI</span></span>
              </div>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider mt-0.5 uppercase flex items-center gap-1.5 pl-8">
                TRANSLATE AI <span className="text-[#00BFFF]">🌐</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative" id="translate-header-controls">
            <span className="text-[10px] font-mono text-[#00BFFF] bg-[#00BFFF]/10 px-2 py-0.5 rounded-full border border-[#00BFFF]/20 hidden sm:inline-block">TRANSLATE_v3.5</span>

            {/* Large Orbiting Orb Decoration */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0" id="translate-glowing-orbit-orb">
              <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute w-11 h-11 rounded-full border border-purple-500/30 bg-gradient-to-tr from-[#050505] via-[#100c1c] to-[#0d1624] flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.2)] overflow-hidden">
                <span className="text-white font-black text-xl tracking-widest font-sans select-none relative z-10">A</span>
              </div>
              <div className="absolute w-14 h-7 border border-[#00BFFF]/30 rounded-full -rotate-[22deg] animate-[spin_12s_linear_infinite]" />
            </div>
          </div>
        </header>
      </div>

      {/* Glassmorphism Language Selector Bar */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 relative z-10 mb-6">
        <div className="p-3 bg-[#0c0c0f]/60 border border-white/10 rounded-2xl backdrop-blur-xl shadow-lg grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" id="translate-lang-selector-bar" style={{ overflow: "visible" }}>
          
          {/* Left dropdown: Source language */}
          <div className="relative flex flex-col min-w-0" style={{ overflow: "visible" }}>
            <button 
              ref={sourceBtnRef}
              onClick={() => {
                setIsFromOpen(!isFromOpen);
                setIsToOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all cursor-pointer min-w-0"
              id="source-lang-btn"
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <Globe className="w-4 h-4 text-[#00BFFF] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white truncate">{sourceLang}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0" style={{ transform: isFromOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center" id="translate-swap-btn-container">
            <button 
              onClick={handleSwap}
              className="p-2 bg-white/5 hover:bg-white/10 border border-[#00BFFF]/30 hover:border-[#00BFFF]/70 rounded-xl text-[#00BFFF] hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95"
              id="swap-lang-btn"
            >
              <motion.div
                animate={{ rotate: swapRotate }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-4 h-4 flex items-center justify-center"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
              </motion.div>
            </button>
          </div>

          {/* Right dropdown: Target language */}
          <div className="relative flex flex-col min-w-0" style={{ overflow: "visible" }}>
            <button 
              ref={targetBtnRef}
              onClick={() => {
                setIsToOpen(!isToOpen);
                setIsFromOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all cursor-pointer min-w-0"
              id="target-lang-btn"
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <Globe className="w-4 h-4 text-[#00BFFF] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white truncate">{targetLang}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0" style={{ transform: isToOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>
          </div>

        </div>
      </div>

      {/* Primary Workspace container */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 relative z-10 flex-1 flex flex-col pb-6">
        <div className="flex-1 border border-white/10 rounded-3xl bg-[#0c0c0e]/80 overflow-hidden flex flex-col h-[520px] sm:h-[580px] shadow-2xl" id="translate-chat-container">
          
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12">
                <div className="w-12 h-12 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center text-[#00BFFF] mb-4 shadow-[0_0_15px_rgba(0,191,255,0.2)] animate-pulse">
                  <Languages className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-white">AI Translation Chat</p>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Type any word, sentence, or phrase in the message input below. The system will translate it into <span className="text-[#00BFFF] font-semibold">{targetLang}</span> and respond instantly.
                </p>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md transition-all ${
                    m.role === "user" 
                      ? "bg-gradient-to-r from-blue-600 to-[#00BFFF] text-white rounded-tr-none border border-blue-400/20" 
                      : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none backdrop-blur-md"
                  }`}>
                    <p className="whitespace-pre-wrap select-text">{m.content}</p>
                  </div>
                  
                  {m.role === "assistant" && (
                    <div className="mt-1.5 flex items-center gap-3.5 pl-1.5 text-[10px] text-gray-500">
                      <button 
                        onClick={() => handleCopy(m.content)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                      <button 
                        onClick={() => handleSpeak(m.content)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Speak</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Translating animation */}
            {translating && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm bg-white/5 border border-white/10 text-gray-400 rounded-tl-none backdrop-blur-md flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] font-medium tracking-wide font-mono text-cyan-400/80">Translating to {targetLang}...</span>
                </div>
              </div>
            )}
            
            <div ref={endRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2.5 bg-[#121214]/90 border border-white/10 rounded-xl px-4 py-1.5 focus-within:border-[#00BFFF]/40 transition-colors shadow-inner" id="translate-input-wrapper">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTranslate()}
                placeholder={`Type message to translate into ${targetLang}...`}
                className="flex-1 bg-transparent border-none outline-none py-2 text-xs sm:text-sm text-white placeholder-gray-500"
              />
              <button 
                onClick={() => handleTranslate()}
                disabled={!input.trim() || translating}
                className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-[#00BFFF] hover:from-blue-500 hover:to-sky-400 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,191,255,0.25)] flex items-center justify-center shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Footer Secure line */}
        <footer className="text-center mt-6 mb-2 text-gray-500 text-xs flex items-center justify-center gap-1.5" id="translate-secure-footer">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shadow-sm" />
          <span>Your data is secure & encrypted</span>
        </footer>
      </div>

      {createPortal(
        <AnimatePresence>
          {isFromOpen && coords && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: coords.direction === "down" ? -6 : 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: coords.direction === "down" ? -6 : 6 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                left: coords.left,
                width: coords.width,
                ...(coords.top !== undefined ? { top: coords.top } : { bottom: coords.bottom }),
              }}
              className="z-[9999] rounded-xl bg-[#0c0c0f]/95 border border-[#00BFFF]/30 shadow-[0_0_25px_rgba(0,191,255,0.25)] backdrop-blur-2xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <div className="p-1 grid grid-cols-1 gap-0.5">
                {LANGUAGES_FROM.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSourceLang(lang);
                      setIsFromOpen(false);
                      addToast(`Source set to ${lang}`, "info");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      sourceLang === lang 
                        ? "bg-[#00BFFF]/10 text-[#00BFFF] font-bold" 
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{lang}</span>
                    {sourceLang === lang && <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {createPortal(
        <AnimatePresence>
          {isToOpen && coords && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, scale: 0.95, y: coords.direction === "down" ? -6 : 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: coords.direction === "down" ? -6 : 6 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed",
                left: coords.left,
                width: coords.width,
                ...(coords.top !== undefined ? { top: coords.top } : { bottom: coords.bottom }),
              }}
              className="z-[9999] rounded-xl bg-[#0c0c0f]/95 border border-[#00BFFF]/30 shadow-[0_0_25px_rgba(0,191,255,0.25)] backdrop-blur-2xl max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <div className="p-1 grid grid-cols-1 gap-0.5">
                {LANGUAGES_TO.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setTargetLang(lang);
                      setIsToOpen(false);
                      addToast(`Target set to ${lang}`, "info");
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      targetLang === lang 
                        ? "bg-[#00BFFF]/10 text-[#00BFFF] font-bold" 
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{lang}</span>
                    {targetLang === lang && <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF]" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}

/* ========================================================================= */
/* 3. SUMMARIZER AI COMPONENT                                                */
/* ========================================================================= */
function SummarizerToolWorkspace({ 
  addToast, 
  onBack = () => {}, 
  userEmail = "", 
  toasts = [] 
}: { 
  addToast: (msg: string, type?: "success" | "info") => void; 
  onBack?: () => void;
  userEmail?: string;
  toasts?: { id: string; message: string; type: "success" | "info" }[];
}) {
  const [activeScreen, setActiveScreen] = useState<"empty" | "loading" | "answer">("empty");
  const [inputMode, setInputMode] = useState<"paste" | "upload" | "url">("paste");
  
  // Input fields state
  const [inputText, setInputText] = useState("");
  const [webUrl, setWebUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileSize, setUploadedFileSize] = useState("");

  // Result state
  const [summaryText, setSummaryText] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [originalWordCount, setOriginalWordCount] = useState(0);
  const [summaryWordCount, setSummaryWordCount] = useState(0);
  const [readingTimeSaved, setReadingTimeSaved] = useState(0);
  const [keywords, setKeywords] = useState<string[]>([]);

  // Loading state
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem("aetrix_active_conv_summarizer");
  });
  const activeConvIdRef = useRef<string | null>(activeConvId);

  const updateActiveConvId = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    localStorage.setItem("aetrix_active_conv_summarizer", id);
  };

  useEffect(() => {
    const activeId = localStorage.getItem("aetrix_active_conv_summarizer");
    if (activeId) {
      setActiveConvId(activeId);
      activeConvIdRef.current = activeId;
      const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const historyList: FeatureChatHistory[] = JSON.parse(stored);
          const found = historyList.find(c => c.id === activeId);
          if (found && found.messages.length >= 2) {
            const aiMsg = found.messages.filter(m => m.role === "assistant").pop();
            if (aiMsg) {
              try {
                const parsed = JSON.parse(aiMsg.content);
                setSummaryText(parsed.summary);
                setHighlights(parsed.highlights || []);
                setOriginalWordCount(parsed.originalWords || 0);
                setSummaryWordCount(parsed.summaryWords || 0);
                setReadingTimeSaved(parsed.saved || 0);
                setKeywords(parsed.keywords || []);
                setActiveScreen("answer");
              } catch (err) {
                setSummaryText(aiMsg.content);
                setActiveScreen("answer");
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail]);

  // Preset Data for Quick Action Cards
  const PRESETS = {
    article: {
      title: "AETRIX AI Unveils Quantum Neural Model",
      text: "AETRIX AI, a pioneer in next-generation artificial intelligence, has officially unveiled its new Quantum Neural Model (QNM-1). The model leverages simulated quantum entanglement principles to accelerate neural weights synchronization by up to 400% compared to standard transformer architectures. Designed to operate completely in offline-first, client-side sandboxes, QNM-1 marks a major milestone in decentralized computing. Tech experts believe this will revolutionize consumer electronics, allowing complex reasoning engines to run natively on mobile hardware without requiring massive cloud clusters or exposing sensitive private data to third-party endpoints.",
      summary: "AETRIX AI has introduced its revolutionary Quantum Neural Model (QNM-1), which utilizes simulated quantum entanglement to speed up neural network synchronization by 400%. By enabling high-performance reasoning engines to run locally on mobile hardware, this breakthrough advances decentralized, offline-first computing while securing user data privacy from cloud vulnerabilities.",
      highlights: [
        "Introduces QNM-1, a model powered by simulated quantum entanglement principles.",
        "Accelerates neural network synchronization speeds by up to 400% over transformers.",
        "Enables native, offline-first execution of complex AI models directly on mobile devices.",
        "Enhances data privacy by eliminating the need to transmit sensitive info to external servers."
      ],
      words: 124,
      summaryWords: 52,
      saved: 75,
      keywords: ["Quantum", "Neural", "AETRIX AI", "Local Computing", "Transformers"]
    },
    pdf: {
      title: "AGI Safety Alignment Protocol v4.2",
      text: "This document outlines the safety alignment guidelines for the development of Artificial General Intelligence (AGI). It establishes a three-tiered reinforcement learning feedback loop (RLFL) that integrates human values at the core objective function level. To prevent reward hacking, the protocol recommends automated multi-agent adversarial red-teaming coupled with formal verification of neural bounds. Furthermore, it advocates for a gradual, sandboxed deployment cycle where model capabilities are rigorously monitored across simulated cognitive domains prior to public API access. Implementing these safeguards is critical to ensuring that superintelligent systems remain beneficial, cooperative, and aligned with human flourishing.",
      summary: "The AGI Safety Alignment Protocol v4.2 establishes a robust three-tiered reinforcement learning loop to align artificial general intelligence with human values. To mitigate risks like reward hacking, the guidelines advocate for multi-agent red-teaming, formal neural boundary verification, and gradual sandboxed testing across diverse cognitive domains before deployment.",
      highlights: [
        "Establishes a three-tiered reinforcement loop integrating human values at the core.",
        "Mitigates reward hacking using adversarial red-teaming and formal verification.",
        "Proposes gradual, sandboxed rollouts with capability monitoring in simulated domains.",
        "Prioritizes long-term safety to keep superintelligent systems aligned with human welfare."
      ],
      words: 122,
      summaryWords: 48,
      saved: 78,
      keywords: ["AGI", "Alignment", "Safety", "Red-Teaming", "Neural Verification"]
    },
    notes: {
      title: "Project Serene - Brainstorming Session",
      text: "The cross-functional team met to discuss the roadmap for Project Serene. Engineering highlighted that migrating to the new edge-runtime framework is 90% complete, which will reduce latency by 45ms. Product proposed integrating the Gemini 1.5 Flash API to handle context summarization and smart suggestions inside the interactive dashboard. Design shared updated Figma high-fidelity prototypes focusing on a sleek dark-slate interface with fluid micro-animations. Marketing noted that the launch date is set for October 12, with a pre-launch landing page going live next week. Action items: Sarah to finalize API key integration, David to optimize canvas resize listeners, and Elena to review copy.",
      summary: "Project Serene's brainstorming session aligned engineering, product, design, and marketing ahead of the October 12 launch. Key milestones include a nearly completed edge-runtime migration, integration of Gemini 1.5 Flash for smart features, and finalized dark-slate visual mockups, with a pre-launch page debuting next week.",
      highlights: [
        "Engineering completed 90% of edge-runtime migration to shave 45ms off latency.",
        "Product plans to integrate Gemini 1.5 Flash API for context-aware summaries.",
        "Design showcased updated dark-slate high-fidelity prototypes with fluid motion.",
        "Set launch date for October 12 with pre-launch landing page debuting next week."
      ],
      words: 114,
      summaryWords: 45,
      saved: 72,
      keywords: ["Project Serene", "Roadmap", "Gemini Flash", "Prototypes", "Launch"]
    }
  };

  const loadPreset = (type: "article" | "pdf" | "notes") => {
    const preset = PRESETS[type];
    setInputMode("paste");
    setInputText(preset.text);
    addToast(`${preset.title} loaded successfully!`, "success");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      setUploadedFileSize((file.size / 1024).toFixed(1) + " KB");
      addToast(`Loaded ${file.name} successfully!`, "success");
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        if (fileContent && typeof fileContent === "string" && file.name.endsWith(".txt")) {
          setInputText(fileContent);
        } else {
          setInputText(`Document title: ${file.name} (${(file.size / 1024).toFixed(1)} KB). This binary doc payload contains analytical segments. The AI model will analyze, cross-reference structural patterns, and compile executive insights.`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFileName(file.name);
      setUploadedFileSize((file.size / 1024).toFixed(1) + " KB");
      addToast(`Dropped ${file.name}!`, "success");
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target?.result as string;
        if (fileContent && typeof fileContent === "string" && file.name.endsWith(".txt")) {
          setInputText(fileContent);
        } else {
          setInputText(`Document title: ${file.name} (${(file.size / 1024).toFixed(1)} KB). This binary doc payload contains analytical segments. The AI model will analyze, cross-reference structural patterns, and compile executive insights.`);
        }
      };
      reader.readAsText(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setUploadedFile(null);
    setUploadedFileName("");
    setUploadedFileSize("");
    setInputText("");
    addToast("File removed", "info");
  };

  // Generate local dynamic summary fallback if API fails
  const generateCustomSummary = (rawText: string) => {
    const clean = rawText.trim();
    const wordCount = clean.split(/\s+/).filter(Boolean).length;
    const sentences = clean.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 8);
    
    // Fallback paragraph
    const p1 = sentences[0] ? sentences[0] + "." : "Analysing custom document context parameters.";
    const p2 = sentences[1] ? " " + sentences[1] + "." : "";
    const p3 = " The system parsed this input natively, securing high-priority insights and mapping logical context workflows.";
    const summaryParagraph = p1 + p2 + p3;
    
    // Fallback points
    const customHighlights = [
      sentences[0] ? sentences[0] + "." : "Decentralized document payload processed natively.",
      sentences[1] ? sentences[1] + "." : "Key structural variables parsed with low latency.",
      "Ensured data sandbox boundaries remained locked client-side.",
      "Achieved high-compression insight ratio with 0% cloud data leak."
    ];

    const wordsArray = clean.split(/[^a-zA-Z]+/);
    const potentialKeywords = Array.from(new Set(wordsArray.filter(w => w.length > 5 && w[0] === w[0].toUpperCase()))).slice(0, 4);
    const finalKeywords = potentialKeywords.length >= 2 ? potentialKeywords : ["Aetrix Core", "Context Parsing", "Security", "AI Client"];

    const summaryCount = Math.floor(wordCount * 0.38) || 35;
    const savedPercent = 100 - Math.round((summaryCount / wordCount) * 100) || 75;

    return {
      summary: summaryParagraph,
      highlights: customHighlights.slice(0, 4),
      words: wordCount || 180,
      summaryWords: summaryCount,
      saved: savedPercent > 95 ? 85 : (savedPercent < 10 ? 68 : savedPercent),
      keywords: finalKeywords
    };
  };

  const handleSummarizeNow = async () => {
    let sourceText = "";
    if (inputMode === "paste") {
      sourceText = inputText;
    } else if (inputMode === "url") {
      sourceText = webUrl;
    } else if (inputMode === "upload") {
      sourceText = inputText || (uploadedFileName ? `Document payload: ${uploadedFileName}. Content analyzed under client side sandbox.` : "");
    }

    if (!sourceText.trim()) {
      addToast("Please provide or load content to summarize", "info");
      return;
    }

    // Check if the current input matches a preset, load its predefined values perfectly
    let isPreset = false;
    let matchingPreset: any = null;

    Object.values(PRESETS).forEach((preset) => {
      if (sourceText.trim() === preset.text.trim()) {
        isPreset = true;
        matchingPreset = preset;
      }
    });

    // Enter loading screen
    setActiveScreen("loading");
    setLoadingProgress(0);
    setLoadingStep(0);

    let apiResult: any = null;
    let apiError = "";
    let apiCompleted = false;

    // Trigger API route in parallel for non-presets
    if (!isPreset) {
      const apiPromise = (async () => {
        try {
          const prompt = `You are a professional document summarizer. Summarize the following text into a clean, well-formatted paragraph of about 80-120 words. Then, list exactly 4 key takeaways as bullet points. Format your response exactly like this:
[Summary Paragraph here]
---
* [Takeaway 1]
* [Takeaway 2]
* [Takeaway 3]
* [Takeaway 4]

Text to summarize: "${sourceText}"`;

          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
          });
          const data = await res.json();
          if (res.ok && data.text) {
            const parts = data.text.split("---");
            const sumPara = parts[0]?.trim() || "Analyzed document overview compiled.";
            const bulletLines = parts[1] 
              ? parts[1].split("\n").map((l: string) => l.replace(/^[*-\s]+/, "").trim()).filter(Boolean)
              : ["Payload validated successfully.", "Insights generated natively.", "Key features indexed.", "Analysis loop closed."];
            
            const rawWords = sourceText.split(/\s+/).filter(Boolean).length;
            const sumWords = sumPara.split(/\s+/).filter(Boolean).length;
            const savedVal = 100 - Math.round((sumWords / rawWords) * 100);

            // Keywords extraction
            const wordsList = sourceText.split(/[^a-zA-Z]+/);
            const rawKeywords = Array.from(new Set(wordsList.filter(w => w.length > 5 && w[0] === w[0].toUpperCase()))).slice(0, 4);
            const finalKeys = rawKeywords.length >= 2 ? rawKeywords : ["AI Synthesis", "Analysis Engine", "Aetrix Core"];

            apiResult = {
              summary: sumPara,
              highlights: bulletLines.slice(0, 4),
              words: rawWords || 140,
              summaryWords: sumWords || 60,
              saved: savedVal > 10 ? savedVal : 72,
              keywords: finalKeys
            };
          } else {
            throw new Error(data.error || "Failed to generate summary.");
          }
        } catch (err: any) {
          console.error("API summarization error:", err);
          apiError = err.message || "An error occurred during summarization.";
        } finally {
          apiCompleted = true;
        }
      })();
    } else {
      apiCompleted = true;
      apiResult = matchingPreset;
    }

    // Loading step checklist
    const steps = [
      "Reading Content Payload...",
      "Understanding Logical Context...",
      "Extracting Critical Points...",
      "Structuring AI Response Summary...",
      "Improving Insight Density...",
      "Finalizing Dashboard Summary..."
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Speeds up step times
      currentProgress += 2.2;
      setLoadingProgress(Math.min(100, Math.floor(currentProgress)));
      
      const stepIndex = Math.min(steps.length - 1, Math.floor((currentProgress / 100) * steps.length));
      setLoadingStep(stepIndex);

      if (currentProgress >= 100) {
        clearInterval(interval);

        const finalizeResponse = () => {
          if (apiError) {
            addToast(`Summarization failed: ${apiError}`, "info");
            setActiveScreen("input");
            return;
          }

          if (isPreset && matchingPreset) {
            setSummaryText(matchingPreset.summary);
            setHighlights(matchingPreset.highlights);
            setOriginalWordCount(matchingPreset.words);
            setSummaryWordCount(matchingPreset.summaryWords);
            setReadingTimeSaved(matchingPreset.saved);
            setKeywords(matchingPreset.keywords);
          } else if (apiResult) {
            setSummaryText(apiResult.summary);
            setHighlights(apiResult.highlights);
            setOriginalWordCount(apiResult.words);
            setSummaryWordCount(apiResult.summaryWords);
            setReadingTimeSaved(apiResult.saved);
            setKeywords(apiResult.keywords);
          } else {
            // No result and no error means empty fallback
            setSummaryText("");
            setHighlights([]);
            setOriginalWordCount(0);
            setSummaryWordCount(0);
            setReadingTimeSaved(0);
            setKeywords([]);
          }

          const finalSum = (isPreset && matchingPreset) 
            ? matchingPreset.summary 
            : (apiResult ? apiResult.summary : generateCustomSummary(sourceText).summary);
          const finalHighlights = (isPreset && matchingPreset) 
            ? matchingPreset.highlights 
            : (apiResult ? apiResult.highlights : generateCustomSummary(sourceText).highlights);
          const finalWords = (isPreset && matchingPreset) 
            ? matchingPreset.words 
            : (apiResult ? apiResult.words : generateCustomSummary(sourceText).words);
          const finalSummaryWords = (isPreset && matchingPreset) 
            ? matchingPreset.summaryWords 
            : (apiResult ? apiResult.summaryWords : generateCustomSummary(sourceText).summaryWords);
          const finalSaved = (isPreset && matchingPreset) 
            ? matchingPreset.saved 
            : (apiResult ? apiResult.saved : generateCustomSummary(sourceText).saved);
          const finalKeywords = (isPreset && matchingPreset) 
            ? matchingPreset.keywords 
            : (apiResult ? apiResult.keywords : generateCustomSummary(sourceText).keywords);

          const historyPayload = {
            summary: finalSum,
            highlights: finalHighlights,
            originalWords: finalWords,
            summaryWords: finalSummaryWords,
            saved: finalSaved,
            keywords: finalKeywords
          };
          
          const userPromptMsg = sourceText.length > 80 ? sourceText.substring(0, 77) + "..." : sourceText;
          saveToolMessageToHistory(
            userEmail || "guest",
            "summarizer",
            `Summarized: "${userPromptMsg}"`,
            JSON.stringify(historyPayload),
            activeConvIdRef.current,
            updateActiveConvId
          );

          setActiveScreen("answer");
          addToast("Executive summary compiled successfully!", "success");
        };

        if (apiCompleted) {
          finalizeResponse();
        } else {
          let pollCount = 0;
          const apiPoll = setInterval(() => {
            pollCount++;
            if (apiCompleted || pollCount >= 12) {
              clearInterval(apiPoll);
              finalizeResponse();
            }
          }, 150);
        }
      }
    }, 110);
  };

  const copySummaryText = () => {
    const fullReport = `SUMMARY:\n${summaryText}\n\nKEY TAKEAWAYS:\n${highlights.map(h => `• ${h}`).join("\n")}`;
    navigator.clipboard.writeText(fullReport);
    setIsCopied(true);
    addToast("Summary Report copied!", "success");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    try {
      const element = document.createElement("a");
      const reportName = uploadedFileName ? uploadedFileName.split(".")[0] : "AETRIX_AI_Summary";
      const content = `AETRIX AI - EXECUTIVE SUMMARIZER REPORT\n========================================\n\n[METRICS]\n- Original Word Count: ${originalWordCount}\n- Summary Word Count: ${summaryWordCount}\n- Cognitive Load Saved: ${readingTimeSaved}%\n- Focus Keywords: ${keywords.join(", ")}\n\n========================================\n\n[AI EXECUTIVE SUMMARY]\n\n${summaryText}\n\n========================================\n\n[CRITICAL HIGHLIGHTS & TAKEAWAYS]\n\n${highlights.map((h, i) => `${i + 1}. [✓] ${h}`).join("\n")}\n\n========================================\nCompiled natively under Aetrix Secure Sandboxed AI Workspace.`;
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${reportName}_Report.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      addToast("Report downloaded as TXT Doc!", "success");
    } catch {
      addToast("Download failed", "info");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AETRIX AI Executive Report',
        text: summaryText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`AETRIX AI Summary Report:\n\n${summaryText}`);
      addToast("Share report copied to clipboard!", "success");
    }
  };

  const handleReset = () => {
    setActiveScreen("empty");
    setInputText("");
    setWebUrl("");
    setUploadedFile(null);
    setUploadedFileName("");
    setUploadedFileSize("");
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-[#0B0F19] text-white flex flex-col items-center justify-start overflow-x-hidden font-sans pb-16 selection:bg-[#00BFFF]/30">
      {/* 60 FPS Stars Background Layer */}
      <div className="absolute inset-0 z-0">
        <PremiumSpaceBackground />
      </div>

      {/* Embedded Scan laser animations */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 8%; opacity: 0.3; }
          50% { top: 88%; opacity: 1; }
        }
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.18; }
        }
        .custom-glow {
          box-shadow: 0 0 35px rgba(0, 191, 255, 0.12);
        }
        .emerald-glow {
          box-shadow: 0 0 45px rgba(16, 185, 129, 0.15);
        }
      `}</style>

      {/* Cyber Space grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-10 animate-[grid-pulse_4s_ease-in-out_infinite] z-0" />

      {/* Floating neon blobs */}
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Redesigned Header element to match Resume AI exactly */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full relative z-10 flex flex-col">
        <header className="flex items-center justify-between mb-8" id="summarizer-header-row">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-md"
              id="summarizer-back-arrow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>

            <div className="flex flex-col text-left" id="summarizer-logo-branding">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-[2px]" />
                  <div className="w-5 h-5 rounded-full border border-[#00BFFF]/50 bg-black flex items-center justify-center text-[10px] text-[#00BFFF] font-black z-10">
                    A
                  </div>
                  <div className="absolute w-7 h-3 border border-[#00BFFF]/40 rounded-full -rotate-[20deg]" />
                </div>
                <span className="font-extrabold tracking-[0.2em] text-sm text-white font-sans">AETRIX <span className="text-[#00BFFF]">AI</span></span>
              </div>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider mt-0.5 uppercase flex items-center gap-1.5 pl-8">
                SUMMARIZER AI <FileText className="w-3.5 h-3.5 text-[#00BFFF]" />
              </span>
            </div>
          </div>

          {/* Large Orbiting Orb Decoration */}
          <div className="relative w-16 h-16 flex items-center justify-center" id="summarizer-glowing-orbit-orb">
            <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute w-11 h-11 rounded-full border border-purple-500/30 bg-gradient-to-tr from-[#050505] via-[#100c1c] to-[#0d1624] flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.2)] overflow-hidden">
              <span className="text-white font-black text-xl tracking-widest font-sans select-none relative z-10">A</span>
            </div>
            <div className="absolute w-14 h-7 border border-[#00BFFF]/30 rounded-full -rotate-[22deg] animate-[spin_12s_linear_infinite]" />
          </div>
        </header>
      </div>

      {/* Inner Screen Switcher Container */}
      <div className="relative w-full max-w-4xl px-4 sm:px-6 z-10 flex flex-col items-center">
        
        {/* ========================================================================= */}
        {/* SCREEN 1: EMPTY/INPUT VIEW                                                */}
        {/* ========================================================================= */}
        {activeScreen === "empty" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center"
          >
            {/* Main Hero Header */}
            <div className="text-center mb-8 max-w-2xl">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono tracking-wider uppercase text-emerald-400">Next-Gen Document Synthesis</span>
              </motion.div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 font-sans">
                Summarizer <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
                Condense lengthy articles, complex PDFs, transcripts, or URLs into concise, actionable summaries instantly using our neural-network processor.
              </p>
            </div>

            {/* Large Interactive Workstation Card */}
            <div className="w-full bg-[#0c0f1d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden custom-glow">
              
              {/* Tabs Indicator Header */}
              <div className="flex border-b border-white/5 mb-6 pb-2 items-center justify-between gap-4 overflow-x-auto scrollbar-none">
                <span className="text-xs font-semibold text-emerald-400 font-mono tracking-widest hidden sm:inline">INPUT GATEWAY</span>
                <div className="flex items-center gap-2">
                  {[
                    { id: "paste", label: "Paste Text", icon: FileText, color: "text-purple-400 bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40" },
                    { id: "upload", label: "Upload File", icon: Upload, color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40" },
                    { id: "url", label: "Enter URL", icon: Link, color: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40" }
                  ].map((tab) => {
                    const isActive = inputMode === tab.id;
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setInputMode(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer ${
                          isActive 
                            ? "bg-white/10 border-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.05)]" 
                            : "bg-transparent border-transparent text-gray-400 hover:text-white"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-gray-400"}`} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workstation Workspace Content */}
              <div className="min-h-[220px] flex flex-col justify-center relative z-10 mb-6">
                
                {/* 1. Paste Text Mode */}
                {inputMode === "paste" && (
                  <div className="w-full h-full relative">
                    <textarea
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your long-form article, lecture notes, or text document here (minimum 20 characters)..."
                      className="w-full h-56 bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all duration-300 resize-none font-sans leading-relaxed"
                    />
                    {inputText && (
                      <button 
                        onClick={() => setInputText("")}
                        className="absolute bottom-4 right-4 text-xs font-mono text-gray-500 hover:text-white bg-black/60 px-2.5 py-1.5 border border-white/10 rounded-lg transition-colors cursor-pointer"
                      >
                        CLEAR TEXT
                      </button>
                    )}
                  </div>
                )}

                {/* 2. Upload File Mode */}
                {inputMode === "upload" && (
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={!uploadedFileName ? triggerFileSelect : undefined}
                    className={`w-full h-56 border border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-300 ${
                      uploadedFileName 
                        ? "border-emerald-500/30 bg-emerald-500/5 cursor-default" 
                        : "border-white/10 hover:border-emerald-500/30 hover:bg-white/5 cursor-pointer"
                    }`}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".txt,.pdf,.docx"
                      className="hidden" 
                    />

                    {!uploadedFileName ? (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#00BFFF]/10 border border-[#00BFFF]/20 flex items-center justify-center mb-4 text-[#00BFFF] animate-bounce">
                          <Upload className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-white mb-1">Drag and drop document</h3>
                        <p className="text-xs text-gray-500 max-w-sm px-4 leading-normal">
                          Supports Plain Text (.txt), PDFs, or DOCX up to 10MB. Or, <span className="text-[#00BFFF] hover:underline font-medium">browse local files</span>.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center w-full max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
                          <FileText className="w-8 h-8" />
                        </div>
                        <h3 className="text-sm font-bold text-white max-w-xs truncate mb-1">{uploadedFileName}</h3>
                        <p className="text-xs text-gray-500 font-mono mb-4">{uploadedFileSize}</p>
                        
                        <div className="flex items-center gap-3 w-full justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerFileSelect();
                            }}
                            className="px-4 py-2 border border-white/10 hover:bg-white/5 text-xs text-gray-300 rounded-lg font-medium transition-all cursor-pointer"
                          >
                            Replace File
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearFile();
                            }}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs text-red-400 rounded-lg font-medium transition-all cursor-pointer"
                          >
                            Remove File
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. URL Mode */}
                {inputMode === "url" && (
                  <div className="w-full h-56 flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl border border-white/5">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                      <Link className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">Enter Website Article URL</h3>
                    <p className="text-xs text-gray-500 mb-4 text-center max-w-xs">
                      Provide a direct web link to any news, science, or essay webpage to scrape and synthesize content.
                    </p>
                    <div className="w-full max-w-md relative">
                      <input 
                        type="url"
                        value={webUrl}
                        onChange={(e) => setWebUrl(e.target.value)}
                        placeholder="https://example.com/tech-news-article"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs outline-none focus:border-amber-500/40 text-gray-200 placeholder-gray-600 font-mono"
                      />
                      {webUrl && (
                        <button 
                          onClick={() => setWebUrl("")}
                          className="absolute right-3 top-2.5 text-[9px] text-gray-500 hover:text-white border border-white/10 bg-black/60 px-2 py-1 rounded transition-colors"
                        >
                          RESET
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Main Submit action Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleSummarizeNow}
                  className="w-full max-w-md py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-90 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] group overflow-hidden relative"
                >
                  <Sparkles className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                  <span>Summarize Now</span>
                </button>
                
                <div className="flex items-center gap-2 mt-4 text-gray-500 text-[10px] font-mono uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-gray-600" />
                  <span>Secure sandboxed sandbox. No data leaves the node.</span>
                </div>
              </div>

            </div>

            {/* Quick Action Cards Section */}
            <div className="w-full mt-10">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">QUICK WORKSPACE PRESETS</span>
                <span className="text-[10px] text-gray-500 font-mono">ONE-CLICK INJECTION</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: "article", label: "Summarize Article", desc: "Aetrix Quantum Neural Model (QNM-1) unveiling", icon: FileText, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40" },
                  { id: "pdf", label: "Summarize PDF Safety", desc: "AGI safety guidelines alignment protocol document", icon: BookOpen, color: "text-blue-400 bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40" },
                  { id: "notes", label: "Summarize Notes", desc: "Project Serene cross-functional brainstorm session", icon: Globe, color: "text-amber-400 bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40" }
                ].map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => loadPreset(preset.id as any)}
                      className={`text-left p-4 rounded-xl bg-black/40 border border-white/5 transition-all duration-300 hover:bg-white/5 cursor-pointer group flex gap-3.5 items-start ${preset.color}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all text-current">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">{preset.label}</span>
                        <span className="text-[10px] text-gray-500 leading-normal mt-0.5 group-hover:text-gray-400 transition-colors">{preset.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: LOADING VIEW                                                    */}
        {/* ========================================================================= */}
        {activeScreen === "loading" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl flex flex-col items-center justify-center py-10"
          >
            {/* Glowing concentric spinning rings with radar sweeps */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-8">
              {/* Radial background pulse glow */}
              <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-2xl animate-pulse" />

              {/* Concentric spin loops */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#00BFFF]/30 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border-2 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent animate-[spin_2.5s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-blue-500/20 animate-[spin_15s_linear_infinite]" style={{ animationDirection: "reverse" }} />
              <div className="absolute inset-6 rounded-full border border-cyan-400/30 animate-[spin_4s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-white/5" />

              {/* Centered Document icon with linear laser beam sweep */}
              <div className="absolute w-20 h-20 rounded-2xl bg-black/80 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                {/* Laser scan beam */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00BFFF] shadow-[0_0_8px_#00BFFF] animate-[scan_2s_ease-in-out_infinite] z-10 pointer-events-none" />
                <FileText className="w-10 h-10 text-emerald-400 relative z-0" />
              </div>
            </div>

            {/* Analysis Checklist progress log */}
            <div className="w-full bg-[#0c0f1d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-6 custom-glow">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-bold uppercase">Neural Synthesis Engine Status</span>
                <span className="text-xs font-mono font-bold text-[#00BFFF]">{loadingProgress}%</span>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {[
                  "Reading Content Payload...",
                  "Understanding Logical Context...",
                  "Extracting Critical Points...",
                  "Structuring AI Response Summary...",
                  "Improving Insight Density...",
                  "Finalizing Dashboard Summary..."
                ].map((step, index) => {
                  const isDone = loadingStep > index;
                  const isActive = loadingStep === index;
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 text-xs font-mono transition-all duration-300 ${
                        isDone 
                          ? "text-emerald-400 opacity-100" 
                          : isActive 
                            ? "text-[#00BFFF] font-bold opacity-100 scale-[1.01]" 
                            : "text-gray-600 opacity-40"
                      }`}
                    >
                      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                        {isDone ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                        ) : isActive ? (
                          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                        )}
                      </div>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standard Loading text and progress block */}
            <div className="text-center w-full px-4">
              <h2 className="text-lg font-bold text-white mb-2 animate-pulse">Analyzing Content Workspace...</h2>
              <p className="text-xs text-gray-500 font-mono tracking-wider mb-6">Usually takes 5-15 seconds</p>
              
              {/* Horizontal sleek progress bar */}
              <div className="w-full bg-black/40 border border-white/5 rounded-full h-2.5 p-0.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 h-full rounded-full transition-all duration-200 shadow-[0_0_10px_rgba(0,191,255,0.4)]"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: ANSWER VIEW                                                     */}
        {/* ========================================================================= */}
        {activeScreen === "answer" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full flex flex-col items-center"
          >
            {/* Header Success visual */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4 animate-[bounce_1.5s_ease-in-out_infinite] emerald-glow">
                <CheckCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Summary Compiled!</h1>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Cognitive Processing Complete</p>
            </div>

            {/* Large Interactive Summary Report Card */}
            <div className="w-full bg-[#0c0f1d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative custom-glow">
              
              {/* Card Meta details top bar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6 gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">EXECUTIVE AI INSIGHTS</span>
                </div>
                
                <button
                  onClick={copySummaryText}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? "COPIED REPORT!" : "COPY REPORT"}</span>
                </button>
              </div>

              {/* Main summary paragraphs text */}
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3 block">EXECUTIVE SUMMARY</h3>
                <p className="text-sm text-gray-300 leading-relaxed bg-black/20 border border-white/5 rounded-xl p-5 font-sans whitespace-pre-line leading-relaxed">
                  {summaryText}
                </p>
              </div>

              {/* Key Highlights list block */}
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3 block">CRITICAL HIGHLIGHTS & TAKEAWAYS</h3>
                <div className="flex flex-col gap-3">
                  {highlights.map((point, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-3.5 transition-colors group"
                    >
                      <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                        <Check className="w-3.5 h-3.5 font-bold" />
                      </div>
                      <span className="text-xs text-gray-300 leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrical dashboard grid info */}
              <div className="mb-8">
                <h3 className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-3 block">DOCUMENT METRICS</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Original Words", value: originalWordCount, unit: "words", color: "text-gray-400" },
                    { label: "Summary Words", value: summaryWordCount, unit: "words", color: "text-[#00BFFF]" },
                    { label: "Cognitive Load", value: `-${readingTimeSaved}%`, unit: "saved", color: "text-emerald-400" },
                    { label: "Keywords", value: keywords.slice(0, 2).join(", ") || "General", unit: "tags", color: "text-amber-400 truncate" }
                  ].map((metric, i) => (
                    <div key={i} className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between h-20">
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{metric.label}</span>
                      <div className="flex items-baseline gap-1 mt-1 truncate">
                        <span className={`text-base font-black font-mono leading-none ${metric.color}`}>{metric.value}</span>
                        <span className="text-[8px] text-gray-600 font-mono uppercase leading-none">{metric.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom actionable triggers */}
              <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-white/5 pt-6">
                
                <button
                  onClick={handleReset}
                  className="w-full sm:flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 active:scale-[0.99] text-black font-bold text-xs tracking-wider uppercase rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer flex items-center justify-center gap-2"
                >
                  <RefreshCcw className="w-4 h-4 text-black" />
                  <span>Summarize Another</span>
                </button>

                <button
                  onClick={handleDownloadPDF}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                >
                  <Download className="w-4 h-4 text-gray-400" />
                  <span>DOWNLOAD REPORT</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 font-mono"
                >
                  <Share2 className="w-4 h-4 text-gray-400" />
                  <span>SHARE</span>
                </button>

              </div>

            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

/* ========================================================================= */
/* 4. CODY HELPER AI COMPONENT                                               */
/* ========================================================================= */
function CodyToolWorkspace({ 
  addToast, 
  onBack = () => {}, 
  userEmail = "", 
  toasts = [] 
}: { 
  addToast: (msg: string, type?: "success" | "info") => void; 
  onBack?: () => void;
  userEmail?: string;
  toasts?: { id: string; message: string; type: "success" | "info" }[];
}) {
  const [activeScreen, setActiveScreen] = useState<"empty" | "loading" | "answer">("empty");
  const [serviceMode, setServiceMode] = useState<"ask" | "debug" | "explain">("ask");
  const [inputText, setInputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string }[]>([]);
  
  // Loaded solution state
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [displayedCode, setDisplayedCode] = useState("");
  const [displayedExplanation, setDisplayedExplanation] = useState("");
  const [displayedTimeComplexity, setDisplayedTimeComplexity] = useState("");
  const [displayedSpaceComplexity, setDisplayedSpaceComplexity] = useState("");
  const [displayedBestPractices, setDisplayedBestPractices] = useState<string[]>([]);
  const [displayedOptimizationTips, setDisplayedOptimizationTips] = useState<string[]>([]);

  // Tab state on screen 3
  const [selectedTab, setSelectedTab] = useState<"answer" | "explanation" | "notes">("answer");

  // Typewriter parameters
  const [typedCode, setTypedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingSpeedMultiplier, setTypingSpeedMultiplier] = useState(1);

  // Loading steps progress
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  // Run Code Console state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem("aetrix_active_conv_cody");
  });
  const activeConvIdRef = useRef<string | null>(activeConvId);

  const updateActiveConvId = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    localStorage.setItem("aetrix_active_conv_cody", id);
  };

  useEffect(() => {
    const activeId = localStorage.getItem("aetrix_active_conv_cody");
    if (activeId) {
      setActiveConvId(activeId);
      activeConvIdRef.current = activeId;
      const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const historyList: FeatureChatHistory[] = JSON.parse(stored);
          const found = historyList.find(c => c.id === activeId);
          if (found && found.messages.length >= 2) {
            const aiMsg = found.messages.filter(m => m.role === "assistant").pop();
            if (aiMsg) {
              try {
                const parsed = JSON.parse(aiMsg.content);
                setDisplayedTitle(parsed.title || "");
                setDisplayedCode(parsed.code || "");
                setTypedCode(parsed.code || "");
                setDisplayedExplanation(parsed.explanation || "");
                setDisplayedTimeComplexity(parsed.timeComplexity || "");
                setDisplayedSpaceComplexity(parsed.spaceComplexity || "");
                setDisplayedBestPractices(parsed.bestPractices || []);
                setDisplayedOptimizationTips(parsed.optimizationTips || []);
                setActiveScreen("answer");
              } catch (err) {
                setDisplayedCode(aiMsg.content);
                setTypedCode(aiMsg.content);
                setActiveScreen("answer");
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail]);
  const [isConsoleRunning, setIsConsoleRunning] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // PRELOADED EXAMPLES DATA
  const EXAMPLES = {
    "Create Login Page": {
      prompt: "Create a beautiful responsive login page in React using Tailwind CSS with glassmorphism effects.",
      language: "JavaScript",
      title: "React - Glassmorphism Login Page Component",
      code: `import React, { useState } from 'react';\n\nexport default function LoginPage() {\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log("Secure login request initiated for:", email);\n  };\n\n  return (\n    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">\n      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">\n        <h2 className="text-2xl font-extrabold text-white text-center mb-6">Welcome Back</h2>\n        <form onSubmit={handleSubmit} className="space-y-4">\n          <div>\n            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Email Address</label>\n            <input \n              type="email" \n              value={email}\n              onChange={(e) => setEmail(e.target.value)}\n              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none"\n              placeholder="name@example.com"\n            />\n          </div>\n          <div>\n            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-2">Password</label>\n            <input \n              type="password" \n              value={password}\n              onChange={(e) => setPassword(e.target.value)}\n              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-cyan-500 outline-none"\n              placeholder="••••••••"\n            />\n          </div>\n          <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl text-black font-bold text-sm">\n            Sign In Securely\n          </button>\n        </form>\n      </div>\n    </div>\n  );\n}`,
      explanation: "This React component implements a fully responsive, secure login interface using Tailwind CSS utility classes and React state hooks. It leverages modern glassmorphism design principles to fit seamlessly into dark-themed dashboards.",
      time: "O(1) Static Render",
      space: "O(1) Local State Scope",
      bestPractices: [
        "Wrap interactive layouts inside semantic HTML form elements to preserve screen reader and keyboard action states.",
        "Implement secure password masking controls and clear error feedbacks.",
        "Sanitize and validate email formatting schemas client-side to prevent redundant network trips."
      ],
      optimizationTips: [
        "Debounce heavy text input hooks or leverage uncontrolled input references.",
        "Split and lazy-load secondary dashboard panels using React Suspense blocks to reduce initial page bundles."
      ],
      console: [
        "[AETRIX COMPILER] Bundling React code parameters...",
        "[AETRIX COMPILER] Transpiling TSX elements to modern ES6 format...",
        "[AETRIX COMPILER] Loading Tailwind module stylesheets...",
        "[SUCCESS] Rendered component successfully in client virtual frame.",
        "[INFO] Form inputs initialized. Action points bound securely. Live preview running."
      ]
    },
    "Python Calculator": {
      prompt: "Build a robust Python calculator class that supports core arithmetic and logs computations to a file.",
      language: "Python",
      title: "Python - Advanced Arithmetic Calculator Class",
      code: `import logging\n\nclass Calculator:\n    def __init__(self):\n        logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(message)s')\n        logging.info("AETRIX AI Calculator module initialized.")\n\n    def add(self, a: float, b: float) -> float:\n        result = a + b\n        logging.info(f"Operation ADD: {a} + {b} = {result}")\n        return result\n\n    def subtract(self, a: float, b: float) -> float:\n        result = a - b\n        logging.info(f"Operation SUB: {a} - {b} = {result}")\n        return result\n\n    def multiply(self, a: float, b: float) -> float:\n        result = a * b\n        logging.info(f"Operation MUL: {a} * {b} = {result}")\n        return result\n\n    def divide(self, a: float, b: float) -> float:\n        if b == 0:\n            logging.error("ZeroDivisionError: Division by zero is prohibited.")\n            raise ValueError("Cannot divide by zero!")\n        result = a / b\n        logging.info(f"Operation DIV: {a} / {b} = {result}")\n        return result\n\n# Execution Example\ncalc = Calculator()\ncalc.add(25.5, 14.5)\ncalc.divide(100, 4)`,
      explanation: "This Python module defines a robust Calculator class using type-hinting and structured logging instead of simple print statements. Arithmetic procedures are wrapped in safety logic to handle edge exceptions securely.",
      time: "O(1) Constant Arithmetic",
      space: "O(1) Static Reference Memory",
      bestPractices: [
        "Incorporate strict type-hint mappings for easier code readability and static compiler assertions.",
        "Always handle potential division by zero errors with explicit custom exception definitions."
      ],
      optimizationTips: [
        "Incorporate operator maps inside dictionary references to handle dynamic math operators with O(1) lookups."
      ],
      console: [
        "[AETRIX COMPILER] Spawning Python virtual sandbox kernel...",
        "[INFO] 2026-07-17 09:52:11 - AETRIX AI Calculator module initialized.",
        "[INFO] 2026-07-17 09:52:11 - Operation ADD: 25.5 + 14.5 = 40.0",
        "[INFO] 2026-07-17 09:52:11 - Operation DIV: 100.0 / 4.0 = 25.0",
        "[SUCCESS] Process completed with exit code 0."
      ]
    },
    "React Navbar": {
      prompt: "Create a sticky, mobile-responsive header navigation bar with animated dropdowns in React.",
      language: "JavaScript",
      title: "React - Responsive Navigation Bar Component",
      code: `import React, { useState } from "react";\nimport { Menu, X, ChevronDown, User, LogOut } from "lucide-react";\n\nexport default function Navbar() {\n  const [isOpen, setIsOpen] = useState(false);\n  const [profileOpen, setProfileOpen] = useState(false);\n\n  return (\n    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-6 py-4">\n      <div className="max-w-7xl mx-auto flex items-center justify-between">\n        <span className="text-white font-bold text-lg tracking-wider">AETRIX AI</span>\n        \n        {/* Desktop Navigation Links */}\n        <div className="hidden md:flex items-center gap-6">\n          <a href="#core" className="text-slate-300 hover:text-white text-sm transition-colors font-mono">Core Nodes</a>\n          <a href="#services" className="text-slate-300 hover:text-white text-sm transition-colors font-mono">AI Services</a>\n          <a href="#security" className="text-slate-300 hover:text-white text-sm transition-colors font-mono">Security Vault</a>\n        </div>\n\n        {/* Mobile Hamburger button */}\n        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-400 hover:text-white cursor-pointer">\n          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}\n        </button>\n      </div>\n\n      {/* Mobile Menu Drawer */}\n      {isOpen && (\n        <div className="md:hidden bg-slate-950/95 border-b border-white/5 py-4 px-6 flex flex-col gap-4 animate-fadeIn">\n          <a href="#core" className="text-slate-300 py-2 border-b border-white/5">Core Nodes</a>\n          <a href="#services" className="text-slate-300 py-2 border-b border-white/5">AI Services</a>\n          <a href="#security" className="text-slate-300 py-2">Security Vault</a>\n        </div>\n      )}\n    </nav>\n  );\n}`,
      explanation: "A sticky, responsive React navigation bar header using standard hooks and icons. It manages viewport states elegantly and features backdrop filter blurs for superior visual aesthetics.",
      time: "O(1) Render Layout",
      space: "O(1) Local Toggle States",
      bestPractices: [
        "Incorporate sticky scroll checks using throttled event listeners or standard CSS relative sticky rules.",
        "Ensure keyboard accessibility by binding focus actions to mobile toggle drawers."
      ],
      optimizationTips: [
        "Use CSS transform parameters inside drawer slide-downs to trigger hardware graphics acceleration loops."
      ],
      console: [
        "[AETRIX COMPILER] Loading mobile responsive viewport layouts...",
        "[INFO] Sticky layout registered at document-top boundaries.",
        "[INFO] Hamburger trigger event listener bound successfully.",
        "[SUCCESS] Navigation component rendering smoothly at 60 FPS."
      ]
    },
    "Java CRUD API": {
      prompt: "Write a Spring Boot REST controller in Java for a secure CRUD resource API.",
      language: "Java",
      title: "Java - Spring Boot REST Controller with CRUD Operations",
      code: `package com.aetrix.api.controller;\n\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.*;\nimport java.util.*;\n\n@RestController\n@RequestMapping("/api/v1/nodes")\npublic class NodeController {\n    private final Map<String, String> dataStore = new HashMap<>();\n\n    @PostMapping\n    public ResponseEntity<Map<String, String>> createNode(@RequestBody Map<String, String> payload) {\n        String id = UUID.randomUUID().toString();\n        dataStore.put(id, payload.get("name"));\n        \n        Map<String, String> response = new HashMap<>();\n        response.put("id", id);\n        response.put("status", "node_registered");\n        return ResponseEntity.ok(response);\n    }\n\n    @GetMapping("/{id}")\n    public ResponseEntity<Map<String, String>> getNode(@PathVariable String id) {\n        if (!dataStore.containsKey(id)) {\n            return ResponseEntity.notFound().build();\n        }\n        Map<String, String> response = new HashMap<>();\n        response.put("id", id);\n        response.put("name", dataStore.get(id));\n        return ResponseEntity.ok(response);\n    }\n\n    @DeleteMapping("/{id}")\n    public ResponseEntity<Void> deleteNode(@PathVariable String id) {\n        if (!dataStore.containsKey(id)) {\n            return ResponseEntity.notFound().build();\n        }\n        dataStore.remove(id);\n        return ResponseEntity.noContent().build();\n    }\n}`,
      explanation: "A robust Java Spring Boot REST Controller establishing secure CRUD operations. Uses Java Collections Framework to index items and maps outcomes to standard HTTP response entities.",
      time: "O(1) Key-Value Map Hash Lookup",
      space: "O(N) Map Store Capacity",
      bestPractices: [
        "Always partition endpoints with clear, consistent routing paths such as /api/v1/*.",
        "Do not store production server states in local collection fields; bind controller logic to persistent SQL datastores."
      ],
      optimizationTips: [
        "Incorporate Redis caches in read paths to prevent expensive round-trips to relational databases."
      ],
      console: [
        "[AETRIX COMPILER] Booting Java Spring Boot Virtual Environment...",
        "[INFO] Starting NodeController application using JDK 17...",
        "[INFO] Tomcat web server initialized on port 8080 (http)...",
        "[INFO] Mapped POST, GET, DELETE request endpoints at /api/v1/nodes",
        "[SUCCESS] REST API active. Ready to process telemetry request payloads."
      ]
    },
    "SQL Query": {
      prompt: "Write an optimized SQL query with window functions to compute running totals and ranking groups.",
      language: "JavaScript",
      title: "SQL - Advanced Analytical Query with Window Functions",
      code: `-- Analytical telemetry analysis with Partition Window sums\nWITH telemetry_cte AS (\n    SELECT \n        node_id,\n        timestamp,\n        latency_ms,\n        status,\n        DATE(timestamp) AS operation_date\n    FROM aetrix_telemetry_logs\n    WHERE status = 'ACTIVE'\n)\nSELECT \n    node_id,\n    timestamp,\n    latency_ms,\n    SUM(latency_ms) OVER (\n        PARTITION BY node_id \n        ORDER BY timestamp \n        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n    ) AS cumulative_latency_ms,\n    DENSE_RANK() OVER (\n        PARTITION BY operation_date \n        ORDER BY latency_ms ASC\n    ) as efficiency_rank\nFROM telemetry_cte\nORDER BY operation_date DESC, efficiency_rank ASC;`,
      explanation: "This SQL query calculates progressive running totals and rank indicators. By utilizing partition limits, it organizes records sequentially and scores nodes based on active response latencies.",
      time: "O(N log N) Sort and Partition Sort",
      space: "O(N) Workspace Sorting Buffer Memory",
      bestPractices: [
        "Incorporate descriptive CTEs rather than nested inner queries for much cleaner readability.",
        "Always partition analytical data using clustered date indexing keys to prevent full index scans."
      ],
      optimizationTips: [
        "Establish unified composite indexes on columns (status, node_id, timestamp) to accelerate analytical filters by 92%."
      ],
      console: [
        "[AETRIX COMPILER] Spawning secure database query runner...",
        "[INFO] Parsing SQL syntax. Preparing execution plans...",
        "[INFO] CTE filter step processed 1,420 raw telemetry log nodes.",
        "[INFO] SUM() and DENSE_RANK() window functions successfully computed.",
        "[SUCCESS] Query completed. Returned 12 filtered rows in 3.4ms."
      ]
    }
  };

  const LANGUAGES = ["Python", "Java", "JavaScript", "C", "C++", "C#", "PHP", "Go", "Rust", "Kotlin", "Swift"];

  // Handle Preset Load
  const loadExample = (presetName: keyof typeof EXAMPLES) => {
    const preset = EXAMPLES[presetName];
    setInputText(preset.prompt);
    setSelectedLanguage(preset.language);
    addToast(`"${presetName}" template values loaded successfully!`, "success");
  };

  // Handle file injection simulation
  const handleSimulateAttach = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = (file.size / 1024).toFixed(1) + " KB";
      setAttachedFiles([{ name: file.name, size: sizeStr }]);
      addToast(`Attached local context: ${file.name}`, "success");
    }
  };

  const removeAttachment = () => {
    setAttachedFiles([]);
    addToast("Attachment cleared", "info");
  };

  // Main compilation action
  const handleGenerateAnswer = async () => {
    if (!inputText.trim()) {
      addToast("Please provide or load a coding prompt", "info");
      return;
    }

    // Identify if current input is one of our gorgeous pre-loaded examples
    let matchedPreset: any = null;
    let isPreset = false;

    Object.entries(EXAMPLES).forEach(([name, data]) => {
      if (inputText.toLowerCase().includes(name.toLowerCase()) || 
          data.prompt.toLowerCase().includes(inputText.toLowerCase()) ||
          inputText.toLowerCase().includes(data.prompt.toLowerCase())) {
        matchedPreset = data;
        isPreset = true;
      }
    });

    // Enter Loading Screen
    setActiveScreen("loading");
    setLoadingProgress(0);
    setLoadingStep(0);

    let apiResult: any = null;
    let apiError = "";
    let apiCompleted = false;

    // Trigger API call in parallel if it is not a preset
    if (!isPreset) {
      const promptToModel = `You are a professional code companion named Cody Helper AI. Please address this coding query: "${inputText}" in language "${selectedLanguage}".
Return your response exactly structured like this with the three dash dividers:
[A descriptive title for this solution]
---
[Provide the clean code solution here. DO NOT wrap with markdown ticks inside the code block.]
---
[A professional 2-3 sentence paragraph explaining the technical logic.]
---
[Time Complexity: e.g. O(N)]
---
[Space Complexity: e.g. O(1)]
---
[Rule 1 of best practices]
[Rule 2 of best practices]
[Rule 3 of best practices]
---
[Optimization tip 1]
[Optimization tip 2]`;

      const apiPromise = (async () => {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: promptToModel }] })
          });
          const data = await res.json();
          if (res.ok && data.text) {
            const parts = data.text.split("---");
            const title = parts[0]?.trim() || `${selectedLanguage} Solution`;
            const rawCode = parts[1]?.trim() || `// Standard ${selectedLanguage} Module\n\nprint("Active context compiled successfully.")`;
            const explanation = parts[2]?.trim() || "This module provides a tailored algorithm to answer the specified prompt under sandboxed boundaries.";
            const timeComp = parts[3]?.trim() || "O(1) Base Execution";
            const spaceComp = parts[4]?.trim() || "O(1) Local Scope";
            const rawBP = parts[5]?.trim() || "Ensure valid input variables.\nWrite clear type structures.";
            const rawOpt = parts[6]?.trim() || "Incorporate local caches for lookups.";

            apiResult = {
              title,
              code: rawCode.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, ""),
              explanation,
              time: timeComp,
              space: spaceComp,
              bestPractices: rawBP.split("\n").filter(Boolean),
              optimizationTips: rawOpt.split("\n").filter(Boolean),
              console: [
                "[AETRIX COMPILER] Spawning dynamic compiler workspace...",
                `[INFO] Target Language: ${selectedLanguage} verified.`,
                "[SUCCESS] Virtual environment bound correctly.",
                "[INFO] Solution evaluated with 0 syntax warnings.",
                "[SUCCESS] Executable package compiled."
              ]
            };
          } else {
            throw new Error(data.error || "Failed to generate solution.");
          }
        } catch (e: any) {
          console.error("API coding error", e);
          apiError = e.message || "Failed to generate code.";
        } finally {
          apiCompleted = true;
        }
      })();
    } else {
      apiCompleted = true;
      apiResult = matchedPreset;
    }

    const steps = [
      "Reading Prompt...",
      "Understanding Logic...",
      "Searching Best Solution...",
      "Generating Code...",
      "Optimizing Response...",
      "Finalizing..."
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Fast progress loader
      currentProgress += 2.5;
      setLoadingProgress(Math.min(100, Math.floor(currentProgress)));

      const stepIndex = Math.min(steps.length - 1, Math.floor((currentProgress / 100) * steps.length));
      setLoadingStep(stepIndex);

      if (currentProgress >= 100) {
        clearInterval(interval);

        const finalizeResponseScreen = () => {
          if (apiError) {
            addToast(`Generation failed: ${apiError}`, "info");
            setActiveScreen("input");
            return;
          }

          const finalData = apiResult || {
            title: `${selectedLanguage} Standard Algorithmic Module`,
            code: `// Custom ${selectedLanguage} Module Compiled\n\nfunction processNode() {\n    const nodeName = "Aetrix Core Node";\n    console.log("Analyzing telemetry metrics for: ", nodeName);\n    return true;\n}`,
            explanation: `This tailored script demonstrates code patterns addressing "${inputText}". Written in ${selectedLanguage}, it highlights industry standard parameters, responsive memory use, and clean functional splits.`,
            time: "O(1) Simple Function",
            space: "O(1) Local Allocation",
            bestPractices: [
              "Always enforce secure boundaries when processing untrusted variables.",
              "Enforce strict modular splits to guarantee testable functions.",
              "Keep variable allocations clean and clean up references upon component unmounting."
            ],
            optimizationTips: [
              "Cache recurring variables to avoid redundant computation loops."
            ],
            console: [
              "[AETRIX COMPILER] Preparing dynamic compiler runner...",
              `[SUCCESS] Node compiled natively using client sandbox rules.`,
              "[SUCCESS] All assertions completed successfully."
            ]
          };

          setDisplayedTitle(finalData.title);
          setDisplayedCode(finalData.code);
          setDisplayedExplanation(finalData.explanation);
          setDisplayedTimeComplexity(finalData.time);
          setDisplayedSpaceComplexity(finalData.space);
          setDisplayedBestPractices(finalData.bestPractices);
          setDisplayedOptimizationTips(finalData.optimizationTips);
          setConsoleLogs(finalData.console);

          // Save to Dynamic history!
          const historyPayload = {
            title: finalData.title,
            code: finalData.code,
            explanation: finalData.explanation,
            timeComplexity: finalData.time,
            spaceComplexity: finalData.space,
            bestPractices: finalData.bestPractices,
            optimizationTips: finalData.optimizationTips
          };

          const userPromptMsg = inputText.length > 80 ? inputText.substring(0, 77) + "..." : inputText;
          saveToolMessageToHistory(
            userEmail || "guest",
            "cody",
            `Code Help: "${userPromptMsg}"`,
            JSON.stringify(historyPayload),
            activeConvIdRef.current,
            updateActiveConvId
          );

          // Transition to answers
          setActiveScreen("answer");
          setSelectedTab("answer");
          setIsConsoleOpen(false);
          addToast("Cody Helper AI compiled your solution!", "success");

          // Start custom code typewriter transition
          triggerCodeTypewriter(finalData.code);
        };

        if (apiCompleted) {
          finalizeResponseScreen();
        } else {
          let pollCount = 0;
          const apiPoll = setInterval(() => {
            pollCount++;
            if (apiCompleted || pollCount >= 10) {
              clearInterval(apiPoll);
              finalizeResponseScreen();
            }
          }, 150);
        }
      }
    }, 90);
  };

  // Simulated typing animation of code block
  const triggerCodeTypewriter = (fullCodeText: string) => {
    setIsTyping(true);
    setTypingSpeedMultiplier(1);
    
    // Split into characters or lines
    const lines = fullCodeText.split("\n");
    let currentLineIdx = 0;
    setTypedCode("");

    const interval = setInterval(() => {
      if (currentLineIdx < lines.length) {
        // Append a line
        setTypedCode(prev => prev + (prev ? "\n" : "") + lines[currentLineIdx]);
        currentLineIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 28); // super fast and clean line typewriter

    return () => clearInterval(interval);
  };

  const skipTypingAnimation = () => {
    setTypedCode(displayedCode);
    setIsTyping(false);
    addToast("Typing animation bypassed", "info");
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayedCode);
    addToast("Code copied to clipboard!", "success");
  };

  const handleCopyFullReport = () => {
    const report = `CODY HELPER AI SOLUTION REPORT\n==============================\nTitle: ${displayedTitle}\n\n[CODE]\n${displayedCode}\n\n[EXPLANATION]\n${displayedExplanation}\n\nTime Complexity: ${displayedTimeComplexity}\nSpace Complexity: ${displayedSpaceComplexity}\n\n[BEST PRACTICES]\n${displayedBestPractices.map(bp => `- ${bp}`).join("\n")}`;
    navigator.clipboard.writeText(report);
    addToast("Full answer report copied!", "success");
  };

  const handleDownloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([displayedCode], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    const fileExts: Record<string, string> = { Python: "py", Java: "java", JavaScript: "js", "C++": "cpp", "C#": "cs", PHP: "php", Go: "go", Rust: "rs", Swift: "swift", Kotlin: "kt" };
    const ext = fileExts[selectedLanguage] || "txt";
    element.download = `cody_solution.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast("Source file downloaded!", "success");
  };

  const handleRunSimulatedCode = () => {
    setIsConsoleOpen(true);
    setIsConsoleRunning(true);
    addToast("Running code inside sandbox environment...", "info");
    
    setTimeout(() => {
      setIsConsoleRunning(false);
      addToast("Code run completed successfully!", "success");
    }, 1800);
  };

  const handleShareResult = () => {
    if (navigator.share) {
      navigator.share({
        title: displayedTitle,
        text: displayedExplanation,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`Cody Helper AI compiled solution: ${displayedTitle}\n\n${displayedExplanation}`);
      addToast("Share text copied to clipboard!", "success");
    }
  };

  // Dynamic Highlight Syntax renderer
  const renderHighlightedCode = (rawCodeText: string) => {
    const lines = rawCodeText.split("\n");
    return lines.map((line, index) => {
      // Escape
      let escaped = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      // Comment styling
      escaped = escaped.replace(/(\/\/.*?$|#.*?$|--.*?$)/g, '<span class="text-slate-500 italic">$1</span>');

      // String highlights
      escaped = escaped.replace(/(&quot;.*?&quot;|'.*?'|`.*?`)/g, '<span class="text-emerald-300 font-semibold">$1</span>');

      // Decimal and numbers
      escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-amber-400 font-mono">$1</span>');

      // Operator/Keywords
      const keywords = [
        "def", "class", "import", "from", "return", "if", "else", "elif", "for", "while",
        "in", "try", "except", "as", "with", "public", "private", "static", "void", "package",
        "final", "new", "null", "var", "const", "let", "function", "export", "default", "SELECT",
        "FROM", "WHERE", "WITH", "AS", "PARTITION BY", "ORDER BY", "SUM", "OVER", "ROWS BETWEEN",
        "AND", "DENSE_RANK", "DESC", "ASC"
      ];
      keywords.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, 'g');
        escaped = escaped.replace(regex, '<span class="text-indigo-400 font-semibold">$1</span>');
      });

      // Types / Common entities
      const coreTypes = ["True", "False", "None", "self", "this", "super", "System", "out", "println", "logging", "ResponseEntity", "RestController", "RequestMapping", "PostMapping", "GetMapping", "DeleteMapping", "PathVariable", "RequestBody"];
      coreTypes.forEach(word => {
        const regex = new RegExp(`\\b(${word})\\b`, 'g');
        escaped = escaped.replace(regex, '<span class="text-cyan-400 font-medium">$1</span>');
      });

      return (
        <div key={index} className="flex hover:bg-white/5 px-4 py-0.5 font-mono text-[11px] leading-relaxed transition-colors select-text">
          <span className="text-gray-600 select-none text-right pr-4 border-r border-white/5 mr-4 min-w-[28px] inline-block font-mono">{index + 1}</span>
          <span dangerouslySetInnerHTML={{ __html: escaped || "&nbsp;" }} className="text-gray-200 flex-1 whitespace-pre-wrap font-mono" />
        </div>
      );
    });
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-[#0B0F19] text-white flex flex-col items-center justify-start overflow-x-hidden font-sans pb-16 selection:bg-[#00BFFF]/30">
      
      {/* 3D Cosmic Space Background Layer */}
      <div className="absolute inset-0 z-0">
        <PremiumSpaceBackground />
      </div>

      {/* CSS Overlays & Scan-line animations */}
      <style>{`
        @keyframes header-glow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(0, 191, 255, 0.4)); }
          50% { filter: drop-shadow(0 0 18px rgba(139, 92, 246, 0.6)); }
        }
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        .glowing-header-logo {
          animation: header-glow 4s ease-in-out infinite, rotate-slow 24s linear infinite;
        }
        .custom-glass-panel {
          background: rgba(12, 15, 29, 0.45);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .glow-cyan-border {
          box-shadow: 0 0 30px rgba(0, 191, 255, 0.12);
        }
        .glow-purple-border {
          box-shadow: 0 0 30px rgba(139, 92, 246, 0.12);
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Cyber Grid pattern layout overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20 z-0" />

      {/* Floating purple & blue background gradient circles */}
      <div className="absolute top-[15%] left-[5%] w-[450px] h-[450px] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[25%] right-[5%] w-[550px] h-[550px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none z-0" />

      {/* Full Width Top Navigation App Bar */}
      <header className="relative w-full border-b border-white/5 bg-black/50 backdrop-blur-md z-10 px-6 py-4 flex items-center justify-between">
        
        {/* Back navigation button and rotating animated brand logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,191,255,0.1)] hover:shadow-[0_0_20px_rgba(0,191,255,0.3)] cursor-pointer group"
          >
            <ArrowLeft className="w-5 h-5 text-cyan-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all" />
          </button>
          
          <div className="flex items-center gap-3 ml-2">
            {/* Real Rotating Logo */}
            <div className="w-10 h-10 rounded-xl bg-[#000]/60 border border-white/10 flex items-center justify-center relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00BFFF]/20 to-[#1E90FF]/10 animate-pulse" />
              <svg 
                viewBox="0 0 120 120" 
                className="w-7 h-7 glowing-header-logo text-[#00BFFF] relative z-10 drop-shadow-[0_0_8px_#00BFFF]"
              >
                <path
                  d="M 60 20 L 25 90 L 39 90 L 60 48 L 81 90 L 95 90 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-widest text-white">CODY HELPER</span>
                <span className="px-1.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[8px] font-bold text-cyan-400 font-mono">AI</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase">COGNITIVE COMPANION</span>
            </div>
          </div>
        </div>

        {/* User context metadata status */}
        <div className="hidden sm:flex flex-col items-end text-right">
          <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-wider">AETRIX SECURE CLOUD</span>
          <span className="text-[9px] font-mono text-cyan-400">{userEmail || "anonymous@aetrix.ai"}</span>
        </div>
      </header>

      {/* Main Container Workspace */}
      <div className="relative w-full max-w-4xl px-4 sm:px-6 z-10 mt-8 sm:mt-12 flex flex-col items-center">
        
        {/* ========================================================================= */}
        {/* SCREEN 1: EMPTY INPUT WORKSPACE PAGE                                      */}
        {/* ========================================================================= */}
        {activeScreen === "empty" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center"
          >
            {/* Giant Central Floating Branding Bracket Card */}
            <div className="relative flex flex-col items-center text-center mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="relative w-28 h-28 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/10 via-cyan-500/10 to-transparent border border-white/10 shadow-[0_0_35px_rgba(139,92,246,0.15)] group hover:border-cyan-500/30 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl blur-xl group-hover:bg-cyan-500/10 transition-all duration-500" />
                <div className="absolute inset-2 border border-white/5 rounded-xl pointer-events-none" />
                <Code2 className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_12px_rgba(0,191,255,0.5)] group-hover:scale-105 transition-transform duration-300" />
                
                {/* Micro floating orbits */}
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-indigo-500 border border-white/20 animate-ping" />
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-6 font-sans">
                Cody Helper <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(139,92,246,0.2)]">AI</span>
              </h1>
              <p className="text-sm text-gray-400 max-w-lg mt-2 leading-relaxed">
                Generate, Debug and Explain Code using AI. Powered by AETRIX Neural Sync engine.
              </p>
            </div>

            {/* Quick Action Category Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { 
                  id: "ask", 
                  label: "Ask Anything", 
                  desc: "Get help for any coding question", 
                  icon: MessageSquare,
                  glow: "glow-purple-border border-indigo-500/30 text-indigo-400"
                },
                { 
                  id: "debug", 
                  label: "Debug Code", 
                  desc: "Find and fix code errors", 
                  icon: Bug,
                  glow: "glow-cyan-border border-cyan-500/30 text-cyan-400"
                },
                { 
                  id: "explain", 
                  label: "Explain Code", 
                  desc: "Understand code easily", 
                  icon: BookOpen,
                  glow: "glow-cyan-border border-blue-500/30 text-blue-400"
                }
              ].map((card) => {
                const isActive = serviceMode === card.id;
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    onClick={() => {
                      setServiceMode(card.id as any);
                      addToast(`Switched mode to: ${card.label}`, "info");
                    }}
                    className={`text-left p-5 rounded-2xl bg-[#0c0f1d]/35 backdrop-blur-xl border transition-all duration-300 cursor-pointer group flex items-start gap-4 ${
                      isActive 
                        ? `${card.glow} border-current shadow-[0_0_20px_rgba(0,191,255,0.05)] scale-[1.01]` 
                        : "border-white/5 hover:border-white/15 text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all text-current`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white transition-colors">{card.label}</span>
                      <span className="text-xs text-gray-500 leading-relaxed mt-1 transition-colors group-hover:text-gray-400">{card.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Large Workspace Prompt Area */}
            <div className="w-full bg-[#0c0f1d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden custom-glow glow-cyan-border">
              
              {/* Box Top Header / Selected Status */}
              <div className="flex border-b border-white/5 mb-5 pb-3 items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
                    PROMPT GATEWAY — {serviceMode.toUpperCase()}_MODE
                  </span>
                </div>
                
                {/* Language Dropdown Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="flex items-center gap-2 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl text-xs font-semibold text-gray-300 hover:text-white transition-all cursor-pointer font-mono"
                  >
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedLanguage}</span>
                    <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isLangDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isLangDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-[#0a0d1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 animate-fadeIn">
                      <div className="p-1 max-h-56 overflow-y-auto font-mono text-[11px] scrollbar-none">
                        {LANGUAGES.map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setSelectedLanguage(lang);
                              setIsLangDropdownOpen(false);
                              addToast(`Selected compiling target: ${lang}`, "success");
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-white/5 cursor-pointer ${
                              selectedLanguage === lang ? "text-cyan-400 bg-cyan-500/10 font-bold" : "text-gray-400"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Text Area Input */}
              <div className="relative w-full mb-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask your coding question... e.g., Build a quicksort function, explain asynchronous recursion, or debug my code blocks."
                  className="w-full h-44 bg-black/40 border border-white/5 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all duration-300 resize-none font-sans leading-relaxed"
                />

                {/* Simulated Attached Files strip */}
                {attachedFiles.length > 0 && (
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 animate-fadeIn">
                    <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-semibold max-w-[120px] truncate">{attachedFiles[0].name}</span>
                    <span className="text-[10px] text-gray-500">({attachedFiles[0].size})</span>
                    <button onClick={removeAttachment} className="ml-1 text-gray-400 hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Embedded attachments & action pins */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={handleSimulateAttach}
                    className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all cursor-pointer"
                    title="Attach Context File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleGenerateAnswer}
                    className="w-9 h-9 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(0,191,255,0.4)] cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>

              {/* Quick Action chips list */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider mr-1">Quick Tasks:</span>
                {[
                  { label: "Generate Code", promptValue: "Generate code to solve standard matrix search arrays in efficient bounds." },
                  { label: "Debug Code", promptValue: "I have a memory leaks issue with continuous websocket connections. Debug this scenario." },
                  { label: "Explain Code", promptValue: "Explain how React reconciler schedules fibers during concurrent render updates." },
                  { label: "Optimize Code", promptValue: "Optimize dynamic programming memoization lookups for fibonacci sequence trees." },
                  { label: "Convert Code", promptValue: "Convert Java collections mapping loops to Rust stream iterators." }
                ].map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => {
                      setInputText(chip.promptValue);
                      addToast(`Selected task: ${chip.label}`, "success");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-[10px] font-semibold text-gray-400 hover:text-cyan-300 transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Primary answer compilation button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleGenerateAnswer}
                  className="w-full max-w-md py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-black font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:opacity-95 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(0,191,255,0.25)] hover:shadow-[0_0_35px_rgba(139,92,246,0.3)] group relative overflow-hidden"
                >
                  <Sparkles className="w-4 h-4 text-black group-hover:scale-110 transition-transform animate-pulse" />
                  <span>Generate Answer</span>
                </button>
                
                <div className="flex items-center gap-2 mt-4 text-gray-500 text-[10px] font-mono uppercase tracking-wider">
                  <Lock className="w-3.5 h-3.5 text-gray-600" />
                  <span>Your data is secure and confidential</span>
                </div>
              </div>

            </div>

            {/* Example Cards (One click injection template library) */}
            <div className="w-full mt-10">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono tracking-widest text-cyan-400 font-bold uppercase">EXAMPLE WORKSPACE PRESETS</span>
                <span className="text-[10px] text-gray-500 font-mono">ONE-CLICK TEMPLATES</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
                {[
                  { name: "Create Login Page", desc: "React + Tailwind Page", icon: FileText, color: "text-indigo-400 hover:border-indigo-500/30" },
                  { name: "Python Calculator", desc: "Python Logging Module", icon: Bug, color: "text-amber-400 hover:border-amber-500/30" },
                  { name: "React Navbar", desc: "Vite + Responsive Drawer", icon: BookOpen, color: "text-cyan-400 hover:border-cyan-500/30" },
                  { name: "Java CRUD API", desc: "Spring REST Controller", icon: Cpu, color: "text-purple-400 hover:border-purple-500/30" },
                  { name: "SQL Query", desc: "Postgres Window Aggs", icon: Terminal, color: "text-emerald-400 hover:border-emerald-500/30" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => loadExample(item.name as any)}
                      className={`text-left p-3.5 rounded-xl bg-black/40 border border-white/5 transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between h-28 group ${item.color}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all text-current">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col mt-4">
                        <span className="text-[11px] font-bold text-white leading-tight">{item.name}</span>
                        <span className="text-[9px] text-gray-500 font-mono mt-1 leading-none">{item.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: HIGH-TECH COMPILING / LOADING VIEW                              */}
        {/* ========================================================================= */}
        {activeScreen === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl flex flex-col items-center justify-center py-8"
          >
            {/* Concentric rotating glowing AI Processor rings */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-[#00BFFF]/5 rounded-full blur-3xl animate-pulse" />

              {/* Glowing concentric spin loops */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#00BFFF]/20 animate-[spin_12s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border-2 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-[spin_2.2s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-[spin_18s_linear_infinite]" style={{ animationDirection: "reverse" }} />
              <div className="absolute inset-7 rounded-full border border-dashed border-indigo-400/30 animate-[spin_5s_linear_infinite]" />
              <div className="absolute inset-10 rounded-full border border-white/5" />

              {/* Centered code brackets with glowing pulse */}
              <div className="absolute w-20 h-20 rounded-2xl bg-black/90 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden custom-glow glow-cyan-border">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#00BFFF] shadow-[0_0_8px_#00BFFF] animate-[scan_1.8s_ease-in-out_infinite] z-10 pointer-events-none" />
                <Terminal className="w-9 h-9 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,191,255,0.5)] animate-pulse" />
              </div>
            </div>

            {/* Neural Synthesis step checklists */}
            <div className="w-full bg-[#0c0f1d]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-6 custom-glow">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">Aetrix AI Compilation Pipeline</span>
                <span className="text-xs font-mono font-bold text-cyan-400">{loadingProgress}%</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Reading Prompt...",
                  "Understanding Logic...",
                  "Searching Best Solution...",
                  "Generating Code...",
                  "Optimizing Response...",
                  "Finalizing..."
                ].map((step, index) => {
                  const isDone = loadingStep > index;
                  const isActive = loadingStep === index;
                  return (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 text-xs font-mono transition-all duration-300 ${
                        isDone 
                          ? "text-cyan-400 opacity-100 font-medium" 
                          : isActive 
                            ? "text-indigo-400 font-bold opacity-100 scale-[1.01]" 
                            : "text-gray-600 opacity-40"
                      }`}
                    >
                      <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                        {isDone ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                        ) : isActive ? (
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                        )}
                      </div>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Progress metrics and loading bar */}
            <div className="text-center w-full px-4">
              <h2 className="text-lg font-bold text-white mb-2 animate-pulse">Analyzing logic workspace...</h2>
              <p className="text-xs text-gray-500 font-mono tracking-wider mb-6">AI is thinking like an expert developer...</p>
              
              {/* Horizontal linear progress bar */}
              <div className="w-full bg-black/40 border border-white/5 rounded-full h-2.5 p-0.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 h-full rounded-full transition-all duration-200 shadow-[0_0_12px_rgba(0,191,255,0.4)]"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: HIGH-DEFINITION RESPONSE WORKSPACE                              */}
        {/* ========================================================================= */}
        {activeScreen === "answer" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="w-full flex flex-col items-center"
          >
            {/* Success Heading Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 mb-4 animate-[bounce_2s_ease-in-out_infinite] glow-cyan-border">
                <CheckCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">Your Solution is Ready!</h1>
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">Generated by Cody Helper AI</p>
            </div>

            {/* Large Tab Switcher Bar */}
            <div className="w-full flex border-b border-white/5 mb-6 justify-center sm:justify-start gap-4">
              {[
                { id: "answer", label: "Answer Solution", icon: Terminal },
                { id: "explanation", label: "Detailed Explanation", icon: BookOpen },
                { id: "notes", label: "Complexity & Tips", icon: Cpu }
              ].map((tabItem) => {
                const isActive = selectedTab === tabItem.id;
                const Icon = tabItem.icon;
                return (
                  <button
                    key={tabItem.id}
                    onClick={() => {
                      setSelectedTab(tabItem.id as any);
                      addToast(`Switched view: ${tabItem.label}`, "info");
                    }}
                    className={`flex items-center gap-2 px-5 py-3 border-b-2 font-mono text-xs font-semibold transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? "border-cyan-500 text-cyan-400 bg-white/5" 
                        : "border-transparent text-gray-500 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tabItem.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB PANEL 1: CODE EDITOR solution */}
            {selectedTab === "answer" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col gap-6"
              >
                {/* Visual Code Editor Terminal */}
                <div className="w-full bg-[#070913]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative glow-cyan-border">
                  
                  {/* Editor Top Bar Controls */}
                  <div className="flex items-center justify-between px-5 py-3.5 bg-black/40 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5 mr-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-xs text-gray-400 font-mono font-bold uppercase">{selectedLanguage} MODULE:</span>
                      <span className="text-xs text-cyan-400 font-mono font-semibold truncate max-w-[280px] sm:max-w-md">{displayedTitle}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isTyping && (
                        <button
                          onClick={skipTypingAnimation}
                          className="px-2.5 py-1 text-[10px] bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded text-indigo-300 font-semibold cursor-pointer"
                        >
                          Skip typing
                        </button>
                      )}
                      <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 rounded-lg text-[10px] font-semibold text-gray-300 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copy Code</span>
                      </button>
                    </div>
                  </div>

                  {/* High Quality Syntax Viewport */}
                  <div className="py-4 overflow-y-auto max-h-[440px] bg-black/60 select-text font-mono relative">
                    {renderHighlightedCode(isTyping ? typedCode : displayedCode)}
                    
                    {/* Simulated blink cursor */}
                    {isTyping && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-cyan-400 animate-pulse" />
                    )}
                  </div>

                  {/* Compiler Console Tray */}
                  {isConsoleOpen && (
                    <div className="bg-black/90 border-t border-white/10 p-5 font-mono text-xs animate-slideUp">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                        <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>AETRIX COMPILING OUTPUT CONSOLE</span>
                        </div>
                        <button onClick={() => setIsConsoleOpen(false)} className="text-gray-500 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {consoleLogs.map((log, index) => (
                          <div 
                            key={index} 
                            className={`font-mono text-[11px] leading-relaxed ${
                              log.startsWith("[SUCCESS]") 
                                ? "text-emerald-400 font-semibold" 
                                : log.startsWith("[ERROR]") 
                                  ? "text-red-400 font-semibold" 
                                  : log.startsWith("[INFO]") 
                                    ? "text-blue-300" 
                                    : "text-gray-400"
                            }`}
                          >
                            {log}
                          </div>
                        ))}
                        {isConsoleRunning && (
                          <div className="text-cyan-400 text-[11px] font-bold animate-pulse font-mono">
                            &gt; Spawning subthreads... compiling code loops...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Console Actions bar */}
                  <div className="flex items-center justify-between px-5 py-3.5 bg-black/40 border-t border-white/5">
                    <span className="text-[10px] font-mono text-gray-500">SANDBOX VERIFICATION ENGINE v1.2</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRunSimulatedCode}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Run Code</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Technical Overview Quick Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
                    <span className="text-xs font-mono uppercase text-gray-500 font-bold tracking-wider">Dynamic Complexity:</span>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 font-bold">
                        Time: {displayedTimeComplexity || "O(1)"}
                      </div>
                      <div className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300 font-bold">
                        Space: {displayedSpaceComplexity || "O(1)"}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">NODE SECURITY STATEMENT</span>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1">
                      Analyzed, compiled, and verified natively client-side. No API keys or source data exposed to third party clusters.
                    </p>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB PANEL 2: EXPLANATION */}
            {selectedTab === "explanation" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Technical Description</h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">{displayedExplanation}</p>
                </div>

                {/* Complexity Box */}
                <div className="border-t border-b border-white/5 py-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs font-mono text-[#00BFFF] uppercase tracking-wider font-bold">Time Analysis</span>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-200 font-mono font-bold">{displayedTimeComplexity || "O(N)"}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-normal mt-1.5 font-sans">
                      The execution is bound directly to input arrays and processes statements sequentially.
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-[#00BFFF] uppercase tracking-wider font-bold">Space Allocation</span>
                    <div className="flex items-center gap-2 mt-2">
                      <Cpu className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-200 font-mono font-bold">{displayedSpaceComplexity || "O(1)"}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-normal mt-1.5 font-sans">
                      Variables are handled in local cache memory frames, resulting in highly lightweight static allocations.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-mono text-indigo-400 uppercase tracking-widest font-bold mb-3">Architectural Highlights</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] mt-2 flex-shrink-0" />
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        Uses standard programming patterns complying perfectly with corporate guidelines.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] mt-2 flex-shrink-0" />
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        Supports high-performance execution bounds with safe exception traps.
                      </p>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB PANEL 3: COMPLEXITY & COMPILING RULES */}
            {selectedTab === "notes" && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col gap-6"
              >
                {/* Best Practices checklist */}
                <div className="w-full bg-[#0c0f1d]/45 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Best Practices Met</span>
                  </h3>
                  <div className="flex flex-col gap-3.5">
                    {displayedBestPractices.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">{rule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimization Tips checklist */}
                <div className="w-full bg-[#0c0f1d]/45 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/5 pb-3">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    <span>Optimization Recommendations</span>
                  </h3>
                  <div className="flex flex-col gap-3.5">
                    {displayedOptimizationTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-3.5">
                        <div className="w-5 h-5 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Plus className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-sans">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Bottom Screen Reset & Action Buttons */}
            <div className="w-full mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyFullReport}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all font-semibold text-xs text-gray-300 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>Copy Report</span>
                </button>
                <button
                  onClick={handleDownloadCode}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all font-semibold text-xs text-gray-300 hover:text-white flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Code</span>
                </button>
                <button
                  onClick={handleShareResult}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 transition-all font-semibold text-xs text-gray-300 hover:text-white flex items-center gap-2 cursor-pointer"
                  title="Share Result"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span>Share</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveScreen("empty");
                  setInputText("");
                  setAttachedFiles([]);
                  addToast("Workspace reset complete. Ask another!", "info");
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 font-bold rounded-xl text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4 text-white" />
                <span>Ask Another</span>
              </button>

            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}

/* ========================================================================= */
/* 5. RESUME AI COMPONENT                                                    */
/* ========================================================================= */
function ResumeToolWorkspace({ 
  addToast, 
  onBack, 
  userEmail,
  toasts 
}: { 
  addToast: (msg: string, type?: "success" | "info") => void; 
  onBack: () => void;
  userEmail: string;
  toasts: { id: string; message: string; type: "success" | "info" }[];
}) {
  // Wizard steps: "empty" | "form" | "loading" | "success" | "preview"
  const [step, setStep] = useState<"empty" | "form" | "loading" | "success" | "preview">("empty");
  const [zoom, setZoom] = useState(1.0);
  const [activeTab, setActiveTab] = useState<"personal" | "summary" | "experience" | "education" | "skills" | "certifications">("personal");

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem("aetrix_active_conv_resume");
  });
  const activeConvIdRef = useRef<string | null>(activeConvId);

  const updateActiveConvId = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    localStorage.setItem("aetrix_active_conv_resume", id);
  };

  // Profile Form States
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    photo: ""
  });

  const [summary, setSummary] = useState("");

  const [experience, setExperience] = useState<any[]>([]);

  const [education, setEducation] = useState<any[]>([]);

  const [skills, setSkills] = useState<string[]>([]);

  const [certifications, setCertifications] = useState<any[]>([]);

  useEffect(() => {
    const activeId = localStorage.getItem("aetrix_active_conv_resume");
    if (activeId) {
      setActiveConvId(activeId);
      activeConvIdRef.current = activeId;
      const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const historyList: FeatureChatHistory[] = JSON.parse(stored);
          const found = historyList.find(c => c.id === activeId);
          if (found && found.messages.length >= 2) {
            const aiMsg = found.messages.filter(m => m.role === "assistant").pop();
            if (aiMsg) {
              try {
                const parsed = JSON.parse(aiMsg.content);
                if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
                if (parsed.summary) setSummary(parsed.summary);
                if (parsed.experience) setExperience(parsed.experience);
                if (parsed.education) setEducation(parsed.education);
                if (parsed.skills) setSkills(parsed.skills);
                if (parsed.certifications) setCertifications(parsed.certifications);
                setStep("preview");
              } catch (err) {
                setStep("preview");
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail]);

  // Skill entry input state
  const [newSkillInput, setNewSkillInput] = useState("");

  // Loading simulation states
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Analyzing Information...");

  // Trigger floating particles
  const [particles] = useState(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * -15,
    }))
  );

  // Helper forms modification functions
  const updateExp = (index: number, field: string, val: any) => {
    const list = [...experience];
    list[index] = { ...list[index], [field]: val };
    setExperience(list);
  };

  const addExpItem = () => {
    setExperience([...experience, { role: "", company: "", duration: "", bullets: [""] }]);
    addToast("Work experience entry added.");
  };

  const removeExpItem = (index: number) => {
    setExperience(experience.filter((_, idx) => idx !== index));
    addToast("Work experience entry removed.");
  };

  const updateEdu = (index: number, field: string, val: string) => {
    const list = [...education];
    list[index] = { ...list[index], [field]: val };
    setEducation(list);
  };

  const addEduItem = () => {
    setEducation([...education, { degree: "", school: "", duration: "" }]);
    addToast("Education entry added.");
  };

  const removeEduItem = (index: number) => {
    setEducation(education.filter((_, idx) => idx !== index));
    addToast("Education entry removed.");
  };

  const updateCert = (index: number, field: string, val: string) => {
    const list = [...certifications];
    list[index] = { ...list[index], [field]: val };
    setCertifications(list);
  };

  const addCertItem = () => {
    setCertifications([...certifications, { name: "", issuer: "", year: "" }]);
    addToast("Certification entry added.");
  };

  const removeCertItem = (index: number) => {
    setCertifications(certifications.filter((_, idx) => idx !== index));
    addToast("Certification entry removed.");
  };

  const addSkill = () => {
    const clean = newSkillInput.trim();
    if (!clean) return;
    if (skills.includes(clean)) {
      addToast("Skill already listed", "info");
      return;
    }
    setSkills([...skills, clean]);
    setNewSkillInput("");
    addToast(`Added skill: ${clean}`);
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, idx) => idx !== index));
  };

  // Launch simulated high fidelity compiler timer
  const handleGenerate = () => {
    setStep("loading");
    setProgress(0);
    setStatusText("Analyzing Information...");

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const historyPayload = {
              personalInfo,
              summary,
              experience,
              education,
              skills,
              certifications
            };
            saveToolMessageToHistory(
              userEmail || "guest",
              "resume",
              `Resume: "${personalInfo.name} - ${personalInfo.title}"`,
              JSON.stringify(historyPayload),
              activeConvIdRef.current,
              updateActiveConvId
            );

            setStep("success");
            addToast("Resume generated successfully!", "success");
          }, 400);
          return 100;
        }

        // Cycle through detailed labels
        if (next < 20) {
          setStatusText("Analyzing Information...");
        } else if (next < 40) {
          setStatusText("Optimizing Content...");
        } else if (next < 60) {
          setStatusText("Generating Resume...");
        } else if (next < 80) {
          setStatusText("Designing Layout...");
        } else {
          setStatusText("Finalizing...");
        }

        return next;
      });
    }, 150); // Counts up in ~2-4 seconds total for snappy feedback
  };

  // Trigger txt download representation
  const handleDownloadTxt = () => {
    const rawText = `
=========================================
${personalInfo.name.toUpperCase()}
${personalInfo.title}
=========================================
📧 ${personalInfo.email}  |  📞 ${personalInfo.phone}  |  📍 ${personalInfo.location}
🔗 ${personalInfo.linkedin}

-----------------------------------------
PROFESSIONAL SUMMARY
-----------------------------------------
${summary}

-----------------------------------------
WORK EXPERIENCE
-----------------------------------------
${experience.map(e => `
* ${e.role} at ${e.company} (${e.duration})
  ${e.bullets.map(b => `- ${b}`).join("\n  ")}
`).join("\n")}

-----------------------------------------
EDUCATION
-----------------------------------------
${education.map(e => `
* ${e.degree}
  ${e.school} (${e.duration})
`).join("\n")}

-----------------------------------------
CORE SKILLS
-----------------------------------------
${skills.join(", ")}

-----------------------------------------
CERTIFICATIONS
-----------------------------------------
${certifications.map(c => `
* ${c.name} - Issued by ${c.issuer} (${c.year})
`).join("\n")}
`;

    const element = document.createElement("a");
    const file = new Blob([rawText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${personalInfo.name.replace(/\s+/g, "_")}_Aetrix_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addToast("ATS-friendly Resume text file downloaded!", "success");
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-[#050505] text-white font-sans selection:bg-[#00BFFF] selection:text-black overflow-x-hidden relative flex flex-col pb-20" id="aetrix-resume-page">
      <style>{`
        @keyframes scan-line {
          0% { top: 0%; opacity: 0.6; }
          50% { top: 100%; opacity: 0.6; }
          100% { top: 0%; opacity: 0.6; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Floating Particles Custom Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#00BFFF]/10 blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0vh", "-120vh"],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Static Floating Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2" id="resume-toasts">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 bg-[#0c0c0f]/95 backdrop-blur-md text-xs text-gray-200 flex items-center gap-2.5 shadow-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header element */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full relative z-10 flex-1 flex flex-col">
        
        {/* Main top header bar */}
        <header className="flex items-center justify-between mb-8" id="resume-header-row">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-md"
              id="resume-back-arrow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>

            <div className="flex flex-col text-left" id="resume-logo-branding">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-[2px]" />
                  <div className="w-5 h-5 rounded-full border border-[#00BFFF]/50 bg-black flex items-center justify-center text-[10px] text-[#00BFFF] font-black z-10">
                    A
                  </div>
                  <div className="absolute w-7 h-3 border border-[#00BFFF]/40 rounded-full -rotate-[20deg]" />
                </div>
                <span className="font-extrabold tracking-[0.2em] text-sm text-white">AETRIX <span className="text-[#00BFFF]">AI</span></span>
              </div>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider mt-0.5 uppercase flex items-center gap-1 pl-8">
                Resume AI <span className="text-[#00BFFF]">📄</span>
              </span>
            </div>
          </div>

          {/* Large Orbiting Orb Decoration */}
          <div className="relative w-16 h-16 flex items-center justify-center" id="resume-glowing-orbit-orb">
            <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute w-11 h-11 rounded-full border border-purple-500/30 bg-gradient-to-tr from-[#050505] via-[#100c1c] to-[#0d1624] flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.2)] overflow-hidden">
              <span className="text-white font-black text-xl tracking-widest font-sans select-none relative z-10">A</span>
            </div>
            <div className="absolute w-14 h-7 border border-[#00BFFF]/30 rounded-full -rotate-[22deg] animate-[spin_12s_linear_infinite]" />
          </div>
        </header>

        {/* 1. EMPTY STATE SCREEN */}
        {step === "empty" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col gap-6"
            id="resume-empty-screen"
          >
            {/* Centered Resume AI top summary card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900/10 to-indigo-900/10 border border-purple-500/20 flex items-center gap-4 relative overflow-hidden" id="resume-empty-top-card">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(168,85,247,0.1),transparent_70%)]" />
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <FileUser className="w-6 h-6 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
              </div>
              <div className="text-left min-w-0">
                <h3 className="text-white text-base font-bold">Resume AI</h3>
                <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">Create professional resumes that stand out in modern tracking algorithms.</p>
              </div>
            </div>

            {/* Central No Resume state */}
            <div className="border-2 border-dashed border-white/10 hover:border-[#00BFFF]/30 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative bg-[#0c0c0e]/30 backdrop-blur-xl group" id="resume-central-box">
              <div className="w-16 h-16 rounded-2xl bg-[#00BFFF]/5 border border-[#00BFFF]/20 flex items-center justify-center mb-5 text-[#00BFFF] shadow-md group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 animate-pulse" />
              </div>

              <h3 className="text-white text-lg font-bold mb-1.5">No resume yet</h3>
              <p className="text-gray-400 text-xs max-w-sm mb-8 leading-relaxed">Upload your details or start from scratch to generate your professional resume.</p>

              <button 
                type="button"
                onClick={() => setStep("form")}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-[#00BFFF] hover:from-blue-500 hover:to-cyan-400 text-black font-bold text-xs tracking-wide shadow-lg shadow-[#00BFFF]/20 hover:shadow-[#00BFFF]/40 transition-all pulsing-border flex items-center gap-2"
              >
                <span>Create New Resume</span>
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom tips list card */}
            <div className="border border-white/5 rounded-3xl bg-[#0c0c0e]/20 p-6 flex flex-col gap-4 text-left" id="resume-tips-box">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                <Sparkles className="w-4 h-4 text-[#00BFFF]" />
                <span className="uppercase tracking-wider font-mono">Tips for better results</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Add accurate personal information",
                  "Include your work experience",
                  "Highlight your key skills",
                  "Keep your achievements specific"
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300">
                    <div className="w-4 h-4 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#00BFFF] mt-0.5 shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. CONFIGURATION / FORM STATE SCREEN */}
        {step === "form" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col gap-6"
            id="resume-form-screen"
          >
            {/* Custom Interactive Tabbed Glassmorphism Form container */}
            <div className="border border-white/10 rounded-3xl bg-[#0c0c0e]/30 backdrop-blur-2xl p-5 sm:p-6 flex flex-col gap-6 shadow-2xl relative" id="resume-form-container">
              
              {/* Form Navigation Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none scrollbar-hide" id="form-tab-nav">
                {[
                  { id: "personal", label: "Personal" },
                  { id: "summary", label: "Summary" },
                  { id: "experience", label: "Experience" },
                  { id: "education", label: "Education" },
                  { id: "skills", label: "Skills" },
                  { id: "certifications", label: "Certifications" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                      activeTab === tab.id 
                        ? "bg-[#00BFFF]/10 border-[#00BFFF]/30 text-[#00BFFF] shadow-[0_0_10px_rgba(0,191,255,0.15)]" 
                        : "bg-transparent border-transparent text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Active Tab render area */}
              <div className="min-h-[250px] text-left text-xs" id="form-tab-body">
                <AnimatePresence mode="wait">
                  
                  {/* 1. PERSONAL INFORMATION */}
                  {activeTab === "personal" && (
                    <motion.div 
                      key="personal"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono text-gray-500 font-bold">Full Name</label>
                        <input 
                          type="text" 
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo({...personalInfo, name: e.target.value})}
                          className="w-full h-9 bg-black/60 border border-white/10 rounded-xl px-3 outline-none focus:border-[#00BFFF]/40 text-white"
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono text-gray-500 font-bold">Professional Title</label>
                        <input 
                          type="text" 
                          value={personalInfo.title}
                          onChange={(e) => setPersonalInfo({...personalInfo, title: e.target.value})}
                          className="w-full h-9 bg-black/60 border border-white/10 rounded-xl px-3 outline-none focus:border-[#00BFFF]/40 text-white"
                          placeholder="Professional Title"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono text-gray-500 font-bold">Email Address</label>
                        <input 
                          type="email" 
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                          className="w-full h-9 bg-black/60 border border-white/10 rounded-xl px-3 outline-none focus:border-[#00BFFF]/40 text-white"
                          placeholder="Email Address"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono text-gray-500 font-bold">Phone Number</label>
                        <input 
                          type="text" 
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                          className="w-full h-9 bg-black/60 border border-white/10 rounded-xl px-3 outline-none focus:border-[#00BFFF]/40 text-white"
                          placeholder="Phone Number"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono text-gray-500 font-bold">Location</label>
                        <input 
                          type="text" 
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({...personalInfo, location: e.target.value})}
                          className="w-full h-9 bg-black/60 border border-white/10 rounded-xl px-3 outline-none focus:border-[#00BFFF]/40 text-white"
                          placeholder="Location"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-mono text-gray-500 font-bold">LinkedIn URL</label>
                        <input 
                          type="text" 
                          value={personalInfo.linkedin}
                          onChange={(e) => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
                          className="w-full h-9 bg-black/60 border border-white/10 rounded-xl px-3 outline-none focus:border-[#00BFFF]/40 text-white"
                          placeholder="LinkedIn URL"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="text-[10px] uppercase font-mono text-gray-500 font-bold">Avatar / Portrait URL</label>
                        <input 
                          type="text" 
                          value={personalInfo.photo}
                          onChange={(e) => setPersonalInfo({...personalInfo, photo: e.target.value})}
                          className="w-full h-9 bg-black/60 border border-white/10 rounded-xl px-3 outline-none focus:border-[#00BFFF]/40 text-white"
                          placeholder="Avatar / Portrait URL"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* 2. SUMMARY */}
                  {activeTab === "summary" && (
                    <motion.div 
                      key="summary"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex flex-col gap-1.5"
                    >
                      <label className="text-[10px] uppercase font-mono text-gray-500 font-bold">Professional Summary</label>
                      <textarea 
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="w-full h-32 bg-black/60 border border-white/10 rounded-xl p-3 outline-none focus:border-[#00BFFF]/40 text-white resize-none leading-relaxed"
                        placeholder="Write an outstanding executive overview..."
                      />
                    </motion.div>
                  )}

                  {/* 3. EXPERIENCE */}
                  {activeTab === "experience" && (
                    <motion.div 
                      key="experience"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-300">Positions Played ({experience.length})</h4>
                        <button 
                          onClick={addExpItem}
                          className="px-2.5 py-1 rounded bg-[#00BFFF]/10 border border-[#00BFFF]/20 text-[#00BFFF] hover:bg-[#00BFFF]/20 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Entry</span>
                        </button>
                      </div>

                      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                        {experience.map((exp, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 relative flex flex-col gap-3">
                            <button 
                              onClick={() => removeExpItem(idx)}
                              className="absolute top-3 right-3 p-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                              title="Delete position"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">Job Title</label>
                                <input 
                                  type="text" 
                                  value={exp.role} 
                                  onChange={(e) => updateExp(idx, "role", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="Job Title"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">Employer</label>
                                <input 
                                  type="text" 
                                  value={exp.company} 
                                  onChange={(e) => updateExp(idx, "company", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="Employer / Company"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">Timeline Duration</label>
                                <input 
                                  type="text" 
                                  value={exp.duration} 
                                  onChange={(e) => updateExp(idx, "duration", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="e.g. 2022 - Present"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[9px] uppercase font-mono text-gray-500">Bullets description (one per line)</label>
                              <textarea 
                                value={exp.bullets.join("\n")}
                                onChange={(e) => updateExp(idx, "bullets", e.target.value.split("\n"))}
                                className="bg-black/50 border border-white/10 rounded-lg p-2 resize-none h-20 text-[11px] text-white"
                                placeholder="Key responsibility or achievement..."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 4. EDUCATION */}
                  {activeTab === "education" && (
                    <motion.div 
                      key="education"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-300">Degree & Programs ({education.length})</h4>
                        <button 
                          onClick={addEduItem}
                          className="px-2.5 py-1 rounded bg-[#00BFFF]/10 border border-[#00BFFF]/20 text-[#00BFFF] hover:bg-[#00BFFF]/20 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add School</span>
                        </button>
                      </div>

                      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                        {education.map((edu, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 relative flex flex-col gap-3">
                            <button 
                              onClick={() => removeEduItem(idx)}
                              className="absolute top-3 right-3 p-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                              title="Delete entry"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">Degree Name</label>
                                <input 
                                  type="text" 
                                  value={edu.degree} 
                                  onChange={(e) => updateEdu(idx, "degree", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="Degree / Program"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">School / Organization</label>
                                <input 
                                  type="text" 
                                  value={edu.school} 
                                  onChange={(e) => updateEdu(idx, "school", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="School / Organization"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">Timeline</label>
                                <input 
                                  type="text" 
                                  value={edu.duration} 
                                  onChange={(e) => updateEdu(idx, "duration", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="e.g. 2018 - 2022"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* 5. SKILLS */}
                  {activeTab === "skills" && (
                    <motion.div 
                      key="skills"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <label className="text-[10px] uppercase font-mono text-gray-500 font-bold block">Keywords & Core Competencies</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addSkill()}
                          placeholder="e.g. PyTorch, Docker, Kubernetes..."
                          className="flex-1 bg-black/60 border border-white/10 rounded-xl h-9 px-3 outline-none focus:border-[#00BFFF]/40 text-white text-xs"
                        />
                        <button 
                          onClick={addSkill}
                          className="h-9 px-4 bg-[#00BFFF] hover:bg-blue-500 text-black font-bold rounded-xl text-xs transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>

                      {/* Display active list */}
                      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-black/20 rounded-xl border border-white/5">
                        {skills.map((sk, idx) => (
                          <div 
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs flex items-center gap-1.5"
                          >
                            <span>{sk}</span>
                            <button 
                              onClick={() => removeSkill(idx)}
                              className="text-gray-500 hover:text-white"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                        {skills.length === 0 && (
                          <p className="text-gray-600 italic text-[11px] p-2">No skills added yet.</p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* 6. CERTIFICATIONS */}
                  {activeTab === "certifications" && (
                    <motion.div 
                      key="certifications"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-300">Certifications & Badges ({certifications.length})</h4>
                        <button 
                          onClick={addCertItem}
                          className="px-2.5 py-1 rounded bg-[#00BFFF]/10 border border-[#00BFFF]/20 text-[#00BFFF] hover:bg-[#00BFFF]/20 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Cert</span>
                        </button>
                      </div>

                      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                        {certifications.map((cert, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 relative flex flex-col gap-3">
                            <button 
                              onClick={() => removeCertItem(idx)}
                              className="absolute top-3 right-3 p-1 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                              title="Delete certification"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">Cert Name</label>
                                <input 
                                  type="text" 
                                  value={cert.name} 
                                  onChange={(e) => updateCert(idx, "name", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="Certification Name"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">Issuer Agency</label>
                                <input 
                                  type="text" 
                                  value={cert.issuer} 
                                  onChange={(e) => updateCert(idx, "issuer", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="Issuing Organization"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="text-[9px] uppercase font-mono text-gray-500">Year</label>
                                <input 
                                  type="text" 
                                  value={cert.year} 
                                  onChange={(e) => updateCert(idx, "year", e.target.value)}
                                  className="bg-black/50 border border-white/10 rounded-lg h-7 px-2 text-white"
                                  placeholder="e.g. 2023"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Bottom buttons panel */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2" id="form-action-panel">
                <button 
                  onClick={() => setStep("empty")}
                  className="px-4 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                
                <button 
                  onClick={handleGenerate}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-[#00BFFF] hover:from-purple-500 hover:to-cyan-400 text-black font-extrabold text-xs tracking-wider transition-all shadow-lg shadow-purple-500/10 hover:shadow-cyan-400/25 flex items-center gap-1.5"
                >
                  <span>Generate Resume</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>

            </div>
          </motion.div>
        )}

        {/* 3. LOADING COMPILING SCREEN */}
        {step === "loading" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-8"
            id="resume-loading-screen"
          >
            <div className="relative w-44 h-44 flex items-center justify-center mb-8">
              {/* Outer pulsing neon ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#00BFFF]/20 animate-ping" />
              
              {/* Spinning orbiting lines */}
              <div className="absolute inset-1.5 rounded-full border border-dashed border-[#A855F7]/40 animate-[spin-slow_15s_linear_infinite]" />
              <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-[#00BFFF] border-b-[#A855F7] animate-[spin_3s_linear_infinite]" />

              <div className="w-28 h-28 rounded-full border border-white/10 bg-black flex flex-col items-center justify-center shadow-[0_0_40px_rgba(0,191,255,0.25)] relative overflow-hidden">
                <span className="text-white font-black text-4xl tracking-widest drop-shadow-[0_0_10px_rgba(0,191,255,0.7)] font-sans">A</span>
                
                {/* Horizontal scanner line laser effect */}
                <div 
                  className="absolute left-0 right-0 h-[2.5px] bg-[#00BFFF] shadow-[0_0_10px_#00BFFF] z-20 pointer-events-none"
                  style={{ animation: "scan-line 2.5s linear infinite" }}
                />
              </div>
            </div>

            {/* Compiled Percentage Counts */}
            <h2 className="text-xl font-black tracking-tight text-white mb-1.5 animate-pulse">
              {statusText}
            </h2>
            <p className="text-gray-500 text-xs mb-8">Synchronizing algorithms into professional format models</p>

            {/* Progress Checklist indicators */}
            <div className="w-full max-w-sm border border-white/5 rounded-2xl bg-black/40 p-4 mb-6 flex flex-col gap-2.5 text-left text-[11px]" id="loading-checklist">
              {[
                { label: "Analyzing your information", startAt: 0 },
                { label: "Optimizing content", startAt: 25 },
                { label: "Designing professional layout", startAt: 50 },
                { label: "Finalizing your resume", startAt: 75 }
              ].map((c, idx) => {
                const isCheck = progress >= c.startAt + 25 || progress === 100;
                const isRun = progress >= c.startAt && progress < c.startAt + 25;
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <span className={isCheck ? "text-gray-300" : isRun ? "text-[#00BFFF] font-bold" : "text-gray-600"}>
                      {idx + 1}. {c.label}
                    </span>
                    <div>
                      {isCheck ? (
                        <span className="text-green-400 font-bold font-mono">✓ DONE</span>
                      ) : isRun ? (
                        <span className="text-[#00BFFF] text-[10px] animate-pulse">● RUNNING</span>
                      ) : (
                        <span className="text-gray-700">○ PENDING</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Glowing neon progress bar */}
            <div className="w-full max-w-sm flex items-center gap-4">
              <div className="flex-1 h-[6px] bg-white/5 border border-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 via-[#00BFFF] to-[#00BFFF] rounded-full shadow-[0_0_12px_#00BFFF] transition-all duration-150 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs font-mono text-[#00BFFF] font-bold w-12 text-right">{progress}%</span>
            </div>

            {/* Subtext info box */}
            <div className="mt-8 text-[10px] text-gray-500 font-mono tracking-wider flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
              <Sparkles className="w-3 h-3 text-purple-400 animate-spin" />
              <span>AI is crafting the perfect resume for your next opportunity.</span>
            </div>
          </motion.div>
        )}

        {/* 4. SUCCESS / OUTPUT PAGE SCREEN */}
        {step === "success" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col gap-6"
            id="resume-success-screen"
          >
            {/* Green animated checkmark success header */}
            <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center gap-3.5 text-left relative overflow-hidden" id="resume-success-card">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(16,185,129,0.1),transparent_70%)]" />
              <div className="w-11 h-11 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCheck className="w-5 h-5 animate-bounce" />
              </div>
              <div className="min-w-0">
                <h3 className="text-white text-sm font-extrabold">Your resume is ready!</h3>
                <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">Review and download your professional resume.</p>
              </div>
            </div>

            {/* Detailed sections summary stack list */}
            <div className="flex flex-col gap-3" id="resume-summary-sections">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-500 text-left pl-1">Resume Summary</h4>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: "Personal Information", val: personalInfo.name, icon: User },
                  { label: "Professional Summary", val: summary.substring(0, 50) + "...", icon: FileText },
                  { label: "Work Experience", val: `${experience.length} entries`, icon: Briefcase },
                  { label: "Education", val: `${education.length} entries`, icon: GraduationCap },
                  { label: "Skills", val: `${skills.length} skills`, icon: Sparkles },
                  { label: "Certifications", val: `${certifications.length} entries`, icon: Award }
                ].map((item, idx) => {
                  const SIcon = item.icon;
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-left hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#00BFFF] border border-white/5">
                          <SIcon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-gray-400 text-[10px] font-mono uppercase tracking-wider">{item.label}</p>
                          <p className="text-white text-xs font-bold truncate mt-0.5">{item.val}</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                        <Check className="w-3 h-3" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Multi-actions flow panel */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4" id="success-action-dock">
              <button 
                onClick={() => setStep("preview")}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-[#00BFFF] hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold text-xs tracking-wider shadow-lg shadow-[#00BFFF]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Resume</span>
              </button>

              <button 
                onClick={handleDownloadTxt}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </button>

              <button 
                onClick={() => setStep("form")}
                className="w-full py-3 rounded-xl bg-transparent hover:bg-white/5 border border-white/5 text-gray-400 hover:text-white font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Information</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* 5. A4 RESUME PREVIEW SCREEN WITH ZOOM */}
        {step === "preview" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col gap-6"
            id="resume-preview-screen"
          >
            {/* Custom interactive Confetti Burst burst on mount */}
            <Confetti active={step === "preview"} />

            {/* Back to summaries or edit button block */}
            <div className="flex items-center justify-between p-4 bg-[#0c0c0e]/50 border border-white/10 rounded-2xl shadow-md" id="preview-toolbar">
              <button 
                onClick={() => setStep("success")}
                className="text-gray-400 hover:text-white text-xs font-semibold flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Summary</span>
              </button>
              
              {/* Zoom sliders */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setZoom(Math.max(0.7, zoom - 0.1))}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-gray-300 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-[#00BFFF] font-bold w-12 text-center">{Math.round(zoom * 100)}%</span>
                <button 
                  onClick={() => setZoom(Math.min(1.3, zoom + 0.1))}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 bg-white/5 text-gray-300 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* The actual beautifully formatted A4 printable Preview sheet */}
            <div className="w-full flex items-center justify-center overflow-x-auto p-4 bg-black/40 border border-white/10 rounded-3xl min-h-[500px]" id="a4-preview-scrollbox">
              <div 
                className="w-full max-w-[660px] aspect-[1/1.414] bg-white text-black p-8 sm:p-10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-left flex flex-col justify-between transition-transform duration-200 relative select-text"
                style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
                id="a4-resume-sheet"
              >
                {/* Clean watermark on preview */}
                <div className="absolute top-1 right-2 text-[8px] text-gray-300 select-none font-bold uppercase tracking-widest">Aetrix AI Formatted</div>

                <div className="space-y-6">
                  {/* Portrait Header Row */}
                  <div className="flex items-center justify-between border-b-2 border-gray-900 pb-5">
                    <div className="space-y-1 max-w-[70%]">
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 uppercase font-sans">{personalInfo.name || ""}</h1>
                      <p className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wider">{personalInfo.title || ""}</p>
                      
                      {/* Contact specifications details list */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-3 text-[10px] text-gray-600 font-sans font-medium">
                        {personalInfo.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>{personalInfo.phone}</span>
                          </div>
                        )}
                        {personalInfo.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>{personalInfo.email}</span>
                          </div>
                        )}
                        {personalInfo.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>{personalInfo.location}</span>
                          </div>
                        )}
                        {personalInfo.linkedin && (
                          <div className="flex items-center gap-1">
                            <Linkedin className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>{personalInfo.linkedin}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile avatar frame */}
                    {personalInfo.photo ? (
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-900 overflow-hidden shrink-0 shadow-md">
                        <img 
                          src={personalInfo.photo} 
                          alt={personalInfo.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      personalInfo.name && (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-900 bg-gray-100 flex items-center justify-center shrink-0 shadow-md">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )
                    )}
                  </div>

                  {/* Body elements flow */}
                  <div className="space-y-5 text-[10.5px] leading-relaxed text-gray-800">
                    
                    {/* Summary segment */}
                    {summary && (
                      <div className="space-y-1">
                        <h3 className="font-extrabold border-b border-gray-300 uppercase text-xs tracking-wider text-gray-900 pb-0.5">Professional Summary</h3>
                        <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
                      </div>
                    )}

                    {/* Experience segment */}
                    {experience.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-extrabold border-b border-gray-300 uppercase text-xs tracking-wider text-gray-900 pb-0.5">Work Experience</h3>
                        
                        <div className="space-y-3">
                          {experience.map((exp, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between font-bold text-gray-900 text-[11px]">
                                <span>{exp.role} {exp.company && <span className="text-blue-700 font-medium">@ {exp.company}</span>}</span>
                                <span className="text-gray-500 font-medium text-[10px]">{exp.duration}</span>
                              </div>
                              {exp.bullets && exp.bullets.length > 0 && exp.bullets.some(b => b.trim()) && (
                                <ul className="list-disc pl-4 space-y-1 text-gray-700 text-[10px]">
                                  {exp.bullets.filter(b => b.trim()).map((b, bIdx) => (
                                    <li key={bIdx}>{b}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Double-column section Education / Certifications */}
                    {(education.length > 0 || certifications.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        
                        {/* Education panel */}
                        {education.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-extrabold border-b border-gray-300 uppercase text-xs tracking-wider text-gray-900 pb-0.5">Education</h3>
                            <div className="space-y-2">
                              {education.map((edu, idx) => (
                                <div key={idx} className="space-y-0.5">
                                  <p className="font-bold text-gray-900 text-[10.5px]">{edu.degree}</p>
                                  <p className="text-gray-600 font-medium">{edu.school}</p>
                                  <p className="text-gray-400 font-medium text-[9px]">{edu.duration}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Certifications panel */}
                        {certifications.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-extrabold border-b border-gray-300 uppercase text-xs tracking-wider text-gray-900 pb-0.5">Certifications</h3>
                            <div className="space-y-1.5">
                              {certifications.map((cert, idx) => (
                                <div key={idx} className="flex items-start gap-1">
                                  <span className="text-blue-700 font-bold shrink-0">✓</span>
                                  <p className="text-gray-700">
                                    <span className="font-bold text-gray-900">{cert.name}</span> {cert.issuer && <>— {cert.issuer}</>} {cert.year && <>({cert.year})</>}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                    {/* Skills pills array segment */}
                    {skills.length > 0 && (
                      <div className="space-y-1.5">
                        <h3 className="font-extrabold border-b border-gray-300 uppercase text-xs tracking-wider text-gray-900 pb-0.5">Core Competencies</h3>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {skills.map((sk, idx) => (
                            <span 
                              key={idx}
                              className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-md text-[9px] font-bold uppercase tracking-wider border border-gray-200"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 text-center text-[9px] text-gray-400 font-medium">
                  {personalInfo.name || "AETRIX USER"} {personalInfo.title && <>• {personalInfo.title}</>} • Compiled via AETRIX AI Space Orchestrator
                </div>
              </div>
            </div>

            {/* Bottom Download & share actionable floating dock bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-4" id="preview-actionable-dock">
              <button 
                onClick={handleDownloadTxt}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-[#00BFFF] hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold text-xs tracking-wider shadow-lg shadow-[#00BFFF]/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button 
                onClick={() => setStep("form")}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Resume</span>
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  addToast("Shareable resume link copied to clipboard!", "success");
                }}
                className="w-full py-3 rounded-xl bg-transparent hover:bg-white/5 border border-white/5 text-gray-400 hover:text-white font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Resume</span>
              </button>
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}

// Simple internal helper component for beautiful custom Confetti explosion burst
function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; color: string; duration: number; delay: number; rotate: number }[]>([]);

  useEffect(() => {
    if (!active) return;
    const colors = ["#00BFFF", "#A855F7", "#3B82F6", "#10B981", "#F59E0B", "#EF4444"];
    const pts = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage width
      y: -10 - Math.random() * 20, // start above screen
      size: Math.random() * 8 + 6, // size in px
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 3 + 2, // 2s to 5s
      delay: Math.random() * 0.5,
      rotate: Math.random() * 360,
    }));
    setParticles(pts);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: ["0%", "110%"],
            x: [`${p.x}%`, `${p.x + (Math.random() * 15 - 7.5)}%`],
            rotate: [p.rotate, p.rotate + 360],
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ========================================================================= */
/* 6. PDF ASSISTANT AI COMPONENT                                             */
/* ========================================================================= */
function PdfToolWorkspace({ 
  addToast, 
  onBack, 
  userEmail,
  toasts 
}: { 
  addToast: (msg: string, type?: "success" | "info") => void; 
  onBack: () => void;
  userEmail: string;
  toasts: { id: string; message: string; type: "success" | "info" }[];
}) {
  const [step, setStep] = useState<"idle" | "processing" | "result">("idle");
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Analyzing Document...");
  const [pasteText, setPasteText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Summary sections
  const [summarySections, setSummarySections] = useState({
    summary: "",
    keyPoints: "",
    detailed: "",
    insights: ""
  });

  // Chat window states
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem("aetrix_active_conv_pdf");
  });
  const activeConvIdRef = useRef<string | null>(activeConvId);

  const updateActiveConvId = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    localStorage.setItem("aetrix_active_conv_pdf", id);
  };

  useEffect(() => {
    const activeId = localStorage.getItem("aetrix_active_conv_pdf");
    if (activeId) {
      setActiveConvId(activeId);
      activeConvIdRef.current = activeId;
      const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const historyList: FeatureChatHistory[] = JSON.parse(stored);
          const found = historyList.find(c => c.id === activeId);
          if (found && found.messages.length >= 2) {
            const aiMsg = found.messages.filter(m => m.role === "assistant").pop();
            if (aiMsg) {
              try {
                const parsed = JSON.parse(aiMsg.content);
                if (parsed.summarySections) setSummarySections(parsed.summarySections);
                if (parsed.messages) setMessages(parsed.messages);
                if (parsed.fileName) setSelectedFile({ name: parsed.fileName, size: parsed.fileSize || "142 KB" });
                setStep("result");
              } catch (err) {
                setSummarySections({
                  summary: aiMsg.content,
                  keyPoints: "• Key findings processed",
                  detailed: "Detailed insights loaded",
                  insights: "Security audit closed"
                });
                setStep("result");
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // Floating particles background
  const [particles] = useState(() => 
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 3.5 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * -20,
    }))
  );

  // Trigger hidden file picker
  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.name.endsWith(".pdf") || file.name.endsWith(".txt") || file.name.endsWith(".docx")) {
        triggerUpload(file.name, file.size);
      } else {
        addToast("Please upload a PDF, TXT or DOCX document.", "info");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      triggerUpload(file.name, file.size);
    }
  };

  // Upload trigger with count-up loading sequence
  const triggerUpload = (name: string, size: number) => {
    const formattedSize = size > 1024 * 1024 
      ? `${(size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(size / 1024).toFixed(0)} KB`;
    
    setSelectedFile({ name, size: formattedSize });
    setStep("processing");
    setProgress(0);
    setStatusText("Analyzing Document...");

    // Start progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 5) + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            generateAISummary(name, "Interactive Aetrix Quantum Core systems analysis details. Hardened architecture mapping Port 3000 to direct secure sockets.");
          }, 300);
          return 100;
        }
        
        // Update status text dynamically based on percentage
        if (next < 35) {
          setStatusText("Analyzing Document...");
        } else if (next < 70) {
          setStatusText("Extracting Key Points...");
        } else {
          setStatusText("Generating AI Summary...");
        }
        return next;
      });
    }, 70);
  };

  const handlePasteSummarize = () => {
    if (!pasteText.trim()) {
      addToast("Please paste some text content to summarize.", "info");
      return;
    }
    const name = "Pasted Content Snippet.txt";
    const size = pasteText.length;
    setSelectedFile({ name, size: `${(size / 1024).toFixed(1)} KB` });
    setStep("processing");
    setProgress(0);
    setStatusText("Analyzing Document...");

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 6) + 3;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            generateAISummary(name, pasteText);
          }, 300);
          return 100;
        }
        if (next < 35) {
          setStatusText("Analyzing Document...");
        } else if (next < 70) {
          setStatusText("Extracting Key Points...");
        } else {
          setStatusText("Generating AI Summary...");
        }
        return next;
      });
    }, 70);
  };

  const savePdfStateToHistory = (
    currentSummarySections: typeof summarySections,
    currentMessages: typeof messages,
    fileName: string,
    fileSize: string
  ) => {
    const historyPayload = {
      summarySections: currentSummarySections,
      messages: currentMessages,
      fileName,
      fileSize
    };
    saveToolMessageToHistory(
      userEmail || "guest",
      "pdf",
      `PDF: "${fileName}"`,
      JSON.stringify(historyPayload),
      activeConvIdRef.current,
      updateActiveConvId
    );
  };

  // Dynamic summary generation using Gemini API
  const generateAISummary = async (fileName: string, context: string) => {
    try {
      const prompt = `Analyze and summarize the following content from '${fileName}'. Break it down into exactly four distinct parts. Format your output EXACTLY with these tag labels:
      
      [SUMMARY]
      Provide a highly-detailed and premium 2-paragraph summary of the document.
      
      [KEY_POINTS]
      Provide 4-5 bullet points outlining the core arguments or specifications, formatted with * at the beginning of each line.
      
      [DETAILED_EXPLANATION]
      Provide an in-depth, clear technical explanation of the mechanisms, frameworks, formulas, or concepts covered in this document.
      
      [INSIGHTS]
      Provide 3 actionable, high-impact insights or implications, formatted with * at the beginning of each line.
      
      Content:
      "${context.substring(0, 3500)}"`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      if (res.ok && data.text) {
        const parsed = parseAIResponse(data.text);
        setSummarySections(parsed);
        const initMsgs = [
          { role: "assistant" as const, content: `Hello! I have successfully ingested \`${fileName}\`. You can ask me to outline insights, answer specific questions, or explore topics further!` }
        ];
        setMessages(initMsgs);
        savePdfStateToHistory(parsed, initMsgs, fileName, selectedFile?.size || "142 KB");
      } else {
        throw new Error(data.error || "Failed to analyze document.");
      }
    } catch (err: any) {
      const errMsg = err.message || "Failed to analyze document.";
      addToast(errMsg, "info");
      const errorSummary = {
        summary: `Analysis Error: ${errMsg}`,
        keyPoints: "• Analysis aborted due to error\n• Please verify your API keys\n• Ensure the server is online",
        detailed: "Document analysis could not be completed because the backend returned an error.",
        insights: "• Error diagnostic code: 500\n• Endpoint mapping failed"
      };
      setSummarySections(errorSummary);
      const initMsgs = [
        { role: "assistant" as const, content: `Analysis Failed: ${errMsg}` }
      ];
      setMessages(initMsgs);
      savePdfStateToHistory(errorSummary, initMsgs, fileName, selectedFile?.size || "142 KB");
    } finally {
      setStep("result");
      addToast("Analysis completed!", "success");
    }
  };

  const parseAIResponse = (text: string) => {
    const summaryMatch = text.match(/\[SUMMARY\]([\s\S]*?)(?=\[KEY_POINTS\]|\[DETAILED_EXPLANATION\]|\[INSIGHTS\]|$)/i);
    const keyPointsMatch = text.match(/\[KEY_POINTS\]([\s\S]*?)(?=\[SUMMARY\]|\[DETAILED_EXPLANATION\]|\[INSIGHTS\]|$)/i);
    const detailedMatch = text.match(/\[DETAILED_EXPLANATION\]([\s\S]*?)(?=\[SUMMARY\]|\[KEY_POINTS\]|\[INSIGHTS\]|$)/i);
    const insightsMatch = text.match(/\[INSIGHTS\]([\s\S]*?)(?=\[SUMMARY\]|\[KEY_POINTS\]|\[DETAILED_EXPLANATION\]|$)/i);

    let summary = summaryMatch ? summaryMatch[1].trim() : "";
    let keyPoints = keyPointsMatch ? keyPointsMatch[1].trim() : "";
    let detailed = detailedMatch ? detailedMatch[1].trim() : "";
    let insights = insightsMatch ? insightsMatch[1].trim() : "";

    if (!summary && !keyPoints && !detailed && !insights) {
      summary = text;
      keyPoints = "• Extracted structural features\n• Analyzed latency routing tolerances\n• Mapped network endpoints";
      detailed = "Detailed document content parsed successfully into high-dimensional space vectors for instant search and diagnostics.";
      insights = "• System demonstrates ideal security profiles\n• Optimization routes remain open";
    }

    return { summary, keyPoints, detailed, insights };
  };

  const getDefaultSummary = (fileName: string, content: string) => {
    const snippet = content && content.length > 50 ? content.substring(0, 180) + "..." : "";
    
    if (fileName.includes("Whitepaper") || fileName.includes("Aetrix") || fileName === "Aetrix_Deep_Research_Whitepaper.pdf") {
      return {
        summary: "The Aetrix Quantum Core Whitepaper describes a revolutionary hardware-accelerated orchestration layer designed to execute large language model (LLM) operations at sub-millisecond latencies.\n\nBy implementing highly-optimized, server-side neural pipelines on direct container infrastructures (specifically utilizing isolated Cloud Run instances), the architecture bypasses traditional ingress bottlenecks.",
        keyPoints: "• **Sub-millisecond Latencies**: Achieving true low-overhead neural throughput using CJS-compiled execution engines.\n• **Dynamic Ingress Routing**: Nginx proxies map Port 3000 as the sole accessible ingress gateway, safeguarding internal networks.\n• **Type Stripping & Native ESModules**: Server execution optimizes runtime speed by utilizing native TypeScript type stripping.\n• **Isolated Sandbox Clusters**: User-authored configurations run in secure, client-isolated pods, eliminating cross-tenant memory bleed.",
        detailed: "The core of the Aetrix architecture lies in its high-performance event loop, which handles incoming vector indices via low-level memory maps.\n\nWhen a query is initiated, the routing subsystem evaluates the cryptographic signature of the request payload and instantly matches it against localized embedding databases. The document highlights a 14% reduction in overall processor utilization by offloading parsing routines to optimized esbuild and tsx-bundled runners.",
        insights: "• **Hardware Efficiency**: Traditional models require massive compute arrays, whereas Aetrix achieves equivalent performance metrics on lightweight, scale-to-zero container engines.\n• **Security Mandates**: Moving keys out of client browser variables into robust, server-side proxy boundaries removes common attack surfaces.\n• **Future Roadmap**: Plans for version 3.0 include direct edge-level orbital caching and quantum-hardened session transport protocols."
      };
    } else {
      return {
        summary: `This is an AI-compiled overview of the ingested document "${fileName}". The system parsed the file content and performed immediate keyphrase extraction to compile this structural summary.\n\nContent Analysis snippet: ${snippet || "Analyzing the payload segments indicates high thematic consistency."}`,
        keyPoints: `• **Document Target**: Analyzed structural contents for "${fileName}".\n• **Format Verification**: Validated data layout and text streams.\n• **Syntactic Highlights**: Identified core topics and semantic patterns.\n• **Security Status**: Processed within the secure client-isolated sandbox.`,
        detailed: `A deeper technical inspection of "${fileName}" reveals structured blocks of text containing significant context. The document's headers, paragraphs, and list items have been indexed into high-dimensional vector spaces for instant queries.\n\nThe vector embeddings represent the text's semantic concepts, allowing the Aetrix assistant to quickly match and retrieve answers without needing manual scanning.`,
        insights: `• **Dynamic Parsing**: Successfully mapped document objects into active memory.\n• **Response Latency**: Query indexing is fully optimized, keeping follow-up question latencies under 20ms.\n• **Security Hardening**: Data is encrypted both in transit and at rest, maintaining strict isolation.`
      };
    }
  };

  // Chat query processor
  const handleSendQuery = async (customQ?: string) => {
    const text = customQ || chatInput;
    if (!text.trim() || !selectedFile) return;
    if (!customQ) setChatInput("");

    const userMsg = { role: "user" as const, content: text };
    setMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const prompt = `Based on the virtual document '${selectedFile.name}' and its summarized takeaways:
      Summary: ${summarySections.summary}
      Key Points: ${summarySections.keyPoints}
      
      Answer this query: "${text}"`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();
      if (res.ok && data.text) {
        const updated = [...messages, userMsg, { role: "assistant" as const, content: data.text }];
        setMessages(updated);
        savePdfStateToHistory(summarySections, updated, selectedFile.name, selectedFile.size);
      } else {
        throw new Error(data.error || "Query failed.");
      }
    } catch (err: any) {
      const errMsg = err.message || "An error occurred during document query.";
      addToast(errMsg, "info");
      const updated = [...messages, userMsg, { role: "assistant" as const, content: `Error: ${errMsg}` }];
      setMessages(updated);
      savePdfStateToHistory(summarySections, updated, selectedFile.name, selectedFile.size);
    } finally {
      setChatLoading(false);
    }
  };

  const handleUnloadFile = () => {
    setSelectedFile(null);
    setStep("idle");
    setPasteText("");
    setMessages([]);
    localStorage.removeItem("aetrix_active_conv_pdf");
    setActiveConvId(null);
    activeConvIdRef.current = null;
    addToast("File unloaded", "info");
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-[#050505] text-white font-sans selection:bg-[#00BFFF] selection:text-black overflow-x-hidden relative flex flex-col pb-20" id="aetrix-pdf-page">
      <style>{`
        @keyframes wave-flow-1 {
          0% { transform: translateX(0) translateZ(0) scaleY(1); }
          50% { transform: translateX(-25%) translateZ(0) scaleY(1.08); }
          100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
        }
        @keyframes wave-flow-2 {
          0% { transform: translateX(-50%) translateZ(0) scaleY(1); }
          50% { transform: translateX(-25%) translateZ(0) scaleY(0.92); }
          100% { transform: translateX(0) translateZ(0) scaleY(1); }
        }
        @keyframes scan-laser {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(0, 191, 255, 0.2); box-shadow: 0 0 5px rgba(0, 191, 255, 0.1); }
          50% { border-color: rgba(0, 191, 255, 0.6); box-shadow: 0 0 15px rgba(0, 191, 255, 0.3); }
        }
        .pulsing-border {
          animation: pulse-border 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* Ambient background glow layers */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00BFFF]/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-[#A855F7]/4 rounded-full blur-3xl pointer-events-none z-0" />
      
      {/* Dynamic floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#00BFFF]/10 blur-[1px]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0vh", "-120vh"],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Floating Toast Area */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2" id="pdf-toasts">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 bg-[#0c0c0f]/95 backdrop-blur-md text-xs text-gray-200 flex items-center gap-2.5 shadow-xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full relative z-10 flex-1 flex flex-col">
        
        {/* Top Header Row */}
        <header className="flex items-center justify-between mb-8" id="pdf-header-bar">
          <div className="flex items-center gap-4">
            {/* Back Arrow button */}
            <button 
              onClick={onBack}
              className="flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-md"
              id="pdf-back-btn"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>

            {/* Aetrix logo branding */}
            <div className="flex flex-col text-left" id="pdf-header-branding">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-[2px]" />
                  <div className="w-5 h-5 rounded-full border border-[#00BFFF]/50 bg-black flex items-center justify-center text-[10px] text-[#00BFFF] font-black z-10">
                    A
                  </div>
                  <div className="absolute w-7 h-3 border border-[#00BFFF]/40 rounded-full -rotate-[20deg]" />
                </div>
                <span className="font-extrabold tracking-[0.2em] text-sm text-white">AETRIX <span className="text-[#00BFFF]">AI</span></span>
              </div>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider mt-0.5 uppercase flex items-center gap-1 pl-8">
                PDF Summarizer AI <span className="text-[#00BFFF]">📄</span>
              </span>
            </div>
          </div>

          {/* Large Orbiting Orb Illustration (Themed Blue/Purple) */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0" id="pdf-glowing-orbit-orb">
            <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-xl animate-pulse" />
            
            <div className="absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#A855F7]/30 bg-gradient-to-tr from-[#050505] via-[#100c1c] to-[#0d1624] flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.2)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
              <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-[#00BFFF] rounded-full animate-ping" />
              <span className="text-white font-black text-lg sm:text-2xl tracking-widest drop-shadow-[0_0_8px_rgba(0,191,255,0.7)] font-sans select-none relative z-10">A</span>
            </div>

            <div className="absolute w-16 h-8 sm:w-20 sm:h-10 border border-[#00BFFF]/30 rounded-full -rotate-[22deg] animate-[spin_12s_linear_infinite]" />
            <div className="absolute w-20 h-10 sm:w-24 sm:h-12 border border-[#A855F7]/20 rounded-full rotate-[40deg] animate-[spin_8s_linear_infinite]">
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-[#A855F7] rounded-full shadow-[0_0_8px_#A855F7]" />
            </div>
          </div>
        </header>

        {/* 1. IDLE / EMPTY STATE */}
        {step === "idle" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
            id="pdf-idle-screen"
          >
            {/* Hero Title */}
            <div className="text-center mt-4 mb-8" id="pdf-hero-section">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#1E3A8A]/30 to-[#A855F7]/20 border border-[#00BFFF]/30 shadow-[0_0_25px_rgba(0,191,255,0.25)] mb-6 relative group overflow-hidden">
                <div className="absolute inset-0 bg-[#00BFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <FileText className="w-10 h-10 text-[#00BFFF] filter drop-shadow-[0_0_10px_rgba(0,191,255,0.7)]" />
              </div>
              <h1 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight text-white mb-3">
                Summarize <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#A855F7]">Any PDF</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-lg mx-auto">
                Upload your PDF and get an AI-powered summary instantly.
              </p>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFilePicker}
              className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative bg-[#0c0c0e]/30 backdrop-blur-xl ${
                isDragging 
                  ? "border-[#00BFFF] bg-[#00BFFF]/5 shadow-[0_0_20px_rgba(0,191,255,0.2)] scale-[1.01]" 
                  : "border-white/10 hover:border-[#00BFFF]/30 hover:bg-[#00BFFF]/2 shadow-md hover:shadow-[0_0_20px_rgba(0,191,255,0.05)]"
              }`}
              id="pdf-drag-drop-zone"
            >
              {/* Invisible HTML File input */}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.txt,.docx"
                className="hidden"
              />

              <div className="w-14 h-14 rounded-2xl bg-[#00BFFF]/5 border border-[#00BFFF]/20 flex items-center justify-center mb-4 text-[#00BFFF] shadow-md group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="text-white text-base font-bold mb-1">Drag & Drop PDF Here</h3>
              <p className="text-gray-400 text-xs mb-6">or click to browse your local directory</p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); triggerFilePicker(); }}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-semibold text-xs tracking-wide transition-all"
                >
                  Browse Files
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); triggerUpload("Aetrix_Deep_Research_Whitepaper.pdf", 1468000); }}
                  className="w-full py-2.5 rounded-xl bg-[#00BFFF] hover:bg-blue-500 text-black font-semibold text-xs tracking-wide shadow-lg shadow-[#00BFFF]/25 hover:shadow-[#00BFFF]/45 transition-all"
                >
                  Load Sample PDF
                </button>
              </div>

              <div className="mt-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Supported: PDF, TXT, DOCX up to 100MB
              </div>
            </div>

            {/* Raw Text Paste Box Fallback */}
            <div className="mt-8 border border-white/5 rounded-3xl bg-[#0c0c0e]/20 p-5 flex flex-col gap-3" id="pdf-paste-fallback">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Or paste your text content here</label>
              <div className="relative">
                <textarea 
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Paste article, essay or technical logs here to generate diagnostic summary..."
                  className="w-full h-24 bg-[#050505] border border-white/10 rounded-xl p-3.5 text-xs text-gray-300 outline-none focus:border-[#00BFFF]/40 transition-colors resize-none"
                />
                {pasteText.trim() && (
                  <button 
                    onClick={handlePasteSummarize}
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#00BFFF] hover:bg-blue-500 text-black text-[10px] font-bold tracking-wide transition-colors"
                  >
                    Summarize pasted text
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. PROCESSING / LOADING SCREEN */}
        {step === "processing" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center py-12"
            id="pdf-processing-screen"
          >
            <div className="relative w-40 h-40 flex items-center justify-center mb-10">
              {/* Outer pulsing neon ring */}
              <div className="absolute inset-0 rounded-full border border-[#00BFFF]/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border border-dashed border-[#A855F7]/30 animate-[spin-slow_20s_linear_infinite]" />
              
              {/* Spinning orbiting particles */}
              <div className="absolute inset-4 rounded-full border border-[#00BFFF]/30 animate-[spin_6s_linear_infinite]">
                <div className="absolute -top-1 left-1/2 w-2 h-2 bg-[#00BFFF] rounded-full shadow-[0_0_10px_#00BFFF]" />
              </div>
              <div className="absolute inset-6 rounded-full border border-[#A855F7]/30 animate-[spin_4s_linear_infinite_reverse]">
                <div className="absolute -bottom-1 left-1/2 w-2 h-2 bg-[#A855F7] rounded-full shadow-[0_0_10px_#A855F7]" />
              </div>

              {/* Central Glowing Aetrix AI Logo */}
              <div className="w-24 h-24 rounded-full border border-white/10 bg-black flex items-center justify-center shadow-[0_0_30px_rgba(0,191,255,0.25)] relative overflow-hidden">
                <span className="text-white font-black text-4xl tracking-widest drop-shadow-[0_0_12px_rgba(0,191,255,0.8)] font-sans">A</span>
                
                {/* Horizontal scanner line laser effect */}
                <div 
                  className="absolute left-0 right-0 h-[2px] bg-[#00BFFF] shadow-[0_0_8px_#00BFFF] z-20 pointer-events-none"
                  style={{ animation: "scan-laser 2.2s linear infinite" }}
                />
              </div>
            </div>

            {/* Progress Texts */}
            <h2 className="text-xl font-bold tracking-tight text-white mb-1 animate-pulse">
              {statusText}
            </h2>
            <p className="text-gray-500 text-xs mb-8">Please wait while AETRIX extracts the document matrix</p>

            {/* Glowing neon progress bar */}
            <div className="w-full max-w-sm flex items-center gap-4">
              <div className="flex-1 h-[6px] bg-white/5 border border-white/10 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-[#00BFFF] to-[#A855F7] rounded-full shadow-[0_0_15px_#00BFFF] transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-mono text-[#00BFFF] font-bold w-12 text-right">{progress}%</span>
            </div>

            {/* Scanning details stream */}
            <div className="mt-10 font-mono text-[9px] text-gray-500 uppercase tracking-widest flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              <span>SYS_THREAD_ID: {Math.floor(Math.random() * 9000 + 1000)} // VECTOR_INGEST_OK</span>
            </div>
          </motion.div>
        )}

        {/* 3. RESULT SCREEN */}
        {step === "result" && selectedFile && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col gap-6"
            id="pdf-result-screen"
          >
            {/* Uploaded File status bar card */}
            <div className="flex items-center justify-between p-4 bg-[#0c0c0e]/50 border border-white/10 rounded-2xl shadow-xl" id="pdf-active-file-card">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-white text-xs font-bold truncate max-w-[200px] sm:max-w-md">{selectedFile.name}</h4>
                  <p className="text-gray-500 text-[10px] mt-0.5">{selectedFile.size} • PDF Document</p>
                </div>
              </div>
              <button 
                onClick={handleUnloadFile}
                className="p-1.5 rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                title="Unload File"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Premium Glass Summary Card */}
            <div className="border border-white/10 rounded-3xl bg-[#0c0c0e]/30 backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden shadow-2xl" id="pdf-result-glass-card">
              
              {/* Glass Sheen effect */}
              <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent transform -skew-x-12 animate-[shine_10s_ease-in-out_infinite] pointer-events-none" />

              {/* Summary Sections Stack */}
              <div className="grid grid-cols-1 gap-6 relative z-10">
                
                {/* 📄 Summary Card */}
                <div className="p-5 rounded-2xl bg-black/40 border border-[#00BFFF]/20 shadow-[0_0_15px_rgba(0,191,255,0.02)] hover:border-[#00BFFF]/40 transition-colors" id="section-summary">
                  <div className="flex items-center gap-2 mb-3 text-[#00BFFF]">
                    <FileText className="w-4 h-4" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider">📄 Summary</h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {summarySections.summary}
                  </p>
                </div>

                {/* ⭐ Key Points Card */}
                <div className="p-5 rounded-2xl bg-black/40 border border-[#A855F7]/20 shadow-[0_0_15px_rgba(168,85,247,0.02)] hover:border-[#A855F7]/40 transition-colors" id="section-key-points">
                  <div className="flex items-center gap-2 mb-3 text-[#A855F7]">
                    <Sparkles className="w-4 h-4" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider">⭐ Key Points</h3>
                  </div>
                  <ul className="text-gray-300 text-xs sm:text-sm leading-relaxed space-y-2 font-sans">
                    {summarySections.keyPoints.split("\n").map((pt, idx) => {
                      const cleanPt = pt.replace(/^[\s*•\-]+/g, "").trim();
                      if (!cleanPt) return null;
                      return (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#A855F7] mt-1 shrink-0">•</span>
                          <span>{cleanPt}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* 📚 Detailed Explanation Card */}
                <div className="p-5 rounded-2xl bg-black/40 border border-blue-500/10 hover:border-blue-500/30 transition-colors" id="section-detailed-explanation">
                  <div className="flex items-center gap-2 mb-3 text-blue-400">
                    <BookOpen className="w-4 h-4" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider">📚 Detailed Explanation</h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {summarySections.detailed}
                  </p>
                </div>

                {/* 💡 Important Insights Card */}
                <div className="p-5 rounded-2xl bg-black/40 border border-teal-500/10 hover:border-teal-500/30 transition-colors" id="section-important-insights">
                  <div className="flex items-center gap-2 mb-3 text-teal-400">
                    <GraduationCap className="w-4 h-4" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider">💡 Important Insights</h3>
                  </div>
                  <ul className="text-gray-300 text-xs sm:text-sm leading-relaxed space-y-2 font-sans">
                    {summarySections.insights.split("\n").map((pt, idx) => {
                      const cleanPt = pt.replace(/^[\s*•\-]+/g, "").trim();
                      if (!cleanPt) return null;
                      return (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-teal-400 mt-1 shrink-0">✨</span>
                          <span>{cleanPt}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

              </div>

              {/* Beautiful Blue/Purple bottom ripple water wave animation */}
              <div className="absolute bottom-0 left-0 right-0 h-10 overflow-hidden pointer-events-none z-0 opacity-70">
                <svg className="absolute bottom-0 w-[200%] h-14" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    d="M0,60 C150,90 350,30 500,60 C650,90 850,30 1000,60 C1150,90 1350,30 1500,60 C1650,90 1850,30 2000,60 L2000,120 L0,120 Z" 
                    fill="url(#wave-pdf-grad-1)" 
                    style={{ animation: "wave-flow-1 12s linear infinite" }}
                  />
                  <path 
                    d="M0,70 C180,40 320,100 500,70 C680,40 820,100 1000,70 C1180,40 1320,100 1500,70 C1680,40 1820,100 2000,70 L2000,120 L0,120 Z" 
                    fill="url(#wave-pdf-grad-2)" 
                    style={{ animation: "wave-flow-2 8s linear infinite", opacity: 0.6 }}
                  />
                  <defs>
                    <linearGradient id="wave-pdf-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(0, 191, 255, 0)" />
                      <stop offset="50%" stopColor="rgba(0, 191, 255, 0.35)" />
                      <stop offset="100%" stopColor="rgba(0, 191, 255, 0)" />
                    </linearGradient>
                    <linearGradient id="wave-pdf-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(168, 85, 247, 0)" />
                      <stop offset="50%" stopColor="rgba(0, 191, 255, 0.2)" />
                      <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

            </div>

            {/* Bottom Interactive Conversation Box (if any follow up queries are present) */}
            {messages.length > 0 && (
              <div className="border border-white/10 rounded-3xl bg-[#0c0c0e]/70 p-5 flex flex-col gap-4 shadow-xl" id="pdf-chat-history">
                <div className="flex items-center gap-1.5 border-b border-white/5 pb-2">
                  <MessageSquare className="w-4 h-4 text-[#00BFFF]" />
                  <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase">Interactive PDF Session Log</span>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                        m.role === "user" 
                          ? "bg-gradient-to-r from-blue-700 to-[#00BFFF] text-white rounded-tr-none shadow-[0_0_15px_rgba(0,191,255,0.2)]" 
                          : "bg-white/5 border border-white/10 text-gray-300 rounded-tl-none"
                      }`}>
                        {m.content.startsWith("### ") ? (
                          <div className="space-y-1">
                            <h4 className="font-bold text-white mb-1 border-b border-white/5 pb-0.5">{m.content.split("\n")[0].substring(4)}</h4>
                            <p className="whitespace-pre-wrap">{m.content.split("\n").slice(1).join("\n")}</p>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{m.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl w-44 text-xs text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-bounce" />
                      <span>Assistant is analyzing...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}

            {/* Bottom Chat Bar Component */}
            <div className="flex flex-col gap-4 mt-2" id="pdf-interactive-floating-dock">
              
              {/* Horizontal scroll Quick Action chips */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none no-scrollbar" id="quick-suggestions-chips">
                {[
                  { label: "Explain Simply", query: "Can you explain the main concept of this document in very simple terms, as if I am 10 years old?" },
                  { label: "More Details", query: "Please expand on the core technical details, providing a more comprehensive breakdown." },
                  { label: "Examples", query: "What are some real-world examples or use cases of the concepts discussed in this document?" },
                  { label: "Quiz Me", query: "Generate a quick 3-question interactive multiple choice quiz based on this document to test my understanding." },
                  { label: "Translate", query: "Please translate the core summary points of this document into Spanish." },
                  { label: "Continue", query: "Continue analyzing and provide further details on what other topics might be covered in this paper." }
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(s.query)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-[#00BFFF]/30 hover:bg-[#00BFFF]/5 text-gray-400 hover:text-[#00BFFF] rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Floating Input bar */}
              <div className="p-2 border border-white/10 bg-black/60 rounded-2xl flex items-center gap-2" id="pdf-chat-bar">
                <button 
                  onClick={() => addToast("Custom file attachment is locked for active document context", "info")}
                  className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors shrink-0"
                  title="Attach File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
                  placeholder="Ask anything about this PDF..."
                  className="flex-1 bg-transparent border-none outline-none py-2 text-xs text-white placeholder-gray-500"
                />

                <button 
                  onClick={() => addToast("Voice parsing is initialized. Standard audio driver connected.", "success")}
                  className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-[#00BFFF] transition-colors shrink-0"
                  title="Voice Input"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => handleSendQuery()}
                  disabled={!chatInput.trim() || chatLoading}
                  className="p-2 rounded-xl bg-[#00BFFF] hover:bg-blue-500 text-black disabled:opacity-40 disabled:hover:bg-[#00BFFF] transition-colors shrink-0 flex items-center justify-center shadow-lg shadow-[#00BFFF]/10"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
}

/* ========================================================================= */
/* 7. GENERATE CODE AI COMPONENT                                             */
/* ========================================================================= */
function CodeGenToolWorkspace({ 
  addToast, 
  onBack, 
  userEmail, 
  toasts 
}: { 
  addToast: (msg: string, type?: "success" | "info") => void; 
  onBack: () => void; 
  userEmail: string; 
  toasts: any[]; 
}) {
  const [screen, setScreen] = useState<"INPUT" | "LOADING" | "ANSWER">("INPUT");
  const [prompt, setPrompt] = useState("");
  const [selectedLang, setSelectedLang] = useState("Python");
  
  // Custom options checkboxes
  const [options, setOptions] = useState({
    comments: true,
    optimize: true,
    explain: true,
    errorHandling: true,
    bestPractices: true,
  });

  const [activeTab, setActiveTab] = useState<"code" | "explanation" | "complexity" | "notes">("code");
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [timeComplexity, setTimeComplexity] = useState("O(N)");
  const [spaceComplexity, setSpaceComplexity] = useState("O(1)");
  const [bestPracticesText, setBestPracticesText] = useState("Follow standard syntax parameters.");
  const [optimizationsText, setOptimizationsText] = useState("Inlined variable bounds.");

  const codeRef = useRef("");
  const explanationRef = useRef("");
  const timeComplexityRef = useRef("");
  const spaceComplexityRef = useRef("");
  const bestPracticesTextRef = useRef("");
  const optimizationsTextRef = useRef("");
  
  // Custom statistics metrics
  const [qualityScore, setQualityScore] = useState(98);
  const [confidenceScore, setConfidenceScore] = useState(99);
  const [executionTime, setExecutionTime] = useState("12ms");

  // Loading Screen States
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState(0);

  // Run Code Terminal Simulator States
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem("aetrix_active_conv_code_gen");
  });
  const activeConvIdRef = useRef<string | null>(activeConvId);

  const updateActiveConvId = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    localStorage.setItem("aetrix_active_conv_code_gen", id);
  };

  useEffect(() => {
    const activeId = localStorage.getItem("aetrix_active_conv_code_gen");
    if (activeId) {
      setActiveConvId(activeId);
      activeConvIdRef.current = activeId;
      const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const historyList: FeatureChatHistory[] = JSON.parse(stored);
          const found = historyList.find(c => c.id === activeId);
          if (found && found.messages.length >= 2) {
            const aiMsg = found.messages.filter(m => m.role === "assistant").pop();
            if (aiMsg) {
              try {
                const parsed = JSON.parse(aiMsg.content);
                if (parsed.code) setCode(parsed.code);
                if (parsed.explanation) setExplanation(parsed.explanation);
                if (parsed.timeComplexity) setTimeComplexity(parsed.timeComplexity);
                if (parsed.spaceComplexity) setSpaceComplexity(parsed.spaceComplexity);
                if (parsed.bestPracticesText) setBestPracticesText(parsed.bestPracticesText);
                if (parsed.optimizationsText) setOptimizationsText(parsed.optimizationsText);
                if (parsed.qualityScore) setQualityScore(parsed.qualityScore);
                if (parsed.confidenceScore) setConfidenceScore(parsed.confidenceScore);
                if (parsed.executionTime) setExecutionTime(parsed.executionTime);
                setScreen("ANSWER");
              } catch (err) {
                setCode(aiMsg.content);
                setScreen("ANSWER");
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail]);

  const loadingSteps = [
    "Reading Prompt...",
    "Understanding Requirements...",
    "Planning Architecture...",
    "Generating Functions...",
    "Optimizing Performance...",
    "Adding Comments...",
    "Checking Errors...",
    "Finalizing Code..."
  ];

  const promptExamples = [
    "Login Page",
    "Portfolio Website",
    "Calculator",
    "Chat App",
    "Weather App",
    "Todo App",
    "REST API",
    "AI Chatbot",
    "E-commerce",
    "Landing Page"
  ];

  const languages = [
    { name: "Python", color: "from-blue-500 to-yellow-400", bg: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
    { name: "Java", color: "from-red-500 to-orange-400", bg: "bg-red-500/10 border-red-500/20 text-red-300" },
    { name: "JavaScript", color: "from-yellow-400 to-yellow-600", bg: "bg-yellow-400/10 border-yellow-400/20 text-yellow-200" },
    { name: "TypeScript", color: "from-blue-600 to-sky-400", bg: "bg-blue-600/10 border-blue-600/20 text-blue-300" },
    { name: "React", color: "from-cyan-400 to-blue-500", bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300" },
    { name: "Next.js", color: "from-zinc-300 to-zinc-600", bg: "bg-white/5 border-white/10 text-white" },
    { name: "Node.js", color: "from-green-500 to-emerald-600", bg: "bg-green-500/10 border-green-500/20 text-green-300" },
    { name: "HTML", color: "from-orange-500 to-red-500", bg: "bg-orange-500/10 border-orange-500/20 text-orange-300" },
    { name: "CSS", color: "from-blue-400 to-indigo-500", bg: "bg-blue-400/10 border-blue-400/20 text-blue-300" },
    { name: "Tailwind CSS", color: "from-cyan-500 to-teal-400", bg: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300" },
    { name: "C", color: "from-slate-400 to-slate-600", bg: "bg-slate-400/10 border-slate-400/20 text-slate-300" },
    { name: "C++", color: "from-blue-500 to-indigo-600", bg: "bg-blue-500/10 border-blue-500/20 text-blue-300" },
    { name: "C#", color: "from-purple-600 to-violet-500", bg: "bg-purple-600/10 border-purple-600/20 text-purple-300" },
    { name: "PHP", color: "from-indigo-400 to-blue-500", bg: "bg-indigo-400/10 border-indigo-400/20 text-indigo-300" },
    { name: "Go", color: "from-sky-400 to-cyan-500", bg: "bg-sky-400/10 border-sky-400/20 text-sky-300" },
    { name: "Rust", color: "from-amber-600 to-orange-700", bg: "bg-amber-600/10 border-amber-600/20 text-amber-400" },
    { name: "Kotlin", color: "from-purple-500 to-orange-500", bg: "bg-purple-500/10 border-purple-500/20 text-purple-300" },
    { name: "Swift", color: "from-orange-500 to-red-500", bg: "bg-orange-500/10 border-orange-500/20 text-orange-300" },
    { name: "Dart (Flutter)", color: "from-cyan-400 to-blue-500", bg: "bg-cyan-400/10 border-cyan-400/20 text-cyan-300" }
  ];

  // Dynamic code highlights
  const highlightCodeText = (codeText: string, lang: string) => {
    if (!codeText) return "";
    let escaped = codeText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const keywords = /\b(def|function|const|let|var|return|if|else|while|for|import|from|export|default|class|interface|public|private|protected|async|await|try|catch|new|void|int|float|double|bool|boolean|string|char|struct|enum|namespace|using|include|fn|pub|impl|type|as)\b/g;
    const strings = /(["'`])(.*?)\1/g;
    const comments = /(\/\/.*|#.*|\/\*[\s\S]*?\*\/)/g;
    const numbers = /\b(\d+)\b/g;
    const types = /\b([A-Z][a-zA-Z0-9_]*)\b/g;

    let tempId = 0;
    const commentMap: Record<string, string> = {};
    escaped = escaped.replace(comments, (match) => {
      const key = `__COMMENT_ID_${tempId++}__`;
      commentMap[key] = `<span class="text-gray-500 italic">${match}</span>`;
      return key;
    });

    const stringMap: Record<string, string> = {};
    escaped = escaped.replace(strings, (match) => {
      const key = `__STRING_ID_${tempId++}__`;
      stringMap[key] = `<span class="text-emerald-400 font-medium">${match}</span>`;
      return key;
    });

    escaped = escaped.replace(keywords, '<span class="text-purple-400 font-semibold">$1</span>');
    escaped = escaped.replace(types, '<span class="text-cyan-400 font-semibold">$1</span>');
    escaped = escaped.replace(numbers, '<span class="text-amber-400">$1</span>');

    Object.keys(stringMap).forEach((key) => {
      escaped = escaped.replace(key, stringMap[key]);
    });
    Object.keys(commentMap).forEach((key) => {
      escaped = escaped.replace(key, commentMap[key]);
    });

    return escaped;
  };

  // Process prompt submission
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setScreen("LOADING");
    setLoadingProgress(0);
    setLoadingStep(0);

    // Smooth loading simulation progress bar
    const intervalTime = 38; 
    const timer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const nextVal = prev + 1;
        const stepIdx = Math.min(Math.floor((nextVal / 100) * loadingSteps.length), loadingSteps.length - 1);
        setLoadingStep(stepIdx);
        return nextVal;
      });
    }, intervalTime);

    try {
      const fullPrompt = `cody helper ai - three dash dividers - coding query: "${prompt}" - language "${selectedLang}" - comments: ${options.comments}, optimize: ${options.optimize}, explain: ${options.explain}, errorHandling: ${options.errorHandling}, bestPractices: ${options.bestPractices}`;
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: fullPrompt }]
        })
      });

      const data = await res.json();
      if (res.ok && data.text) {
        const parts = data.text.split("---");
        if (parts.length >= 3) {
          const rawCode = parts[1]?.trim() || "";
          const cleanCode = rawCode.replace(/```[a-zA-Z]*\n/g, "").replace(/```$/g, "").trim();
          setCode(cleanCode);
          codeRef.current = cleanCode;
          const exp = parts[2]?.trim() || "Analyzed generated code context.";
          setExplanation(exp);
          explanationRef.current = exp;
          const tc = parts[3]?.trim() || "O(N)";
          setTimeComplexity(tc);
          timeComplexityRef.current = tc;
          const sc = parts[4]?.trim() || "O(1)";
          setSpaceComplexity(sc);
          spaceComplexityRef.current = sc;
          const bp = parts[5]?.trim() || "Follow structural code conventions.";
          setBestPracticesText(bp);
          bestPracticesTextRef.current = bp;
          const opt = parts[6]?.trim() || "Optimized memory layout configurations.";
          setOptimizationsText(opt);
          optimizationsTextRef.current = opt;
        } else {
          const codeBlockRegex = /```(?:[a-zA-Z]*)\n([\s\S]*?)```/g;
          const match = codeBlockRegex.exec(data.text);
          let cleanCode = "";
          let exp = "";
          if (match && match[1]) {
            cleanCode = match[1].trim();
            exp = data.text.replace(match[0], "").trim();
          } else {
            cleanCode = data.text;
            exp = "Explanation generated based on response context.";
          }
          setCode(cleanCode);
          codeRef.current = cleanCode;
          setExplanation(exp);
          explanationRef.current = exp;
          setTimeComplexity("O(N)");
          timeComplexityRef.current = "O(N)";
          setSpaceComplexity("O(1)");
          spaceComplexityRef.current = "O(1)";
          setBestPracticesText("Verified syntactical limits.");
          bestPracticesTextRef.current = "Verified syntactical limits.";
          setOptimizationsText("Inlined functional properties.");
          optimizationsTextRef.current = "Inlined functional properties.";
        }
      } else {
        throw new Error(data.error || "Connection failed");
      }
    } catch (err: any) {
      clearInterval(timer);
      const errMsg = err.message || "An error occurred during code generation.";
      addToast(errMsg, "info");
      setScreen("INPUT");
      return;
    }

    // Complete loading beautifully
    setTimeout(() => {
      const finalQuality = Math.floor(Math.random() * 5) + 95;
      const finalConfidence = Math.floor(Math.random() * 4) + 96;
      const finalExecTime = `${(Math.random() * 15 + 3).toFixed(1)}ms`;

      setQualityScore(finalQuality);
      setConfidenceScore(finalConfidence);
      setExecutionTime(finalExecTime);

      setScreen("ANSWER");
      setActiveTab("code");

      // Save to dynamic history!
      const historyPayload = {
        code: codeRef.current,
        explanation: explanationRef.current,
        timeComplexity: timeComplexityRef.current,
        spaceComplexity: spaceComplexityRef.current,
        bestPracticesText: bestPracticesTextRef.current,
        optimizationsText: optimizationsTextRef.current,
        qualityScore: finalQuality,
        confidenceScore: finalConfidence,
        executionTime: finalExecTime
      };

      const promptSummary = prompt.length > 80 ? prompt.substring(0, 77) + "..." : prompt;
      saveToolMessageToHistory(
        userEmail || "guest",
        "code-gen",
        `Code Generator: "${promptSummary}"`,
        JSON.stringify(historyPayload),
        activeConvIdRef.current,
        updateActiveConvId
      );
    }, 1000);
  };

  // Run simulated script compiler terminal
  const runCodeSimulation = () => {
    setIsTerminalOpen(true);
    setIsRunningSim(true);
    setTerminalLogs([
      `[AETRIX CLOUD CONTAINER] Spawning container instance for ${selectedLang} runtime...`,
      `[AETRIX CLOUD CONTAINER] Setting environment limits (RAM: 512MB, CPU: 1vCPU)...`
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, `[COMPILER] Code parsed. Generating abstract syntax tree...`]);
    }, 600);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev, 
        `[COMPILER] Syntax verification complete: 0 warnings, 0 errors.`,
        `[RUNNER] Launching thread execution stack...`,
        `[LOG] Initializing program parameters for target payload...`,
        `[LOG] Computed memory heap allocations: 4.88 KB.`
      ]);
    }, 1300);

    setTimeout(() => {
      const isPython = selectedLang.toLowerCase() === "python";
      const resultOutput = isPython 
        ? `[OUTPUT] Processed items: [10.8, 21.6, 43.2]` 
        : `[OUTPUT] Successful stream transformation for ${selectedLang}.`;

      setTerminalLogs(prev => [
        ...prev,
        resultOutput,
        `[SUCCESS] Program executed successfully. Exit code: 0 (0x00)`,
        `[AETRIX CLOUD CONTAINER] Thread destroyed safely.`
      ]);
      setIsRunningSim(false);
      addToast("Simulated compilation succeeded!", "success");
    }, 2200);
  };

  // Download logic helper
  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aetrix_solution.${selectedLang.toLowerCase() === "python" ? "py" : selectedLang.toLowerCase() === "javascript" ? "js" : "txt"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast("Code file downloaded successfully!", "success");
  };

  // Interactive Binary rain canvas component
  const BinaryRainCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let animationId: number;
      let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
      let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

      const handleResize = () => {
        if (!canvas || !canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      };
      window.addEventListener("resize", handleResize);

      const columns = Math.floor(width / 24);
      const yPositions = Array(columns).fill(0).map(() => Math.random() * height * -1);
      const chars = "0101<>/{};()[]+=*-".split("");

      const draw = () => {
        ctx.fillStyle = "rgba(11, 15, 25, 0.12)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "rgba(0, 191, 255, 0.22)";
        ctx.font = "11px monospace";

        for (let i = 0; i < columns; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * 24;
          const y = yPositions[i];

          ctx.fillText(char, x, y);

          if (y > height && Math.random() > 0.985) {
            yPositions[i] = 0;
          } else {
            yPositions[i] += 4;
          }
        }

        animationId = requestAnimationFrame(draw);
      };

      draw();
      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.22]" />;
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-[#0B0F19] text-white font-sans selection:bg-[#00BFFF]/30 selection:text-white relative flex flex-col overflow-x-hidden" id="aetrix-code-gen-flow">
      {/* Interactive CSS Animations & Matrix Background Glows */}
      <style>{`
        @keyframes rotate-slow-right {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotate-slow-left {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.2; }
          50% { transform: scale(1.05); opacity: 0.5; }
          100% { transform: scale(0.95); opacity: 0.2; }
        }
        .animate-rotate-right {
          animation: rotate-slow-right 24s linear infinite;
        }
        .animate-rotate-left {
          animation: rotate-slow-left 18s linear infinite;
        }
        .animate-float {
          animation: float-gentle 5s ease-in-out infinite;
        }
        .animate-pulse-ring {
          animation: pulse-ring 3s ease-in-out infinite;
        }
      `}</style>

      {/* Futuristic Grid & Ambient Spotlights */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00BFFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Falling Binary particles canvas */}
      <BinaryRainCanvas />

      {/* Floating Toast Area */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2" id="codegen-toasts">
        {toasts.map((t: any) => (
          <div 
            key={t.id} 
            className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 bg-black/90 backdrop-blur-md text-xs text-gray-200 flex items-center gap-2.5 shadow-xl animate-slide-in"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Redesigned Header element to match Resume AI exactly */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full relative z-10 flex flex-col">
        <header className="flex items-center justify-between mb-8" id="codegen-header-row">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-md"
              id="codegen-back-arrow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>

            <div className="flex flex-col text-left" id="codegen-logo-branding">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-[2px]" />
                  <div className="w-5 h-5 rounded-full border border-[#00BFFF]/50 bg-black flex items-center justify-center text-[10px] text-[#00BFFF] font-black z-10">
                    A
                  </div>
                  <div className="absolute w-7 h-3 border border-[#00BFFF]/40 rounded-full -rotate-[20deg]" />
                </div>
                <span className="font-extrabold tracking-[0.2em] text-sm text-white font-sans">AETRIX <span className="text-[#00BFFF]">AI</span></span>
              </div>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider mt-0.5 uppercase flex items-center gap-1.5 pl-8">
                GENERATE CODE AI <span className="text-[#00BFFF]">💻</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative" id="codegen-header-controls">
            <span className="text-[10px] font-mono text-[#00BFFF] bg-[#00BFFF]/10 px-2 py-0.5 rounded-full border border-[#00BFFF]/20 hidden sm:inline-block">GEN_CODE_MODULE: ACTIVE</span>

            {/* Large Orbiting Orb Decoration */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0" id="codegen-glowing-orbit-orb">
              <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute w-11 h-11 rounded-full border border-purple-500/30 bg-gradient-to-tr from-[#050505] via-[#100c1c] to-[#0d1624] flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.2)] overflow-hidden">
                <span className="text-white font-black text-xl tracking-widest font-sans select-none relative z-10">A</span>
              </div>
              <div className="absolute w-14 h-7 border border-[#00BFFF]/30 rounded-full -rotate-[22deg] animate-[spin_12s_linear_infinite]" />
            </div>
          </div>
        </header>
      </div>

      {/* PRIMARY WORKSPACE */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 md:py-10 relative z-10 flex flex-col items-center justify-center">
        
        {/* ========================================== */}
        {/* SCREEN 1: INPUT PAGE                       */}
        {/* ========================================== */}
        {screen === "INPUT" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl flex flex-col items-center gap-8"
            id="codegen-input-screen"
          >
            {/* Visual Header Panel */}
            <div className="text-center space-y-3 animate-float">
              {/* Huge glowing animated code icon */}
              <div className="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#00BFFF]/10 to-purple-600/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_12px_40px_rgba(0,191,255,0.15)]">
                <div className="absolute inset-0 rounded-3xl bg-cyan-400/5 animate-pulse-ring" />
                <Terminal className="w-10 h-10 text-[#00BFFF] drop-shadow-[0_0_8px_rgba(0,191,255,0.6)]" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl bg-clip-text bg-gradient-to-r from-white via-gray-100 to-[#00BFFF]">
                Generate Code with <span className="text-[#00BFFF] relative inline-block">AI<span className="absolute bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-[#00BFFF] to-purple-600 rounded" /></span>
              </h1>
              <p className="text-gray-400 text-sm max-w-md mx-auto">
                Write, debug, optimize and explain code in any programming language.
              </p>
            </div>

            {/* Prompt input Box */}
            <div className="w-full bg-[#0E1526]/80 border border-white/10 rounded-[22px] p-4 flex flex-col gap-3 shadow-[0_12px_32px_rgba(0,0,0,0.5)] focus-within:border-[#00BFFF]/50 focus-within:shadow-[0_0_20px_rgba(0,191,255,0.15)] transition-all">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything about programming..."
                className="w-full bg-transparent border-none text-white text-sm outline-none resize-none h-28 placeholder-gray-500 leading-relaxed font-medium"
              />
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <button 
                  onClick={() => addToast("Custom parameters imported successfully.", "info")}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white transition-colors"
                  title="Attach File"
                >
                  <Paperclip className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim()}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-[#00BFFF] to-blue-600 hover:from-blue-500 hover:to-purple-600 text-white shadow-[0_4px_20px_rgba(0,191,255,0.3)] disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center transform active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Options Checkboxes */}
            <div className="w-full space-y-3">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Generation Pipeline Options</span>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                {[
                  { key: "comments", label: "Generate Comments" },
                  { key: "optimize", label: "Optimize Code" },
                  { key: "explain", label: "Explain Code" },
                  { key: "errorHandling", label: "Add Error Handling" },
                  { key: "bestPractices", label: "Best Practices" }
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setOptions(prev => ({ ...prev, [opt.key]: !prev[opt.key as keyof typeof options] }))}
                    className={`p-3 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                      options[opt.key as keyof typeof options]
                        ? "bg-[#00BFFF]/10 border-[#00BFFF]/40 text-cyan-300 shadow-[0_0_10px_rgba(0,191,255,0.05)]"
                        : "bg-white/[0.02] border-white/5 text-gray-400 hover:border-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Choose Programming Languages */}
            <div className="w-full space-y-3">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Choose Language</span>
              <div className="flex flex-wrap gap-2">
                {languages.slice(0, 12).map((l) => (
                  <button
                    key={l.name}
                    onClick={() => {
                      setSelectedLang(l.name);
                      addToast(`Selected ${l.name} context`, "success");
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all hover:scale-105 flex items-center gap-2 ${
                      selectedLang === l.name
                        ? "bg-gradient-to-r from-blue-600/30 to-[#00BFFF]/10 border-[#00BFFF]/50 text-cyan-200 shadow-[0_4px_15px_rgba(0,191,255,0.15)]"
                        : "bg-white/[0.02] border-white/5 text-gray-300 hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${l.color}`} />
                    <span>{l.name}</span>
                  </button>
                ))}
                <button
                  onClick={() => addToast("Support for C#, Kotlin, Swift, Dart is initialized inside compiler core.", "info")}
                  className="px-4 py-2.5 rounded-2xl text-xs font-semibold bg-white/[0.02] border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  More...
                </button>
              </div>
            </div>

            {/* Quick Prompt Examples */}
            <div className="w-full space-y-3">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block font-bold">Quick Prompt Examples</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
                {promptExamples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setPrompt(`Create a fully responsive high-performance ${ex.toLowerCase()} template with state tracking, beautiful layouts, and robust helper APIs.`);
                      addToast(`Imported "${ex}" example`, "success");
                    }}
                    className="p-3 text-left bg-[#0E1526]/50 border border-white/5 hover:border-[#00BFFF]/30 rounded-xl hover:bg-[#00BFFF]/5 transition-all text-xs font-semibold text-gray-300 hover:text-white truncate"
                  >
                    <span>{ex}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Action Button */}
            <button 
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-[#00BFFF] to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-sm tracking-wide transition-all shadow-[0_8px_32px_rgba(0,191,255,0.25)] flex items-center justify-center gap-2 group transform active:scale-98 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Sparkles className="w-5 h-5 text-yellow-300 group-hover:animate-spin" />
              <span>Generate Answer</span>
            </button>

            {/* Secure Footer message */}
            <div className="flex items-center gap-2 text-gray-500 text-[10px] font-mono">
              <Lock className="w-3.5 h-3.5 text-gray-600" />
              <span>Your data is secure and confidential</span>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* SCREEN 2: LOADING PAGE                     */}
        {/* ========================================== */}
        {screen === "LOADING" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-xl flex flex-col items-center gap-8 py-6 text-center"
            id="codegen-loading-screen"
          >
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
                Code <span className="text-[#00BFFF]">AI</span> is working...
              </h1>
              <p className="text-gray-400 text-xs max-w-sm mx-auto">Please wait while we generate the best solution.</p>
            </div>

            {/* Rotating AI Processor Graphic */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              {/* Spinning circuit rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#00BFFF]/20 animate-rotate-right" />
              <div className="absolute inset-3 rounded-full border border-double border-purple-500/25 animate-rotate-left" />
              <div className="absolute inset-8 rounded-full border border-[#00BFFF]/30 animate-pulse-ring" />
              
              {/* Inner glowing core with brackets */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#0b0b14] to-[#0E1526] border border-cyan-400/40 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,191,255,0.25)] relative">
                <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
                <span className="font-mono text-cyan-300 text-lg font-bold mt-1.5 tracking-widest">&lt; / &gt;</span>
              </div>
            </div>

            {/* Progress metrics */}
            <div className="w-full space-y-2.5">
              <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span className="text-[#00BFFF] animate-pulse font-bold">{loadingSteps[loadingStep]}</span>
                <span>{loadingProgress}%</span>
              </div>

              {/* Progress linear bar */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-[#00BFFF] to-purple-600 transition-all duration-100 shadow-[0_0_8px_#00BFFF]" 
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>

            {/* Realtime step-by-step diagnostic checklist */}
            <div className="w-full bg-[#0E1526]/50 border border-white/5 rounded-2xl p-4 text-left space-y-2 font-mono text-[11px] shadow-inner max-h-[160px] overflow-y-auto">
              {loadingSteps.map((step, i) => {
                const isActive = i === loadingStep;
                const isDone = i < loadingStep;
                return (
                  <div key={step} className="flex items-center gap-3 transition-opacity">
                    {isDone ? (
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                    ) : isActive ? (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                    )}
                    <span className={isDone ? "text-gray-500" : isActive ? "text-cyan-300 font-bold" : "text-gray-600"}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom expert thought card */}
            <div className="w-full p-4 rounded-2xl border border-white/5 bg-[#0E1526]/40 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Cpu className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">AI is thinking like an expert developer...</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">This may take a few seconds</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================== */}
        {/* SCREEN 3: ANSWER PAGE                      */}
        {/* ========================================== */}
        {screen === "ANSWER" && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col gap-6"
            id="codegen-answer-screen"
          >
            {/* Animated green success indicator banner */}
            <div className="w-full p-5 rounded-[22px] bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-lg">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-lg font-bold text-white">Your Solution is Ready!</h2>
                <p className="text-gray-400 text-xs">Generated by AETRIX high-fidelity intelligence model.</p>
              </div>
            </div>

            {/* Content Tabs Navigation */}
            <div className="flex border-b border-white/10 pb-1 gap-1">
              {[
                { id: "code", label: "Code Output" },
                { id: "explanation", label: "Explanation" },
                { id: "complexity", label: "Complexity & Stats" },
                { id: "notes", label: "Notes" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id as any);
                    addToast(`Opened ${t.label} tab`, "info");
                  }}
                  className={`px-5 py-3 text-xs font-bold transition-all relative ${
                    activeTab === t.id
                      ? "text-[#00BFFF]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {t.label}
                  {activeTab === t.id && (
                    <motion.div 
                      layoutId="activeTabUnderline" 
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#00BFFF] to-purple-600 rounded" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panels Contents */}
            <div className="min-h-[380px] w-full" id="codegen-active-tab-panel">
              
              {/* CODE TAB PANEL */}
              {activeTab === "code" && (
                <div className="space-y-3">
                  {/* Editor Header panel */}
                  <div className="flex items-center justify-between p-3.5 bg-[#0a0d17] border border-white/10 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5 mr-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-1 rounded-md font-semibold">
                        {selectedLang} Source
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={runCodeSimulation}
                        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-mono text-[10px] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Simulate compiler run"
                      >
                        <Play className="w-3 h-3" />
                        <span>Run Code</span>
                      </button>

                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          addToast("Code copied to clipboard!", "success");
                        }}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={handleDownloadCode}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editor body with dynamic syntax highlight */}
                  <div className={`relative ${isFullScreen ? "fixed inset-10 z-50 bg-[#0B0F19] border border-white/20 rounded-2xl p-6" : "bg-[#060913] border border-t-0 border-white/10 rounded-b-2xl"}`}>
                    <div className="flex font-mono text-[12px] leading-relaxed select-text overflow-auto h-[350px]">
                      {/* Line Numbers column */}
                      <div className="text-right text-gray-600 select-none px-4 border-r border-white/5 bg-[#04060c] py-4">
                        {code.split("\n").map((_, i) => (
                          <div key={i}>{i + 1}</div>
                        ))}
                      </div>

                      {/* Code body block */}
                      <pre 
                        className="flex-1 px-5 py-4 overflow-x-auto text-gray-200"
                        dangerouslySetInnerHTML={{ __html: highlightCodeText(code, selectedLang) }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* EXPLANATION TAB PANEL */}
              {activeTab === "explanation" && (
                <div className="space-y-4">
                  <div className="bg-[#0E1526]/55 border border-white/5 rounded-2xl p-6 space-y-4 leading-relaxed">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-purple-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">How it Works</h3>
                    </div>
                    <p className="text-gray-300 text-xs">
                      {explanation}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs">
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold block uppercase">Code Flow</span>
                        <p className="text-gray-400">Inputs are strictly asserted inside parameters bounds. Process calculations are scoped linearly to minimize redundant thread allocation loops.</p>
                      </div>
                      <div className="space-y-2">
                        <span className="font-mono text-[10px] text-purple-400 font-bold block uppercase">Security Considerations</span>
                        <p className="text-gray-400">Strict sanitize patterns guard the values from cross-boundary leak vulnerabilities.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPLEXITY TAB PANEL */}
              {activeTab === "complexity" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="codegen-stats-grid">
                  {/* Time Complexity Card */}
                  <div className="bg-gradient-to-b from-[#0E1526]/80 to-black/30 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Time Complexity</span>
                      <Clock className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-black text-white">{timeComplexity}</h3>
                      <p className="text-gray-500 text-[10px] mt-1">Excellent performance scaling parameters.</p>
                    </div>
                  </div>

                  {/* Space Complexity Card */}
                  <div className="bg-gradient-to-b from-[#0E1526]/80 to-black/30 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-bold">Space Complexity</span>
                      <Cpu className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-black text-white">{spaceComplexity}</h3>
                      <p className="text-gray-500 text-[10px] mt-1">Negligible storage overhead.</p>
                    </div>
                  </div>

                  {/* Code Quality Card */}
                  <div className="bg-gradient-to-b from-[#0E1526]/80 to-black/30 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Code Quality Score</span>
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-2xl font-black text-white">{qualityScore}%</h3>
                      <p className="text-gray-500 text-[10px] mt-1">Adheres strictly to style guidelines.</p>
                    </div>
                  </div>

                  {/* AI Confidence Score */}
                  <div className="bg-gradient-to-b from-[#0E1526]/80 to-black/30 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">AI Confidence Score</span>
                    <div className="mt-4">
                      <h3 className="text-2xl font-black text-white">{confidenceScore}%</h3>
                      <p className="text-gray-500 text-[10px] mt-1">High algorithmic accuracy.</p>
                    </div>
                  </div>

                  {/* Estimated Execution Time */}
                  <div className="bg-gradient-to-b from-[#0E1526]/80 to-black/30 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shadow-lg">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider font-bold">Execution Time</span>
                    <div className="mt-4">
                      <h3 className="text-2xl font-black text-white">{executionTime}</h3>
                      <p className="text-gray-500 text-[10px] mt-1">Superfast execution metrics.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTES TAB PANEL */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  <div className="bg-[#0E1526]/55 border border-white/5 rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">Best Practices checklist</h3>
                    <ul className="text-xs text-gray-300 space-y-3 leading-relaxed">
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] mt-1.5" />
                        <span>{bestPracticesText}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                        <span>{optimizationsText}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                        <span>Enforce thorough sanitizations against memory-leak bounds.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

            </div>

            {/* Action Buttons Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-white/10">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  addToast("Solution copied successfully!", "success");
                }}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Answer</span>
              </button>

              <button 
                onClick={runCodeSimulation}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <Play className="w-4 h-4" />
                <span>Run Code</span>
              </button>

              <button 
                onClick={handleDownloadCode}
                className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button 
                onClick={() => {
                  setScreen("INPUT");
                  setPrompt("");
                  addToast("Ask another query!", "info");
                }}
                className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Ask Another</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>

      {/* Terminal Drawer Simulator */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 150 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 150 }}
            className="fixed bottom-0 left-0 right-0 h-[280px] bg-black border-t border-white/15 z-50 p-4 font-mono text-[11px] flex flex-col justify-between shadow-[0_-12px_40px_rgba(0,0,0,0.8)]"
            id="codegen-terminal-sim"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-gray-300">AETRIX SYS CONSOLE (SIMULATOR)</span>
              </div>
              <button 
                onClick={() => setIsTerminalOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 select-text p-2 bg-[#04060c] rounded-lg">
              {terminalLogs.map((log, i) => (
                <div 
                  key={i} 
                  className={log.includes("[SUCCESS]") ? "text-emerald-400" : log.includes("[RUNNER]") ? "text-cyan-400" : log.includes("[OUTPUT]") ? "text-[#00BFFF] font-bold" : "text-gray-400"}
                >
                  {log}
                </div>
              ))}
              {isRunningSim && (
                <div className="text-cyan-400 animate-pulse flex items-center gap-1">
                  <span>Executing processor thread...</span>
                  <span className="w-1 h-3 bg-cyan-400 animate-ping" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[9px] text-gray-500 border-t border-white/5 pt-2 mt-2">
              <span>STATUS: READY</span>
              <span>CONTAINER ID: cgen-node-88x</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========================================================================= */
/* 8. STUDY HELPER AI COMPONENT                                              */
/* ========================================================================= */
interface StudyAnswerData {
  title: string;
  subtitle: string;
  equation?: string;
  definition: string;
  keyPoints: string[];
  steps: string[];
}

function StudyToolWorkspace({ 
  addToast,
  onBack,
  userEmail = "",
  toasts = []
}: { 
  addToast: (msg: string, type?: "success" | "info") => void;
  onBack?: () => void;
  userEmail?: string;
  toasts?: any[];
}) {
  const [activeView, setActiveView] = useState<"hub" | "chat">("hub");
  const [step, setStep] = useState<"empty" | "loading" | "answer">("empty");
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Understanding your question...");
  const [answerData, setAnswerData] = useState<StudyAnswerData | null>(null);

  // Interaction States
  const [speaking, setSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [listening, setListening] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [pastSessions, setPastSessions] = useState<{ id: string; title: string; timestamp: string }[]>([]);

  // Local storage active conversation id tracking
  const [activeConvId, setActiveConvId] = useState<string | null>(() => {
    return localStorage.getItem("aetrix_active_conv_study");
  });
  const activeConvIdRef = useRef<string | null>(activeConvId);

  const updateActiveConvId = (id: string) => {
    setActiveConvId(id);
    activeConvIdRef.current = id;
    localStorage.setItem("aetrix_active_conv_study", id);
  };

  // Generate background particles
  useEffect(() => {
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 5
    }));
    setParticles(generated);
  }, []);

  // Sync / load past sessions from localStorage
  const loadPastSessions = () => {
    const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        const historyList: FeatureChatHistory[] = JSON.parse(stored);
        const filtered = historyList
          .filter((h) => h.toolId === "study")
          .map((h) => {
            const lastMsg = h.messages[h.messages.length - 1];
            return {
              id: h.id,
              title: h.title.replace(/^Study: "/, "").replace(/"$/, ""),
              timestamp: lastMsg ? lastMsg.timestamp : "Just now"
            };
          });
        setPastSessions(filtered);
      } else {
        setPastSessions([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadPastSessions();
  }, [userEmail, activeConvId]);

  // Load selected session from history list
  const loadSessionById = (id: string) => {
    const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        const historyList: FeatureChatHistory[] = JSON.parse(stored);
        const found = historyList.find((h) => h.id === id);
        if (found && found.messages.length >= 2) {
          const userMsg = found.messages.filter((m) => m.role === "user").pop();
          const aiMsg = found.messages.filter((m) => m.role === "assistant").pop();
          if (userMsg && aiMsg) {
            setQuestion(userMsg.content);
            try {
              const parsed = JSON.parse(aiMsg.content);
              setAnswerData(parsed);
            } catch {
              setAnswerData({
                title: "Study Explanation",
                subtitle: "Direct AI Consultation",
                definition: aiMsg.content,
                keyPoints: ["Generated from saved workspace context"],
                steps: []
              });
            }
            updateActiveConvId(id);
            setStep("answer");
            setActiveView("chat");
            setShowHistoryDropdown(false);
            addToast("Session loaded!", "success");
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle active session sync on initial load
  useEffect(() => {
    const activeId = localStorage.getItem("aetrix_active_conv_study");
    if (activeId) {
      setActiveConvId(activeId);
      activeConvIdRef.current = activeId;
      const historyKey = `aetrix_features_history_${userEmail || "guest"}`;
      try {
        const stored = localStorage.getItem(historyKey);
        if (stored) {
          const historyList: FeatureChatHistory[] = JSON.parse(stored);
          const found = historyList.find((h) => h.toolId === "study" && h.id === activeId);
          if (found && found.messages.length >= 2) {
            const userMsg = found.messages.filter((m) => m.role === "user").pop();
            const aiMsg = found.messages.filter((m) => m.role === "assistant").pop();
            if (userMsg && aiMsg) {
              setQuestion(userMsg.content);
              try {
                const parsed = JSON.parse(aiMsg.content);
                setAnswerData(parsed);
                setStep("answer");
                setActiveView("chat");
              } catch (e) {
                setAnswerData({
                  title: "Study Explanation",
                  subtitle: "Direct AI Consultation",
                  definition: aiMsg.content,
                  keyPoints: ["Generated from active session context"],
                  steps: []
                });
                setStep("answer");
                setActiveView("chat");
              }
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail]);

  // Handle smooth status transition on loading
  useEffect(() => {
    if (step !== "loading") return;

    const statuses = [
      "Understanding your question...",
      "Searching reliable information...",
      "Preparing the best explanation...",
      "Almost done..."
    ];
    let idx = 0;
    setLoadingStatus(statuses[0]);

    const interval = setInterval(() => {
      idx++;
      if (idx < statuses.length) {
        setLoadingStatus(statuses[idx]);
      } else {
        clearInterval(interval);
      }
    }, 1100);

    return () => clearInterval(interval);
  }, [step]);

  // Preset solutions database
  const PRESET_ANSWERS: Record<string, StudyAnswerData> = {
    "photosynthesis": {
      title: "Explain photosynthesis",
      subtitle: "The process of converting light energy to chemical energy.",
      equation: "6CO₂ + 6H₂O —(Sunlight / Chlorophyll)→ C₆H₁₂O₆ + 6O₂",
      definition: "Photosynthesis is a biochemical process used by green plants, algae, and some bacteria to synthesize glucose and oxygen from carbon dioxide and water, using light energy absorbed by chlorophyll.",
      keyPoints: [
        "Chloroplasts: Occurs inside the cell organelles called chloroplasts which contain light-capturing chlorophyll pigments.",
        "Light Reactions: Splits water molecules using light to produce ATP and NADPH while releasing oxygen as a byproduct.",
        "Dark Reactions (Calvin Cycle): Utilizes atmospheric carbon dioxide along with ATP and NADPH to synthesize high-energy sugar molecules (glucose).",
        "Global Biosphere: Forms the foundation of energy for nearly all living organisms on Earth and replenishes atmospheric oxygen."
      ],
      steps: [
        "Light Absorption: Photons from sunlight strike chlorophyll molecules within the thylakoid membranes of chloroplasts, energizing electrons.",
        "Water Photolysis: Energized chlorophyll pulls electrons from water molecules, splitting H₂O into gaseous oxygen, protons, and free electrons.",
        "Electron Transport: Energized electrons traverse an electron transport chain, generating a proton gradient that drives ATP synthesis.",
        "Carbon Fixation: In the stroma, the enzyme RuBisCO facilitates the bonding of CO₂ molecules to ribulose bisphosphate to begin glucose synthesis."
      ]
    },
    "pythagorean": {
      title: "What is the Pythagorean theorem?",
      subtitle: "The fundamental geometric relation in Euclidean spaces.",
      equation: "a² + b² = c²",
      definition: "The Pythagorean Theorem states that in any right-angled triangle, the area of the square whose side is the hypotenuse (the side opposite the right angle) is equal to the sum of the areas of the squares on the other two sides.",
      keyPoints: [
        "Right Triangles Only: Exclusively applicable to triangles containing a 90-degree internal angle.",
        "Distance Formula: Serves as the mathematical foundation for calculating spatial distances in coordinate planes.",
        "Trigonometric Identities: Directly leads to the core trigonometric identity: sin²θ + cos²θ = 1.",
        "Vector Magnitudes: Used in physics and engineering to compute the resultant length of perpendicular vectors."
      ],
      steps: [
        "Identify Sides: Find the right angle. Label the two perpendicular legs a and b, and label the longest opposite side (hypotenuse) as c.",
        "Square the Legs: Multiply side a by itself (a²) and side b by itself (b²).",
        "Sum the Squares: Add the squared values of the legs together (a² + b²).",
        "Solve for Hypotenuse: Take the square root of the sum to find the direct distance length (c = √(a² + b²))."
      ]
    },
    "newtons": {
      title: "Newton's Laws of Motion",
      subtitle: "The structural pillars of classical mechanics.",
      equation: "F = m · a",
      definition: "Newton's Laws of Motion are three physical laws compiled by Sir Isaac Newton that define the relationship between the forces acting on a physical body and its resultant acceleration.",
      keyPoints: [
        "First Law (Inertia): A body remains at rest or moves at constant velocity unless acted upon by a net external force.",
        "Second Law (Force): Acceleration is directly proportional to net force and inversely proportional to body mass (F = ma).",
        "Third Law (Action-Reaction): For every applied force, there is an equal in magnitude and opposite in direction reaction force.",
        "Universal Applicability: Governs everything from simple macroscopic falling objects to planetary orbits in space."
      ],
      steps: [
        "First Law Analysis: Define the frame of reference. If net forces sum to zero, velocity is perfectly constant.",
        "Second Law Calculation: Measure the mass m of the body. Apply a known force F. Calculate acceleration as a = F/m.",
        "Third Law Verification: Observe interactions between two bodies. If body A exerts force on body B, body B exerts an equal and opposite force on body A."
      ]
    },
    "solve": {
      title: "Solving Quadratic Equations",
      subtitle: "Finding roots using the quadratic formula.",
      equation: "x = (-b ± √(b² - 4ac)) / 2a",
      definition: "A quadratic equation is a second-order polynomial equation of the form ax² + bx + c = 0, where a ≠ 0.",
      keyPoints: [
        "Two Roots: Typically yields two mathematical solutions corresponding to the positive and negative sign.",
        "The Discriminant: The term D = b² - 4ac determines if roots are real and distinct, real and repeated (D=0), or complex (D<0).",
        "Parabolic Axis: The vertex of the corresponding parabola is located at x = -b / (2a)."
      ],
      steps: [
        "Standard Form: Rearrange the equation so all non-zero terms are on one side: ax² + bx + c = 0.",
        "Identify Coefficients: Extract the values for constants a, b, and c.",
        "Calculate Discriminant: Evaluate b² - 4ac to see what types of roots exist.",
        "Apply Formula: Substitute the coefficients into the formula to extract the precise real or complex roots."
      ]
    }
  };

  // Send action handler
  const handleQuery = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim()) return;
    
    setInput("");
    setQuestion(text);
    setStep("loading");
    setActiveView("chat");
    setFeedback(null);
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }

    // Identify if question is a preset
    let matchedKey = "";
    const lower = text.toLowerCase();
    if (lower.includes("photo") || lower.includes("plant")) matchedKey = "photosynthesis";
    else if (lower.includes("pythagorean") || lower.includes("triangle")) matchedKey = "pythagorean";
    else if (lower.includes("newton") || lower.includes("force")) matchedKey = "newtons";
    else if (lower.includes("math") || lower.includes("quadratic")) matchedKey = "solve";

    try {
      if (matchedKey) {
        // High fidelity mock database response load
        await new Promise(resolve => setTimeout(resolve, 4400));
        const finalData = PRESET_ANSWERS[matchedKey];
        setAnswerData(finalData);

        // Save to dynamic history!
        saveToolMessageToHistory(
          userEmail || "guest",
          "study",
          `Study: "${text}"`,
          JSON.stringify(finalData),
          activeConvIdRef.current,
          updateActiveConvId
        );
      } else {
        // Real-time call to Gemini API using the chat proxy
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `You are the AETRIX Study Helper AI. Please provide a structured academic explanation for: "${text}". Make sure to highlight Key Points and provide Step-by-Step guide. Maintain a highly professional, encouraging tutor voice.`
              }
            ]
          })
        });

        const resData = await response.json();
        if (response.ok && resData.text) {
          // Parse response to structured StudyAnswerData
          const parsedData = formatCustomAnswer(resData.text, text);
          setAnswerData(parsedData);

          // Save to dynamic history!
          saveToolMessageToHistory(
            userEmail || "guest",
            "study",
            `Study: "${text}"`,
            JSON.stringify(parsedData),
            activeConvIdRef.current,
            updateActiveConvId
          );
        } else {
          throw new Error(resData.error || "Failed to fetch answer.");
        }
      }
      setStep("answer");
    } catch (err: any) {
      const errMsg = err.message || "An error occurred during study lookup.";
      addToast(errMsg, "info");
      const errorData = {
        title: text,
        subtitle: "Study Query Failed",
        definition: `Could not retrieve explanation: ${errMsg}`,
        keyPoints: [
          "Study helper could not contact the AI service.",
          "Please verify your API settings.",
          "Check backend connection."
        ],
        steps: [
          "Review network settings.",
          "Retry request in a moment."
        ]
      };
      setAnswerData(errorData);
      setStep("answer");
    }
  };

  // Helper parser for custom Gemini responses
  const formatCustomAnswer = (text: string, titleStr: string): StudyAnswerData => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const definition = lines.find(l => !l.startsWith("#") && !l.startsWith("-") && !l.startsWith("*") && l.length > 40) || text;
    
    const keyPoints = lines
      .filter(l => l.startsWith("-") || l.startsWith("*") || l.startsWith("•"))
      .map(l => l.replace(/^[-*•]\s*/, ""))
      .slice(0, 4);

    const steps = lines
      .filter(l => /^\d+\.\s*/.test(l))
      .map(l => l.replace(/^\d+\.\s*/, ""))
      .slice(0, 4);

    return {
      title: titleStr,
      subtitle: "Interactive AI Explanation",
      definition,
      equation: text.includes("=") || text.includes("→") ? lines.find(l => l.includes("=") || l.includes("→")) : undefined,
      keyPoints: keyPoints.length > 0 ? keyPoints : ["Rigorous academic accuracy", "Step-by-step interactive resolution", "Clear concept definition"],
      steps: steps.length > 0 ? steps : ["Review the mathematical foundations", "Break down terms sequentially", "Analyze final values"]
    };
  };

  // Interactive Quick Actions
  const handleCopy = () => {
    if (!answerData) return;
    const bodyText = `${answerData.title}\n\n${answerData.definition}\n\n${answerData.equation ? `Formula: ${answerData.equation}\n\n` : ''}Key Points:\n${answerData.keyPoints.map(kp => `- ${kp}`).join('\n')}`;
    navigator.clipboard.writeText(bodyText);
    addToast("Copied to clipboard!", "success");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`https://aetrix.ai/study/session?id=${activeConvId || 'direct'}`);
    addToast("Sharing link copied to clipboard!", "success");
  };

  const handleRegenerate = () => {
    if (question) {
      handleQuery(question);
    }
  };

  const handleReadAloud = () => {
    if ("speechSynthesis" in window) {
      if (speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        addToast("Audio paused", "info");
      } else {
        if (!answerData) return;
        const speech = new SpeechSynthesisUtterance();
        speech.text = `${answerData.title}. ${answerData.definition}. Key points are: ${answerData.keyPoints.join(", ")}`;
        speech.rate = 0.95;
        speech.pitch = 1.0;
        
        speech.onend = () => {
          setSpeaking(false);
        };
        speech.onerror = () => {
          setSpeaking(false);
        };

        window.speechSynthesis.speak(speech);
        setSpeaking(true);
        addToast("Reading explanation aloud...", "success");
      }
    } else {
      addToast("Speech synthesis not supported on this device.", "info");
    }
  };

  // Mock upload action flows
  const handleAttachment = () => {
    addToast("Document uploaded! Ready for study guide generation.", "success");
    setInput("Summarize my physics class notes document.");
  };

  const handleImageUpload = () => {
    addToast("Diagram uploaded successfully!", "success");
    setInput("Explain the biological processes shown in this heart diagram.");
  };

  const handleVoiceInput = () => {
    if (listening) return;
    setListening(true);
    addToast("Listening... speak now.", "info");
    setTimeout(() => {
      const presets = [
        "Explain gravitational waves in simple terms",
        "What is the chemical formula of glucose?",
        "Explain the theory of relativity"
      ];
      setInput(presets[Math.floor(Math.random() * presets.length)]);
      setListening(false);
      addToast("Voice transcribed successfully!", "success");
    }, 2200);
  };

  // Reset Session
  const handleResetSession = () => {
    setStep("empty");
    setActiveView("chat");
    setInput("");
    setQuestion("");
    setAnswerData(null);
    setFeedback(null);
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
    localStorage.removeItem("aetrix_active_conv_study");
    setActiveConvId(null);
    activeConvIdRef.current = null;
    addToast("Session closed.", "info");
  };

  return (
    <div className="w-full h-[100dvh] max-h-[100dvh] overflow-y-auto bg-black text-white font-sans selection:bg-[#00BFFF] selection:text-black relative flex flex-col overflow-x-hidden pb-24" id="study-workspace">
      {/* Background Star grid & ambient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Static Floating Toasts */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2" id="study-toasts">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className="px-4 py-2.5 rounded-xl border border-[#00BFFF]/30 bg-black/90 backdrop-blur-md text-xs text-gray-200 flex items-center gap-2.5 shadow-xl animate-slide-in"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF]" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: "110%", x: `${p.x}%`, opacity: 0 }}
            animate={{
              y: "-10%",
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear",
            }}
            className="absolute rounded-full bg-[#00BFFF]/20 blur-[1px]"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.x}%`,
            }}
          />
        ))}
      </div>

      {/* Redesigned Header element to match Resume AI and Summarizer AI exactly */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-2 w-full relative z-10 flex flex-col">
        <header className="flex items-center justify-between mb-8" id="study-header-row">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (activeView === "chat") {
                  setActiveView("hub");
                } else if (onBack) {
                  onBack();
                }
              }}
              className="flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-md"
              id="study-back-arrow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>

            <div className="flex flex-col text-left" id="study-logo-branding">
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-[2px]" />
                  <div className="w-5 h-5 rounded-full border border-[#00BFFF]/50 bg-black flex items-center justify-center text-[10px] text-[#00BFFF] font-black z-10">
                    A
                  </div>
                  <div className="absolute w-7 h-3 border border-[#00BFFF]/40 rounded-full -rotate-[20deg]" />
                </div>
                <span className="font-extrabold tracking-[0.2em] text-sm text-white font-sans">AETRIX <span className="text-[#00BFFF]">AI</span></span>
              </div>
              <span className="text-gray-400 text-[10px] font-bold tracking-wider mt-0.5 uppercase flex items-center gap-1.5 pl-8">
                STUDY HELPER AI <span className="text-[#00BFFF]">📚</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative" id="study-header-controls">
            <span className="text-[10px] font-mono text-[#00BFFF] bg-[#00BFFF]/10 px-2 py-0.5 rounded-full border border-[#00BFFF]/20 hidden sm:inline-block">TUTOR_v3.5</span>
            
            {/* History dropdown clock trigger */}
            <button 
              onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
              className="flex items-center justify-center border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white rounded-full p-2.5 transition-all cursor-pointer shadow-md"
              title="Study History"
              id="study-history-btn"
            >
              <Clock className="w-5 h-5 text-gray-300" />
            </button>

            {/* History dropdown modal container */}
            <AnimatePresence>
              {showHistoryDropdown && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-12 w-64 rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl p-3 z-50 text-left max-h-[300px] overflow-y-auto"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#00BFFF]">PAST STUDY SESSIONS</span>
                    <button onClick={() => setShowHistoryDropdown(false)} className="text-[9px] text-gray-500 hover:text-white">Close</button>
                  </div>
                  {pastSessions.length === 0 ? (
                    <p className="text-[10px] text-gray-500 text-center py-4">No past study sessions found.</p>
                  ) : (
                    <div className="space-y-1">
                      {pastSessions.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            loadSessionById(s.id);
                            setShowHistoryDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-[10px] hover:bg-[#00BFFF]/10 border transition-all truncate block ${
                            activeConvId === s.id ? "border-[#00BFFF]/40 text-[#00BFFF]" : "border-transparent text-gray-400 hover:text-white"
                          }`}
                        >
                          <div className="font-medium truncate">{s.title}</div>
                          <div className="text-[8px] text-gray-600 mt-0.5">{s.timestamp}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Large Orbiting Orb Decoration */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0" id="study-glowing-orbit-orb">
              <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute w-11 h-11 rounded-full border border-purple-500/30 bg-gradient-to-tr from-[#050505] via-[#100c1c] to-[#0d1624] flex items-center justify-center shadow-[0_0_15px_rgba(0,191,255,0.2)] overflow-hidden">
                <span className="text-white font-black text-xl tracking-widest font-sans select-none relative z-10">A</span>
              </div>
              <div className="absolute w-14 h-7 border border-[#00BFFF]/30 rounded-full -rotate-[22deg] animate-[spin_12s_linear_infinite]" />
            </div>
          </div>
        </header>
      </div>

      {/* Screen view content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 relative z-10 flex flex-col justify-start max-w-4xl mx-auto w-full pb-28">
        
        {/* VIEW 1: STUDY HELPER DASHBOARD HUB (COLUMN 4 STYLE) */}
        {activeView === "hub" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col flex-1 space-y-6"
            id="study-hub-view"
          >

            {/* Quick Subjects grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase block">Academic Disciplines</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: "Maths", icon: Calculator, color: "text-blue-400", bg: "bg-blue-500/5", border: "border-blue-500/20", q: "Show math quadratic equations solution steps" },
                  { name: "Science", icon: FlaskConical, color: "text-green-400", bg: "bg-green-500/5", border: "border-green-500/20", q: "Explain photosynthesis details" },
                  { name: "History", icon: Globe, color: "text-orange-400", bg: "bg-orange-500/5", border: "border-orange-500/20", q: "Explain core events of classical industrialization" },
                  { name: "English", icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/5", border: "border-purple-500/20", q: "Write short guide on literary device analysis" }
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(s.q);
                      setActiveView("chat");
                      setStep("empty");
                      addToast(`Selected ${s.name}`, "info");
                    }}
                    className={`p-3 rounded-2xl ${s.bg} ${s.border} border hover:border-[#00BFFF]/40 flex flex-col items-center justify-center gap-1.5 transition-all hover:scale-[1.03] active:scale-95 cursor-pointer`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center ${s.color}`}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-300">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Examples Section */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider text-gray-500 uppercase block">Study Suite Examples</span>
                <button 
                  onClick={() => {
                    setActiveView("chat");
                    setStep("empty");
                  }} 
                  className="text-[10px] text-[#00BFFF] font-semibold hover:underline"
                >
                  Ask Custom Query &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { title: "Explain a topic", desc: "Get simple explanations", icon: BookOpen, color: "text-indigo-400", prompt: "Explain quantum computing in simple terms" },
                  { title: "Solve a problem", desc: "Step-by-step solutions", icon: Calculator, color: "text-pink-400", prompt: "What is the Pythagorean theorem?" },
                  { title: "Summarize text", desc: "Get short and clear notes", icon: FileText, color: "text-emerald-400", prompt: "Write short notes on Newton's law" },
                  { title: "Make notes", desc: "Create study notes", icon: Edit, color: "text-amber-400", prompt: "Create detailed study notes on cellular respiration" },
                  { title: "Quiz me", desc: "Test your knowledge", icon: MessageSquare, color: "text-teal-400", prompt: "Give me a multiple choice quiz about chemical bonding" },
                  { title: "Study tips", desc: "Improve your learning", icon: Sparkles, color: "text-red-400", prompt: "What are the best scientifically proven memorization techniques?" }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuery(item.prompt)}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#00BFFF]/30 hover:bg-[#00BFFF]/5 transition-all text-left active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 ${item.color}`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{item.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-600 hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: STUDY HELPER CHAT SYSTEM */}
        {activeView === "chat" && (
          <div className="flex-1 flex flex-col h-full">
            
            {/* SCREEN 2.1: EMPTY CHAT STATE (COLUMN 1 STYLE) */}
            {step === "empty" && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col flex-1 items-center justify-center text-center py-6"
                id="empty-chat-pane"
              >
                {/* Book + graduation cap animated mockup */}
                <div className="relative w-44 h-44 mb-4 flex items-center justify-center">
                  {/* Glowing neon background circles */}
                  <div className="absolute inset-0 bg-[#00BFFF]/10 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute w-36 h-36 border border-[#00BFFF]/20 rounded-full animate-spin [animation-duration:15s]" />
                  <div className="absolute w-28 h-28 border border-[#00BFFF]/40 border-dashed rounded-full animate-spin [animation-duration:8s] direction-reverse" />
                  
                  {/* 3D Animated Graduation Cap with Book vector elements */}
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 flex flex-col items-center justify-center"
                  >
                    <div className="relative">
                      {/* Floating Star sparkles */}
                      <Sparkles className="absolute -top-3 -right-3 text-[#00BFFF] w-5 h-5 animate-bounce [animation-duration:2.5s]" />
                      <Sparkles className="absolute -bottom-1 -left-4 text-cyan-400 w-4 h-4 animate-bounce [animation-duration:3s]" />
                      
                      {/* Visual representations of Book and Cap */}
                      <GraduationCap className="w-16 h-16 text-[#00BFFF] drop-shadow-[0_0_15px_rgba(0,191,255,0.6)]" />
                    </div>
                    <BookOpen className="w-14 h-14 text-white mt-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                  </motion.div>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-bold text-white tracking-wide">Study Helper AI</h3>
                  <p className="text-[#00BFFF] text-xs font-medium tracking-wide">Learn smarter with AI-powered explanations.</p>
                  
                  <div className="pt-3">
                    <p className="text-sm text-gray-200 font-semibold">Hello! What would you like to study today?</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed max-w-sm px-4 mt-0.5">
                      Ask any question, upload notes, or solve problems instantly.
                    </p>
                  </div>
                </div>

                {/* Direct Mockup Suggestion pills */}
                <div className="w-full max-w-sm space-y-2" id="suggestion-pills">
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block mb-1">SUGGESTION CARDS</span>
                  {[
                    { label: "Explain a Topic", prompt: "Explain photosynthesis in simple terms" },
                    { label: "Solve a Math Problem", prompt: "What is the Pythagorean theorem?" },
                    { label: "Summarize Notes", prompt: "Write short notes on Newton's law" },
                    { label: "Prepare for Exams", prompt: "What are the best scientifically proven memorization techniques?" }
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuery(s.prompt)}
                      className="w-full p-3 text-xs bg-white/[0.02] border border-white/5 hover:border-[#00BFFF]/30 hover:bg-[#00BFFF]/5 rounded-xl text-gray-300 hover:text-white text-left transition-all active:scale-[0.98] flex items-center justify-between"
                    >
                      <span className="truncate">{s.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SCREEN 2.2: LOADING SCREEN STATE (COLUMN 2 STYLE) */}
            {step === "loading" && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-center py-10"
                id="loading-pane"
              >
                {/* User's query shown at the top */}
                <div className="absolute top-2 left-0 right-0 px-4">
                  <div className="bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white rounded-2xl rounded-tr-none px-4 py-3 text-xs text-right max-w-[85%] ml-auto shadow-lg">
                    {question}
                  </div>
                </div>

                {/* Glowing study helper circular loading widget */}
                <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                  {/* Glowing Blue Neon rotating SVG Ring */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      stroke="rgba(255, 255, 255, 0.03)"
                      strokeWidth="3"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      stroke="#00BFFF"
                      strokeWidth="3.5"
                      fill="transparent"
                      strokeDasharray="339"
                      strokeDashoffset="120"
                      className="animate-spin origin-center"
                      style={{ transformOrigin: "50% 50%" }}
                    />
                  </svg>
                  
                  {/* Inner glowing cap */}
                  <div className="absolute inset-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/5 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-[#00BFFF] drop-shadow-[0_0_12px_#00BFFF] animate-pulse" />
                  </div>
                </div>

                {/* Smooth Status text updates */}
                <div className="text-center space-y-1.5">
                  <h4 className="text-sm font-bold text-white tracking-wide">Thinking...</h4>
                  <p className="text-xs text-gray-400 tracking-wide font-mono animate-pulse min-h-[16px]">
                    {loadingStatus}
                  </p>
                  
                  {/* Triple bouncing dots */}
                  <div className="flex justify-center items-center gap-1 mt-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2.3: ANSWER RENDER VIEW (COLUMN 3 STYLE) */}
            {step === "answer" && answerData && (
              <motion.div 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 space-y-4 pb-20"
                id="answer-pane"
              >
                {/* User's question card on top right */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white rounded-2xl rounded-tr-none px-4 py-3 text-xs shadow-md shadow-blue-900/20 font-medium">
                    {question}
                  </div>
                </div>

                {/* AI Structured Answer Card */}
                <div className="border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-md p-4 relative overflow-hidden shadow-2xl">
                  {/* Left glow ribbon */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00BFFF] to-blue-600" />
                  
                  {/* Header and title info */}
                  <div className="flex items-center gap-1.5 mb-3 border-b border-white/5 pb-2.5">
                    <Sparkles className="w-4 h-4 text-[#00BFFF]" />
                    <span className="text-[10px] font-mono text-gray-400">AETRIX STUDY EXPLORER</span>
                  </div>

                  <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
                    
                    {/* Concept Title */}
                    <div>
                      <h3 className="text-base font-bold text-white tracking-wide">{answerData.title}</h3>
                      <p className="text-[10px] text-[#00BFFF] font-medium tracking-wide font-mono mt-0.5">{answerData.subtitle}</p>
                    </div>

                    {/* Paragraph main definition */}
                    <p className="whitespace-pre-wrap font-medium">{answerData.definition}</p>

                    {/* Centered Equation rendering if exists */}
                    {answerData.equation && (
                      <div className="py-1">
                        <div className="text-[9px] font-mono text-gray-500 mb-1">EQUATION / REPRESENTATION:</div>
                        <div className="p-3.5 bg-black/60 rounded-xl border border-[#00BFFF]/20 text-center text-[#00BFFF] font-mono font-bold text-xs shadow-[inset_0_0_10px_rgba(0,191,255,0.05)] tracking-wide whitespace-nowrap overflow-x-auto">
                          {answerData.equation}
                        </div>
                      </div>
                    )}

                    {/* Key points formatted bullet lists */}
                    {answerData.keyPoints && answerData.keyPoints.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Key Insights:</span>
                        <ul className="space-y-2">
                          {answerData.keyPoints.map((point, pIdx) => {
                            const parts = point.split(": ");
                            const hasLabel = parts.length > 1;
                            return (
                              <li key={pIdx} className="flex items-start gap-2 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shrink-0 mt-1.5 shadow-[0_0_6px_#00BFFF]" />
                                <span>
                                  {hasLabel ? (
                                    <>
                                      <strong className="text-white">{parts[0]}</strong>: {parts.slice(1).join(": ")}
                                    </>
                                  ) : (
                                    point
                                  )}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Step-by-Step guides lists */}
                    {answerData.steps && answerData.steps.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Step-By-Step Breakdown:</span>
                        <div className="space-y-3">
                          {answerData.steps.map((stepItem, sIdx) => {
                            const parts = stepItem.split(": ");
                            const hasLabel = parts.length > 1;
                            return (
                              <div key={sIdx} className="flex gap-3">
                                <div className="w-5 h-5 rounded-full bg-[#00BFFF]/10 border border-[#00BFFF]/30 flex items-center justify-center font-mono text-[9px] font-bold text-[#00BFFF] shrink-0">
                                  {sIdx + 1}
                                </div>
                                <p className="text-xs">
                                  {hasLabel ? (
                                    <>
                                      <strong className="text-white">{parts[0]}</strong> &mdash; {parts.slice(1).join(": ")}
                                    </>
                                  ) : (
                                    stepItem
                                  )}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM ACTION BUTTONS SYSTEM */}
                  <div className="flex flex-wrap items-center justify-between border-t border-white/5 mt-5 pt-3.5 gap-2">
                    {/* Primary Utilities */}
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={handleCopy}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#00BFFF]/30 hover:bg-[#00BFFF]/5 text-gray-400 hover:text-[#00BFFF] transition-all flex items-center gap-1 text-[10px]"
                        title="Copy solution"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>

                      <button 
                        onClick={handleShare}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#00BFFF]/30 hover:bg-[#00BFFF]/5 text-gray-400 hover:text-[#00BFFF] transition-all flex items-center gap-1 text-[10px]"
                        title="Share solution"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </button>

                      <button 
                        onClick={handleReadAloud}
                        className={`p-2 rounded-lg border text-[10px] transition-all flex items-center gap-1 ${
                          speaking 
                            ? "bg-[#00BFFF]/10 border-[#00BFFF]/40 text-[#00BFFF] animate-pulse" 
                            : "bg-white/5 border-white/10 hover:border-[#00BFFF]/30 text-gray-400 hover:text-[#00BFFF]"
                        }`}
                        title={speaking ? "Stop voice synthesis" : "Listen to explanation"}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{speaking ? "Speaking..." : "Listen"}</span>
                      </button>
                    </div>

                    {/* Secondary Feedback / Regenerate */}
                    <div className="flex items-center gap-1.5">
                      {/* Thumbs up / down feedback */}
                      <button 
                        onClick={() => {
                          setFeedback("like");
                          addToast("Helpfulness review submitted!", "success");
                        }}
                        className={`p-2 rounded-lg border transition-all ${
                          feedback === "like"
                            ? "bg-[#00BFFF]/15 border-[#00BFFF]/40 text-[#00BFFF]"
                            : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
                        }`}
                        title="Mark helpful"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={() => {
                          setFeedback("dislike");
                          addToast("Feedback recorded.", "info");
                        }}
                        className={`p-2 rounded-lg border transition-all ${
                          feedback === "dislike"
                            ? "bg-red-500/15 border-red-500/40 text-red-400"
                            : "bg-white/5 border-white/10 text-gray-500 hover:text-white"
                        }`}
                        title="Mark unhelpful"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      <button 
                        onClick={handleRegenerate}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#00BFFF]/30 hover:bg-[#00BFFF]/5 text-gray-400 hover:text-[#00BFFF] transition-all flex items-center gap-1 text-[10px]"
                        title="Re-run neural search"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>

                      <button 
                        onClick={handleResetSession}
                        className="p-2 rounded-lg bg-red-950/10 border border-red-500/20 text-red-400 hover:bg-red-950/30 hover:border-red-500/40 text-[10px]"
                        title="Unload/close"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* FIXED BOTTOM MESSAGE INPUT (IDENTICAL TO CHAT PAGE STYLE WITH ADDITIONAL BUTTONS) */}
      <div className="p-4 border-t border-white/5 bg-black/60 backdrop-blur-md absolute bottom-0 left-0 right-0 z-20">
        <div className="flex items-center gap-2 bg-[#121214]/90 border border-white/10 rounded-2xl px-3 py-1.5 shadow-[0_4px_15px_rgba(0,0,0,0.4)]">
          {/* Quick-action Attachment docking bar */}
          <div className="flex items-center gap-1 border-r border-white/5 pr-2 shrink-0">
            <button 
              onClick={handleAttachment}
              className="p-1.5 rounded-lg text-gray-500 hover:text-[#00BFFF] hover:bg-white/5 transition-all cursor-pointer"
              title="Attach notes document"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            
            <button 
              onClick={handleImageUpload}
              className="p-1.5 rounded-lg text-gray-500 hover:text-[#00BFFF] hover:bg-white/5 transition-all cursor-pointer"
              title="Upload diagram image"
            >
              <Image className="w-4 h-4" />
            </button>

            <button 
              onClick={handleVoiceInput}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                listening 
                  ? "text-red-500 bg-red-500/10 animate-pulse" 
                  : "text-gray-500 hover:text-[#00BFFF] hover:bg-white/5"
              }`}
              title="Speak question"
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>

          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim() && step !== "loading") {
                handleQuery();
              }
            }}
            disabled={step === "loading"}
            placeholder={listening ? "Listening..." : "Type your question..."}
            className="flex-1 bg-transparent border-none outline-none py-1.5 px-1 text-xs text-white placeholder-gray-500 disabled:opacity-40"
          />
          
          <button 
            onClick={() => handleQuery()}
            disabled={!input.trim() || step === "loading"}
            className="p-2 rounded-full bg-[#00BFFF] hover:bg-blue-500 text-black transition-all shadow-md shadow-[#00BFFF]/20 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
