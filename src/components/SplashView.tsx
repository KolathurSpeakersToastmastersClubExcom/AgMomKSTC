import React, { useEffect, useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

interface SplashViewProps {
  onComplete: () => void;
}

export default function SplashView({ onComplete }: SplashViewProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background text-on-background select-none">
      {/* Background Ambient Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px]" />

      <div className="relative mb-12 transition-transform duration-700">
        {/* Glass Plate */}
        <div className="glass-panel p-10 rounded-[40px] relative overflow-hidden group border border-white/40 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-white font-black text-4xl shadow-lg border border-white/50 overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTYPK2WQNUnXV4hMCrXx54F8HF29C3eaSUxVTtDbuXi7rXpuz-ZyR0BjIjuHRfUVp-CfxA-0MhPlyv-MsKKs7E6EaRIjGmBfzj6ju1AGdnHjZfP2nfqaV642kAxGGNosjWl-76I-hKuryJYPgV8yOROeM-K4zmFcHJX_1-kjYztpno7LJQildA3vEug-NclzFnwts4ZPCWP4tBeIzgyrvb2TdEmDfwjBsxMCfT-cdB96Dw1w7Fjl-z-Q9f8MbKPu1CZ2eBsftFYU8" 
                alt="Toastmasters AI Logo"
                className="w-full h-full object-cover scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-primary-container/10 blur-xl rounded-full" />
      </div>

      <div className="text-center space-y-6 max-w-2xl px-4 z-10">
        <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Toastmasters <span className="text-secondary">AI</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant/80 max-w-md mx-auto leading-relaxed">
          Empowering Leaders Through AI-Driven Agendas
        </p>

        {/* Progress bar */}
        <div className="pt-12 flex flex-col items-center gap-4">
          <div className="w-48 h-1.5 bg-surface-container-highest rounded-full overflow-hidden relative border border-outline-variant/10">
            <div 
              className="absolute left-0 top-0 h-full bg-primary-container transition-all duration-100 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
          <span className="font-mono text-xs text-outline tracking-widest uppercase">
            Initializing Intelligence ({progress}%)
          </span>
        </div>
      </div>

      <div className="absolute bottom-12 flex gap-8">
        <div className="flex items-center gap-2 text-on-surface-variant/50 text-sm">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="font-sans font-medium">Precision Prepared</span>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant/50 text-sm">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="font-sans font-medium">Real-time Feedback</span>
        </div>
      </div>
    </div>
  );
}
