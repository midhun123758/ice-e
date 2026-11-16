import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Chloe V.',
    role: 'Food & Wine Editor',
    comment: 'The Strawberry Velvet tastes like heaven. The texture has zero crystallization!',
    rating: 5,
    avatar: '👩🏼',
  },
  {
    name: 'Marcus Chen',
    role: 'Gelato Connoisseur',
    comment: 'Matcha Zenith with charcoal cone is arguably the greatest flavor pairing in the city.',
    rating: 5,
    avatar: '👨🏻',
  },
  {
    name: 'Elena Rostova',
    role: 'Pastry Chef',
    comment: 'The -196°C freeze technique makes the mouthfeel absurdly velvety. 10/10.',
    rating: 5,
    avatar: '👩🏽',
  },
  {
    name: 'David K.',
    role: 'Verified Foodie',
    comment: 'The build-your-own cone tool is so much fun, and the hot fudge drip is top notch!',
    rating: 5,
    avatar: '🧔🏻',
  },
  {
    name: 'Aisha Patel',
    role: 'Daily Regular',
    comment: 'Alphonso Sunrise literally transports you straight to the mango orchards of Ratnagiri.',
    rating: 5,
    avatar: '👩🏾',
  },
];

export const ReviewsTicker: React.FC = () => {
  return (
    <section id="reviews" className="py-16 overflow-hidden bg-white/50 border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
        <span className="text-xs uppercase font-bold tracking-widest text-stone-400 block mb-1">
          LOVED BY THOUSANDS
        </span>
        <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-900">
          What the Ice Cream World is Saying
        </h3>
      </div>

      {/* Infinite Scrolling Marquee */}
      <div className="flex gap-6 w-full select-none">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}
          className="flex gap-6 shrink-0"
        >
          {[...REVIEWS, ...REVIEWS].map((item, idx) => (
            <div
              key={idx}
              className="w-80 sm:w-96 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center gap-1 mb-2">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed mb-4">
                "{item.comment}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <span className="text-2xl">{item.avatar}</span>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">{item.name}</h4>
                  <span className="text-[11px] text-stone-400 font-medium">{item.role}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
