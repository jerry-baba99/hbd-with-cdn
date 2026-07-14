/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Sparkles, Flame, Check, Mic, MicOff, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface HappyBirthdayProps {
  onNext: () => void;
}

export default function HappyBirthday({ onNext }: HappyBirthdayProps) {
  const [balloonCount, setBalloonCount] = useState(6);
  // Track state of the 3 candles (true = lit, false = blown out)
  const [candles, setCandles] = useState([true, true, true]);
  const [allBlownOut, setAllBlownOut] = useState(false);

  // Microphone integration states
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [audioVolume, setAudioVolume] = useState(0);

  useEffect(() => {
    const updateBalloonCount = () => {
      setBalloonCount(window.innerWidth >= 768 ? 16 : 6);
    };

    updateBalloonCount();
    window.addEventListener("resize", updateBalloonCount);
    return () => window.removeEventListener("resize", updateBalloonCount);
  }, []);

  // Web Audio API Microphone monitoring loop
  useEffect(() => {
    if (!isMicEnabled) {
      setAudioVolume(0);
      return;
    }

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let stream: MediaStream | null = null;
    let animationFrameId: number;

    const startMic = async () => {
      try {
        setMicError(null);
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContext = new AudioContextClass();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.2; // faster reaction
        
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let blowCooldown = false;

        const checkBlow = () => {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray);

          // Sum frequency bins to check breath blow energy
          let total = 0;
          for (let i = 0; i < bufferLength; i++) {
            total += dataArray[i];
          }
          const average = total / bufferLength;
          setAudioVolume(average);

          // Standard vocal/ambient noise sits around 10-35.
          // Direct wind or heavy breath puffing registers 50-90+ average amplitude easily.
          if (average > 50 && !blowCooldown) {
            setCandles((prev) => {
              const index = prev.findIndex((c) => c === true);
              if (index !== -1) {
                const nextCandles = [...prev];
                nextCandles[index] = false;

                // Sparkle pop for individual candle
                confetti({
                  particleCount: 20,
                  spread: 45,
                  origin: { y: 0.5 },
                  colors: ["#ffd700", "#ff7f50", "#ff4500"],
                });

                // Check if all blown out
                if (nextCandles.every((c) => !c)) {
                  setAllBlownOut(true);
                  // Double giant confetti burst!
                  setTimeout(() => {
                    confetti({
                      particleCount: 100,
                      spread: 70,
                      origin: { y: 0.6 },
                    });
                    confetti({
                      particleCount: 50,
                      angle: 60,
                      spread: 55,
                      origin: { x: 0 },
                    });
                    confetti({
                      particleCount: 50,
                      angle: 120,
                      spread: 55,
                      origin: { x: 1 },
                    });
                  }, 300);
                }

                return nextCandles;
              }
              return prev;
            });

            // Cooldown between individual candle blowouts to prevent extinguishing all instantly
            blowCooldown = true;
            setTimeout(() => {
              blowCooldown = false;
            }, 450);
          }

          animationFrameId = requestAnimationFrame(checkBlow);
        };

        checkBlow();
      } catch (err: any) {
        console.error("Microphone setup failed:", err);
        setMicError("Permission denied or microphone unavailable.");
        setIsMicEnabled(false);
      }
    };

    startMic();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };
  }, [isMicEnabled]);

  const toggleMic = () => {
    setIsMicEnabled((prev) => !prev);
  };

  const handleBlowCandle = (index: number) => {
    if (!candles[index]) return; // already blown out

    const newCandles = [...candles];
    newCandles[index] = false;
    setCandles(newCandles);

    // Sparkle pop for individual candle
    confetti({
      particleCount: 15,
      spread: 40,
      origin: { y: 0.5 },
      colors: ["#ffd700", "#ff7f50", "#ff4500"],
    });

    // Check if all blown out
    if (newCandles.every((c) => !c)) {
      setAllBlownOut(true);
      // Double giant confetti burst!
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 300);
    }
  };

  const balloonColors = [
    "from-red-400 to-red-600",
    "from-blue-400 to-blue-600",
    "from-green-400 to-green-700",
    "from-yellow-400 to-yellow-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Floating Balloons Backdrop */}
      {Array.from({ length: balloonCount }).map((_, i) => {
        const color = balloonColors[i % balloonColors.length];
        const xPosition = (100 / balloonCount) * i + (Math.random() * 5 - 2.5);
        const delay = i * 0.25;
        const duration = 5 + Math.random() * 3;

        return (
          <motion.div
            key={`balloon-${i}`}
            className="absolute pointer-events-none select-none z-5"
            style={{
              left: `${xPosition}%`,
              bottom: "-10%",
            }}
            animate={{
              y: ["0vh", "-120vh"],
              x: [0, Math.sin(i) * 15, 0],
              rotate: [0, i % 2 === 0 ? 5 : -5, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear",
            }}
          >
            <div className="relative w-[60px] h-[75px] md:w-[75px] md:h-[90px]">
              {/* Balloon shape */}
              <div
                className={`w-full h-full bg-gradient-to-b ${color} relative shadow-xl`}
                style={{
                  borderRadius: "75% 75% 80% 80% / 75% 75% 80% 80%",
                }}
              >
                {/* Highlights */}
                <div className="absolute top-2 left-2 w-3.5 h-6 bg-white/45 rounded-full blur-[1px]" />
              </div>
              {/* String */}
              <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-[2px] h-[25px] bg-white/20" />
            </div>
          </motion.div>
        );
      })}

      <div className="text-center mb-8 relative z-10 max-w-xl">
        {/* Interactive Birthday Cake */}
        <motion.div
          className="mb-8 cursor-pointer relative"
          animate={allBlownOut ? { y: [0, -4, 0] } : { y: [0, -8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {allBlownOut && (
            <motion.div
              className="absolute -top-16 left-1/2 -translate-x-1/2 text-pink-400 font-cute text-sm bg-black/60 backdrop-blur-sm border border-pink-500/20 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg shadow-pink-500/10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <Check className="w-4 h-4 text-green-400" />
              <span>You made a wish! 🌟</span>
            </motion.div>
          )}

          <div className="relative flex flex-col items-center">
            {/* Candles Row */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[70px] flex justify-between z-20">
              {candles.map((isLit, idx) => (
                <div
                  key={idx}
                  className="relative group cursor-pointer"
                  onClick={() => handleBlowCandle(idx)}
                >
                  <AnimatePresence>
                    {isLit ? (
                      <motion.div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 z-30"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0, y: -10 }}
                      >
                        <motion.div
                          animate={{
                            scaleY: [1, 1.25, 1],
                            scaleX: [1, 0.85, 1],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: idx * 0.15,
                          }}
                        >
                          <Flame className="w-5 h-5 text-orange-400 fill-current drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="absolute -top-4 left-1/2 -translate-x-1/2 text-white/40 text-[9px] font-cute"
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: -8 }}
                        exit={{ opacity: 0 }}
                      >
                        💨
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Candle Wax Body */}
                  <div className="w-2.5 h-9 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-sm mx-auto shadow-md border-t border-white/20" />
                </div>
              ))}
            </div>

            {/* Cake Layers */}
            {/* Top Layer */}
            <div className="w-24 h-11 bg-gradient-to-b from-purple-300 to-purple-500 rounded-xl relative mx-auto -mt-1 shadow-md border-t border-white/20">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-300 to-pink-300 rounded-t-xl" />
              <div className="absolute inset-x-0 bottom-2 flex justify-around px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-pink-100" />
              </div>
            </div>

            {/* Middle Layer */}
            <div className="w-32 h-13 bg-gradient-to-b from-pink-300 to-pink-500 rounded-xl relative mx-auto -mt-2 shadow-lg">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-300 to-purple-400 rounded-t-xl" />
              <div className="absolute inset-x-0 bottom-3 flex justify-around px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            {/* Bottom Layer */}
            <div className="w-40 h-16 bg-gradient-to-b from-yellow-200 to-yellow-400 rounded-xl relative mx-auto -mt-1 shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-pink-300 to-pink-400 rounded-t-xl" />
              <div className="absolute inset-x-0 bottom-4 flex justify-around px-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              </div>
            </div>

            {/* Cake Plate */}
            <div className="w-44 h-3.5 bg-gradient-to-r from-gray-200 to-gray-400 rounded-full shadow-2xl border-t border-white/20" />
          </div>
        </motion.div>

        {/* Upgraded Floating instruction helper & Microphone control panel */}
        <div className="flex flex-col items-center justify-center gap-3 mb-6 relative z-10">
          <motion.p
            className="text-xs text-pink-300/80 bg-pink-500/10 border border-pink-500/20 px-4 py-1.5 rounded-full font-cute inline-block"
            animate={{ opacity: allBlownOut ? 0 : [0.6, 1, 0.6] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🎂 Blow out the candles! Click on each flame or enable your microphone to blow! 💨
          </motion.p>

          {!allBlownOut && (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-cute text-xs font-semibold border transition-all cursor-pointer shadow-md ${
                  isMicEnabled
                    ? "bg-red-500/20 border-red-400 text-red-300 hover:bg-red-500/30"
                    : "bg-pink-500/20 border-pink-400/40 text-pink-300 hover:bg-pink-500/35"
                }`}
              >
                {isMicEnabled ? (
                  <>
                    <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    <span>Mic Blowing Detection Active (Click to Disable)</span>
                  </>
                ) : (
                  <>
                    <MicOff className="w-3.5 h-3.5 text-pink-400" />
                    <span>🎙️ Enable Mic to Blow out Candles!</span>
                  </>
                )}
              </button>

              {/* Dynamic live audio level visualization bar */}
              {isMicEnabled && !micError && (
                <div className="flex flex-col items-center gap-1 mt-1">
                  <div className="w-40 bg-white/10 h-2 rounded-full overflow-hidden border border-white/5 relative">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-75"
                      style={{ width: `${Math.min(100, (audioVolume / 50) * 100)}%` }}
                    />
                    {/* Blow threshold line indicator */}
                    <div className="absolute top-0 bottom-0 left-[83%] w-[1.5px] bg-red-400 opacity-60" title="Blow Threshold" />
                  </div>
                  <span className="text-[10px] text-pink-300/60 font-cute">Blow close to your mic to trigger 💨</span>
                </div>
              )}

              {micError && (
                <p className="text-red-400 text-[10px] font-cute flex items-center gap-1 mt-1 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  {micError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Text Area */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 font-cute"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Happy Birthday
        </motion.h1>

        <motion.h2
          className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6 font-cute flex items-center justify-center gap-1.5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          Madam Jii<span className="animate-bounce">💕</span>
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-purple-300 font-cute font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
        >
          🎉 Wishing you the most beautiful and radiant year ahead! 🎉
        </motion.p>
      </div>

      {/* Navigation Trigger */}
      <motion.div
        className="mt-6 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        <button
          onClick={onNext}
          className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white text-lg md:text-xl px-10 py-4.5 rounded-full shadow-[0_8px_25px_rgba(236,72,153,0.3)] border-2 border-white/60 transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <motion.div className="flex items-center space-x-2" whileHover={{ x: 5 }}>
            <span className="font-cute font-medium">See Our Moments</span>
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
}
