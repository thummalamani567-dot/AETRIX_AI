import React, { useState } from "react";
import { ArrowLeft, User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { motion } from "motion/react";
import AetrixLogo from "./AetrixLogo";
import { getSupabase, isSupabaseConfigured } from "../supabase";

interface AetrixSignUpProps {
  onBack: () => void;
  onSignUpSuccess: (email: string, token: string, name: string, phone: string, avatar?: string) => void;
  onNavigateToLogin: () => void;
}

export default function AetrixSignUp({ onBack, onSignUpSuccess, onNavigateToLogin }: AetrixSignUpProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.");
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your Full Name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your Email Address.");
      return;
    }
    if (!password) {
      setError("Please create a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms & Privacy Policy to register.");
      return;
    }

    setIsLoading(true);
    try {
      const supabase = getSupabase();
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            avatar_url: "",
          }
        }
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const session = data.session;
        const name = data.user.user_metadata?.full_name || fullName.trim();
        const token = session?.access_token || "supabase_auth_pending";
        onSignUpSuccess(
          data.user.email || email.trim(),
          token,
          name,
          data.user.phone || "",
          data.user.user_metadata?.avatar_url || ""
        );
      } else {
        setError("Registration succeeded, but no user data was returned.");
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Network or server connection failed. Please try again.");
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0B0F19] text-white font-sans flex flex-col overflow-y-auto select-none z-40" id="aetrix-signup-screen">
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#1E90FF]/15 to-[#00BFFF]/5 blur-3xl top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      {/* Header Bar */}
      <header className="h-[64px] border-b border-white/10 flex items-center justify-between px-5 relative z-50">
        <button 
          onClick={onBack}
          className="p-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          id="signup-back-btn"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-bold tracking-[0.2em] text-sm text-white absolute left-1/2 transform -translate-x-1/2">
          AETRIX <span className="text-[#00BFFF]">AI</span>
        </span>
        <div className="w-8" />
      </header>

      {/* Main Content Card container */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10 max-w-md mx-auto w-full">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full bg-[#0d1222]/85 border border-white/10 rounded-[32px] p-8 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_50px_rgba(0,191,255,0.05)] flex flex-col items-center"
          id="signup-card-box"
        >
          {/* Logo container */}
          <div className="mb-4 transform scale-90">
            <AetrixLogo />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white mt-1 text-center font-sans">
            Create Account
          </h2>
          <p className="text-gray-400 text-xs mt-1 mb-6 text-center font-sans font-medium">
            Join AETRIX AI with your email address
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {error && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-300 text-left">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-[#00BFFF]/50 transition-all duration-300 group">
                <User className="w-4 h-4 text-gray-500 group-focus-within:text-[#00BFFF] transition-colors shrink-0 mr-3" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 select-text"
                  id="signup-fullname-input"
                />
              </div>
            </div>

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
                  id="signup-email-input"
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
                  id="signup-password-input"
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

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5 relative">
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus-within:border-[#00BFFF]/50 transition-all duration-300 group">
                <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-[#00BFFF] transition-colors shrink-0 mr-3" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-gray-500 pr-8 select-text"
                  id="signup-confirmpassword-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-gray-500 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Agree Terms Checkbox */}
            <div className="flex items-start gap-2.5 pt-1.5 select-none text-left">
              <input 
                type="checkbox"
                id="signup-agree-checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-white/10 bg-white/5 text-[#00BFFF] focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="signup-agree-checkbox" className="text-xs text-gray-400 leading-normal font-sans font-medium">
                I agree to the <span className="text-[#00BFFF] hover:underline cursor-pointer">Terms & Privacy Policy</span>
              </label>
            </div>

            {/* Sign Up button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-[48px] rounded-xl bg-gradient-to-r from-[#1E90FF] to-[#00BFFF] text-white font-semibold text-sm hover:opacity-90 shadow-[0_4px_16px_rgba(0,191,255,0.35)] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
              id="signup-submit-btn"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-8 text-xs text-gray-400 font-medium">
            Already have an account?{" "}
            <button 
              type="button"
              onClick={onNavigateToLogin}
              className="text-[#00BFFF] hover:underline font-semibold cursor-pointer ml-1"
            >
              Login
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
