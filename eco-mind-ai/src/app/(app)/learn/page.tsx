'use client';

// ===========================================
// Learning Hub — ECO MIND AI
// ===========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, BookOpen, Clock, Award, Sparkles,
  Check, X, Search, Lightbulb, Heart, ArrowRight
} from 'lucide-react';
import { formatNumber } from '@/lib/utils/formatters';
import { callGemini } from '@/lib/utils/gemini';
import { useAuth } from '@/contexts/AuthContext';

const DEFAULT_LEARN_RECOMMENDATIONS = [
  {
    topic: 'Transitioning to Solar Power in India',
    reason: 'Learn about state incentives, grid-metering, and reducing AC emissions.',
    pointsReward: 25,
  },
  {
    topic: 'Maximizing Public Transit Commutes',
    reason: 'Discover carbon-saving ratios of shifting from car travel to metros or buses.',
    pointsReward: 15,
  },
  {
    topic: 'Methane and Dairy footprint',
    reason: 'A structured review of diet-linked agricultural emissions.',
    pointsReward: 20,
  },
];

const ARTICLES = [
  {
    id: 'art-1',
    category: 'Energy',
    title: 'The Hidden Standby Cost: Vampire Power',
    desc: 'Devices plugged in but switched off still draw power. Learn how vampire load accounts for up to 10% of your energy bill.',
    readTime: '3 min read',
    difficulty: 'Easy',
    points: 15,
    slug: 'vampire-power',
  },
  {
    id: 'art-2',
    category: 'Food',
    title: 'Carbon Footprint of Food: Farm to Fork',
    desc: 'Understand why lamb and beef produce 10-30x more emissions than plant equivalents and how shipping distance affects impact.',
    readTime: '5 min read',
    difficulty: 'Medium',
    points: 25,
    slug: 'carbon-food',
  },
  {
    id: 'art-3',
    category: 'Transport',
    title: 'EVs vs Hybrid vs Combustion in India',
    desc: 'Electric vehicles are cleaner, but in coal-heavy grids, how do they compare? A transparent breakdown of lifetime emissions.',
    readTime: '6 min read',
    difficulty: 'Hard',
    points: 30,
    slug: 'ev-vs-hybrid',
  },
  {
    id: 'art-4',
    category: 'Waste',
    title: 'Demystifying Wet and Dry Waste Separation',
    desc: 'Composting wet waste prevents anaerobic methane release in landfills. Learn simple kitchen segregation techniques.',
    readTime: '4 min read',
    difficulty: 'Easy',
    points: 15,
    slug: 'waste-separation',
  },
];

const QUIZ_QUESTIONS = [
  {
    question: 'Which of these diets has the lowest average carbon footprint?',
    options: [
      'Locally-sourced meat diet',
      'Vegetarian diet (rich in imported cheese)',
      'Strict vegan plant-based diet',
      'Pescatarian diet (fish and seafood)',
    ],
    correctIdx: 2,
    explanation: 'A strict plant-based vegan diet generates the lowest greenhouse gas emissions, as animal farming accounts for the majority of agricultural emissions.',
  },
  {
    question: 'How much CO₂ does an average mature tree absorb per year?',
    options: [
      'Approximately 5 kg',
      'Approximately 22 kg',
      'Approximately 100 kg',
      'Approximately 1.5 kg',
    ],
    correctIdx: 1,
    explanation: 'A mature tropical tree absorbs roughly 22 kg of CO₂ annually. That means offsetting 1 tonne of carbon requires planting about 45 trees.',
  },
  {
    question: 'Which home appliance typically consumes the most energy in Indian urban households?',
    options: [
      'LED lighting grid',
      'Air Conditioner (AC)',
      'Refrigerator',
      'Electric water kettle',
    ],
    correctIdx: 1,
    explanation: 'Air conditioners operate at high wattage (1-2 kW) and run for hours, making AC units the single largest energy drain in typical households.',
  },
];

