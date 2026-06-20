'use client';

// ===========================================
// Achievements & Badges — ECO MIND AI
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Star } from 'lucide-react';
import { BADGES } from '@/lib/utils/constants';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils/formatters';
import { evaluateBadge } from '@/lib/utils/badgeEvaluator';
import type { Badge } from '@/types/challenge';

export default function AchievementsPage() {
  const { user } = useAuth();

  // Evaluate badge requirements dynamically from actual user profile stats
  const processedBadges: Badge[] = BADGES.map((badge) => {
    let earned = false;
    
    if (user) {
      const stats = {
        streakDays: user.streakDays || 0,
        ecoPoints: user.ecoPoints || 0,
        carbonScore: user.carbonScore || 0,
        onboardingComplete: user.onboardingComplete || false,
        journalEntriesCount: user.journalEntriesCount || 0,
        completedChallengesCount: user.completedChallengesCount || 0,
        billScansCount: user.billScansCount || 0,
        receiptScansCount: user.receiptScansCount || 0,
        simulatorScenariosCount: user.simulatorScenariosCount || 0,
        communityChallengesCount: user.communityChallengesCount || 0,
      };

      earned = evaluateBadge(badge.id, stats);
    }

    return {
      ...badge,
      earned,
      earnedAt: earned && user ? (user.createdAt || new Date().toISOString()) : undefined,
    };
  });

  const earned = processedBadges.filter(b => b.earned);
  const locked = processedBadges.filter(b => !b.earned);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="text-gradient-eco">Achievements</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">Earn badges by completing sustainability milestones</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div className="glass-card p-5 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{earned.length}</p>
          <p className="text-xs text-surface-400">Badges Earned</p>
        </motion.div>
        <motion.div className="glass-card p-5 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Star className="w-6 h-6 text-eco-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{user?.ecoPoints?.toLocaleString() || 0}</p>
          <p className="text-xs text-surface-400">Eco Points</p>
        </motion.div>
        <motion.div className="glass-card p-5 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Lock className="w-6 h-6 text-surface-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{locked.length}</p>
          <p className="text-xs text-surface-400">To Unlock</p>
        </motion.div>
      </div>

      {/* Earned Badges */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" /> Earned Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {earned.map((badge, i) => (
            <motion.div
              key={badge.id}
              className="glass-card p-5 text-center border-eco-500/15"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{badge.name}</h3>
              <p className="text-xs text-surface-400 mb-2">{badge.description}</p>
              {badge.earnedAt && (
                <p className="text-[10px] text-eco-400">Earned {formatDate(badge.earnedAt)}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked Badges */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4 text-surface-500" /> Locked Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locked.map((badge, i) => (
            <motion.div
              key={badge.id}
              className="glass-card-static p-5 text-center opacity-60"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
              <h3 className="text-sm font-semibold text-surface-400 mb-1">{badge.name}</h3>
              <p className="text-xs text-surface-500 mb-2">{badge.description}</p>
              <p className="text-[10px] text-surface-600 italic">{badge.requirement}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
