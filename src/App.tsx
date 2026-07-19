import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Cpu } from "lucide-react";
import AetrixLogo from "./components/AetrixLogo";
import AetrixChatWorkspace from "./components/AetrixChatWorkspace";
import AetrixFeaturesPage from "./components/AetrixFeaturesPage";
import AetrixToolPages from "./components/AetrixToolPages";
import AetrixLogin from "./components/AetrixLogin";
import AetrixSignUp from "./components/AetrixSignUp";
import AetrixProfile from "./components/AetrixProfile";
import AetrixSettings from "./components/AetrixSettings";
import AetrixProjects from "./components/AetrixProjects";
import AetrixLibrary from "./components/AetrixLibrary";
import Toast, { ToastMessage } from "./components/Toast";

function SplashScreen() {
  const [loadingText, setLoadingText] = useState("Initializing neural networks...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const textSequence = [
      { delay: 400, text: "Synchronizing quantum models..." },
      { delay: 1000, text: "Authenticating security layers..." },
      { delay: 1600, text: "Injecting aesthetic overlays..." },
      { delay: 2100, text: "System fully online. Redirecting..." }
    ];

    const timeouts = textSequence.map(seq => 
      setTimeout(() => setLoadingText(seq.text), seq.delay)
    );

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 4, 100));
    }, 100);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden font-sans select-none" id="aetrix-splash-screen">
      {/* Background radial neon glowing nebula */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#1E90FF]/10 to-[#00BFFF]/5 blur-3xl" />
      
      {/* Interactive binary matrix background stream */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(0,191,255,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-sm"
      >
        {/* Glowing Logo ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#00BFFF]/20 blur-2xl rounded-full scale-110 animate-pulse" />
          <AetrixLogo />
        </div>

        {/* Brand Details */}
        <div className="mt-2 flex flex-col gap-1 items-center">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-[#00BFFF] uppercase tracking-[0.2em] font-semibold">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "4s" }} />
            <span>AI ENGINE v2.5</span>
          </div>
        </div>

        {/* Status Loading Bar */}
        <div className="w-64 h-[4px] bg-white/10 rounded-full overflow-hidden mt-8 relative">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] rounded-full shadow-[0_0_12px_#00BFFF]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>

        {/* Loading text with micro ticks */}
        <div className="flex items-center gap-2 mt-4 text-xs font-mono tracking-wider text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00BFFF] animate-ping" />
          <span className="truncate max-w-[240px] text-left">{loadingText}</span>
        </div>

        {/* Micro diagnostics stats */}
        <div className="absolute -bottom-36 left-1/2 transform -translate-x-1/2 flex flex-col gap-1 items-center select-none opacity-40">
          <span className="text-[9px] font-mono tracking-[0.25em] text-gray-600">SECURE SHELL ESTABLISHED</span>
          <span className="text-[8px] font-mono text-[#00BFFF]">LATENCY: ~14ms // SYS_OK</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPath, setCurrentPath] = useState(() => {
    const path = window.location.pathname;
    const validPaths = [
      "/", "/chat", "/login", "/signup", "/features", 
      "/features/chat", "/features/translate", "/features/summarizer", 
      "/features/cody", "/features/resume", "/features/pdf", 
      "/features/code-gen", "/features/study",
      "/profile", "/settings", "/projects", "/library"
    ];
    return validPaths.includes(path) || path.startsWith("/features/") ? path : "/";
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("aetrix_is_logged_in") === "true";
  });
  
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem("aetrix_user_email") || "guest@aetrix.ai";
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("aetrix_user_name") || "Guest";
  });

  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem("aetrix_user_avatar") || "";
  });
  
  const [savedInputText, setSavedInputText] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString() + "-" + Math.floor(Math.random() * 1000000);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  // Run Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  // Securely restore the logged-in session from backend on mount/restart
  useEffect(() => {
    const token = localStorage.getItem("aetrix_session_token");
    if (token) {
      fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid session token");
        return res.json();
      })
      .then((data) => {
        setIsLoggedIn(true);
        setUserEmail(data.user.email);
        setUserName(data.user.fullName);
        setUserAvatar(data.user.avatar || "");
        localStorage.setItem("aetrix_is_logged_in", "true");
        localStorage.setItem("aetrix_user_email", data.user.email);
        localStorage.setItem("aetrix_user_name", data.user.fullName);
        localStorage.setItem("aetrix_user_avatar", data.user.avatar || "");
      })
      .catch(() => {
        // Clear stale session
        setIsLoggedIn(false);
        setUserEmail("guest@aetrix.ai");
        setUserName("Guest");
        setUserAvatar("");
        localStorage.removeItem("aetrix_is_logged_in");
        localStorage.removeItem("aetrix_user_email");
        localStorage.removeItem("aetrix_user_name");
        localStorage.removeItem("aetrix_user_avatar");
        localStorage.removeItem("aetrix_session_token");
      });
    } else {
      setIsLoggedIn(false);
      setUserEmail("guest@aetrix.ai");
      setUserName("Guest");
      setUserAvatar("");
    }
  }, []);

  // Listen to browser popstate events (e.g. back/forward browser buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Redirect invalid paths to main chat screen or login
  useEffect(() => {
    if (showSplash) return;
    const validPaths = [
      "/", "/chat", "/login", "/signup", "/features", 
      "/features/chat", "/features/translate", "/features/summarizer", 
      "/features/cody", "/features/resume", "/features/pdf", 
      "/features/code-gen", "/features/study",
      "/profile", "/settings", "/projects", "/library"
    ];
    const isValid = validPaths.includes(currentPath) || currentPath.startsWith("/features/");
    if (!isValid) {
      navigate("/");
      return;
    }

    // Protect features route if not logged in
    if (!isLoggedIn && (currentPath === "/features" || currentPath.startsWith("/features/") || ["/profile", "/settings", "/projects", "/library"].includes(currentPath))) {
      navigate("/");
      addToast("Please Login or Sign Up to access secure profile, settings, and workspace tools.", "error");
    }
  }, [showSplash, currentPath, isLoggedIn]);

  // If splash is showing, render splash screen
  if (showSplash) {
    return <SplashScreen />;
  }

  // Handle Toast overlay
  const toastContainer = <Toast toasts={toasts} removeToast={removeToast} />;

  // Render Login Screen
  if (currentPath === "/login") {
    return (
      <>
        {toastContainer}
        <AetrixLogin 
          onBack={() => {
            navigate("/chat");
          }}
          onLoginSuccess={(email, token, name, phone, avatar) => {
            setIsLoggedIn(true);
            setUserEmail(email);
            setUserName(name);
            setUserAvatar(avatar || "");
            localStorage.setItem("aetrix_is_logged_in", "true");
            localStorage.setItem("aetrix_user_email", email);
            localStorage.setItem("aetrix_user_name", name);
            localStorage.setItem("aetrix_user_avatar", avatar || "");
            localStorage.setItem("aetrix_session_token", token);
            addToast("Successfully authenticated. Welcome to AETRIX AI!", "success");
            navigate("/chat");
          }}
          onNavigateToSignUp={() => {
            navigate("/signup");
          }}
        />
      </>
    );
  }

  // Render Sign Up Screen
  if (currentPath === "/signup") {
    return (
      <>
        {toastContainer}
        <AetrixSignUp 
          onBack={() => {
            navigate("/chat");
          }}
          onSignUpSuccess={(email, token, name, phone, avatar) => {
            setIsLoggedIn(true);
            setUserEmail(email);
            setUserName(name);
            setUserAvatar(avatar || "");
            localStorage.setItem("aetrix_is_logged_in", "true");
            localStorage.setItem("aetrix_user_email", email);
            localStorage.setItem("aetrix_user_name", name);
            localStorage.setItem("aetrix_user_avatar", avatar || "");
            localStorage.setItem("aetrix_session_token", token);
            addToast("Account successfully registered! Welcome to AETRIX AI.", "success");
            navigate("/chat");
          }}
          onNavigateToLogin={() => {
            navigate("/login");
          }}
        />
      </>
    );
  }

  // Render correct workspace based on current path
  if (currentPath === "/" || currentPath === "/chat") {
    return (
      <>
        {toastContainer}
        <AetrixChatWorkspace 
          isLoggedIn={isLoggedIn}
          userEmail={isLoggedIn ? userEmail : "guest@aetrix.ai"}
          userName={isLoggedIn ? userName : "Guest"}
          userAvatar={isLoggedIn ? userAvatar : ""}
          savedInputText={savedInputText}
          onSaveInputText={setSavedInputText}
          onOpenLogin={() => {
            navigate("/login");
          }}
          onOpenSignUp={() => {
            navigate("/signup");
          }}
          onLogout={() => {
            setIsLoggedIn(false);
            setUserEmail("guest@aetrix.ai");
            setUserName("Guest");
            setUserAvatar("");
            localStorage.removeItem("aetrix_is_logged_in");
            localStorage.removeItem("aetrix_user_email");
            localStorage.removeItem("aetrix_user_name");
            localStorage.removeItem("aetrix_user_avatar");
            addToast("AETRIX session reset completed.", "success");
            navigate("/");
          }}
          onOpenFeatures={() => {
            if (!isLoggedIn) {
              addToast("Please login or sign up to access AI Features.", "error");
            } else {
              navigate("/features");
            }
          }}
          onOpenProjects={() => {
            if (!isLoggedIn) {
              addToast("Please login or sign up to access Projects.", "error");
            } else {
              navigate("/projects");
            }
          }}
          onOpenLibrary={() => {
            if (!isLoggedIn) {
              addToast("Please login or sign up to access Neural Library.", "error");
            } else {
              navigate("/library");
            }
          }}
          onOpenProfile={() => {
            if (!isLoggedIn) {
              addToast("Please login or sign up to view Profile.", "error");
            } else {
              navigate("/profile");
            }
          }}
          onOpenSettings={() => {
            if (!isLoggedIn) {
              addToast("Please login or sign up to view Settings.", "error");
            } else {
              navigate("/settings");
            }
          }}
        />
      </>
    );
  }

  if (currentPath === "/profile") {
    return (
      <>
        {toastContainer}
        <AetrixProfile 
          userName={isLoggedIn ? userName : "Alex Design"}
          userEmail={isLoggedIn ? userEmail : "alex@aetrix.ai"}
          userAvatar={isLoggedIn ? userAvatar : ""}
          onBack={() => {
            navigate("/chat");
          }}
          onLogout={() => {
            setIsLoggedIn(false);
            setUserEmail("guest@aetrix.ai");
            setUserName("Guest");
            setUserAvatar("");
            localStorage.removeItem("aetrix_is_logged_in");
            localStorage.removeItem("aetrix_user_email");
            localStorage.removeItem("aetrix_user_name");
            localStorage.removeItem("aetrix_user_avatar");
            localStorage.removeItem("aetrix_session_token");
            addToast("AETRIX session reset completed.", "success");
            navigate("/");
          }}
          onNavigateToSettings={() => {
            navigate("/settings");
          }}
          onUpdateProfile={async (name, email, avatar) => {
            const token = localStorage.getItem("aetrix_session_token");
            try {
              const response = await fetch("/api/auth/update-profile", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ fullName: name, avatar })
              });
              if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update profile.");
              }
              const data = await response.json();
              setUserName(data.user.fullName);
              setUserEmail(data.user.email);
              setUserAvatar(data.user.avatar || "");
              localStorage.setItem("aetrix_is_logged_in", "true");
              localStorage.setItem("aetrix_user_name", data.user.fullName);
              localStorage.setItem("aetrix_user_email", data.user.email);
              localStorage.setItem("aetrix_user_avatar", data.user.avatar || "");
              localStorage.setItem("aetrix_session_token", data.token);
            } catch (err: any) {
              addToast(err.message || "Failed to update profile", "error");
              throw err;
            }
          }}
          onChangePassword={async (currentPass, newPass) => {
            const token = localStorage.getItem("aetrix_session_token");
            const response = await fetch("/api/auth/change-password", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({ currentPass, newPass })
            });
            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.error || "Failed to change password.");
            }
          }}
          addToast={addToast}
        />
      </>
    );
  }

  if (currentPath === "/settings") {
    return (
      <>
        {toastContainer}
        <AetrixSettings 
          onBack={() => {
            navigate("/profile");
          }}
          addToast={addToast}
          userEmail={isLoggedIn ? userEmail : "guest@aetrix.ai"}
          onLogout={() => {
            setIsLoggedIn(false);
            setUserEmail("guest@aetrix.ai");
            setUserName("Guest");
            setUserAvatar("");
            localStorage.removeItem("aetrix_is_logged_in");
            localStorage.removeItem("aetrix_user_email");
            localStorage.removeItem("aetrix_user_name");
            localStorage.removeItem("aetrix_user_avatar");
            localStorage.removeItem("aetrix_session_token");
            addToast("AETRIX session reset completed.", "success");
            navigate("/");
          }}
        />
      </>
    );
  }

  if (currentPath === "/projects") {
    return (
      <>
        {toastContainer}
        <AetrixProjects 
          onBack={() => {
            navigate("/chat");
          }}
          addToast={addToast}
        />
      </>
    );
  }

  if (currentPath === "/library") {
    return (
      <>
        {toastContainer}
        <AetrixLibrary 
          onBack={() => {
            navigate("/chat");
          }}
          addToast={addToast}
        />
      </>
    );
  }

  if (currentPath === "/features") {
    return (
      <>
        {toastContainer}
        <AetrixFeaturesPage 
          userName={isLoggedIn ? userName : "Aetrix User"}
          onBack={() => {
            navigate("/chat");
          }}
          onSelectTool={(toolId) => {
            navigate(`/features/${toolId}`);
          }}
        />
      </>
    );
  }

  if (currentPath.startsWith("/features/")) {
    const toolId = currentPath.substring("/features/".length);
    return (
      <>
        {toastContainer}
        <AetrixToolPages 
          toolId={toolId}
          userEmail={isLoggedIn ? userEmail : "guest@aetrix.ai"}
          onBack={() => {
            navigate("/features");
          }}
        />
      </>
    );
  }

  // Fallback (should theoretically not be reached due to path redirect effect)
  return (
    <>
      {toastContainer}
      <AetrixChatWorkspace 
        isLoggedIn={isLoggedIn}
        userEmail={isLoggedIn ? userEmail : "guest@aetrix.ai"}
        userName={isLoggedIn ? userName : "Guest"}
        userAvatar={isLoggedIn ? userAvatar : ""}
        savedInputText={savedInputText}
        onSaveInputText={setSavedInputText}
        onOpenLogin={() => {
          navigate("/login");
        }}
        onOpenSignUp={() => {
          navigate("/signup");
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          setUserEmail("guest@aetrix.ai");
          setUserName("Guest");
          setUserAvatar("");
          localStorage.removeItem("aetrix_is_logged_in");
          localStorage.removeItem("aetrix_user_email");
          localStorage.removeItem("aetrix_user_name");
          localStorage.removeItem("aetrix_user_avatar");
          localStorage.removeItem("aetrix_session_token");
          addToast("AETRIX session reset completed.", "success");
          navigate("/");
        }}
        onOpenFeatures={() => {
          if (!isLoggedIn) {
            addToast("Please login or sign up to access AI Features.", "error");
          } else {
            navigate("/features");
          }
        }}
        onOpenProjects={() => {
          if (!isLoggedIn) {
            addToast("Please login or sign up to access Projects.", "error");
          } else {
            navigate("/projects");
          }
        }}
        onOpenLibrary={() => {
          if (!isLoggedIn) {
            addToast("Please login or sign up to access Neural Library.", "error");
          } else {
            navigate("/library");
          }
        }}
        onOpenProfile={() => {
          if (!isLoggedIn) {
            addToast("Please login or sign up to view Profile.", "error");
          } else {
            navigate("/profile");
          }
        }}
        onOpenSettings={() => {
          if (!isLoggedIn) {
            addToast("Please login or sign up to view Settings.", "error");
          } else {
            navigate("/settings");
          }
        }}
      />
    </>
  );
}
