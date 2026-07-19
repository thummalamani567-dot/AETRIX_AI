import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Search, MessageSquare, Languages, FileText, 
  Code2, FileUser, FileSpreadsheet, Terminal, GraduationCap, 
  ChevronRight, Sparkles, X
} from "lucide-react";
import PremiumSpaceBackground from "./PremiumSpaceBackground";

interface ToolItem {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<any>;
  color: string;
  borderColor: string;
  bgGlow: string;
  btnBorder: string;
}

interface AetrixFeaturesPageProps {
  onBack: () => void;
  onSelectTool: (toolId: string) => void;
  userName?: string;
}

// Subtle floating particle helper
const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 15 + 15,
  delay: Math.random() * -20,
}));

function formatChatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function AetrixFeaturesPage({ onBack, onSelectTool, userName = "Aetrix User" }: AetrixFeaturesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const userEmail = localStorage.getItem("aetrix_user_email") || "guest";
  const historyKey = `aetrix_features_history_${userEmail}`;

  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: "success" | "error" | "info" }[]>([]);

  // Long press & Context Menu state
  const [pressTimer, setPressTimer] = useState<any>(null);
  const [hasLongPressed, setHasLongPressed] = useState(false);
  const [selectedConvForMenu, setSelectedConvForMenu] = useState<any | null>(null);
  const [isConvMenuOpen, setIsConvMenuOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [convToDeleteId, setConvToDeleteId] = useState<string | null>(null);

  // Load history from localStorage on mount and when user session changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        setRecentChats(JSON.parse(stored));
      } else {
        setRecentChats([]);
      }
    } catch (e) {
      console.error("Failed to load history", e);
      setRecentChats([]);
    }
  }, [historyKey]);

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    if (type !== "error") return;
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleCardClick = (toolId: string) => {
    if (activeCardId) return;
    setActiveCardId(toolId);
    
    // Clear active conversation pointer so they start a fresh session
    try {
      localStorage.removeItem(`aetrix_active_conv_${toolId}`);
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      onSelectTool(toolId);
    }, 600);
  };

  const startPress = (chat: any) => {
    setHasLongPressed(false);
    const timer = setTimeout(() => {
      setHasLongPressed(true);
      setSelectedConvForMenu(chat);
      setIsConvMenuOpen(true);
    }, 600);
    setPressTimer(timer);
  };

  const endPress = (chat: any, e: React.MouseEvent | React.TouchEvent) => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClickChat = (chat: any) => {
    if (hasLongPressed) {
      setHasLongPressed(false);
      return;
    }
    // Set active conversation pointer in localStorage so the tool page loads it
    try {
      localStorage.setItem(`aetrix_active_conv_${chat.toolId}`, chat.id);
    } catch (e) {
      console.error(e);
    }
    onSelectTool(chat.toolId);
  };

  const handleRenameSave = () => {
    if (!renameTitle.trim() || !selectedConvForMenu) return;

    const updatedChats = recentChats.map((c) => {
      if (c.id === selectedConvForMenu.id) {
        return { ...c, title: renameTitle.trim(), updatedAt: Date.now() };
      }
      return c;
    });

    setRecentChats(updatedChats);
    try {
      localStorage.setItem(historyKey, JSON.stringify(updatedChats));
    } catch (err) {
      console.error(err);
    }

    setIsRenameOpen(false);
    setSelectedConvForMenu(null);
    addToast("Conversation renamed", "success");
  };

  const handleDeleteConversation = (id: string) => {
    const updatedChats = recentChats.filter((c) => c.id !== id);
    setRecentChats(updatedChats);
    try {
      localStorage.setItem(historyKey, JSON.stringify(updatedChats));
      const chatToDelete = recentChats.find((c) => c.id === id);
      if (chatToDelete) {
        localStorage.removeItem(`aetrix_active_conv_${chatToDelete.toolId}`);
      }
    } catch (err) {
      console.error(err);
    }
    addToast("Conversation deleted", "success");
  };

  // Define tools details exactly as in the visual reference
  const allToolsList: ToolItem[] = [
    {
      id: "chat",
      name: "AI Chat",
      desc: "Smart conversations for anything",
      icon: MessageSquare,
      color: "text-white bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]",
      borderColor: "group-hover:border-purple-500/50 hover:border-purple-500/80",
      bgGlow: "group-hover:shadow-[0_0_35px_rgba(168,85,247,0.3)]",
      btnBorder: "border-purple-500/40 text-purple-400 hover:text-white hover:bg-purple-600 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
    },
    {
      id: "translate",
      name: "Translate AI",
      desc: "Translate text in 100+ languages",
      icon: Languages,
      color: "text-white bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]",
      borderColor: "group-hover:border-blue-500/50 hover:border-blue-500/80",
      bgGlow: "group-hover:shadow-[0_0_35px_rgba(59,130,246,0.3)]",
      btnBorder: "border-blue-500/40 text-blue-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
    },
    {
      id: "summarizer",
      name: "Summarizer AI",
      desc: "Summarize any text instantly",
      icon: FileText,
      color: "text-white bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]",
      borderColor: "group-hover:border-emerald-500/50 hover:border-emerald-500/80",
      bgGlow: "group-hover:shadow-[0_0_35px_rgba(16,185,129,0.3)]",
      btnBorder: "border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]"
    },
    {
      id: "cody",
      name: "Cody Helper AI",
      desc: "Generate, debug & explain code",
      icon: Code2,
      color: "text-white bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]",
      borderColor: "group-hover:border-indigo-500/50 hover:border-indigo-500/80",
      bgGlow: "group-hover:shadow-[0_0_35px_rgba(99,102,241,0.3)]",
      btnBorder: "border-indigo-500/40 text-indigo-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]"
    },
    {
      id: "resume",
      name: "Resume AI",
      desc: "Create professional resumes",
      icon: FileUser,
      color: "text-white bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]",
      borderColor: "group-hover:border-orange-500/50 hover:border-orange-500/80",
      bgGlow: "group-hover:shadow-[0_0_35px_rgba(249,115,22,0.3)]",
      btnBorder: "border-orange-500/40 text-orange-400 hover:text-white hover:bg-orange-600 hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]"
    },
    {
      id: "pdf",
      name: "PDF Assistant AI",
      desc: "Ask, analyze & summarize PDFs",
      icon: FileSpreadsheet,
      color: "text-white bg-gradient-to-br from-red-700 via-red-600 to-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]",
      borderColor: "group-hover:border-red-500/50 hover:border-red-500/80",
      bgGlow: "group-hover:shadow-[0_0_35px_rgba(239,68,68,0.3)]",
      btnBorder: "border-red-500/40 text-red-400 hover:text-white hover:bg-red-600 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
    },
    {
      id: "code-gen",
      name: "Generate Code AI",
      desc: "Generate code in any programming language",
      icon: Terminal,
      color: "text-white bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 shadow-[0_0_20px_rgba(20,184,166,0.4)]",
      borderColor: "group-hover:border-teal-500/50 hover:border-teal-500/80",
      bgGlow: "group-hover:shadow-[0_0_35px_rgba(20,184,166,0.3)]",
      btnBorder: "border-teal-500/40 text-teal-400 hover:text-white hover:bg-teal-600 hover:border-teal-500 hover:shadow-[0_0_15px_rgba(20,184,166,0.5)]"
    },
    {
      id: "study",
      name: "Study Helper AI",
      desc: "Learn, solve & understand better",
      icon: GraduationCap,
      color: "text-white bg-gradient-to-br from-sky-600 via-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(14,165,233,0.4)]",
      borderColor: "group-hover:border-sky-500/50 hover:border-sky-500/80",
      bgGlow: "group-hover:shadow-[0_0_35px_rgba(14,165,233,0.3)]",
      btnBorder: "border-[#00BFFF]/40 text-[#00BFFF] hover:text-white hover:bg-[#00BFFF]/60 hover:border-[#00BFFF] hover:shadow-[0_0_15px_rgba(0,191,255,0.5)]"
    }
  ];


  const filteredAll = allToolsList.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00BFFF] selection:text-black overflow-x-hidden relative" id="aetrix-features-page">
      {/* Ultra-premium interactive animated space background */}
      <PremiumSpaceBackground />

      <div className="max-w-5xl lg:max-w-7xl xl:max-w-[90%] 2xl:max-w-[85%] w-full mx-auto px-4 sm:px-6 md:px-8 py-8 pb-20 relative z-10 animate-fade-in">
        
        {/* Header Bar */}
        <header className="flex items-center justify-between mb-8" id="features-header">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#00BFFF] to-blue-600 rounded-lg p-[1px] shadow-[0_0_12px_rgba(0,191,255,0.3)]">
              <span className="font-bold text-xs text-white">A</span>
            </div>
            <span className="font-bold tracking-[0.18em] text-sm text-white">AETRIX <span className="text-[#00BFFF]">AI</span></span>
          </div>

          {/* Back Button */}
          <button 
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-[#0e0e11] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00BFFF]/30 transition-all cursor-pointer shadow-lg shadow-black/40"
            title="Back to Chat"
            id="features-back-btn"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </header>

        {/* Hello Banner */}
        <div className="mb-8" id="hello-banner">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-2">
            Hello, {userName} <span className="animate-bounce inline-block origin-bottom">👋</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">How can I help you today?</p>
        </div>

        {/* Search Input Box */}
        <div className="relative mb-10" id="search-container">
          <Search className="w-5 h-5 text-gray-500 absolute left-4.5 top-3.5" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search anything..." 
            className="w-full h-12 bg-[#0c0c0e] border border-white/10 rounded-2xl pl-12 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00BFFF]/40 focus:shadow-[0_0_15px_rgba(0,191,255,0.1)] transition-all"
            id="search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3 text-xs text-gray-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* AI Features Premium 3-Column Grid */}
        <section className="mb-14" id="all-tools-section">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00BFFF]" />
            <span>AI Features</span>
          </h2>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8" id="tools-grid-3cols">
            {filteredAll.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeCardId === tool.id;
              return (
                <div key={`tool-wrapper-${tool.id}`} className="relative w-full h-full flex flex-col">
                  {/* Soft neon bloom underneath the card - outside of overflow-hidden */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isActive ? { 
                      opacity: [0, 1, 0.7, 0.95], // pulse once, then remain active
                      scale: 1 
                    } : { 
                      opacity: 0, 
                      scale: 0.95 
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute -inset-3 bg-[#00BFFF]/25 rounded-[22px] sm:rounded-[30px] blur-2xl pointer-events-none z-0"
                  />

                  <motion.div
                    onClick={() => handleCardClick(tool.id)}
                    animate={isActive ? {
                      y: -6,
                      borderColor: "rgba(0, 191, 255, 0.6)",
                      boxShadow: "0 20px 40px rgba(0, 191, 255, 0.2), 0 0 30px rgba(0, 191, 255, 0.15)"
                    } : {
                      y: 0,
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 0 15px rgba(0, 191, 255, 0.02)"
                    }}
                    whileHover={activeCardId ? {} : {
                      y: -3,
                      borderColor: "rgba(0, 191, 255, 0.3)",
                      boxShadow: "0 10px 25px rgba(0, 191, 255, 0.1)"
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="group relative flex-1 rounded-[20px] sm:rounded-[28px] bg-[#0c0c0f]/60 border p-3 sm:p-6 md:p-8 flex flex-col items-center justify-between text-center cursor-pointer select-none overflow-hidden backdrop-blur-xl hover:bg-[#111116]/80 z-10"
                  >
                    {/* Glowing background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#00BFFF]/0 to-[#00BFFF]/[0.01] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Bright electric blue light emerging from the bottom edge */}
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={isActive ? { 
                        scaleX: 1, 
                        opacity: [0, 1, 0.8, 1] 
                      } : { 
                        scaleX: 0, 
                        opacity: 0 
                      }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#00BFFF] shadow-[0_0_15px_#00BFFF,0_0_30px_#00BFFF] z-30 origin-center"
                    />

                    {/* Upward spreading glow smoothly across the card */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={isActive ? { 
                        height: "100%", 
                        opacity: [0, 1, 0.6, 0.85] // pulse once, remain subtle
                      } : { 
                        height: 0, 
                        opacity: 0 
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#00BFFF]/30 via-[#00BFFF]/8 to-transparent pointer-events-none z-10"
                    />

                    <div className="flex flex-col items-center w-full z-20">
                      {/* Large Colorful Gradient Icon (+40% size) */}
                      <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl md:rounded-[24px] flex items-center justify-center mb-3 sm:mb-5 ${tool.color} transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(0,191,255,0.15)]`}>
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                      </div>

                      {/* Larger Bold White Title */}
                      <h3 className="text-[10px] sm:text-base md:text-xl font-bold text-white mb-1.5 sm:mb-2 group-hover:text-[#00BFFF] transition-colors leading-tight">
                        {tool.name}
                      </h3>

                      {/* Brighter and easier to read description */}
                      <p className="text-gray-300 text-[8px] sm:text-xs md:text-sm font-medium leading-relaxed line-clamp-2 px-1 mb-4 sm:mb-6">
                        {tool.desc}
                      </p>
                    </div>

                    {/* Glowing Open Button at the bottom */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(tool.id);
                      }}
                      className={`w-full py-1.5 sm:py-2.5 px-3 sm:px-4 border rounded-lg sm:rounded-xl text-[8px] sm:text-xs font-bold bg-transparent transition-all duration-300 cursor-pointer ${tool.btnBorder} flex items-center justify-center shadow-md z-20`}
                    >
                      Open
                    </button>
                    
                    {/* Visual subtle card glow boundary */}
                    <div className={`absolute -inset-[1px] rounded-[20px] sm:rounded-[28px] border border-transparent transition-all duration-300 pointer-events-none ${tool.borderColor} ${tool.bgGlow}`} />
                  </motion.div>
                </div>
              );
            })}
            {filteredAll.length === 0 && (
              <div className="col-span-full py-10 text-center text-gray-500 text-sm">
                No tools found matching your search.
              </div>
            )}
          </div>
        </section>

        {/* Recent Chats Section matching visually */}
        {!searchQuery && (
          <section id="recent-chats-section">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
              Recent Chats
            </h2>
            <div className="rounded-2xl border border-white/10 bg-[#070709] overflow-hidden divide-y divide-white/5">
              {recentChats.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center min-h-[140px]">
                  <MessageSquare className="w-8 h-8 text-gray-600 mb-2" />
                  <p className="text-xs font-semibold text-gray-400">No recent chats</p>
                  <p className="text-[11px] text-gray-500 mt-1">Start a new conversation to create your history.</p>
                </div>
              ) : (
                recentChats.map((chat) => {
                  const toolMeta = allToolsList.find(t => t.id === chat.toolId);
                  const IconComponent = toolMeta ? toolMeta.icon : MessageSquare;
                  
                  return (
                    <div 
                      key={chat.id}
                      onMouseDown={() => startPress(chat)}
                      onMouseUp={(e) => endPress(chat, e)}
                      onMouseLeave={() => {
                        if (pressTimer) {
                          clearTimeout(pressTimer);
                          setPressTimer(null);
                        }
                      }}
                      onTouchStart={() => startPress(chat)}
                      onTouchEnd={(e) => endPress(chat, e)}
                      onClick={() => handleClickChat(chat)}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-white/5 transition-colors cursor-pointer group select-none"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-4 h-4 text-gray-500 group-hover:text-[#00BFFF] transition-colors" />
                        <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">
                          {chat.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-medium">
                          {chat.time || formatChatTime(chat.updatedAt)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

      </div>

      {/* Floating Toast Area */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-2" id="features-toasts">
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

      {/* ---------------------------------------------------- */}
      {/* CONVERSATION OPTIONS BOTTOM SHEET */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isConvMenuOpen && selectedConvForMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsConvMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            />
            
            {/* Bottom Sheet wrapper */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 bg-[#09090b]/95 border-t border-white/10 rounded-t-[24px] z-50 shadow-[0_-8px_40px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto pb-safe flex flex-col items-center"
            >
              {/* Handle bar */}
              <div className="w-12 h-1 bg-white/20 rounded-full my-3.5" />
              
              <div className="w-full max-w-md px-6 pb-8 text-left select-none">
                <div className="flex flex-col gap-1.5 mb-5 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Conversation Options
                  </span>
                  <p className="text-xs text-white truncate font-semibold max-w-sm">
                    {selectedConvForMenu.title}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setRenameTitle(selectedConvForMenu.title);
                      setIsRenameOpen(true);
                      setIsConvMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-gray-200 hover:text-white bg-white/5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-left"
                  >
                    <span className="text-base shrink-0">📝</span>
                    <span>✏️ Rename Chat</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      setConvToDeleteId(selectedConvForMenu.id);
                      setIsDeleteConfirmOpen(true);
                      setIsConvMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/25 active:scale-[0.98] transition-all cursor-pointer text-left"
                  >
                    <span className="text-base shrink-0">🗑️</span>
                    <span>🗑️ Delete Chat</span>
                  </button>
                </div>
                
                <button
                  onClick={() => setIsConvMenuOpen(false)}
                  className="w-full mt-4 flex items-center justify-center py-3 rounded-xl text-xs font-bold text-gray-500 hover:text-white bg-transparent hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* RENAME CHAT DIALOG MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isRenameOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsRenameOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-white font-medium text-sm">
                  <span className="text-base">✏️</span>
                  <span>Rename Conversation</span>
                </div>
                <button 
                  onClick={() => setIsRenameOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 flex-1">
                <p className="text-[11px] text-gray-500 mb-2 font-medium">
                  Enter a new descriptive title for this conversation:
                </p>
                <input
                  type="text"
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none focus:border-[#00BFFF]/40 font-sans"
                  placeholder="Conversation Title"
                  autoFocus
                />
              </div>
              
              <div className="px-5 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setIsRenameOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRenameSave}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Rename
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------- */}
      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {/* ---------------------------------------------------- */}
      <AnimatePresence>
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsDeleteConfirmOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative bg-[#09090b] border border-red-500/25 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2 text-white font-medium text-sm">
                  <span className="text-base">🗑️</span>
                  <span>Delete Conversation?</span>
                </div>
                <button 
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5 flex-1">
                <p className="text-xs text-gray-300 leading-relaxed">
                  Are you sure you want to permanently delete this conversation from your history? This action is irreversible.
                </p>
              </div>
              
              <div className="px-5 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (convToDeleteId) {
                      handleDeleteConversation(convToDeleteId);
                    }
                    setIsDeleteConfirmOpen(false);
                    setConvToDeleteId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 active:scale-95 text-white transition-all cursor-pointer"
                >
                  Yes, delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

