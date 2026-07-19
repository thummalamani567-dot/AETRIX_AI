import React, { useEffect, useRef } from "react";

export default function PremiumSpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Dynamic star count based on screen area to ensure high density without lag
    const starCount = Math.min(2000, Math.floor((width * height) / 500));
    
    interface Star {
      x: number;
      y: number;
      size: number;
      color: string;
      baseOpacity: number;
      twinkleSpeed: number;
      twinklePhase: number;
      vx: number;
      vy: number;
      depth: number; // Parallax depth factor (0.1 to 1.0)
    }

    interface CosmicDust {
      x: number;
      y: number;
      size: number;
      color: string;
      alpha: number;
      vx: number;
      vy: number;
      depth: number;
      pulseSpeed: number;
      pulsePhase: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      opacity: number;
      active: boolean;
      life: number;
      maxLife: number;
    }

    const stars: Star[] = [];
    const dusts: CosmicDust[] = [];
    let shootingStar: ShootingStar | null = null;

    // Realistic star colors (spectrum from blue-hot stars to yellow/orange stars)
    const starColors = [
      "rgba(255, 255, 255, ", // Pure white
      "rgba(217, 249, 157, ", // Very soft lime/yellowish white
      "rgba(191, 219, 254, ", // Blue-white
      "rgba(254, 215, 170, ", // Amber-orangeish white
      "rgba(224, 242, 254, ", // Soft cyan-white
    ];

    const dustColors = [
      "rgba(0, 191, 255, ",  // Deep sky blue
      "rgba(139, 92, 246, ", // Purple
      "rgba(99, 102, 241, ", // Indigo
    ];

    // Initialize stars
    for (let i = 0; i < starCount; i++) {
      const depth = Math.random() * 0.9 + 0.1;
      
      // Natural logarithmic distribution: mostly tiny background stars, very few massive foreground ones
      const r = Math.random();
      const size = r < 0.75 
        ? Math.random() * 0.4 + 0.2  // Very tiny
        : r < 0.96 
          ? Math.random() * 0.7 + 0.4  // Mid size
          : Math.random() * 1.2 + 0.9; // Large, glowing foreground star

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseOpacity: Math.random() * 0.7 + 0.3,
        twinkleSpeed: 0.003 + Math.random() * 0.012,
        twinklePhase: Math.random() * Math.PI * 2,
        // Slowly drift in slightly random vectors
        vx: (Math.random() - 0.5) * 0.05 * depth,
        vy: (Math.random() - 0.5) * 0.05 * depth,
        depth,
      });
    }

    // Initialize cosmic dust particles (20x less dense than stars)
    const dustCount = Math.floor(starCount / 20);
    for (let i = 0; i < dustCount; i++) {
      const depth = Math.random() * 0.6 + 0.4;
      dusts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.0 + 1.2,
        color: dustColors[Math.floor(Math.random() * dustColors.length)],
        alpha: Math.random() * 0.12 + 0.04,
        vx: (Math.random() - 0.5) * 0.09 * depth,
        vy: (Math.random() - 0.5) * 0.09 * depth,
        depth,
        pulseSpeed: 0.004 + Math.random() * 0.008,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Handle container/window resizes dynamically
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      
      // Redistribute stars outside bounds seamlessly
      stars.forEach((s) => {
        if (s.x > width) s.x = Math.random() * width;
        if (s.y > height) s.y = Math.random() * height;
      });
      dusts.forEach((d) => {
        if (d.x > width) d.x = Math.random() * width;
        if (d.y > height) d.y = Math.random() * height;
      });
    };

    window.addEventListener("resize", handleResize);

    // Mouse hover tracking for smooth 3D parallax offsets
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.targetX = (x - width / 2) / (width / 2); // -1 to 1 range
      mouseRef.current.targetY = (y - height / 2) / (height / 2); // -1 to 1 range
    };

    // Touch moving tracking for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        mouseRef.current.targetX = (x - width / 2) / (width / 2);
        mouseRef.current.targetY = (y - height / 2) / (height / 2);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Core Animation Frame Loop (60 FPS optimized)
    const animate = () => {
      // 1. Solid Pure Black Space Background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Smooth interpolation dampening on mouse offset vectors for realistic parallax weight
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.04;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.04;

      const parallaxX = mouseRef.current.x * 25; // 25px max parallax shift
      const parallaxY = mouseRef.current.y * 25;

      // 2. Draw Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Drift
        s.x += s.vx;
        s.y += s.vy;

        // Loop boundaries seamlessly
        if (s.x < 0) s.x = width;
        if (s.x > width) s.x = 0;
        if (s.y < 0) s.y = height;
        if (s.y > height) s.y = 0;

        // Calculate location with depth-based parallax factor
        let finalX = s.x + parallaxX * s.depth;
        let finalY = s.y + parallaxY * s.depth;

        // Wrap overflow positions to avoid clipping/popping at visual borders
        if (finalX < 0) finalX += width;
        if (finalX > width) finalX -= width;
        if (finalY < 0) finalY += height;
        if (finalY > height) finalY -= height;

        // Calculate gentle star twinkling
        s.twinklePhase += s.twinkleSpeed;
        const twinkle = Math.sin(s.twinklePhase) * 0.4 + 0.6; // opacity oscillates
        const opacity = s.baseOpacity * twinkle;

        // Draw star dot
        ctx.fillStyle = s.color + opacity.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(finalX, finalY, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Add soft radial glare to larger foreground stars
        if (s.size > 0.95) {
          ctx.fillStyle = s.color + (opacity * 0.22).toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc(finalX, finalY, s.size * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Draw Cosmic Dust Particles
      for (let i = 0; i < dusts.length; i++) {
        const d = dusts[i];

        // Drift
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        if (d.y < 0) d.y = height;
        if (d.y > height) d.y = 0;

        let finalX = d.x + parallaxX * d.depth;
        let finalY = d.y + parallaxY * d.depth;

        if (finalX < 0) finalX += width;
        if (finalX > width) finalX -= width;
        if (finalY < 0) finalY += height;
        if (finalY > height) finalY -= height;

        // Soft cloud pulsing
        d.pulsePhase += d.pulseSpeed;
        const pulse = Math.sin(d.pulsePhase) * 0.35 + 0.65;
        const opacity = d.alpha * pulse;

        // Draw radial cosmic dust
        const dustGrad = ctx.createRadialGradient(
          finalX, finalY, 0,
          finalX, finalY, d.size * 2.5
        );
        dustGrad.addColorStop(0, d.color + opacity.toFixed(3) + ")");
        dustGrad.addColorStop(0.4, d.color + (opacity * 0.35).toFixed(3) + ")");
        dustGrad.addColorStop(1, d.color + "0)");

        ctx.fillStyle = dustGrad;
        ctx.beginPath();
        ctx.arc(finalX, finalY, d.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Shooting Stars
      // Trigger a shooting star with randomized, low probability (~1 per 12 seconds avg)
      if (!shootingStar && Math.random() < 0.001) {
        const startX = Math.random() * width * 0.7 + width * 0.3;
        const startY = Math.random() * height * 0.3;
        const speed = 14 + Math.random() * 7;
        const angle = Math.PI * 0.75 + (Math.random() - 0.5) * 0.12; // 135 deg diagonal path
        const maxLife = 35 + Math.random() * 20;

        shootingStar = {
          x: startX,
          y: startY,
          length: 70 + Math.random() * 70,
          speed,
          angle,
          opacity: 0,
          active: true,
          life: 0,
          maxLife,
        };
      }

      if (shootingStar && shootingStar.active) {
        shootingStar.life++;

        // Smooth fade-in and fade-out over life cycle
        if (shootingStar.life < 8) {
          shootingStar.opacity = shootingStar.life / 8;
        } else if (shootingStar.life > shootingStar.maxLife - 12) {
          shootingStar.opacity = (shootingStar.maxLife - shootingStar.life) / 12;
        } else {
          shootingStar.opacity = 1.0;
        }

        const dx = Math.cos(shootingStar.angle);
        const dy = Math.sin(shootingStar.angle);
        const tailX = shootingStar.x - dx * shootingStar.length;
        const tailY = shootingStar.y - dy * shootingStar.length;

        // Elegant bi-color gradient for shooting star tail
        const starGrad = ctx.createLinearGradient(
          shootingStar.x, shootingStar.y,
          tailX, tailY
        );
        starGrad.addColorStop(0, "rgba(255, 255, 255, " + (shootingStar.opacity * 0.95).toFixed(3) + ")");
        starGrad.addColorStop(0.12, "rgba(0, 191, 255, " + (shootingStar.opacity * 0.8).toFixed(3) + ")");
        starGrad.addColorStop(0.6, "rgba(139, 92, 246, " + (shootingStar.opacity * 0.25).toFixed(3) + ")");
        starGrad.addColorStop(1, "rgba(139, 92, 246, 0)");

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Update coordinates
        shootingStar.x += dx * shootingStar.speed;
        shootingStar.y += dy * shootingStar.speed;

        if (shootingStar.life >= shootingStar.maxLife) {
          shootingStar = null;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black pointer-events-none select-none" id="premium-space-bg">
      {/* 60 FPS Optimized interactive Star Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Layered purple & blue Nebula clouds with subtle pulsing opacity */}
      <div className="absolute inset-0 z-0 opacity-15 mix-blend-screen pointer-events-none">
        <div 
          className="absolute top-[-10%] left-[-15%] w-[85vw] h-[85vw] bg-gradient-to-br from-cyan-500/25 via-blue-600/15 to-transparent rounded-full blur-[130px] animate-pulse"
          style={{ animationDuration: "28s" }}
        />
        <div 
          className="absolute bottom-[-15%] right-[-10%] w-[90vw] h-[90vw] bg-gradient-to-tr from-purple-600/18 via-violet-500/15 to-transparent rounded-full blur-[140px] animate-pulse"
          style={{ animationDuration: "36s" }}
        />
        <div 
          className="absolute top-[25%] left-[25%] w-[55vw] h-[55vw] bg-indigo-500/8 rounded-full blur-[110px]"
        />
      </div>

      {/* Dark Vignette and center overlay:
          Darkens the center slightly as requested, and darkens outer bounds to keep typography perfectly readable and cinematic */}
      <div 
        className="absolute inset-0 pointer-events-none z-10" 
        style={{
          background: "radial-gradient(circle at center, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)"
        }}
      />
    </div>
  );
}
