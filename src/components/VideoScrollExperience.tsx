import React, { useEffect, useRef, useState } from 'react';
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
          THE MIDNIGHT CRUNCH TYPOGRAPHY (COVERS GEMINI LOGO)
          Pure floating words with Fredoka brand font — NO box,
          positioned over the bottom-right corner to cleanly
          conceal the Gemini watermark while keeping the view clear!
          ======================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute bottom-5 right-5 sm:bottom-8 sm:right-8 z-30 max-w-xs sm:max-w-md text-right pointer-events-auto select-text"
      >
        {/* Soft, natural shadow layer behind words to completely obscure the Gemini watermark */}
        <div className="absolute -inset-8 bg-black/60 blur-2xl rounded-full pointer-events-none -z-10" />

        {/* Title in iconic Fredoka bold font */}
        <h3
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight mb-2 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
          style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
        >
          The Midnight Crunch
        </h3>

        {/* Narrative Description in Fredoka font */}
        <p
          className="text-xs sm:text-sm lg:text-[15px] text-white/95 font-normal leading-relaxed sm:leading-relaxed drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
          style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
        >
          Slow-churned sweet cream enrobed in a tempered shell of 72% Belgian dark cocoa, explosive roasted hazelnut shards, and molten caramel rivers.
        </p>
      </motion.div>
    </section>
  );
}

export default VideoScrollExperience;
