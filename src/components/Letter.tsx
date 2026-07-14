/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Heart, Sparkles, RotateCcw, Volume2, VolumeX } from "lucide-react";
import confetti from "canvas-confetti";
import { musicPlayer } from "../utils/audio";

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(musicPlayer.getIsPlaying());

  const letterText = `My Dearest Madam Jii,

On this very special day, I want you to know how incredibly grateful I am to have you in my life. Your birthday isn't just a celebration of another year - it's a celebration of all the joy, laughter, and beautiful memories you bring to this world.

You have this amazing ability to light up any room you enter, to make people smile even on their darkest days, and to spread kindness wherever you go. Your heart is pure gold, and your spirit is absolutely infectious.

Thank you for being the wonderful, amazing, absolutely fantastic person that you are. The world is so much brighter because you're in it.

Happy Birthday, beautiful soul! 🎂✨

With all my love and warmest wishes,
Forever Yours 💕`;

  useEffect(() => {
    if (showText) {
      let index = 0;
      const timer = setInterval(() => {
        if (index < letterText.length) {
          setCurrentText(letterText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setShowCursor(false);
          // Special heart-shaped sparkle shower!
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#ff69b4", "#ff1493", "#9370db", "#8a2be2", "#ffd700"],
          });
        }
      }, 30); // 30ms typing speed

      return () => clearInterval(timer);
    }
  }, [showText, letterText]);

  const handleOpenLetter = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowText(true);
    }, 850);
  };

  const handleReset = () => {
    setIsOpen(false);
    setShowText(false);
    setCurrentText("");
    setShowCursor(true);
  };

  const handleToggleAudio = () => {
    const isPlaying = musicPlayer.toggle();
    setIsAudioOn(isPlaying);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Floating Audio Controller */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={handleToggleAudio}
          className="bg-black/40 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-white/10 active:scale-95 transition-all shadow-lg cursor-pointer"
          title="Toggle Music Box"
        >
          {isAudioOn ? (
            <Volume2 className="w-5 h-5 text-pink-400 animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-white/50" />
          )}
        </button>
      </div>

      <div className="max-w-xl w-full px-4 relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2 font-cute">
            A Handcrafted Letter
          </h1>
          <p className="text-purple-300 font-cute font-light text-sm md:text-base">
            Written directly from the heart, just for you 💌
          </p>
        </motion.div>

        <motion.div
          className="relative w-full flex justify-center min-h-[350px]"
          initial={{ scale: 0.85, rotate: -3, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 150,
          }}
        >
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* --- WAX-SEALED ENVELOPE --- */
              <motion.div
                key="envelope"
                className="relative cursor-pointer select-none"
                whileHover={{ scale: 1.05, rotate: 1.5 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleOpenLetter}
                exit={{ rotateX: -90, opacity: 0, transition: { duration: 0.5 } }}
              >
                <div className="w-[310px] md:w-[350px] h-[210px] md:h-[230px] bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.4)] border-2 border-pink-300 relative overflow-hidden flex flex-col justify-between p-6">
                  {/* Flaps design overlay */}
                  <div className="absolute top-0 left-0 w-full h-[115px] bg-gradient-to-br from-pink-300/40 to-purple-300/40 transform origin-top skew-y-12 z-0" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mail className="w-14 h-14 text-pink-500/80 drop-shadow-md animate-pulse" />
                  </div>

                  {/* Elegant wax seal */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-700 rounded-full flex items-center justify-center shadow-lg border-2 border-red-400 cursor-pointer"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <Heart className="w-6 h-6 text-white fill-current" />
                    </motion.div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-spin-slow" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4">
                    <Heart className="w-5 h-5 text-rose-500 fill-current" />
                  </div>

                  <motion.div
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 text-pink-800 text-xs md:text-sm font-cute font-bold tracking-wider"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Click Seal to Open 💝
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              /* --- OPEN WRITTEN LETTER CANVAS --- */
              <motion.div
                key="letter"
                className="w-full max-w-lg rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-pink-300 p-6 md:p-8 relative flex flex-col justify-between"
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.7, type: "spring" }}
                style={{
                  background:
                    "linear-gradient(135deg, #fdf2f8 0%, #fae8ff 40%, #fdf2f8 100%)",
                }}
              >
                {/* Vintage red rose header ornament */}
                <div className="text-center mb-4">
                  <motion.div
                    className="inline-block"
                    animate={{ rotate: [0, 4, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart className="w-10 h-10 text-rose-500 fill-current mx-auto drop-shadow-md" />
                  </motion.div>
                </div>

                {/* Self-writing letter body with customized scrollbar */}
                <div className="flex-grow min-h-[300px] max-h-[320px] overflow-y-auto text-pink-950 font-cute text-sm md:text-base leading-relaxed pr-2">
                  {showText && (
                    <div className="whitespace-pre-wrap select-text font-light text-pink-900/90 text-left">
                      {currentText}
                      {showCursor && (
                        <motion.span
                          className="inline-block w-[3px] h-4 bg-pink-700 ml-1.5 align-middle"
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Read Again Button appears at completion */}
                {currentText === letterText && (
                  <motion.div
                    className="text-center mt-5"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 bg-white/70 hover:bg-white text-pink-600 font-cute font-medium border border-pink-300 px-6 py-2.5 rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Read Again 💌</span>
                    </button>
                  </motion.div>
                )}

                {/* Corner ornaments */}
                <div className="absolute top-4 left-4 pointer-events-none">
                  <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                </div>
                <div className="absolute top-4 right-4 pointer-events-none">
                  <Heart className="w-5 h-5 text-rose-500 fill-current" />
                </div>
                <div className="absolute bottom-4 left-4 pointer-events-none">
                  <Heart className="w-5 h-5 text-pink-400 fill-current" />
                </div>
                <div className="absolute bottom-4 right-4 pointer-events-none">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
