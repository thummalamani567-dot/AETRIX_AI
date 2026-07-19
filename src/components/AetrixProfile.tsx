import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowLeft, MoreVertical, Edit2, Calendar, Crown, Shield, 
  MessageSquare, Star, Download, Settings, LogOut, Check, Camera,
  User, Mail, Key, Bell, Globe, Database, HelpCircle, Info, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AetrixProfileProps {
  userEmail: string;
  userName: string;
  userAvatar?: string;
  onBack: () => void;
  onLogout: () => void;
  onNavigateToSettings: () => void;
  onUpdateProfile: (name: string, email: string, avatar?: string) => Promise<void>;
  onChangePassword?: (currentPass: string, newPass: string) => Promise<void>;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

export default function AetrixProfile({ 
  userEmail, 
  userName, 
  userAvatar,
  onBack, 
  onLogout, 
  onNavigateToSettings,
  onUpdateProfile,
  onChangePassword,
  addToast
}: AetrixProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [tempEmail, setTempEmail] = useState(userEmail);
  const [avatarSeed, setAvatarSeed] = useState(1);
  const [customAvatar, setCustomAvatar] = useState(userAvatar || "");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    setTempName(userName);
  }, [userName]);

  useEffect(() => {
    setTempEmail(userEmail);
    setNewEmail(userEmail);
  }, [userEmail]);

  useEffect(() => {
    setCustomAvatar(userAvatar || "");
  }, [userAvatar]);

  // Image Select & Crop states
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Form states for dialogs
  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newEmail, setNewEmail] = useState(userEmail);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCropImageSrc(event.target.result as string);
          setZoom(1);
          setPanX(0);
          setPanY(0);
          setShowCropModal(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanX(e.touches[0].clientX - dragStart.x);
    setPanY(e.touches[0].clientY - dragStart.y);
  };

  const handleSaveCrop = () => {
    const image = new Image();
    image.src = cropImageSrc;
    image.onload = async () => {
      const canvas = document.createElement("canvas");
      const size = 256;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#0b0f19";
        ctx.fillRect(0, 0, size, size);

        const imgWidth = image.width;
        const imgHeight = image.height;
        
        let drawWidth = size;
        let drawHeight = size;
        
        if (imgWidth > imgHeight) {
          drawWidth = size * (imgWidth / imgHeight);
        } else {
          drawHeight = size * (imgHeight / imgWidth);
        }
        
        const finalWidth = drawWidth * zoom;
        const finalHeight = drawHeight * zoom;
        
        const scaleRatio = size / 192;
        const adjustedPanX = panX * scaleRatio;
        const adjustedPanY = panY * scaleRatio;
        
        const x = (size - finalWidth) / 2 + adjustedPanX;
        const y = (size - finalHeight) / 2 + adjustedPanY;
        
        ctx.drawImage(image, x, y, finalWidth, finalHeight);
        
        const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
        try {
          await onUpdateProfile(tempName, userEmail, croppedBase64);
          setCustomAvatar(croppedBase64);
          setShowCropModal(false);
        } catch (err) {
          // Error is handled/displayed by the caller
        }
      }
    };
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = tempName.trim();
    if (!trimmedName) {
      addToast("Display name cannot be empty.", "error");
      return;
    }
    if (trimmedName.length < 2) {
      addToast("Display name must be at least 2 characters.", "error");
      return;
    }
    
    try {
      await onUpdateProfile(trimmedName, userEmail, customAvatar);
      setIsEditing(false);
      setActiveModal(null);
    } catch (err) {
      // Keep modal open so the user can correct the name
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPass) {
      addToast("Please enter your current password.", "error");
      return;
    }
    if (!newPass) {
      addToast("Please enter a new password.", "error");
      return;
    }
    if (newPass.length < 6) {
      addToast("New password must be at least 6 characters.", "error");
      return;
    }

    try {
      if (onChangePassword) {
        await onChangePassword(currPass, newPass);
        setCurrPass("");
        setNewPass("");
        setActiveModal(null);
      }
    } catch (err: any) {
      addToast(err.message || "Failed to update password.", "error");
    }
  };

  const handleAvatarChange = () => {
    setAvatarSeed(prev => prev + 1);
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0B0F19] text-white font-sans flex flex-col overflow-y-auto select-none z-30" id="aetrix-profile-screen">
      {/* Dynamic Star background and glowing neon blur */}
      <div className="absolute top-0 inset-x-0 h-[450px] bg-gradient-to-b from-[#0f172a] to-transparent opacity-60 pointer-events-none" />
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-r from-[#1E90FF]/10 to-[#00BFFF]/5 blur-3xl -top-10 left-1/2 transform -translate-x-1/2 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header with Back button & Option menu */}
      <header className="h-[64px] shrink-0 border-b border-white/10 flex items-center justify-between px-5 relative z-40 bg-black/40 backdrop-blur-md sticky top-0">
        <button 
          onClick={onBack}
          className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          id="profile-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold tracking-[0.2em] text-sm text-white absolute left-1/2 transform -translate-x-1/2">
          AETRIX <span className="text-[#00BFFF]">AI</span>
        </span>
        <button 
          onClick={onNavigateToSettings}
          className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto px-5 py-8 relative z-20 space-y-7 animate-fade-in">
        
        {/* Title Group */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">My Profile</h1>
          <p className="text-gray-400 text-xs">Manage your account and settings</p>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent mx-auto mt-2 opacity-60" />
        </div>

        {/* HERO CARD - Mani Edits layout */}
        <div 
          className="relative bg-gradient-to-b from-[#0e1628]/95 to-[#080d19]/95 border border-white/10 rounded-[30px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(0,191,255,0.04)] overflow-hidden flex flex-col sm:flex-row items-center gap-6"
          id="profile-hero-card"
        >
          {/* Planet Earth Curve Accent inside Card Background */}
          <div className="absolute right-0 bottom-0 w-[200px] h-[200px] rounded-full bg-gradient-to-tl from-[#00BFFF]/20 via-[#1E90FF]/5 to-transparent blur-xl pointer-events-none translate-x-12 translate-y-12" />
          <div className="absolute right-0 bottom-0 w-[140px] h-[140px] rounded-full border-t border-l border-white/5 bg-[#00BFFF]/5 pointer-events-none translate-x-14 translate-y-14" />

          {/* Avatar Area */}
          <div 
            onClick={triggerFileSelect}
            className="relative group shrink-0 cursor-pointer"
            title="Tap to change profile picture"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] blur-lg opacity-45 group-hover:opacity-75 transition-opacity" />
            <div className="relative w-28 h-28 rounded-full p-0.5 bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] shadow-[0_0_20px_rgba(0,191,255,0.3)]">
              <div className="w-full h-full rounded-full bg-[#0b0f19] overflow-hidden flex items-center justify-center relative">
                <img 
                  src={customAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}-${avatarSeed}`} 
                  alt="Avatar" 
                  className={`rounded-full bg-[#0d1222] ${customAvatar ? 'w-full h-full object-cover' : 'w-24 h-24 object-contain'}`} 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Camera Switch Badge */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                triggerFileSelect();
              }}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#00BFFF] border border-[#0d1222] text-black hover:bg-white transition-all shadow-md cursor-pointer"
              title="Upload new profile picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Meta info */}
          <div className="flex-1 text-center sm:text-left space-y-2 relative z-10 w-full">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-white tracking-wide">{userName}</h3>
                <div className="w-4 h-4 rounded-full bg-[#00BFFF] flex items-center justify-center text-black shrink-0" title="Verified Identity Node">
                  <Check className="w-2.5 h-2.5 stroke-[4px]" />
                </div>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                <span className="text-[10px] text-gray-400 font-mono tracking-wider">SECURE IDENTITY ACTIVE</span>
              </div>
            </div>

            {/* Premium Badges row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#1E90FF]/20 to-[#00BFFF]/20 border border-[#00BFFF]/30 rounded-full text-[10px] font-semibold text-[#00BFFF] tracking-wider uppercase">
                <Crown className="w-3.5 h-3.5" />
                Premium Member
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                <Calendar className="w-3 h-3 text-gray-600" />
                Member since May 2024
              </span>
            </div>
          </div>

          {/* Edit Button right-top alignment */}
          <button 
            onClick={() => setActiveModal("edit-profile")}
            className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer font-medium"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#00BFFF]" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Section Heading */}
        <div className="flex items-center gap-2 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] shadow-[0_0_6px_#00BFFF]" />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account & Settings</h4>
        </div>

        {/* List items container with custom icons and actions */}
        <div className="bg-[#0d1222]/85 border border-white/10 rounded-3xl overflow-hidden shadow-2xl divide-y divide-white/5">
          {[
            { id: "edit-profile", icon: User, title: "Edit Profile", desc: "Update your name, email, and profile picture" },
            { id: "change-password", icon: Shield, title: "Account & Security", desc: "Manage your password and security settings" },
            { id: "subscription", icon: Crown, title: "Subscription", desc: "View your plan and billing details" },
            { id: "chat-history", icon: MessageSquare, title: "Chat History", desc: "View and manage your conversation history" },
            { id: "favorites", icon: Star, title: "Favorites", desc: "View all your favorite chats" },
            { id: "downloads", icon: Download, title: "Downloads", desc: "View your downloaded files" },
            { id: "settings", icon: Settings, title: "Settings", desc: "Customize your app preferences", action: onNavigateToSettings }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveModal(item.id);
                  }
                }}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#00BFFF]/30 transition-all">
                    <Icon className="w-4.5 h-4.5 text-gray-400 group-hover:text-[#00BFFF] transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                  </div>
                </div>
                <div className="text-gray-600 group-hover:text-[#00BFFF] transition-colors ml-4 shrink-0 text-sm font-bold">
                  ➔
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout System Button */}
        <button 
          onClick={onLogout}
          className="w-full border border-red-500/20 bg-red-950/10 hover:bg-red-950/25 rounded-2xl p-4.5 text-center transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-1 group"
          id="profile-logout-btn"
        >
          <div className="flex items-center gap-2 text-red-400 group-hover:text-red-300 font-semibold text-sm">
            <LogOut className="w-4 h-4 text-red-500 shrink-0" />
            <span>Logout</span>
          </div>
          <span className="text-[10px] text-gray-500">Sign out from your account</span>
        </button>

      </main>

      {/* Dynamic Popups for each action modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#0d1222] border border-white/10 rounded-[24px] p-6 shadow-2xl z-10"
            >
              {/* Modal 1: EDIT PROFILE */}
              {activeModal === "edit-profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-[#00BFFF]" />
                    <span>Edit Profile Settings</span>
                  </h3>
                  
                  {/* Tappable Profile Picture in Modal */}
                  <div className="flex flex-col items-center justify-center py-1 space-y-1 select-none">
                    <div 
                      onClick={triggerFileSelect}
                      className="relative w-20 h-20 rounded-full p-0.5 bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] cursor-pointer group shrink-0 shadow-lg shadow-[#00BFFF]/10 hover:shadow-[#00BFFF]/20 transition-all"
                      title="Tap to change profile picture"
                    >
                      <div className="w-full h-full rounded-full bg-[#0b0f19] overflow-hidden flex items-center justify-center relative">
                        <img 
                          src={customAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${userName}-${avatarSeed}`} 
                          alt="Avatar" 
                          className={`rounded-full bg-[#0d1222] ${customAvatar ? 'w-full h-full object-cover' : 'w-14 h-14 object-contain'}`} 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 p-1 rounded-full bg-[#00BFFF] text-black shadow-md border border-[#0d1222]">
                        <Camera className="w-2.5 h-2.5" />
                      </div>
                    </div>
                    <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Tap image to change</span>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#00BFFF]/50 transition-all flex items-center">
                      <User className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                      <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full bg-transparent border-none outline-none text-white text-sm select-text"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-xs font-semibold text-white hover:opacity-95 shadow-md cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Modal 2: ACCOUNT & SECURITY / PASSWORD */}
              {activeModal === "change-password" && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#00BFFF]" />
                    <span>Change Password</span>
                  </h3>
                  <p className="text-xs text-gray-400">Change your secure login password key.</p>

                  <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#00BFFF]/50 transition-all flex items-center">
                      <Key className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                      <input 
                        type="password" 
                        value={currPass}
                        onChange={(e) => setCurrPass(e.target.value)}
                        placeholder="Current Password"
                        className="w-full bg-transparent border-none outline-none text-white text-sm select-text"
                      />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-[#00BFFF]/50 transition-all flex items-center">
                      <Key className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
                      <input 
                        type="password" 
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="New Password"
                        className="w-full bg-transparent border-none outline-none text-white text-sm select-text"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setActiveModal(null)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-xs font-semibold text-white hover:opacity-95 shadow-md cursor-pointer"
                    >
                      Update Key
                    </button>
                  </div>
                </form>
              )}

              {/* Modal 3: SUBSCRIPTION */}
              {activeModal === "subscription" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span>Your Subscription Plan</span>
                  </h3>
                  
                  <div className="p-4 bg-amber-400/5 border border-amber-400/20 rounded-2xl text-left space-y-2">
                    <p className="text-xs font-bold text-amber-300 tracking-widest uppercase">AETRIX PRO PLAN</p>
                    <p className="text-xl font-extrabold text-white">$19.99 <span className="text-xs font-normal text-gray-400">/ month</span></p>
                    <p className="text-[11px] text-gray-300">Renewing automatically on May 24, 2027.</p>
                  </div>

                  <ul className="text-xs text-gray-400 text-left space-y-1.5 list-disc pl-4 font-sans">
                    <li>Unlimited query generation bandwidth</li>
                    <li>Access to premium multimodal neural models</li>
                    <li>Priority GPU scheduling queue latency (~14ms)</li>
                    <li>Full projects memory and vector databases</li>
                  </ul>

                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Close Plan Panel
                  </button>
                </div>
              )}

              {/* Modal 4: CHAT HISTORY */}
              {activeModal === "chat-history" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#00BFFF]" />
                    <span>Chat History Sync</span>
                  </h3>
                  <p className="text-xs text-gray-400">Your chat records are fully encrypted and synchronized to cloud shards.</p>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left space-y-2 font-mono text-[10px]">
                    <p className="text-gray-400">SESSION SHARDS: 12</p>
                    <p className="text-gray-400">STORAGE USED: ~1.24 MB</p>
                    <p className="text-[#00BFFF]">CLOUD STATUS: IN-SYNC</p>
                  </div>

                  <button 
                    onClick={() => {
                      setActiveModal(null);
                    }}
                    className="w-full py-2.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 rounded-xl text-xs font-semibold text-red-300 transition-colors cursor-pointer"
                  >
                    Clear All Shards
                  </button>
                </div>
              )}

              {/* Modal 5: FAVORITES */}
              {activeModal === "favorites" && (
                <div className="space-y-4 text-center">
                  <Star className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                  <h3 className="text-lg font-bold text-white">Favorite Chats</h3>
                  <p className="text-xs text-gray-400">Highlight important responses using the Star tool to reference them anytime.</p>
                  
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 text-left">
                    No starred outputs logged in this workspace shell yet.
                  </div>

                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Close Favorites
                  </button>
                </div>
              )}

              {/* Modal 6: DOWNLOADS */}
              {activeModal === "downloads" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Download className="w-5 h-5 text-[#00BFFF]" />
                    <span>Downloaded Files</span>
                  </h3>
                  <p className="text-xs text-gray-400">Locate downloaded reports, generated scripts, and summary PDFs below.</p>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 text-center">
                    No files downloaded in current workspace.
                  </div>

                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-gray-200 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CROP MODAL */}
      <AnimatePresence>
        {showCropModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCropModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#0d1222] border border-white/10 rounded-[24px] p-6 shadow-2xl z-10 space-y-5"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#00BFFF]" />
                <span>Crop Profile Picture</span>
              </h3>
              <p className="text-xs text-gray-400">Drag to position the image inside the frame, or use the zoom slider below.</p>

              {/* Crop Frame Area */}
              <div className="relative w-48 h-48 rounded-full border border-[#00BFFF]/40 overflow-hidden mx-auto bg-[#050811] shadow-[0_0_25px_rgba(0,191,255,0.15)] select-none">
                <div 
                  className="w-full h-full relative overflow-hidden"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                >
                  <img 
                    src={cropImageSrc} 
                    alt="Source to crop" 
                    className="absolute max-w-none origin-center pointer-events-none"
                    style={{
                      transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                      left: "50%",
                      top: "50%",
                      transformOrigin: "center",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      marginTop: "-50%",
                      marginLeft: "-50%"
                    }}
                  />
                </div>
              </div>

              {/* Slider Controller */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">
                  <span>Zoom Level</span>
                  <span className="text-[#00BFFF] font-mono">{zoom.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="4" 
                  step="0.05" 
                  value={zoom} 
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00BFFF]"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowCropModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSaveCrop}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-xs font-semibold text-white hover:opacity-95 shadow-md cursor-pointer"
                >
                  Apply Crop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
}
