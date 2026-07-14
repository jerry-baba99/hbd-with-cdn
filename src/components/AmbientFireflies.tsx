/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

export default function AmbientFireflies() {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);

  useEffect(() => {
    const colors = [
      "rgba(253, 224, 71, 0.6)", // Warm Gold/Yellow
      "rgba(244, 114, 182, 0.55)", // Soft Pink
      "rgba(192, 132, 252, 0.5)", // Amber Purple
      "rgba(251, 146, 60, 0.65)"  // Magical Orange
    ];

    const generated: Firefly[] = Array.from({ length: 25 }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 100, // percentage x
      y: Math.random() * 100, // percentage y
      size: Math.random() * 4 + 3, // 3px to 7px size
      color: colors[idx % colors.length],
      duration: Math.random() * 12 + 10, // 10s to 22s travel duration
      delay: Math.random() * -15 // Start immediately at random progress
    }));

    setFireflies(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {fireflies.map((ff) => (
        <motion.div
          key={ff.id}
          className="absolute rounded-full"
          style={{
            left: `${ff.x}%`,
            top: `${ff.y}%`,
            width: ff.size,
            height: ff.size,
            backgroundColor: ff.color,
            boxShadow: `0 0 ${ff.size * 2}px ${ff.color}, 0 0 ${ff.size * 4}px ${ff.color}`,
          }}
          animate={{
            x: [
              0,
              Math.random() * 120 - 60,
              Math.random() * 120 - 60,
              0
            ],
            y: [
              0,
              Math.random() * -150 - 50, // Generally float upwards
              Math.random() * 100 - 50,
              0
            ],
            opacity: [0.1, 0.9, 0.4, 0.9, 0.1],
            scale: [1, 1.3, 0.8, 1.2, 1]
          }}
          transition={{
            duration: ff.duration,
            repeat: Infinity,
            delay: ff.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}
