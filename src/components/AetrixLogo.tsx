import React from "react";

export default function AetrixLogo() {
  return (
    <div className="flex flex-col items-center justify-center select-none" id="aetrix-logo-container">
      {/* Stylized Futuristic Logo Icon */}
      <div className="relative w-20 h-20 flex items-center justify-center group" id="logo-icon-wrapper">
        {/* Glow behind logo */}
        <div className="absolute inset-0 bg-[#1E90FF]/25 blur-xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />
        
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full relative z-10 drop-shadow-[0_0_15px_rgba(30,144,255,0.6)]"
          id="aetrix-logo-svg"
        >
          <defs>
            <linearGradient id="aetrixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00BFFF" />
              <stop offset="60%" stopColor="#1E90FF" />
              <stop offset="100%" stopColor="#00008B" />
            </linearGradient>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="30%" stopColor="#1E90FF" />
              <stop offset="70%" stopColor="#00BFFF" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Planet Orbit Ring (Nested perspective ellipse) */}
          <g transform="rotate(-28, 60, 60)">
            <ellipse
              cx="60"
              cy="60"
              rx="48"
              ry="16"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="2.5"
              className="animate-[pulse_3s_ease-in-out_infinite]"
              strokeDasharray="250"
              strokeDashoffset="0"
            />
            {/* Satellite / Orb on the ring */}
            <circle
              cx="108"
              cy="60"
              r="4.5"
              fill="#00BFFF"
              filter="url(#glow-filter)"
              className="animate-[pulse_1.5s_ease-in-out_infinite]"
            />
          </g>

          {/* Futuristic stylized "A" */}
          {/* Main Left Pillar (Angled) */}
          <path
            d="M 60 20 L 25 90 L 39 90 L 60 48 L 81 90 L 95 90 Z"
            fill="url(#aetrixGrad)"
            filter="url(#glow-filter)"
          />
          
          {/* Crossbar with custom cyber cutout slit */}
          <path
            d="M 44 76 L 76 76"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 45 76 L 75 76"
            stroke="#00BFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#glow-filter)"
          />

          {/* Small inner cyber accents (under top vertex) */}
          <polygon
            points="60,35 55,45 65,45"
            fill="#FFFFFF"
            opacity="0.8"
            filter="url(#glow-filter)"
          />
        </svg>
      </div>

      {/* Main Brand Name */}
      <h1 
        className="text-white text-2xl font-bold tracking-[0.32em] mt-3 uppercase text-center select-none font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
        id="aetrix-logo-heading"
      >
        Aetrix Ai
      </h1>

      {/* Subtitle / Tagline */}
      <div 
        className="flex items-center justify-center gap-2 mt-1.5 w-full select-none"
        id="aetrix-logo-tagline-wrapper"
      >
        <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#1E90FF]/50" />
        <span 
          className="text-[#1E90FF]/80 text-[9px] tracking-[0.25em] font-semibold uppercase text-center whitespace-nowrap font-sans"
          id="aetrix-logo-tagline"
        >
          Your AI Assistant
        </span>
        <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#1E90FF]/50" />
      </div>
    </div>
  );
}
