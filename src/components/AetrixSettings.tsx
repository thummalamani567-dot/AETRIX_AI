import React, { useState } from "react";
import { 
  ArrowLeft, Palette, Bell, Globe, Shield, Lock, Sparkles, 
  Database, HelpCircle, Info, ChevronRight, Check, FileText, LogOut
} from "lucide-react";
import { motion } from "motion/react";

interface AetrixSettingsProps {
  onBack: () => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  userEmail?: string;
  onLogout?: () => void;
  onClearChatHistory?: () => void;
}

export default function AetrixSettings({ onBack, addToast, userEmail, onLogout, onClearChatHistory }: AetrixSettingsProps) {
  // Config states
  const [theme, setTheme] = useState("cosmic");
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sound: true,
    updates: true
  });
  const [language, setLanguage] = useState("english");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [aiCreativity, setAiCreativity] = useState(70);
  const [twoFactor, setTwoFactor] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      addToast(`${String(key).toUpperCase()} notifications updated.`, "success");
      return updated;
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#070a13] text-white font-sans flex flex-col overflow-y-auto select-none z-30" id="aetrix-settings-screen">
      {/* Background Star pattern and custom glows */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#0b0f19] to-transparent opacity-70 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#00BFFF]/5 blur-3xl top-10 left-1/4 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#1E90FF]/5 blur-3xl bottom-10 right-1/4 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top sticky Navbar */}
      <header className="h-[64px] shrink-0 border-b border-white/10 flex items-center justify-between px-5 relative z-40 bg-black/40 backdrop-blur-md sticky top-0">
        <button 
          onClick={onBack}
          className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          id="settings-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold tracking-[0.2em] text-sm text-white absolute left-1/2 transform -translate-x-1/2">
          AETRIX <span className="text-[#00BFFF]">AI</span>
        </span>
        <div className="w-9 h-9" /> {/* Placeholder for alignment symmetry */}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8 relative z-20 space-y-7 pb-24">
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">System Settings</h1>
          <p className="text-gray-400 text-xs font-sans">Configure your cognitive platform nodes</p>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent mx-auto mt-2 opacity-60" />
        </div>

        {/* List of Settings Accordion Groups */}
        <div className="space-y-4">

          {/* Group 1: Appearance */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "appearance" ? null : "appearance")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00BFFF]/10 border border-[#00BFFF]/20 flex items-center justify-center">
                  <Palette className="w-4 h-4 text-[#00BFFF]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">Appearance & Themes</h3>
                  <p className="text-[10px] text-gray-500">Visual layout, interface density, style theme</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "appearance" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "appearance" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Interface Theme Preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "cosmic", label: "Cosmic Glow (Neon Blue)", colors: "from-[#070a13] to-[#00BFFF]" },
                      { id: "obsidian", label: "Midnight Velvet (Black)", colors: "from-[#000000] to-gray-800" },
                      { id: "monochrome", label: "Carbon Steel (Grey)", colors: "from-[#111111] to-zinc-500" },
                      { id: "nebula", label: "Purple Aurora (Violet)", colors: "from-[#0a0515] to-fuchsia-500" }
                    ].map((t) => {
                      const isSel = theme === t.id;
                      return (
                        <button 
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            addToast(`Visual skin shifted to ${t.label}.`, "success");
                          }}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-[75px] transition-all cursor-pointer ${
                            isSel ? "border-[#00BFFF] bg-[#00BFFF]/5" : "border-white/5 bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] font-semibold text-gray-300">{t.label}</span>
                            {isSel && <div className="w-3 h-3 rounded-full bg-[#00BFFF] flex items-center justify-center text-black"><Check className="w-2 h-2 stroke-[4px]" /></div>}
                          </div>
                          <div className={`h-2.5 w-full rounded-md bg-gradient-to-r ${t.colors} opacity-85`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Group 2: Notifications */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "notifications" ? null : "notifications")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">Notification Settings</h3>
                  <p className="text-[10px] text-gray-500">Push pings, system sounds, dispatch alerts</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "notifications" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "notifications" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-3.5">
                {[
                  { key: "push" as const, label: "Neural Push Notifications", desc: "Show immediate real-time desktop alerts" },
                  { key: "email" as const, label: "Weekly Account Summaries", desc: "Email metrics, insights and session maps" },
                  { key: "sound" as const, label: "Workspace Ambient Audio", desc: "Synthesizer feedback sounds on event completions" },
                  { key: "updates" as const, label: "System Service Advisories", desc: "Product feature updates and patch log notifications" }
                ].map((item) => {
                  const val = notifications[item.key];
                  return (
                    <div key={item.key} className="flex items-center justify-between py-1">
                      <div className="pr-4">
                        <span className="text-xs font-semibold text-gray-300 block">{item.label}</span>
                        <span className="text-[10px] text-gray-500 block">{item.desc}</span>
                      </div>
                      <button 
                        onClick={() => handleToggleNotification(item.key)}
                        className={`w-10 h-6.5 rounded-full p-1 transition-colors cursor-pointer flex items-center ${val ? "bg-[#00BFFF]" : "bg-white/10"}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-black shadow-md transform transition-transform ${val ? "translate-x-3.5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Group 3: Language */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "language" ? null : "language")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">Language & Region</h3>
                  <p className="text-[10px] text-gray-500">System display dial, formatting, region standards</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "language" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "language" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">System Dial Language</label>
                <div className="space-y-1.5">
                  {[
                    { id: "english", label: "English (United States)", short: "EN-US" },
                    { id: "spanish", label: "Español (España)", short: "ES-ES" },
                    { id: "french", label: "Français (France)", short: "FR-FR" },
                    { id: "japanese", label: "日本語 (日本)", short: "JA-JP" }
                  ].map((l) => {
                    const isSel = language === l.id;
                    return (
                      <button 
                        key={l.id}
                        onClick={() => {
                          setLanguage(l.id);
                          addToast(`Display language switched to ${l.label}.`, "info");
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                          isSel ? "border-[#00BFFF]/50 bg-[#00BFFF]/5 text-white" : "border-white/5 bg-white/5 hover:bg-white/10 text-gray-400"
                        }`}
                      >
                        <span>{l.label}</span>
                        <span className="text-[10px] opacity-65 font-mono">{l.short}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Group 4: Privacy */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "privacy" ? null : "privacy")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">Privacy Controls</h3>
                  <p className="text-[10px] text-gray-500">Shared telemetries, incognito thread mode, query logging</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "privacy" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "privacy" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="pr-4">
                    <span className="text-xs font-semibold text-gray-300 block">Incognito Threading Mode</span>
                    <span className="text-[10px] text-gray-500 block">Do not persist chat histories in the local indexing database after ending sessions.</span>
                  </div>
                  <button 
                    onClick={() => {
                      setPrivacyMode(!privacyMode);
                      addToast(privacyMode ? "Privacy encryption mode offline." : "Strict privacy isolation node activated.", "info");
                    }}
                    className={`w-10 h-6.5 rounded-full p-1 transition-colors cursor-pointer flex items-center shrink-0 ${privacyMode ? "bg-[#00BFFF]" : "bg-white/10"}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-black shadow-md transform transition-transform ${privacyMode ? "translate-x-3.5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Group 5: Security */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "security" ? null : "security")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">Security Nodes</h3>
                  <p className="text-[10px] text-gray-500">2FA verification key, trusted devices logging, API tokens</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "security" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "security" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-300 block">Two-Factor Authentication</span>
                    <span className="text-[10px] text-gray-500 block">Require a temporary neural token before credential changes.</span>
                  </div>
                  <button 
                    onClick={() => {
                      setTwoFactor(!twoFactor);
                      addToast(twoFactor ? "Two-Factor authentication disengaged." : "Two-Factor verification nodes initialized.", "success");
                    }}
                    className={`w-10 h-6.5 rounded-full p-1 transition-colors cursor-pointer flex items-center shrink-0 ${twoFactor ? "bg-[#00BFFF]" : "bg-white/10"}`}
                  >
                    <div className={`w-4.5 h-4.5 rounded-full bg-black shadow-md transform transition-transform ${twoFactor ? "translate-x-3.5" : "translate-x-0"}`} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Group 6: AI Preferences */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "ai-preferences" ? null : "ai-preferences")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">AI Preferences</h3>
                  <p className="text-[10px] text-gray-500">Temperature, creativity sliders, output layout style</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "ai-preferences" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "ai-preferences" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-gray-300">Cognitive Temperature</span>
                    <span className="font-mono text-[#00BFFF] font-bold">{(aiCreativity / 100).toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={aiCreativity}
                    onChange={(e) => setAiCreativity(Number(e.target.value))}
                    className="w-full accent-[#00BFFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-gray-500 font-sans uppercase">
                    <span>Precise (0.1)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Group 7: Data & Storage */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "data-storage" ? null : "data-storage")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Database className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">Data & Storage</h3>
                  <p className="text-[10px] text-gray-500">Clear cached indices, export workspaces, sync nodes</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "data-storage" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "data-storage" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-3">
                <button 
                  onClick={() => {
                    addToast("Exporting workspace archives... ZIP packet downloading shortly.", "info");
                    addToast("Workspace exported.", "success");
                  }}
                  className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors cursor-pointer text-center"
                >
                  Export Space Archives
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to permanently clear your chat history? This action cannot be undone.")) {
                      localStorage.removeItem(`aetrix_conversations_${userEmail || "guest"}`);
                      if (onClearChatHistory) {
                        onClearChatHistory();
                      }
                      addToast("Your chat history has been permanently cleared.", "success");
                    }
                  }}
                  className="w-full py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 rounded-xl text-xs font-semibold text-red-300 transition-colors cursor-pointer text-center"
                >
                  Clear Chat History
                </button>
              </div>
            )}
          </div>

          {/* Group 8: Help & Support */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "help-support" ? null : "help-support")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">Help & Support</h3>
                  <p className="text-[10px] text-gray-500">Knowledge base, customer grid node, help manuals</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "help-support" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "help-support" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-3 text-xs text-gray-400 leading-relaxed font-sans">
                <p>Need support or guidance on query structures?</p>
                <p>Our neural customer grid is live 24/7. Connect directly to support engineers via <span className="text-[#00BFFF] font-semibold underline">support@aetrix.ai</span></p>
                <button 
                  onClick={() => addToast("Support ticket sequence launched.", "info")}
                  className="w-full py-2 bg-[#00BFFF]/10 hover:bg-[#00BFFF]/20 border border-[#00BFFF]/20 rounded-xl text-xs font-semibold text-[#00BFFF] transition-colors cursor-pointer"
                >
                  Create Secure Ticket
                </button>
              </div>
            )}
          </div>

          {/* Group 9: About AETRIX AI */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "about" ? null : "about")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                  <Info className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">About AETRIX AI</h3>
                  <p className="text-[10px] text-gray-500">Node specification, build version, licensing</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "about" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "about" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-3 font-mono text-[10px] text-gray-400">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>SYSTEM VERSION</span>
                  <span className="text-[#00BFFF]">v2.50.14-PRO</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>COGNITIVE CORE</span>
                  <span>HYPER-NEURAL NET-X8</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span>LICENSE STATUS</span>
                  <span className="text-emerald-400 font-semibold">VALID SECURE CORE</span>
                </div>
                <div className="pt-2 text-[9px] text-gray-500 leading-normal font-sans text-center">
                  © 2026 AETRIX AI Inc. This system operates under fully end-to-end sandbox routing. All sessions are cryptographically isolated.
                </div>
              </div>
            )}
          </div>

          {/* Group 10: Terms & Conditions */}
          <div className="bg-[#0e1424]/90 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <button 
              onClick={() => setActiveGroup(activeGroup === "terms" ? null : "terms")}
              className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-200">Terms & Conditions</h3>
                  <p className="text-[10px] text-gray-500">Review terms of use and sandbox boundaries</p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${activeGroup === "terms" ? "rotate-90" : ""}`} />
            </button>

            {activeGroup === "terms" && (
              <div className="p-4 border-t border-white/5 bg-black/20 space-y-3 font-sans text-[11px] text-gray-400 leading-relaxed">
                <p className="font-semibold text-white">Terms of Cognitive Sandbox Services:</p>
                <p>1. **Acceptable Use**: AETRIX AI is provided strictly for helpful cognitive explorations and task acceleration. Any attempt to abuse the neural models, execute malicious payloads, or destabilize sandbox boundaries is forbidden.</p>
                <p>2. **Data Cryptography**: All sessions, input matrices, and loaded media packets are stored on your local device node cache and are secured through end-to-end sandbox routing.</p>
                <p>3. **Model Limitations**: Responses are processed using the Gemini API. While highly optimized, intelligence artifacts may contain variations or simulated outputs; verify critical parameters independently.</p>
              </div>
            )}
          </div>

        </div>

        {/* Logout System Button */}
        {onLogout && (
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to log out of the AETRIX AI system? Your local visual state will be reset.")) {
                onLogout();
              }
            }}
            className="w-full h-[52px] rounded-2xl bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 text-red-400 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from System</span>
          </button>
        )}

      </main>
    </div>
  );
}
