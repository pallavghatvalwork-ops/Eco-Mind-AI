'use client';

// ===========================================
// Natural Language Activity Tracker — ECO MIND AI
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Check, X, History, Car, Utensils, Zap, ShoppingBag, Trash2 } from 'lucide-react';
import { formatCO2, formatRelativeTime } from '@/lib/utils/formatters';
import type { DetectedActivity } from '@/types/activity';
import { callGemini } from '@/lib/utils/gemini';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/client';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  transport: <Car className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  energy: <Zap className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  waste: <Trash2 className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#3b82f6',
  food: '#22c55e',
  energy: '#f59e0b',
  shopping: '#8b5cf6',
  waste: '#ef4444',
};

const SUGGESTIONS = [
  'Today I drove 10 km and used AC for 5 hours',
  'I travelled by train and ate vegetarian meals',
  'Walked to work today and had vegan lunch',
  'Used metro for commute, ordered groceries online',
];

export default function TrackerPage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedActivities, setDetectedActivities] = useState<DetectedActivity[]>([]);
  const [showDetected, setShowDetected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchActivities = async () => {
      try {
        setLoadingHistory(true);
        const q = query(
          collection(db, 'users', user.uid, 'activities'),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const fetched: any[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() });
        });
        setActivities(fetched);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchActivities();
  }, [user]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);

    try {
      setError(null);
      const data = await callGemini('tracker', { text: input });
      if (data && data.isFallback) {
        throw new Error('AI fallback triggered');
      }
      if (Array.isArray(data)) {
        setDetectedActivities(data);
        setShowDetected(true);
      } else {
        throw new Error('AI did not return an array of activities');
      }
    } catch (err) {
      console.warn('Real Gemini API tracker analysis failed. Falling back to local parser:', err);
      setError('AI features are temporarily unavailable. Using local recommendations.');
      
      // Mock detected activities based on input (Fallback)
      const mockDetected: DetectedActivity[] = [];
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('drove') || lowerInput.includes('car') || lowerInput.includes('drive')) {
        const kmMatch = lowerInput.match(/(\d+)\s*km/);
        const km = kmMatch ? parseInt(kmMatch[1]) : 10;
        mockDetected.push({
          category: 'transport',
          description: `Drove ${km} km by car`,
          parsedData: { mode: 'car', distanceKm: km },
          estimatedCarbonKg: km * 0.21,
          confidence: 0.95,
        });
      }
      if (lowerInput.includes('train') || lowerInput.includes('metro')) {
        mockDetected.push({
          category: 'transport',
          description: 'Used public transport',
          parsedData: { mode: 'train', distanceKm: 15 },
          estimatedCarbonKg: 0.62,
          confidence: 0.88,
        });
      }
      if (lowerInput.includes('ac') || lowerInput.includes('air condition')) {
        const hrMatch = lowerInput.match(/(\d+)\s*hour/);
        const hrs = hrMatch ? parseInt(hrMatch[1]) : 3;
        mockDetected.push({
          category: 'energy',
          description: `Used AC for ${hrs} hours`,
          parsedData: { type: 'ac', unitsOrHours: hrs },
          estimatedCarbonKg: hrs * 1.23,
          confidence: 0.92,
        });
      }
      if (lowerInput.includes('vegetarian') || lowerInput.includes('vegan')) {
        mockDetected.push({
          category: 'food',
          description: 'Vegetarian meals',
          parsedData: { mealType: 'full day', dietType: 'vegetarian' },
          estimatedCarbonKg: 3.81,
          confidence: 0.90,
        });
      }
      if (lowerInput.includes('walk') || lowerInput.includes('bicycle') || lowerInput.includes('cycle')) {
        mockDetected.push({
          category: 'transport',
          description: 'Walked / Cycled (Zero emission! 🌿)',
          parsedData: { mode: 'walking', distanceKm: 5 },
          estimatedCarbonKg: 0,
          confidence: 0.98,
        });
      }

      // Default if nothing detected
      if (mockDetected.length === 0) {
        mockDetected.push({
          category: 'transport',
          description: 'General daily activities',
          parsedData: { mode: 'car', distanceKm: 8 },
          estimatedCarbonKg: 1.68,
          confidence: 0.60,
        });
      }

      setDetectedActivities(mockDetected);
      setShowDetected(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!user || detectedActivities.length === 0) return;
    try {
      for (const act of detectedActivities) {
        const activityDoc = {
          userId: user.uid,
          rawInput: input,
          category: act.category,
          parsedData: act.parsedData,
          carbonKg: act.estimatedCarbonKg,
          source: 'nlp',
          createdAt: new Date().toISOString(),
          date: new Date().toISOString(),
        };
        await addDoc(collection(db, 'users', user.uid, 'activities'), activityDoc);
      }
      
      // Refresh history
      const q = query(
        collection(db, 'users', user.uid, 'activities'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const fetched: any[] = [];
      snap.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() });
      });
      setActivities(fetched);
    } catch (err) {
      console.error('Error saving activities:', err);
    } finally {
      setShowDetected(false);
      setDetectedActivities([]);
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
          Activity <span className="text-gradient-eco">Tracker</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          Describe your activities in natural language — AI extracts and calculates emissions
        </p>
      </div>

      {/* Input Section */}
      <div className="glass-card-static p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-eco-400" />
          <span className="text-sm font-medium text-eco-400">Powered by Gemini AI</span>
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me about your day... e.g., 'Today I drove 10 km and used AC for 5 hours'"
            className="w-full h-28 glass-input px-4 py-3 text-white placeholder-surface-500 resize-none text-sm"
            aria-label="Activity description"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAnalyze(); } }}
          />
          <button
            onClick={handleAnalyze}
            disabled={!input.trim() || isAnalyzing}
            className="absolute bottom-3 right-3 p-2.5 gradient-eco rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-eco-500/20 transition-all"
            aria-label="Analyze activities"
          >
            {isAnalyzing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white transition-colors border border-white/5"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Detected Activities */}
      <AnimatePresence>
        {showDetected && detectedActivities.length > 0 && (
          <motion.div
            className="glass-card-static p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-base font-semibold text-white mb-4">🔍 Detected Activities</h2>
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium">
                ⚠️ AI features are temporarily unavailable. Using local recommendations.
              </div>
            )}
            <div className="space-y-3">
              {detectedActivities.map((activity, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/3 border border-white/5"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: `${CATEGORY_COLORS[activity.category]}15`,
                      color: CATEGORY_COLORS[activity.category],
                    }}
                  >
                    {CATEGORY_ICONS[activity.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-surface-400 capitalize">{activity.category}</span>
                      <span className="text-xs text-surface-500">•</span>
                      <span className="text-xs text-surface-400">
                        {(activity.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-semibold ${
                      activity.estimatedCarbonKg === 0 ? 'text-eco-400' : 'text-surface-300'
                    }`}>
                      {activity.estimatedCarbonKg === 0 ? '🌿 Zero!' : formatCO2(activity.estimatedCarbonKg)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
              <p className="text-sm text-surface-400">
                Total: <span className="text-white font-semibold">
                  {formatCO2(detectedActivities.reduce((s, a) => s + a.estimatedCarbonKg, 0))}
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDetected(false); setDetectedActivities([]); }}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm text-surface-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white gradient-eco rounded-xl hover:shadow-lg hover:shadow-eco-500/20 transition-all"
                >
                  <Check className="w-4 h-4" />
                  Save Activities
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity History */}
      <div className="glass-card-static p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-surface-400" />
          <h2 className="text-base font-semibold text-white">Recent Activities</h2>
        </div>

        <div className="space-y-3">
          {loadingHistory ? (
            <div className="text-center py-6 text-sm text-surface-500">Loading activity history...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-6 text-sm text-surface-500">No activities recorded yet.</div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/3 transition-colors">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${CATEGORY_COLORS[activity.category]}15`,
                    color: CATEGORY_COLORS[activity.category],
                  }}
                >
                  {CATEGORY_ICONS[activity.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{activity.rawInput}</p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {formatRelativeTime(activity.createdAt)} • via {activity.source || 'nlp'}
                  </p>
                </div>
                <span className="text-sm font-medium text-surface-300 shrink-0">
                  {formatCO2(activity.carbonKg)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
