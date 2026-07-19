import React, { useEffect } from "react";
import { Info, CheckCircle, AlertTriangle, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export default function Toast({ toasts, removeToast }: ToastProps) {
  return (
    <div 
      className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none select-none"
      id="aetrix-toast-container"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
}

function ToastItem({ toast, removeToast }: { toast: ToastMessage; removeToast: (id: string) => void; key?: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case "error":
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default:
        return <Info className="w-5 h-5 text-[#1E90FF]" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
      case "error":
        return "border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]";
      default:
        return "border-[#1E90FF]/30 shadow-[0_0_15px_rgba(30,144,255,0.15)]";
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl bg-black/80 backdrop-blur-md border ${getBorderColor()} text-white animate-[slideIn_0.3s_ease-out]`}
      id={`toast-${toast.id}`}
    >
      <div className="flex items-center gap-3">
        {getIcon()}
        <p className="text-xs font-sans font-medium tracking-wide text-gray-200">{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-white transition-colors duration-200"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