export default function LearnPage() {
  const { user, updateUser, addNotification } = useAuth();
  const [activeCategory, setActiveCategory] = useState<'all' | 'Energy' | 'Food' | 'Transport' | 'Waste'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Quiz states
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [scoreEarned, setScoreEarned] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Recommendations state
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [usingLocalRecs, setUsingLocalRecs] = useState(false);

  // Sync completion status from user profile
  useEffect(() => {
    if (user?.quizCompleted) {
      setQuizCompleted(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const readArticles = ['Energy', 'Transport'];
        const data = await callGemini('learn', { readArticles });
        if (Array.isArray(data) && data.length > 0) {
          setRecommendations(data);
          setUsingLocalRecs(false);
        } else {
          throw new Error('Empty recommendations');
        }
      } catch (err) {
        console.warn('Failed to load learning recommendations, falling back to static:', err);
        setRecommendations(DEFAULT_LEARN_RECOMMENDATIONS);
        setUsingLocalRecs(true);
      }
    };
    fetchRecommendations();
  }, []);

  const filteredArticles = ARTICLES.filter(art => {
    const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAnswerClick = (idx: number) => {
    if (quizSubmitted || quizCompleted) return;
    setSelectedAnswer(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null || quizSubmitted || quizCompleted) return;
    
    setQuizSubmitted(true);
    if (selectedAnswer === QUIZ_QUESTIONS[currentQuizIdx].correctIdx) {
      setScoreEarned(prev => prev + 10);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIdx === QUIZ_QUESTIONS.length - 1) {
      setQuizCompleted(true);
      if (user && !user.quizCompleted) {
        updateUser({
          ecoPoints: (user.ecoPoints || 0) + scoreEarned,
          quizCompleted: true,
        });
        addNotification(
          '📚 Learning Hub Complete',
          `You earned +${scoreEarned} Eco Points.`,
          'quiz'
        );
        addNotification(
          '⭐ Eco Points Earned',
          `+${scoreEarned} points for completing a quiz.`,
          'tip'
        );
      }
    } else {
      setSelectedAnswer(null);
      setQuizSubmitted(false);
      setCurrentQuizIdx((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-[var(--font-display)] flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-eco-400" />
            Learning <span className="text-gradient-eco">Hub</span>
          </h1>
          <p className="text-surface-400 text-sm mt-1">
            Grow your knowledge. Understand the science of carbon accounting and earn eco points.
          </p>
        </div>

        {/* Score tracker */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/3 border border-white/5 self-start md:self-auto">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="text-xs text-surface-400">Quiz Points Earned:</span>
          <span className="text-sm font-bold text-white">+{scoreEarned} pts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Articles grid (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex flex-wrap gap-1 w-full sm:w-auto">
              {['all', 'Energy', 'Food', 'Transport', 'Waste'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeCategory === cat
                      ? 'bg-eco-500 text-white'
                      : 'bg-white/3 text-surface-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs glass-input text-white placeholder-surface-500"
              />
            </div>
          </div>

          {/* Articles list */}
          <div className="space-y-4">
            {filteredArticles.map((art) => (
              <Link
                key={art.id}
                href={`/learn/articles/${art.slug}`}
                className="glass-card p-5 space-y-3 cursor-pointer group block"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    art.category === 'Energy' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    art.category === 'Food' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    art.category === 'Transport' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {art.category}
                  </span>
                  
                  <div className="flex items-center gap-3 text-[10px] text-surface-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                    <span>•</span>
                    <span>{art.difficulty}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-eco-400 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-surface-400 mt-1 leading-relaxed">
                    {art.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-surface-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    +{art.points} points upon reading
                  </span>
                  
                  <span className="text-xs text-eco-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column: Interactive Quiz & Trivia (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Interactive Quiz card */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-eco-400" />
                <h2 className="text-sm font-bold text-white">Daily Eco Quiz</h2>
              </div>
            {!quizCompleted && (
              <span className="text-[10px] text-surface-500">Q {currentQuizIdx + 1} of {QUIZ_QUESTIONS.length}</span>
            )}
          </div>

          {quizCompleted ? (
            <div className="text-center py-6 space-y-3">
              <div className="text-4xl">🏆</div>
              <h3 className="text-sm font-bold text-white">Quiz Completed!</h3>
              <p className="text-xs text-surface-400 leading-relaxed">
                Great job! You have completed today's quiz and learned more about carbon accounting.
              </p>
              <div className="p-4 rounded-xl bg-eco-500/10 border border-eco-500/20 text-xs text-eco-400 font-semibold max-w-xs mx-auto">
                Points Earned: +{scoreEarned} Eco Points
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text-xs text-white font-semibold leading-relaxed">
                  {QUIZ_QUESTIONS[currentQuizIdx].question}
                </p>

                <div className="space-y-2">
                  {QUIZ_QUESTIONS[currentQuizIdx].options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === QUIZ_QUESTIONS[currentQuizIdx].correctIdx;
                    
                    let optionClass = 'bg-white/3 border-white/5 text-surface-400 hover:bg-white/5';
                    if (isSelected && !quizSubmitted) {
                      optionClass = 'bg-eco-500/10 border-eco-500/50 text-white';
                    } else if (quizSubmitted) {
                      if (isCorrect) {
                        optionClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium';
                      } else if (isSelected) {
                        optionClass = 'bg-rose-500/10 border-rose-500/50 text-rose-400';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleAnswerClick(idx)}
                        disabled={quizSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs leading-normal transition-all flex items-center justify-between ${optionClass}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />}
                        {quizSubmitted && isSelected && !isCorrect && <X className="w-3.5 h-3.5 text-rose-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Explanation & Submission Panel */}
              {quizSubmitted && (
                <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-[11px] text-surface-400 leading-relaxed">
                  <span className="font-bold text-white block mb-1">
                    {selectedAnswer === QUIZ_QUESTIONS[currentQuizIdx].correctIdx ? '🎉 Correct! (+10 points)' : '❌ Incorrect'}
                  </span>
                  {QUIZ_QUESTIONS[currentQuizIdx].explanation}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full py-2 bg-eco-500 disabled:opacity-50 text-white font-semibold text-xs rounded-xl hover:shadow-lg transition-all"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuiz}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl transition-all"
                  >
                    {currentQuizIdx === QUIZ_QUESTIONS.length - 1 ? 'Complete Quiz' : 'Next Question'}
                  </button>
                )}
              </div>
            </>
          )}
          </div>

          {/* AI Reading Recommendations */}
          {recommendations.length > 0 && (
            <div className="glass-card-static p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-eco-400" />
                  <h3 className="text-sm font-bold text-white">AI Reading recommendations</h3>
                </div>
                {usingLocalRecs && (
                  <span className="text-[9px] text-amber-400 font-semibold px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full shrink-0">
                    Offline
                  </span>
                )}
              </div>
              {usingLocalRecs && (
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 rounded-lg">
                  ⚠️ AI features are temporarily unavailable. Using local recommendations.
                </div>
              )}
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/3 border border-white/5 space-y-1">
                    <p className="text-xs font-semibold text-white">{rec.topic}</p>
                    <p className="text-[10px] text-surface-400 leading-relaxed">{rec.reason}</p>
                    <span className="inline-flex items-center text-[9px] text-yellow-400 mt-1 font-semibold bg-yellow-500/10 px-2 py-0.5 rounded">
                      💰 +{rec.pointsReward} pts reward
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Trivia Box */}
          <div className="glass-card-static p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h3 className="text-sm font-bold text-white">Eco Trivia</h3>
            </div>
            
            <p className="text-xs text-surface-400 leading-relaxed">
              If every household in India switched one incandescent bulb to an LED bulb, we could save over 5.5 billion kWh of electricity and reduce 4.5 million tonnes of carbon emissions annually. LEDs consume up to 85% less energy and last 25 times longer!
            </p>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-surface-500">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-500" fill="currentColor" />
                Favored by 125 users
              </span>
              <span>Trivia #42</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
