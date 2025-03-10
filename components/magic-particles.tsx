"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  alpha: number;
  alphaSpeed: number;
}

export default function MagicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create initial particles
    const createParticles = () => {
      particles.current = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);

      for (let i = 0; i < particleCount; i++) {
        const colors = [
          "rgba(147, 51, 234, 0.7)", // Purple
          "rgba(16, 185, 129, 0.7)", // Emerald
          "rgba(139, 92, 246, 0.7)", // Violet
          "rgba(5, 150, 105, 0.7)", // Green
        ];

        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 5 + 1,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: Math.random() * 0.5 + 0.1,
          alphaSpeed: Math.random() * 0.01 - 0.005,
        });
      }
    };

    createParticles();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Update alpha
        particle.alpha += particle.alphaSpeed;
        if (particle.alpha <= 0.1 || particle.alpha >= 0.5) {
          particle.alphaSpeed = -particle.alphaSpeed;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(
          /[\d.]+\)$/g,
          `${particle.alpha})`
        );
        ctx.fill();

        // Reset if out of bounds
        if (
          particle.x < 0 ||
          particle.x > canvas.width ||
          particle.y < 0 ||
          particle.y > canvas.height
        ) {
          if (Math.random() > 0.5) {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() > 0.5 ? 0 : canvas.height;
          } else {
            particle.x = Math.random() > 0.5 ? 0 : canvas.width;
            particle.y = Math.random() * canvas.height;
          }
        }
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
