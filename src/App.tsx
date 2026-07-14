/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

// Import custom sections
import Loader from "./components/Loader";
import Countdown from "./components/Countdown";
import Celebration from "./components/Celebration";
import HappyBirthday from "./components/HappyBirthday";
import PhotoGallery from "./components/PhotoGallery";
import Letter from "./components/Letter";
import AmbientFireflies from "./components/AmbientFireflies";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Real birthday: July 18, 2026
  const birthdayDate = new Date("2026-07-18T00:00:00");
  
  // Check if current date has reached the birthday
  const [isBirthdayOver, setIsBirthdayOver] = useState(
    new Date().getTime() >= birthdayDate.getTime()
  );

  useEffect(() => {
    // Initial loading suspense to prepare something special
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3800);
    return () => clearTimeout(timer);
  }, []);

  // Screen flow manager function
  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        if (!isBirthdayOver) {
          return (
            <Countdown
              birthdayDate={birthdayDate}
              onComplete={() => {
                setIsBirthdayOver(true);
              }}
            />
          );
        } else {
          return (
            <Celebration
              onNext={() => setCurrentScreen(1)}
            />
          );
        }
      case 1:
        return <HappyBirthday onNext={() => setCurrentScreen(2)} />;
      case 2:
        return <PhotoGallery onNext={() => setCurrentScreen(3)} />;
      case 3:
        return <Letter />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#070212] text-white overflow-hidden relative select-none font-cute">
      
      {/* Ambient Fireflies Effect */}
      <AmbientFireflies />
      
      {/* Dynamic ambient soft lights backdrops */}
      <div
        className="fixed inset-0 z-0 pointer-events-none blur-[140px] opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(244, 63, 94, 0.4) 0%, transparent 45%)",
        }}
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none blur-[140px] opacity-35"
        style={{
          backgroundImage:
            "radial-gradient(circle at 85% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 45%)",
        }}
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none blur-[180px] opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(253, 242, 248, 0.25) 0%, transparent 50%)",
        }}
      />

      {/* Screen container */}
      <div className="relative z-10 min-h-screen">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Loader key="loader" />
          ) : (
            <motion.div
              key={`screen-${currentScreen}-${isBirthdayOver}`}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="min-h-screen"
            >
              {renderScreen()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating subtle ambient star sparks in background */}
      <div className="fixed inset-0 pointer-events-none z-1 opacity-20">
        <div className="absolute top-12 left-[10%] w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <div className="absolute top-[40%] left-[80%] w-1 h-1 rounded-full bg-pink-400 animate-ping" />
        <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[70%] left-[15%] w-1 h-1 rounded-full bg-white animate-pulse" />
      </div>
    </div>
  );
}
