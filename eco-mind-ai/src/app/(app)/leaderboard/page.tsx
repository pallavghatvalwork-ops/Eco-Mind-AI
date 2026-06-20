'use client';

// ===========================================
// Leaderboard — ECO MIND AI
// ===========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Search, ShieldAlert, Sparkles, Star, Users, ArrowUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_LEADERBOARD } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils/formatters';

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'global' | 'campus' | 'friends'>('global');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock different rankings based on tab selected
  const getLeaderboardData = () => {
    let list = [...MOCK_LEADERBOARD];
    if (activeTab === 'campus') {
      list = MOCK_LEADERBOARD.filter((_, i) => i % 2 === 0); // Simulate campus slice
    } else if (activeTab === 'friends') {
      list = MOCK_LEADERBOARD.slice(2, 6); // Simulate friends slice
    }

    if (searchQuery.trim()) {
      list = list.filter(item => 
        item.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Recalculate ranks based on index
    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    }));
  };

  const currentBoard = getLeaderboardData();
  const topThree = currentBoard.slice(0, 3);
  const remainingUsers = currentBoard.slice(3);

  // Find user's standing
  const myStanding = MOCK_LEADERBOARD.find(item => item.userId === 'mock-user-001') || {
    rank: 5,
    ecoPoints: 1250,
    carbonScore: 78,
  };

  const pointsToNextRank = 2100 - myStanding.ecoPoints; // points of rank 4

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-display)] flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-400" />
            Eco <span className="text-gradient-eco">Leaderboard</span>
          </h1>
          <p className="text-surface-400 text-sm mt-1">
            See how your green actions stack up against other eco warriors in the community.
          </p>
        </div>
        
        {/* Quick Rank Banner */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/3 border border-white/5 self-start md:self-auto">
          <div className="text-2xl">🔥</div>
          <div>
            <p className="text-xs text-surface-400 leading-none">Your Rank</p>
            <p className="text-sm font-bold text-white mt-1">#{myStanding.rank} Overall</p>
          </div>
          <div className="w-px h-6 bg-white/10 mx-1" />
          <div>
            <p className="text-xs text-surface-400 leading-none">Total Points</p>
            <p className="text-sm font-bold text-eco-400 mt-1">{formatNumber(myStanding.ecoPoints)} pts</p>
          </div>
        </div>
      </div>

      {/* Tabs and Search Row */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        {/* Tabs */}
        <div className="flex p-1 bg-white/3 rounded-xl border border-white/5 w-full sm:w-auto">
          {[
            { id: 'global', label: 'Global' },
            { id: 'campus', label: 'COEP Campus' },
            { id: 'friends', label: 'Friends' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-eco-500 text-white shadow-md shadow-eco-500/25'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2 text-xs glass-input text-white placeholder-surface-400"
          />
        </div>
      </div>

      {/* Podiums for Top 3 */}
      {searchQuery === '' && topThree.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 md:gap-6 items-end pt-6 pb-2 max-w-2xl mx-auto">
          
          {/* Rank 2 Podium */}
          <motion.div
            className="flex flex-col items-center"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeIn}
          >
            <div className="relative mb-3">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-slate-700/50 border-2 border-slate-400 flex items-center justify-center text-white text-base font-bold">
                {topThree[1].displayName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-400 text-[10px] font-bold text-slate-900 flex items-center justify-center border border-surface-900">
                2
              </div>
            </div>
            <p className="text-xs font-bold text-white truncate max-w-[80px] md:max-w-full text-center">
              {topThree[1].displayName}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">{formatNumber(topThree[1].ecoPoints)} pts</p>
            <div className="w-full h-20 bg-slate-400/10 border-t border-slate-400/30 rounded-t-xl mt-3 flex items-center justify-center">
              <Medal className="w-6 h-6 text-slate-300" />
            </div>
          </motion.div>

          {/* Rank 1 Podium (Tallest) */}
          <motion.div
            className="flex flex-col items-center"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeIn}
          >
            <div className="relative mb-3">
              <div className="w-18 h-18 md:w-20 md:h-20 rounded-full bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-amber-400/10">
                {topThree[0].displayName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 text-xs font-bold text-amber-990 flex items-center justify-center border border-surface-900">
                👑
              </div>
            </div>
            <p className="text-sm font-bold text-white truncate max-w-[90px] md:max-w-full text-center">
              {topThree[0].displayName}
            </p>
            <p className="text-xs text-amber-400 font-medium mt-0.5">{formatNumber(topThree[0].ecoPoints)} pts</p>
            <div className="w-full h-28 bg-amber-400/10 border-t border-amber-400/30 rounded-t-xl mt-3 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-amber-400" />
            </div>
          </motion.div>

          {/* Rank 3 Podium */}
          <motion.div
            className="flex flex-col items-center"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeIn}
          >
            <div className="relative mb-3">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-900/30 border-2 border-amber-750 flex items-center justify-center text-white text-base font-bold">
                {topThree[2].displayName.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-700 text-[10px] font-bold text-white flex items-center justify-center border border-surface-900">
                3
              </div>
            </div>
            <p className="text-xs font-bold text-white truncate max-w-[80px] md:max-w-full text-center">
              {topThree[2].displayName}
            </p>
            <p className="text-[10px] text-amber-700 mt-0.5">{formatNumber(topThree[2].ecoPoints)} pts</p>
            <div className="w-full h-16 bg-amber-700/10 border-t border-amber-700/30 rounded-t-xl mt-3 flex items-center justify-center">
              <Medal className="w-5 h-5 text-amber-600" />
            </div>
          </motion.div>

        </div>
      )}

      {/* Main Standings List */}
      <div className="glass-card-static p-4 md:p-6 space-y-4">
        
        {/* Next Rank Goal Banner */}
        {pointsToNextRank > 0 && searchQuery === '' && (
          <div className="p-3.5 px-4 rounded-xl bg-eco-500/10 border border-eco-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-eco-400 shrink-0" />
              <p className="text-surface-300">
                You are only <span className="text-white font-semibold">{pointsToNextRank} points</span> away from Rank #4! Complete 2 more weekly challenges.
              </p>
            </div>
            <a href="/challenges" className="text-eco-400 font-semibold hover:underline flex items-center gap-0.5 shrink-0 self-start sm:self-auto">
              View Challenges
            </a>
          </div>
        )}

        <div className="space-y-2">
          {/* Header Row */}
          <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-surface-500 px-4 py-2">
            <span className="w-10 text-center">Rank</span>
            <span className="flex-1">Member</span>
            <span className="w-24 text-center">Carbon Score</span>
            <span className="w-24 text-right">Points</span>
          </div>

          {/* List of members */}
          <div className="space-y-1.5">
            {currentBoard.map((item, idx) => {
              const isMe = item.userId === 'mock-user-001';
              const rankColor = 
                item.rank === 1 ? 'text-amber-400' :
                item.rank === 2 ? 'text-slate-300' :
                item.rank === 3 ? 'text-amber-600' :
                'text-surface-400';

              return (
                <motion.div
                  key={item.userId}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                    isMe 
                      ? 'bg-eco-500/15 border border-eco-500/30' 
                      : 'bg-white/3 border border-white/5 hover:bg-white/5'
                  }`}
                  initial="hidden"
                  animate="visible"
                  custom={idx}
                  variants={fadeIn}
                >
                  {/* Rank */}
                  <span className={`w-10 text-center font-bold text-sm ${rankColor}`}>
                    {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                  </span>

                  {/* Member Name */}
                  <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full gradient-eco flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {item.displayName.charAt(0)}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-semibold text-white truncate flex items-center gap-1.5">
                        {item.displayName}
                        {isMe && <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-eco-500/20 text-eco-400 border border-eco-500/30 font-bold uppercase">You</span>}
                      </p>
                      <p className="text-[10px] text-surface-500">Eco Citizen since 2026</p>
                    </div>
                  </div>

                  {/* Carbon Score */}
                  <div className="w-24 text-center shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/5 text-eco-400">
                      {item.carbonScore}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="w-24 text-right shrink-0">
                    <p className="text-sm font-bold text-white">{formatNumber(item.ecoPoints)}</p>
                    <p className="text-[10px] text-surface-500">pts</p>
                  </div>

                </motion.div>
              );
            })}

            {currentBoard.length === 0 && (
              <div className="p-10 text-center glass-card-static">
                <ShieldAlert className="w-8 h-8 text-surface-500 mx-auto mb-2" />
                <p className="text-sm text-surface-400">No users found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
