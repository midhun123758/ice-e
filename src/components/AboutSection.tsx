import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Footer } from './Footer';

interface AboutSectionProps {
  onBackToTop: () => void;
  onNavigateSection?: (sec: number) => void;
}

export function AboutSection({
  onBackToTop,
  onNavigateSection,
}: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy-load and play the background video only when section enters viewport
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!video.src || video.src === '') {
              video.src = '/videos/about-bg.mp4';
              video.load();
            }
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: '300px 0px', threshold: 0.1 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen select-none bg-white text-[#23120b] flex flex-col justify-between overflow-hidden gpu-layer"
    >
      {/* ========================================================
          BACKGROUND VIDEO LAYER:
          White base with translucent video & soft white scrim
          ======================================================== */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-white">
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover pointer-events-none transition-opacity duration-700 gpu-layer"
          style={{ opacity: 0.75 }}
        />

        {/* Soft, clean white scrim overlay to keep the typography crystal-clear */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-white/75 pointer-events-none" />
      </div>

      {/* ========================================================
          ABOUT ICE E: ONLY THE WORDS (NO CARDS, NO BUTTONS, NO BADGES)
          Pure, high-contrast, beautiful typography
          ======================================================== */}
      <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 sm:px-12 pt-20 sm:pt-28 pb-12 text-center select-text">
        {/* Title: About ICE E */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-[#23120b] mb-6 drop-shadow-sm leading-none"
          style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
        >
          About ICE E
        </motion.h2>

        {/* Narrative Paragraph 1 */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg sm:text-xl md:text-2xl lg:text-[1.5rem] xl:text-[1.65rem] text-[#2b170e] font-normal leading-relaxed sm:leading-relaxed max-w-3xl mx-auto mb-5 drop-shadow-sm"
          style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
        >
          Born from an obsession with cold science and sensory contrast, ICE E redefines small-batch artisanal frozen confectionery. Every scoop is an exploration of pure textures, natural fruits, and molten drizzles.
        </motion.p>

        {/* Narrative Paragraph 2 */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-sm sm:text-base md:text-lg lg:text-xl text-[#4a2e1b]/95 font-normal leading-relaxed sm:leading-relaxed max-w-2xl mx-auto drop-shadow-sm"
          style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
        >
          Crafted in micro-batches with sun-ripened fruit slices, organic whole milk, and single-origin cocoa, celebrating pure ingredients and unmatched velvety smoothness.
        </motion.p>
      </div>

      {/* ========================================================
          MINIMAL DARK FOOTER DOCKED AT BOTTOM
          ======================================================== */}
      <Footer
        onBackToTop={onBackToTop}
        onNavigateSection={onNavigateSection}
      />
    </section>
  );
}

export default AboutSection;
