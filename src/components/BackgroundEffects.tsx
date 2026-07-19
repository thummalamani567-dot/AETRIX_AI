import React, { useEffect, useRef } from "react";

export default function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class definition
    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height + height * 0.2; // Start from bottom / mid-screen
        this.size = Math.random() * 2.2 + 0.6;
        this.speedY = -(Math.random() * 0.7 + 0.2); // Slowly drift upwards
        this.speedX = (Math.random() - 0.5) * 0.2; // Tiny drift left/right
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
        this.color = `rgba(${Math.random() > 0.4 ? "30, 144, 255" : "0, 191, 255"}, ${this.opacity})`;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Wrap around top
        if (this.y < 0) {
          this.y = height + Math.random() * 50;
          this.x = Math.random() * width;
        }
        
        // Wrap around sides
        if (this.x < 0 || this.x > width) {
          this.x = Math.random() * width;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Premium glow effect on some particles
        if (this.size > 1.8) {
          context.shadowBlur = 10;
          context.shadowColor = "#1E90FF";
        } else {
          context.shadowBlur = 0;
        }
        
        context.fillStyle = this.color;
        context.fill();
      }
    }

    const particles: Particle[] = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000)); // Adaptive count

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.shadowBlur = 0; // Reset shadow

      // Draw all particles
      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0B0F19] overflow-hidden select-none z-0" id="background-effects-container">
      {/* Sleek Theme Radial Dot Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: "radial-gradient(circle, #1E90FF 1px, transparent 1px)", 
          backgroundSize: "40px 40px" 
        }}
        id="bg-sleek-dot-matrix"
      />

      {/* 1. Deep Futuristic Ambient Background Gradients (Nebula Glows) */}
      <div 
        className="absolute top-[10%] left-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-[#1E90FF]/12 to-transparent blur-[120px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite]" 
        id="bg-glow-nebula-left"
      />
      <div 
        className="absolute bottom-[10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-[#00008B]/20 via-[#1E90FF]/10 to-transparent blur-[120px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" 
        id="bg-glow-nebula-right"
      />
      
      {/* 2. Slow Drifting Background Ambient Blobs */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#1E90FF]/04 blur-[100px] pointer-events-none animate-[ping_15s_linear_infinite_alternate]" 
        id="bg-glow-center"
      />

      {/* 3. Left-Side Digital Planet Grid Overlay (identical to the constellation/grid in the left of the reference image) */}
      <svg 
        className="absolute left-[-100px] top-[10%] w-[500px] h-[500px] opacity-[0.25] text-[#1E90FF]/60 select-none pointer-events-none"
        viewBox="0 0 500 500"
        id="bg-grid-svg-left"
      >
        <defs>
          <radialGradient id="gridFade" cx="30%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E90FF" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#1E90FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Draw subtle concentric digital circles representing planet grid coordinates */}
        <circle cx="150" cy="250" r="120" fill="none" stroke="url(#gridFade)" strokeWidth="1" strokeDasharray="3 6" />
        <circle cx="150" cy="250" r="180" fill="none" stroke="url(#gridFade)" strokeWidth="1" strokeDasharray="4 8" />
        <circle cx="150" cy="250" r="240" fill="none" stroke="url(#gridFade)" strokeWidth="1" />
        <circle cx="150" cy="250" r="300" fill="none" stroke="url(#gridFade)" strokeWidth="1" strokeDasharray="2 10" />
        
        {/* Connecting angled data lines */}
        <line x1="150" y1="250" x2="450" y2="50" stroke="url(#gridFade)" strokeWidth="0.75" />
        <line x1="150" y1="250" x2="380" y2="400" stroke="url(#gridFade)" strokeWidth="0.75" />
        <line x1="150" y1="250" x2="400" y2="250" stroke="url(#gridFade)" strokeWidth="0.5" strokeDasharray="5 5" />
        
        {/* Subtle data nodes/stars */}
        <circle cx="350" cy="117" r="3" fill="#00BFFF" />
        <circle cx="280" cy="150" r="2" fill="#FFFFFF" />
        <circle cx="380" cy="400" r="4.5" fill="#1E90FF" className="animate-ping" />
        <circle cx="380" cy="400" r="2" fill="#FFFFFF" />
        <circle cx="200" cy="300" r="1.5" fill="#FFFFFF" />
      </svg>

      {/* 4. Right-Side Vertical Light Stream Lines (matching the streaks in the right of the reference image) */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-[300px] h-full opacity-35 pointer-events-none select-none flex justify-around px-8"
        id="bg-vertical-streams"
      >
        <div className="w-[1px] h-[80%] bg-gradient-to-b from-transparent via-[#1E90FF]/25 to-transparent relative top-[10%]">
          <div className="absolute top-[30%] left-[-2px] w-[5px] h-[5px] rounded-full bg-[#00BFFF] shadow-[0_0_8px_#00BFFF] animate-[bounce_4s_ease-in-out_infinite]" />
        </div>
        <div className="w-[1px] h-[60%] bg-gradient-to-b from-transparent via-[#1E90FF]/15 to-transparent relative top-[20%]">
          <div className="absolute top-[65%] left-[-1.5px] w-[4px] h-[4px] rounded-full bg-[#1E90FF] shadow-[0_0_8px_#1E90FF] animate-[bounce_6s_ease-in-out_infinite_reverse]" />
        </div>
        <div className="w-[1px] h-[90%] bg-gradient-to-b from-transparent via-[#00BFFF]/20 to-transparent relative top-[5%]">
          <div className="absolute top-[15%] left-[-2.5px] w-[6px] h-[6px] rounded-full bg-[#FFFFFF] shadow-[0_0_10px_#00BFFF] animate-[bounce_5s_ease-in-out_infinite]" />
        </div>
        <div className="w-[1px] h-[70%] bg-gradient-to-b from-transparent via-[#1E90FF]/10 to-transparent relative top-[15%]">
          <div className="absolute top-[80%] left-[-1.5px] w-[4px] h-[4px] rounded-full bg-[#1E90FF] shadow-[0_0_8px_#1E90FF] animate-[bounce_8s_ease-in-out_infinite_reverse]" />
        </div>
      </div>

      {/* 5. Dynamic Canvas for floating dust particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70 mix-blend-screen" 
        id="bg-canvas-particles"
      />

      {/* 6. Holographic Circle Projecting Platform at the Bottom Center (Matches the floor reflection in reference image) */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[700px] h-[160px] pointer-events-none select-none z-10"
        id="holographic-projector-platform"
      >
        {/* Uplight projection cone */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[250px] bg-gradient-to-t from-[#1E90FF]/16 via-[#1E90FF]/03 to-transparent blur-2xl rounded-t-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[180px] h-[200px] bg-gradient-to-t from-[#00BFFF]/20 via-[#1E90FF]/05 to-transparent blur-xl rounded-t-full" />

        {/* Concentric Ellipses on floor */}
        {/* Ring 1 - Deep outer ring */}
        <div 
          className="absolute bottom-[-60px] left-1/2 -translate-x-1/2 w-[580px] h-[120px] rounded-full border border-[#1E90FF]/20 shadow-[inset_0_0_40px_rgba(30,144,255,0.15)] bg-gradient-to-t from-[#1E90FF]/02 to-transparent" 
          id="holo-ring-outer"
        />
        
        {/* Ring 2 - Primary mid ring with pulse */}
        <div 
          className="absolute bottom-[-45px] left-1/2 -translate-x-1/2 w-[440px] h-[90px] rounded-full border border-[#1E90FF]/35 shadow-[0_0_30px_rgba(30,144,255,0.3),inset_0_0_30px_rgba(30,144,255,0.2)] animate-[pulse_4s_ease-in-out_infinite]" 
          id="holo-ring-mid"
        />

        {/* Ring 3 - Glowing bright cyan core ring */}
        <div 
          className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[320px] h-[65px] rounded-full border-2 border-[#00BFFF]/50 shadow-[0_0_20px_rgba(0,191,255,0.5),inset_0_0_15px_rgba(0,191,255,0.3)]" 
          id="holo-ring-inner"
        />

        {/* Ring 4 - Ultra white/cyan center ring */}
        <div 
          className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-[180px] h-[38px] rounded-full border border-[#FFFFFF]/40 shadow-[0_0_15px_rgba(255,255,255,0.4)] bg-gradient-to-b from-[#1E90FF]/15 to-transparent" 
          id="holo-ring-core"
        />

        {/* Bright center laser source point */}
        <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-[50px] h-[10px] rounded-full bg-[#FFFFFF] blur-[3px] shadow-[0_0_15px_#FFFFFF] opacity-80" />
      </div>
    </div>
  );
}
