/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, ArrowRight, RotateCw, Heart } from "lucide-react";

// Use direct string paths for generated assets to satisfy TypeScript
const rosePhoto = "/1.jpg";
const glassesPhoto = "/2.jpg";

interface PhotoGalleryProps {
  onNext: () => void;
}

export default function PhotoGallery({ onNext }: PhotoGalleryProps) {
  // Stack of interactive polaroids
  const [cards, setCards] = useState([
    {
      id: 2,
      src: glassesPhoto,
      caption: "That Precious Sparkle ✨",
      date: "August 2025",
      note: "Whenever I see you in those cute glasses, my heart does a little jump. You have this incredibly adorable, intelligent, and warm aura that just brightens my whole day. Please keep smiling like this forever! 🤓💖",
      rotated: -3,
    },
    {
      id: 1,
      src: rosePhoto,
      caption: "A Rose For My Rose 🌹",
      date: "July 2025",
      note: "No rose in this world can match your elegance and warmth. Holding these flowers, you looked like a living painting, a pure angel who spreads kindness wherever she goes. Your heart is pure gold, Madam Jii! 🌸💕",
      rotated: 4,
    },
  ]);

  const [activeFlipped, setActiveFlipped] = useState<number | null>(null);

  // Swipe logic: remove top card
  const handleSwipe = (id: number) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    setActiveFlipped(null);
  };

  const handleFlip = (id: number) => {
    setActiveFlipped(activeFlipped === id ? null : id);
  };

  const handleResetDeck = () => {
    setCards([
      {
        id: 2,
        src: glassesPhoto,
        caption: "That Precious Sparkle ✨",
        date: "August 2025",
        note: "Whenever I see you in those cute glasses, my heart does a little jump. You have this incredibly adorable, intelligent, and warm aura that just brightens my whole day. Please keep smiling like this forever! 🤓💖",
        rotated: -3,
      },
      {
        id: 1,
        src: rosePhoto,
        caption: "A Rose For My Rose 🌹",
        date: "July 2025",
        note: "No rose in this world can match your elegance and warmth. Holding these flowers, you looked like a living painting, a pure angel who spreads kindness wherever she goes. Your heart is pure gold, Madam Jii! 🌸💕",
        rotated: 4,
      },
    ]);
    setActiveFlipped(null);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-6 relative z-10">
        <motion.div
          className="mb-4 inline-block"
          animate={{
            rotate: [0, -10, 10, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Camera className="w-12 h-12 text-pink-400 mx-auto drop-shadow-[0_0_10px_rgba(244,114,182,0.4)]" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-2 font-cute">
          Moments with You
        </h1>
        <p className="text-purple-300 font-cute font-light text-sm md:text-base">
          Beautiful memories of Madam Jii. Drag to throw, click to flip the card! 📸💖
        </p>
      </div>

      {/* 3D Stack Area */}
      <div className="relative w-full max-w-sm h-[460px] flex items-center justify-center z-10 px-4">
        <AnimatePresence>
          {cards.length === 0 ? (
            <motion.div
              className="text-center flex flex-col items-center p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Heart className="w-10 h-10 text-pink-500 fill-current mb-3 animate-pulse" />
              <p className="text-purple-200 font-cute mb-4">You've looked at all the memories!</p>
              <button
                onClick={handleResetDeck}
                className="bg-white/10 hover:bg-white/20 text-white font-cute text-sm px-5 py-2.5 rounded-full transition-all border border-white/20 cursor-pointer"
              >
                View Stack Again
              </button>
            </motion.div>
          ) : (
            cards.map((card, index) => {
              const isTop = index === cards.length - 1;
              const isFlipped = activeFlipped === card.id;

              return (
                <motion.div
                  key={card.id}
                  className="absolute cursor-grab active:cursor-grabbing"
                  style={{
                    zIndex: index + 10,
                    perspective: 1000, // Enables 3D flipping space
                  }}
                  initial={{ scale: 0.9, opacity: 0, y: 15 }}
                  animate={{
                    scale: isTop ? 1 : 0.95,
                    opacity: 1,
                    y: isTop ? 0 : 8,
                    rotate: isTop ? card.rotated : card.rotated / 2,
                  }}
                  exit={{
                    x: [0, Math.random() > 0.5 ? 200 : -200],
                    y: [0, -50],
                    rotate: [0, Math.random() > 0.5 ? 20 : -20],
                    opacity: 0,
                    transition: { duration: 0.5 },
                  }}
                  drag={isTop && !isFlipped ? "x" : false} // Allow horizontal drag only if top and not flipped
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 120) {
                      handleSwipe(card.id);
                    }
                  }}
                >
                  {/* Card Flipper Inner Container */}
                  <motion.div
                    className="w-[280px] md:w-[320px] h-[390px] md:h-[430px] rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.5)] bg-pink-50 relative overflow-hidden"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    onClick={() => handleFlip(card.id)}
                  >
                    {/* --- FRONT SIDE OF POLAROID --- */}
                    <div
                      className="absolute inset-0 p-4 pb-6 flex flex-col justify-between"
                      style={{
                        backfaceVisibility: "hidden", // Hides the side facing away in 3D
                      }}
                    >
                      <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-200 border-2 border-white/60 shadow-inner relative group">
                        <img
                          src={card.src}
                          alt={card.caption}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover select-none pointer-events-none"
                        />
                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] text-white font-cute font-medium">
                          {card.date}
                        </div>
                      </div>

                      {/* Polaroid Footer */}
                      <div className="text-center mt-3">
                        <h3 className="font-cute text-base md:text-lg font-bold text-pink-900 leading-tight">
                          {card.caption}
                        </h3>
                        <p className="font-cute text-[10px] md:text-xs text-pink-700/60 mt-1 flex items-center justify-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" /> 
                        </p>
                      </div>
                    </div>

                    {/* --- BACK SIDE OF POLAROID (Flipped 180deg) --- */}
                    <div
                      className="absolute inset-0 p-6 flex flex-col justify-between text-pink-950"
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        background:
                          "linear-gradient(135deg, #fff5f5 0%, #fff0f6 100%)",
                      }}
                    >
                      <div className="flex flex-col items-center flex-grow justify-center">
                        <Heart className="w-8 h-8 text-pink-500 fill-current mb-3 animate-pulse" />
                        <p className="font-cute text-sm leading-relaxed text-center px-2 select-text cursor-text font-light text-pink-900">
                          "{card.note}"
                        </p>
                      </div>

                      {/* Polaroid Back Footer */}
                      <div className="text-center border-t border-pink-200/50 pt-2">
                        <p className="font-cute text-[10px] text-pink-700/60 flex items-center justify-center gap-1.5">
                          <RotateCw className="w-3.5 h-3.5" /> Click to see photo again
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Button to Letter Slide */}
      <motion.div
        className="mt-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white text-lg px-8 py-4 rounded-full shadow-[0_8px_20px_rgba(236,72,153,0.3)] border-2 border-white/60 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <motion.div className="flex items-center space-x-2" whileHover={{ x: 5 }}>
            <span className="font-cute">One Last Thing...</span>
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
}
