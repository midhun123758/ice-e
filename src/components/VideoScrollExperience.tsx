import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ArrowDown, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoScrollExperienceProps {
  onGoToAbout?: () => void;
}

export function VideoScrollExperience({ onGoToAbout }: VideoScrollExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);

  // Automatically load & play only when arriving near the section (lazy video load)
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!video.src || video.src === '') {
              video.src = '/videos/ice-cream-bar-explode.mp4';
              video.load();
              setVideoLoaded(true);
            }
            video.currentTime = 0;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const replay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full min-h-screen h-screen overflow-hidden flex items-center justify-center bg-[#070302] select-none gpu-layer"
    >
      {/* Background 1080p Exploding Ice Cream Video — Lazy loaded with preload="none" */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0 gpu-layer"
        playsInline
        muted
        loop
        preload="none"
      />

      {/* Atmospheric Vignette & Soft Gradient Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-radial-gradient from-transparent via-black/15 to-black/60" />
      <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-black/40 via-transparent to-black/65" />

      {/* ========================================================
          THE MIDNIGHT CRUNCH CARD (COVERS GEMINI LOGO)
          Positioned in the bottom-right corner to cleanly hide
          the Gemini watermark while presenting "The Midnight Crunch"
          and its confectionery description!
          Center is kept completely clear for unobstructed viewing!
          ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 max-w-xs sm:max-w-sm pointer-events-auto"
      >
        <div className="bg-black/85 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col items-start text-left">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30 mb-2.5 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-amber-200">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Artisanal Bar</span>
          </div>

          {/* Title */}
          <h3
            className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight mb-2 drop-shadow-md"
            style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
          >
            The Midnight Crunch
          </h3>

          {/* Explanation / Description */}
          <p className="text-xs sm:text-[13px] text-white/85 font-normal leading-relaxed mb-4">
            Slow-churned sweet cream enrobed in a tempered shell of 72% Belgian dark cocoa, explosive roasted hazelnut shards, and molten caramel rivers.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full pt-1">
            <button
              onClick={replay}
              aria-label="Replay Video"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              title="Replay Video"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay</span>
            </button>

            <button
              onClick={onGoToAbout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#120803] hover:bg-white/90 text-xs font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md ml-auto group"
            >
              <span>Learn About ICE E</span>
              <ArrowDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default VideoScrollExperience;
