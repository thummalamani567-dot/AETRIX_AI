import React, { useState, useEffect } from "react";
import { ArrowLeft, Folder, Plus, Calendar, Star, Trash2, Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AetrixLogo from "./AetrixLogo";

interface Project {
  id: string;
  name: string;
  desc: string;
  category: string;
  updatedAt: string;
  starred: boolean;
}

interface AetrixProjectsProps {
  onBack: () => void;
  addToast: (message: string, type?: "success" | "error" | "info") => void;
}

export default function AetrixProjects({ onBack, addToast }: AetrixProjectsProps) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const userEmail = localStorage.getItem("aetrix_user_email") || "guest@aetrix.ai";
    const stored = localStorage.getItem(`aetrix_projects_${userEmail}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const userEmail = localStorage.getItem("aetrix_user_email") || "guest@aetrix.ai";
    localStorage.setItem(`aetrix_projects_${userEmail}`, JSON.stringify(projects));
  }, [projects]);

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState("AI Development");

  const filtered = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.desc.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProj: Project = {
      id: "p-" + Date.now(),
      name: newName,
      desc: newDesc || "No details specified.",
      category: newCat,
      updatedAt: new Date().toISOString().split('T')[0],
      starred: false
    };

    setProjects([newProj, ...projects]);
    setNewName("");
    setNewDesc("");
    setShowAddModal(false);
    addToast("New Neural Project node initialized.", "success");
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
    addToast("Project node disengaged safely.", "info");
  };

  const handleToggleStar = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, starred: !p.starred } : p));
  };

  return (
    <div className="absolute inset-0 w-full h-[100dvh] max-h-[100dvh] bg-[#050811] text-white font-sans flex flex-col overflow-y-auto select-none z-30" id="aetrix-projects-screen">
      {/* Visual background flourishes */}
      <div className="absolute top-0 inset-x-0 h-[380px] bg-gradient-to-b from-[#0b0f19] to-transparent opacity-70 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] rounded-full bg-[#00BFFF]/10 blur-3xl -top-10 -left-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top sticky Navbar */}
      <header className="h-[64px] shrink-0 border-b border-white/10 flex items-center justify-between px-5 relative z-40 bg-black/40 backdrop-blur-md sticky top-0">
        <button 
          onClick={onBack}
          className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer flex items-center justify-center"
          id="projects-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold tracking-[0.2em] text-sm text-white absolute left-1/2 transform -translate-x-1/2">
          AETRIX <span className="text-[#00BFFF]">AI</span>
        </span>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-2 text-[#00BFFF] hover:text-white hover:bg-[#00BFFF]/10 rounded-xl transition-all cursor-pointer flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-lg mx-auto w-full px-5 py-8 relative z-20 space-y-6 pb-24">
        
        {/* Header Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-white">Project Workspaces</h1>
          <p className="text-gray-400 text-xs">Sandbox shards and training directory modules</p>
          <div className="w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent mx-auto mt-2 opacity-60" />
        </div>

        {/* Search tool bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search workspaces by node name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0d1222]/90 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#00BFFF]/50 transition-all select-text"
          />
        </div>

        {/* Project cards listing */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.length === 0 ? (
            <div className="text-center py-12 flex flex-col items-center justify-center space-y-6" id="projects-empty-state">
              <div className="scale-75 opacity-90">
                <AetrixLogo />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-gray-200">No Projects Yet</p>
                <p className="text-xs text-gray-500">Your created projects will appear here.</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl p-6">
              <Folder className="w-12 h-12 text-gray-600 mx-auto mb-3 animate-pulse" />
              <p className="text-sm font-semibold text-gray-300">No matching projects found</p>
              <p className="text-xs text-gray-500 mt-1">Try refining your search terms.</p>
            </div>
          ) : (
            filtered.map((proj) => (
              <div 
                key={proj.id}
                className="bg-[#0d1222]/90 border border-white/10 rounded-2xl p-5 hover:border-[#00BFFF]/30 transition-all shadow-lg relative group overflow-hidden"
              >
                {/* Visual side accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1E90FF] to-[#00BFFF] opacity-40 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#00BFFF] bg-[#00BFFF]/10 border border-[#00BFFF]/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {proj.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {proj.updatedAt}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white tracking-wide group-hover:text-[#00BFFF] transition-colors">
                      {proj.name}
                    </h3>
                    
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {proj.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 relative z-10">
                    <button 
                      onClick={() => handleToggleStar(proj.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-yellow-400 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${proj.starred ? "text-yellow-400 fill-yellow-400" : ""}`} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </main>

      {/* CREATE NEW PROJECT MODAL */}
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
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00BFFF]" />
                <span>Initialize Project</span>
              </h3>
              <p className="text-xs text-gray-400 font-sans">Deploy an isolated neural sandbox directory to store specific memories and variables.</p>

              <form onSubmit={handleCreateProject} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Project Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter project node label..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00BFFF]/50 text-sm text-white select-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Category</label>
                  <select 
                    value={newCat} 
                    onChange={(e) => setNewCat(e.target.value)}
                    className="w-full bg-[#0d1222] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00BFFF]/50 text-sm text-white cursor-pointer"
                  >
                    <option value="AI Development">AI Development</option>
                    <option value="Data Engineering">Data Engineering</option>
                    <option value="Acoustics Node">Acoustics Node</option>
                    <option value="General Sandbox">General Sandbox</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">Core Description</label>
                  <textarea 
                    placeholder="Describe project specifications..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#00BFFF]/50 text-sm text-white resize-none select-text"
                  />
                </div>

                <div className="flex gap-3 pt-2">
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
                    Deploy Node
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
