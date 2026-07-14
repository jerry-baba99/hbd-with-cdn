/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";

export default function Loader() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
    >
      {/* Decorative ambient blurred stars */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-pink-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      <div className="text-center relative z-10 flex flex-col items-center justify-center">
        {/* Heart loader container */}
        <div className="h-44 w-full flex items-center justify-center relative mb-8">
          <div className="cssload-main scale-[0.8] md:scale-100">
            <div className="cssload-heart">
              <span className="cssload-heartL"></span>
              <span className="cssload-heartR"></span>
              <span className="cssload-square"></span>
            </div>
            <div className="cssload-shadow"></div>
          </div>
        </div>

        {/* Heading with delayed fade-in */}
        <motion.h1
          className="text-2xl md:text-4xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-cute max-w-xs md:max-w-md"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Preparing Something Special
        </motion.h1>

        <motion.p
          className="text-purple-300/70 text-sm md:text-base mt-3 font-cute font-light"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          For someone very special... ✨
        </motion.p>
      </div>
    </motion.div>
  );
}
