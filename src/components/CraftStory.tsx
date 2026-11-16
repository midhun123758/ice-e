import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Leaf, Milk, Wind, Award, Heart } from 'lucide-react';

export const CraftStory: React.FC = () => {
  const perks = [
    {
      icon: <Milk className="w-6 h-6 text-pink-500" />,
      title: 'Hokkaido Whole Cream',
      desc: 'Sourced from pasture-raised, grass-fed cows in Northern Japan for an incomparable silky butterfat profile.',
      tag: '100% Pure',
    },
    {
      icon: <Wind className="w-6 h-6 text-sky-500" />,
      title: '-196°C Micro Flash Freeze',
      desc: 'Liquid nitrogen churn prevents large ice crystals from forming, producing microscopic air cell texture.',
      tag: 'Ultra Smooth',
    },
    {
      icon: <Leaf className="w-6 h-6 text-emerald-500" />,
      title: 'Botanical Nectars',
      desc: 'Colored solely by nature: crushed red beetroot, ceremonial Kyoto matcha, turmeric, and wild blueberries.',
      tag: 'Zero Synthetics',
    },
    {
      icon: <Award className="w-6 h-6 text-amber-500" />,
      title: '15-Min Baked Cones',
      desc: 'Hand-pressed sugar waffle cones rolled hot off the iron with Madagascar bourbon vanilla aromatics.',
      tag: 'Always Fresh',
    },
  ];

  return (
    <section id="story" className="py-20 px-4 sm:px-8 bg-stone-900 text-white relative overflow-hidden rounded-3xl mx-4 sm:mx-8 my-10 shadow-2xl">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800 text-pink-400 text-xs font-bold uppercase tracking-wider border border-stone-700">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>The Science of Satisfaction</span>
          </div>
          <h2 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight">
            How We Mastered the <span className="text-pink-400">Perfect Scoop</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base">
            No syrups, no artificial thickeners, and no compromises. Here is what makes ICE E an entirely different category of frozen dessert.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, idx) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="bg-stone-800/80 backdrop-blur-md rounded-2xl p-6 border border-stone-700/80 hover:border-pink-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-700/60 flex items-center justify-center mb-5 shadow-inner">
                  {perk.icon}
                </div>
                <div className="inline-block text-[10px] font-bold tracking-widest uppercase text-pink-400 mb-2">
                  {perk.tag}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">
                  {perk.title}
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
