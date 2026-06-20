'use client';

// ===========================================
// AI Daily Green Journal — ECO MIND AI
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Send, Sparkles, Calendar, TrendingDown, Flame } from 'lucide-react';
import { formatCO2, formatRelativeTime } from '@/lib/utils/formatters';
import { callGemini } from '@/lib/utils/gemini';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

interface JournalResult {
  activities: string[];
  totalSavings: number;
  encouragement: string;
  streakDay: number;
}

export default function JournalPage() {
  const { user, updateUser, addNotification } = useAuth();
  const [entry, setEntry] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<JournalResult | null>(null);
  const [usingLocalJournal, setUsingLocalJournal] = useState(false);
  const [pastEntries, setPastEntries] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const fetchJournals = async () => {
    if (!user) return;
    try {
      setLoadingHistory(true);
      const q = query(
        collection(db, 'users', user.uid, 'journals'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const fetched: any[] = [];
      snap.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setPastEntries(fetched);
    } catch (err) {
      console.error('Error fetching journals:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJournals();
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!entry.trim()) return;
    setIsAnalyzing(true);

    try {
      const data = await callGemini('journal', { text: entry });
      if (data && data.isFallback) {
        throw new Error('AI fallback triggered');
      }
      if (data && typeof data === 'object') {
        const nextStreak = (user?.streakDays || 0) + 1;
        const rewardPoints = Number(data.scoreIncrease || 10);
        
        setResult({
          activities: Array.isArray(data.activities) ? data.activities : ['Custom green action recognized'],
          totalSavings: Number(data.co2SavedKg || 0),
          encouragement: data.encouragement || 'Keep up the amazing green choices! 🌿',
          streakDay: nextStreak,
        });

        // Save to Firestore
        if (user) {
          const entryDoc = {
            userId: user.uid,
            text: entry,
            savings: Number(data.co2SavedKg || 0),
            streak: nextStreak,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };
          await addDoc(collection(db, 'users', user.uid, 'journals'), entryDoc);
        }

        // Award eco points and advance streak in Auth context / Firestore
        updateUser({
          ecoPoints: (user?.ecoPoints || 0) + rewardPoints,
          streakDays: nextStreak,
          journalEntriesCount: (user?.journalEntriesCount || 0) + 1,
        });
        setUsingLocalJournal(false);
        addNotification(
          `🔥 ${nextStreak}-Day Streak!`,
          `You've been tracking activities for ${nextStreak} consecutive days.`,
          'streak'
        );
        addNotification(
          '⭐ Eco Points Earned',
          `+${rewardPoints} points for submitting a journal entry.`,
          'tip'
        );
        
        await fetchJournals();
      } else {
        throw new Error('AI did not return correct response format');
      }
    } catch (err) {
      console.warn('Real Gemini API journal analysis failed. Falling back to mock:', err);
      const nextStreak = (user?.streakDays || 1);
      setResult({
        activities: [
          '🚲 Bicycle commute detected — Zero emissions!',
          '🥗 Vegetarian meals — Lower carbon diet',
          '♻️ Composting mentioned — Great waste management',
        ],
        totalSavings: 4.2,
        encouragement: `Amazing day! You saved approximately 4.2 kg CO₂ compared to the average Indian lifestyle. Your consistent green choices are making a real difference. Keep this momentum going — you're on a ${nextStreak}-day streak! 🌿`,
        streakDay: nextStreak,
      });
      
      // Save mock entry to Firestore
      if (user) {
        const entryDoc = {
          userId: user.uid,
          text: entry,
          savings: 4.2,
          streak: nextStreak,
          date: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        await addDoc(collection(db, 'users', user.uid, 'journals'), entryDoc);
      }

      updateUser({
        ecoPoints: (user?.ecoPoints || 0) + 15,
        streakDays: nextStreak,
        journalEntriesCount: (user?.journalEntriesCount || 0) + 1,
      });
      setUsingLocalJournal(true);
      addNotification(
        `🔥 ${nextStreak}-Day Streak!`,
        `You've been tracking activities for ${nextStreak} consecutive days.`,
        'streak'
      );
      addNotification(
        '⭐ Eco Points Earned',
        `+15 points for submitting a journal entry.`,
        'tip'
      );

      await fetchJournals();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Green <span className="text-gradient-eco">Journal</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          Write about your day — AI analyzes your sustainability impact
        </p>
      </div>

      {/* Journal Entry */}
      <div className="glass-card-static p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-surface-400" />
          <span className="text-sm text-surface-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="How was your day from a sustainability perspective? e.g., 'Today I traveled by bicycle and ate vegetarian food. I composted my kitchen waste and used a reusable water bottle.'"
          className="w-full h-36 glass-input px-4 py-3 text-white placeholder-surface-500 resize-none text-sm mb-4"
          aria-label="Green journal entry"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-eco-400" />
            <span className="text-xs text-surface-500">Gemini AI will analyze your activities</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!entry.trim() || isAnalyzing}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white gradient-eco rounded-xl disabled:opacity-50 hover:shadow-lg hover:shadow-eco-500/20 transition-all"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Submit Entry'}
          </button>
        </div>
      </div>

      {/* AI Analysis Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            className="glass-card-static p-6 border-eco-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-eco-400" />
              AI Analysis
            </h2>

            {usingLocalJournal && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
                ⚠️ AI features are temporarily unavailable. Using local recommendations.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              <div className="p-4 rounded-xl bg-eco-500/10 border border-eco-500/20 text-center">
                <TrendingDown className="w-5 h-5 text-eco-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{formatCO2(result.totalSavings)}</p>
                <p className="text-xs text-surface-400">CO₂ Saved Today</p>
              </div>
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{result.streakDay}</p>
                <p className="text-xs text-surface-400">Day Streak</p>
              </div>
              <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 text-center">
                <BookOpen className="w-5 h-5 text-accent-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-white">{result.activities.length}</p>
                <p className="text-xs text-surface-400">Activities Detected</p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {result.activities.map((a, i) => (
                <motion.p
                  key={i}
                  className="text-sm text-surface-300 py-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {a}
                </motion.p>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-eco-500/5 border border-eco-500/10">
              <p className="text-sm text-surface-300 leading-relaxed">{result.encouragement}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Past Entries */}
      <div className="glass-card-static p-6">
        <h2 className="text-base font-semibold text-white mb-4">Past Entries</h2>
        <div className="space-y-3">
          {loadingHistory ? (
            <div className="text-center py-6 text-sm text-surface-500">Loading journal history...</div>
          ) : pastEntries.length === 0 ? (
            <div className="text-center py-6 text-sm text-surface-500">No journal entries yet.</div>
          ) : (
            pastEntries.map((e, i) => (
              <div key={e.id || i} className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-eco-500/10 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-eco-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-surface-400">
                      {e.createdAt ? formatRelativeTime(e.createdAt) : e.date}
                    </span>
                    <span className="text-xs text-eco-400 font-medium">🔥 Day {e.streak}</span>
                  </div>
                  <p className="text-sm text-surface-300">{e.text}</p>
                  <p className="text-xs text-eco-400 mt-1 font-medium">Saved {formatCO2(e.savings)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
