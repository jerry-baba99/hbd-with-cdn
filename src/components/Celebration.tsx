/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Gift, Sparkles, Music, Music2 } from "lucide-react";
import confetti from "canvas-confetti";
import { musicPlayer } from "../utils/audio";

interface CelebrationProps {
  onNext: () => void;
}

export default function Celebration({ onNext }: CelebrationProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    // Continuous celebratory confetti showers
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#ff69b4", "#ff1493", "#c084fc", "#a855f7", "#60a5fa"];

    const frame = () => {
      const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

      for (let i = 0; i < 2; i++) {
        confetti({
          particleCount: 1,
          angle: i === 0 ? 60 : 120,
          spread: 60,
          origin: { x: i === 0 ? 0.05 : 0.95, y: 0.8 },
          colors: [randomColor()],
        });
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  const handleStartMagic = () => {
    // Trigger huge confetti pop
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Start background music box
    musicPlayer.start();
    setIsAudioPlaying(true);

    // Proceed to slides
    setTimeout(() => {
      onNext();
    }, 1200);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -80 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center mb-10 relative z-10 max-w-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Glowing floating box */}
        <motion.div
          className="relative mb-8 inline-block"
          animate={{
            rotate: [0, 8, -8, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full blur-2xl opacity-40 scale-125 animate-pulse" />
          <div className="w-32 h-32 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto shadow-[0_15px_40px_rgba(236,72,153,0.4)] relative overflow-hidden group cursor-pointer">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ["-150%", "150%"] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <Gift className="w-16 h-16 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-6 font-cute tracking-tight"
          style={{
            filter: "drop-shadow(0 0 30px rgba(255,105,180,0.45))",
          }}
        >
          Time to Celebrate!
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-purple-300 font-cute font-light leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The countdown is complete! A magical world made just for you is about to unfold... 🎉
        </motion.p>
      </motion.div>

      {/* Primary Action Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.8,
          type: "spring",
          stiffness: 180,
          damping: 10,
        }}
        className="relative z-10"
      >
        <button
          onClick={handleStartMagic}
          className="relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white text-lg md:text-xl px-10 py-5 rounded-full shadow-[0_10px_30px_rgba(236,72,153,0.35)] border-2 border-white/60 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <motion.div className="flex items-center space-x-3" whileTap={{ scale: 0.95 }}>
            <Music className="w-6 h-6 animate-pulse" />
            <span className="font-semibold font-cute">Open Madam Jii's Gift!</span>
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </motion.div>
        </button>
      </motion.div>

      {/* Decorative prompt message */}
      <motion.p
        className="mt-6 text-purple-300/60 text-sm font-cute font-light relative z-10 flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Music2 className="w-4 h-4 text-pink-400" />
        <span>Click to start the music & unlock the magic! ✨</span>
      </motion.p>
    </motion.div>
  );
}
