import React, { useState } from "react";
import { ArrowLeft, Lock, Eye, EyeOff, Mail, Database, ExternalLink, RefreshCw } from "lucide-react";
import { motion } from "motion/react";
import AetrixLogo from "./AetrixLogo";
import { getSupabase, isSupabaseConfigured } from "../supabase";

interface AetrixLoginProps {
  onBack: () => void;
  onLoginSuccess: (email: string, token: string, name: string, phone: string, avatar?: string) => void;
  onNavigateToSignUp: () => void;
}

export default function AetrixLogin({ onBack, onLoginSuccess, onNavigateToSignUp }: AetrixLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [showResend, setShowResend] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResendStatus("");
    setShowResend(false);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your Email Address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabase();
      console.log("Attempting Supabase login for:", email.trim());
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        console.error("Supabase sign-in error:", authError);

        setError(authError.message || "Invalid login credentials.");
        
        const isEmailNotConfirmed = authError.message?.toLowerCase().includes("email not confirmed") || 
                                    authError.message?.toLowerCase().includes("confirm");
        if (isEmailNotConfirmed) {
          setShowResend(true);
        } else {
          setShowResend(false);
        }
        setIsLoading(false);
        return;
      }

      const session = data.session;
      const user = data.user || session?.user;

      if (session && user) {
        console.log("Supabase login successful for user:", user.email);
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "AETRIX User";
        
        // Pass session information back to parent handler which saves state, localStorage, and redirects to /chat
        onLoginSuccess(
          user.email || "",
          session.access_token,
          name,
          user.phone || "",
          user.user_metadata?.avatar_url || ""
        );
      } else {
        console.error("Supabase login succeeded but session or user is missing:", data);
        setError("Authentication was successful, but no active session was returned. If email confirmation is enabled, please verify your email address.");
      }
      setIsLoading(false);
    } catch (err: any) {
      console.error("Unexpected error during Supabase login:", err);
      setIsLoading(false);
      setError(err.message || "An unexpected error occurred. Unable to contact the authentication server.");
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) return;
    setIsResending(true);
    setResendStatus("");
    try {
      const supabase = getSupabase();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin + "/chat"
        }
      });
      if (resendError) {
        setResendStatus(`Failed to resend: ${resendError.message}`);
      } else {
        setResendStatus("Confirmation email resent successfully! Please check your inbox and spam folders.");
      }
    } catch (err: any) {
      setResendStatus(`Error: ${err.message || "Unable to resend confirmation email."}`);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0B0F19] text-white font-sans flex flex-col overflow-y-auto select-none z-40" id="aetrix-login-screen">
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#1E90FF]/15 to-[#00BFFF]/5 blur-3xl top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Header Bar */}
      <header className="h-[64px] border-b border-white/10 flex items-center justify-between px-5 relative z-50">
        <button 
          onClick={onBack}
          className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          id="login-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold tracking-[0.2em] text-sm text-white absolute left-1/2 transform -translate-x-1/2">
          AETRIX <span className="text-[#00BFFF]">AI</span>
        </span>
        <div className="w-8" />
      </header>

      {/* Main Content Card container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative z-10 max-w-md mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-[#0d1222]/85 border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_50px_rgba(0,191,255,0.05)] flex flex-col items-center"
          id="login-card-box"
        >
          {/* Logo container */}
          <div className="mb-4 transform scale-90">
            <AetrixLogo />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mt-1 text-center font-sans">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-xs mt-1 mb-6 text-center font-sans font-medium">
            Sign in with your email address
          </p>

          {/* Form states */}
          <div className="w-full">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {error && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-300 text-left">
                    {error}
                  </div>
                  {showResend && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col gap-3 text-left">
                      <div className="flex gap-2">
                        <Database className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-[11px] font-bold text-amber-300">How to fix in your Supabase project:</h4>
                          <ul className="list-decimal pl-4 text-[10px] text-gray-400 mt-1 space-y-1">
                            <li>Go to your <strong className="text-gray-300">Supabase Console</strong> &rarr; <strong className="text-gray-300">Authentication</strong></li>
                            <li>Click <strong className="text-gray-300">Providers</strong> &rarr; expand <strong className="text-gray-300">Email</strong></li>
                            <li>Toggle <strong className="text-amber-400">Confirm email</strong> to <strong className="text-red-400">Disabled</strong> and click Save</li>
                            <li>Or go to <strong className="text-gray-300">Users</strong>, click your user, and click <strong className="text-emerald-400">Confirm User</strong></li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="h-px bg-white/5 my-0.5" />

                      <p className="text-[10px] text-blue-200">
                        Need another verification link? We can resend it to <strong>{email}</strong>
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={handleResendConfirmation}
                          disabled={isResending}
                          className="text-[11px] bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 font-semibold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer w-full justify-center"
                        >
                          {isResending ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <span>Resend Verification Email</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  {resendStatus && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 text-left">
                      {resendStatus}
                    </div>
                  )}
                </div>
              )}

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-[#00BFFF]/50 transition-all duration-300 group">
                  <Mail className="w-4 h-4 text-gray-500 group-focus-within:text-[#00BFFF] transition-colors shrink-0 mr-3" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 select-text"
                    id="login-email-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5 relative">
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-[#00BFFF]/50 transition-all duration-300 group">
                  <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-[#00BFFF] transition-colors shrink-0 mr-3" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 pr-8 select-text"
                    id="login-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-white font-semibold text-sm hover:opacity-90 shadow-[0_4px_16px_rgba(0,191,255,0.35)] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
                id="login-submit-btn"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>

          {/* Switch to SignUp */}
          <div className="mt-8 text-xs text-gray-400 font-medium text-center">
            Don’t have an account?{" "}
            <button 
              type="button"
              onClick={onNavigateToSignUp}
              className="text-[#00BFFF] hover:underline font-semibold cursor-pointer ml-1"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500 font-medium text-center">
            or{" "}
            <button 
              type="button"
              onClick={() => {
                onLoginSuccess("guest@aetrix.ai", "guest-token-" + Date.now(), "Guest User", "", "");
              }}
              className="text-emerald-400 hover:underline font-semibold cursor-pointer ml-1"
            >
              Continue as Guest (Bypass Login)
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
