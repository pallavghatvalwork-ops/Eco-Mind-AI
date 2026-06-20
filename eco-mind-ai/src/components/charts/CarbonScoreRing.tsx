'use client';

// ===========================================
// Carbon Score Ring — ECO MIND AI
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import { getScoreColor } from '@/lib/carbon/scoring';

interface CarbonScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function CarbonScoreRing({
  score,
  size = 160,
  strokeWidth = 10,
  showLabel = true,
}: CarbonScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-label={`Carbon score: ${score} out of 100`}
        role="img"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] as const, delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}50)` }}
        />
      </svg>

      {/* Center content */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-surface-400 mt-0.5">out of 100</span>
        </div>
      )}
    </div>
  );
}
