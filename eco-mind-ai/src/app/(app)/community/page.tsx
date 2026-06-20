'use client';

// ===========================================
// Community Carbon Challenge — ECO MIND AI
// ===========================================

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { MOCK_COMMUNITY_CHALLENGES } from '@/lib/mock-data';
import { formatCO2 } from '@/lib/utils/formatters';

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Community <span className="text-gradient-eco">Challenges</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          Join collective sustainability goals and make a bigger impact together
        </p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Challenges', value: '2', icon: Target, color: '#3b82f6' },
          { label: 'Total Participants', value: '214', icon: Users, color: '#22c55e' },
          { label: 'CO₂ Saved Together', value: '1,054 kg', icon: TrendingUp, color: '#f59e0b' },
        ].map((s, i) => (
          <motion.div
            key={i} className="glass-card p-5 text-center"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <s.icon className="w-6 h-6 mx-auto mb-2" style={{ color: s.color }} />
            <p className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{s.value}</p>
            <p className="text-xs text-surface-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Community Challenges */}
      {MOCK_COMMUNITY_CHALLENGES.map((challenge, i) => {
        const progressPercent = Math.round((challenge.currentProgressKg / challenge.goalKg) * 100);
        const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / 86400000);

        return (
          <motion.div
            key={challenge.id}
            className="glass-card-static p-6 overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-eco-500/5 rounded-full blur-[60px] -mr-20 -mt-20" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{challenge.title}</h2>
                  <p className="text-sm text-surface-400 mt-1">{challenge.description}</p>
                </div>
                {challenge.isActive && (
                  <span className="px-3 py-1 text-xs font-semibold text-eco-400 bg-eco-500/10 border border-eco-500/20 rounded-full shrink-0">
                    Active
                  </span>
                )}
              </div>

              {/* Large Progress */}
              <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <span className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                      {formatCO2(challenge.currentProgressKg).replace(' CO₂', '')}
                    </span>
                    <span className="text-sm text-surface-400 ml-1">
                      / {formatCO2(challenge.goalKg)}
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-eco-400">{progressPercent}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full gradient-eco"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    style={{ boxShadow: '0 0 12px rgba(34,197,94,0.4)' }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="p-3 rounded-xl bg-white/3 text-center">
                  <Users className="w-4 h-4 text-accent-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-white">{challenge.participantCount}</p>
                  <p className="text-[10px] text-surface-500">Participants</p>
                </div>
                <div className="p-3 rounded-xl bg-white/3 text-center">
                  <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-white">{daysLeft}</p>
                  <p className="text-[10px] text-surface-500">Days Left</p>
                </div>
                <div className="p-3 rounded-xl bg-white/3 text-center">
                  <Trophy className="w-4 h-4 text-eco-400 mx-auto mb-1" />
                  <p className="text-sm font-semibold text-white truncate">{challenge.reward.split('+')[0]}</p>
                  <p className="text-[10px] text-surface-500">Reward</p>
                </div>
              </div>

              {/* Top Contributors */}
              {challenge.participants.length > 0 && (
                <div>
                  <p className="text-xs text-surface-400 mb-2">Top Contributors</p>
                  <div className="flex gap-2">
                    {challenge.participants.slice(0, 5).map((p, j) => (
                      <div key={j} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                        <div className="w-5 h-5 rounded-full gradient-eco flex items-center justify-center text-[10px] text-white font-bold">
                          {p.displayName.charAt(0)}
                        </div>
                        <span className="text-xs text-surface-300">{p.displayName}</span>
                        <span className="text-[10px] text-eco-400 font-medium">{formatCO2(p.contributionKg)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Join Button */}
              <button className="w-full mt-5 py-3 text-sm font-semibold text-white gradient-eco rounded-xl hover:shadow-lg hover:shadow-eco-500/20 transition-all">
                Join Challenge
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
