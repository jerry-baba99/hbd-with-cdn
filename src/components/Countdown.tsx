/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Cake, Sparkles, Lock, Flame } from "lucide-react";

interface CountdownProps {
  birthdayDate: Date;
  onComplete: () => void;
}

export default function Countdown({ birthdayDate, onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showDeveloperSkip, setShowDeveloperSkip] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = birthdayDate.getTime() - now;

      if (distance <= 0) {
        onComplete();
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [birthdayDate, onComplete]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days, color: "from-pink-500/80 to-rose-500/80" },
    { label: "Hours", value: timeLeft.hours, color: "from-purple-500/80 to-pink-500/80" },
    { label: "Minutes", value: timeLeft.minutes, color: "from-indigo-500/80 to-purple-500/80" },
    { label: "Seconds", value: timeLeft.seconds, color: "from-blue-500/80 to-indigo-500/80" },
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-10 relative z-10">
        <motion.div
          className="mb-6 relative inline-block"
          animate={{
            rotate: [0, 8, -8, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl scale-125" />
          <Cake className="w-16 h-16 text-pink-400 relative z-10 drop-shadow-[0_0_15px_rgba(244,114,182,0.5)]" />
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl py-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 font-cute"
          style={{
            filter: "drop-shadow(0 0 25px rgba(236, 72, 153, 0.25))",
          }}
        >
          The Birthday Countdown
        </motion.h1>
        <p className="text-base md:text-lg text-purple-300 font-cute font-light">
          Something magical is cooking... The wait is almost over! ✨
        </p>
      </div>

      {/* Grid of countdown card dials */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl w-full px-4 relative z-10">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            className="text-center"
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{
              delay: 0.2 + index * 0.1,
              type: "spring",
              stiffness: 150,
              damping: 12,
            }}
          >
            <div
              className={`relative bg-gradient-to-br ${unit.color} rounded-3xl p-5 md:p-7 border border-white/10 overflow-hidden group`}
              style={{
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255,255,255,0.1)",
              }}
            >
              {/* Highlight flash animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <AnimatePresence mode="popLayout">
                <motion.div
                  className="text-4xl md:text-5xl font-bold text-white mb-2 font-cute tracking-tight drop-shadow-md"
                  key={unit.value}
                  initial={{ y: -15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 15, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {unit.value.toString().padStart(2, "0")}
                </motion.div>
              </AnimatePresence>
              
              <div className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-widest font-cute">
                {unit.label}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-12 text-center relative z-10 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 mb-2 text-purple-300 font-cute text-sm">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span>A handcrafted surprise is waiting inside for you 💖</span>
        </div>

        {/* Discreet skip trigger */}
        <div className="mt-8">
          {!showDeveloperSkip ? (
            <button
              onClick={() => setShowDeveloperSkip(true)}
              className="text-xs text-white/30 hover:text-pink-400/80 transition-all font-cute flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white/5 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Unlock Secret Developer Preview</span>
            </button>
          ) : (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={onComplete}
              className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/35 hover:to-purple-500/35 border border-pink-500/30 text-pink-300 text-xs md:text-sm px-5 py-2.5 rounded-full font-cute transition-all hover:scale-105 shadow-lg shadow-pink-500/10 cursor-pointer flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
              <span>Pass the Lock & Enter Madam Jii's Special Surprise! 🧁</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
