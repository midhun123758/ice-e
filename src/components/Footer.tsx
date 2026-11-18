import React from 'react';
import { ArrowUp } from 'lucide-react';
import { playChime } from '../utils/audio';

interface FooterProps {
  onBackToTop: () => void;
  onNavigateSection?: (section: number) => void;
}

export function Footer({ onBackToTop, onNavigateSection }: FooterProps) {
  return (
    <footer className="w-full bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-white/10 py-5 px-6 sm:px-12 z-30 shrink-0 select-none pointer-events-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <span
            className="text-xl font-bold text-white tracking-wide"
            style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
          >
            ICE E
          </span>
          <span className="text-white/20">•</span>
          <span className="text-white/70 tracking-wider uppercase text-xs font-medium">
            Artisanal Confectionery • Since 1990
          </span>
        </div>

        {/* Minimal Copyright */}
        <div className="text-white/50 text-xs tracking-wide text-center">
          © 2026 ICE E Confectionery Co. All rights reserved.
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-5">
          {onNavigateSection && (
            <div className="hidden md:flex items-center gap-4 text-xs font-semibold text-white/70">
              <button
                onClick={() => onNavigateSection(0)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => onNavigateSection(1)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                The Pour
              </button>
              <span className="text-white/20">•</span>
              <button
                onClick={() => onNavigateSection(2)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Flavors
              </button>
            </div>
          )}

          <button
            onClick={() => {
              playChime();
              onBackToTop();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 border border-white/15 shadow-sm cursor-pointer"
            aria-label="Back to Top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
