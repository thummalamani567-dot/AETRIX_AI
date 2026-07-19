import React, { useState, useEffect } from "react";
import { ArrowLeft, BookOpen, Search, Copy, Check, Star, Heart, Plus, Trash2, Upload, X, FileText, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AetrixLogo from "./AetrixLogo";

interface LibraryItem {
  id: string;
  title: string;
  category: string;
  prompt: string;
  likes: number;
  starred: boolean;
  fileName?: string;
}

interface AetrixLibraryProps {
  onBack: () => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

export default function AetrixLibrary({ onBack, addToast }: AetrixLibraryProps) {
  const [items, setItems] = useState<LibraryItem[]>(() => {
    const userEmail = localStorage.getItem("aetrix_user_email") || "guest@aetrix.ai";
    const stored = localStorage.getItem(`aetrix_library_${userEmail}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("aetrix_user_email") || "guest@aetrix.ai";
    localStorage.setItem(`aetrix_library_${userEmail}`, JSON.stringify(items));
  }, [items]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Writing");
  const [newPrompt, setNewPrompt] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const categories = ["All", "Writing", "Coding", "Business", "Files"];

  const filtered = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.prompt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast("Prompt snippet copied to secure clipboard.", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleStar = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, starred: !i.starred } : i));
  };

  const handleLikeItem = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, likes: i.likes + 1 } : i));
    addToast("Neural index template upvoted.", "success");
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    addToast("Library item removed safely.", "info");
  };

  // Drag and drop handlers
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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    setUploadedFileName(file.name);
    setNewTitle(file.name);
    setNewCategory("Files");
    
    // Attempt to read text content if applicable
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewPrompt(event.target.result as string);
      } else {
        setNewPrompt(`Uploaded file payload: ${file.name} (${Math.round(file.size / 1024)} KB)`);
      }
    };
    reader.readAsText(file);
    addToast(`File metadata loaded: ${file.name}`, "info");
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) {
      addToast("Please provide both title and content/prompt.", "error");
      return;
    }

    const newItem: LibraryItem = {
      id: "lib-" + Date.now(),
      title: newTitle,
      category: newCategory,
      prompt: newPrompt,
      likes: 0,
      starred: false,
      fileName: uploadedFileName || undefined
    };

    setItems([newItem, ...items]);
    setNewTitle("");
    setNewPrompt("");
    setUploadedFileName("");
    setNewCategory("Writing");
    setShowAddModal(false);
    addToast("Neural library document saved successfully.", "success");
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#04060d] text-white font-sans flex flex-col overflow-y-auto select-none z-30" id="aetrix-library-screen">
      {/* Immersive space flourishes */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-[#0a0d18] to-transparent opacity-70 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#00BFFF]/5 blur-3xl -top-20 -right-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Top sticky Navbar */}
      <header className="h-[64px] shrink-0 border-b border-white/10 flex items-center justify-between px-5 relative z-40 bg-black/40 backdrop-blur-md sticky top-0">
        <button 
          onClick={onBack}
          className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          id="library-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold tracking-[0.2em] text-sm text-white absolute left-1/2 transform -translate-x-1/2">
          AETRIX <span className="text-[#00BFFF]">AI</span>
        </span>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-2 text-[#00BFFF] hover:text-white hover:bg-[#00BFFF]/10 rounded-xl transition-all cursor-pointer flex items-center justify-center animate-pulse"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl lg:max-w-7xl xl:max-w-[90%] w-full mx-auto px-5 py-8 relative z-20 space-y-6 pb-24 animate-fade-in">
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Neural Library</h1>
          <p className="text-gray-400 text-xs">Curated prompt sequences, scripts, and layout nodes</p>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent mx-auto mt-2 opacity-60" />
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search templates in neural catalog..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d1222]/90 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00BFFF]/50 transition-all select-text"
          />
        </div>

        {/* Category selector row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none">
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 border ${
                  isSel 
                    ? "bg-[#00BFFF] text-black border-[#00BFFF] shadow-[0_0_12px_rgba(0,191,255,0.25)]" 
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Cards list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center space-y-6" id="library-empty-state">
              <div className="scale-75 opacity-90">
                <AetrixLogo />
              </div>
              <div className="space-y-1 px-4">
                <p className="text-lg font-bold text-gray-200">Library is Empty</p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">Your saved files and AI documents will appear here.</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl p-6">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-gray-300">No matching documents found</p>
              <p className="text-xs text-gray-500 mt-1">Try refining your search terms or changing filters.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id}
                className="bg-[#0e1424]/90 border border-white/10 rounded-2xl p-5 hover:border-[#00BFFF]/30 transition-all shadow-xl space-y-4 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#00BFFF] bg-[#00BFFF]/10 border border-[#00BFFF]/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 relative z-10">
                    <button 
                      onClick={() => handleToggleStar(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <Star className={`w-3.5 h-3.5 ${item.starred ? "text-yellow-400 fill-yellow-400" : ""}`} />
                    </button>
                    <button 
                      onClick={() => handleLikeItem(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-pink-400 hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1 text-[10px]"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>{item.likes}</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-[#00BFFF] transition-colors flex items-center gap-2">
                    {item.category === "Files" && <FileText className="w-3.5 h-3.5 text-gray-400" />}
                    <span>{item.title}</span>
                  </h3>
                  <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 text-xs text-gray-400 leading-relaxed font-mono relative">
                    <p className="line-clamp-3 select-text whitespace-pre-wrap">{item.prompt}</p>
                    
                    <button 
                      onClick={() => handleCopyPrompt(item.id, item.prompt)}
                      className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-white/5 hover:bg-[#00BFFF] hover:text-black text-gray-400 border border-white/10 hover:border-transparent transition-all cursor-pointer"
                      title="Copy content"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {/* SAVE DOCUMENT / FILE UPLOAD MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-[#0d1222] border border-white/10 rounded-[24px] p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00BFFF]" />
                  <span>Save to Library</span>
                </span>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </h3>

              <form onSubmit={handleSaveItem} className="space-y-3.5">
                {/* Drag and Drop Box */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-uploader")?.click()}
                  className={`border border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    isDragging ? "border-[#00BFFF] bg-[#00BFFF]/10" : "border-white/15 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <input 
                    type="file" 
                    id="file-uploader" 
                    className="hidden" 
                    onChange={handleFileSelect} 
                  />
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-gray-300">Drag & drop files here, or click</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Supports images, logs, text documents</p>
                  {uploadedFileName && (
                    <div className="mt-2 text-[11px] text-[#00BFFF] font-mono truncate px-2 bg-[#00BFFF]/10 py-1 rounded-md">
                      Selected: {uploadedFileName}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Title / Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter document title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-[#00BFFF]/50 text-sm text-white select-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Category</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#0d1222] border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-[#00BFFF]/50 text-sm text-white cursor-pointer"
                  >
                    <option value="Writing">Writing</option>
                    <option value="Coding">Coding</option>
                    <option value="Business">Business</option>
                    <option value="Files">Files</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Content / Body / Prompt</label>
                  <textarea 
                    required
                    placeholder="Enter details, prompts, or body text..."
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 outline-none focus:border-[#00BFFF]/50 text-sm text-white resize-none select-text"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button 
                    type="button" 
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-gray-300 hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-xs font-semibold text-white hover:opacity-95 shadow-md cursor-pointer"
                  >
                    Save Node
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
