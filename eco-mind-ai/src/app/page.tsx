'use client';

// ===========================================
// Landing Page — ECO MIND AI
// ===========================================

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Leaf, Brain, BarChart3, Target, ScanLine, BookOpen,
  Users, TrendingUp, Trophy, ArrowRight, Sparkles,
  TreePine, Car, Zap, ChevronDown,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Brain,
    title: 'AI Sustainability Coach',
    description: 'Personalized recommendations powered by Google Gemini AI to reduce your carbon footprint.',
    color: '#22c55e',
  },
  {
    icon: BarChart3,
    title: 'Smart Carbon Calculator',
    description: 'Accurate emission tracking across transport, food, energy, shopping, and waste.',
    color: '#3b82f6',
  },
  {
    icon: ScanLine,
    title: 'Bill & Receipt Scanner',
    description: 'Upload bills and receipts — AI extracts data and calculates carbon impact automatically.',
    color: '#8b5cf6',
  },
  {
    icon: BookOpen,
    title: 'Daily Green Journal',
    description: 'Log your day in natural language. AI analyzes activities and tracks CO₂ savings.',
    color: '#f59e0b',
  },
  {
    icon: Target,
    title: 'Weekly AI Challenges',
    description: 'Custom sustainability challenges with estimated savings and reward points.',
    color: '#ec4899',
  },
  {
    icon: Users,
    title: 'Community Challenges',
    description: 'Join collective goals, compete on leaderboards, and drive impact together.',
    color: '#06b6d4',
  },
  {
    icon: TrendingUp,
    title: 'Carbon Forecast',
    description: 'Predict your future emissions and visualize potential reduction paths.',
    color: '#22c55e',
  },
  {
    icon: Trophy,
    title: 'Gamification & Badges',
    description: 'Earn eco points, unlock achievements, and climb the sustainability leaderboard.',
    color: '#f59e0b',
  },
];

const WHY_IT_MATTERS = [
  {
    icon: TreePine,
    value: '44',
    unit: 'trees',
    label: 'needed to offset average Indian\'s annual footprint',
    color: '#22c55e',
  },
  {
    icon: Car,
    value: '8,571',
    unit: 'km',
    label: 'of car travel produces the same CO₂',
    color: '#3b82f6',
  },
  {
    icon: Zap,
    value: '30%',
    unit: 'reduction',
    label: 'possible through simple daily changes',
    color: '#f59e0b',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-eco flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">ECO MIND AI</span>
          </div>
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-semibold text-white gradient-eco rounded-xl hover:shadow-lg hover:shadow-eco-500/20 transition-all duration-300"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-eco-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-accent-500/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-eco-500/5 rounded-full animate-spin-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-accent-500/5 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-eco-500/10 border border-eco-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-eco-400" />
              <span className="text-sm font-medium text-eco-400">Powered by Google Gemini AI</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-gradient-eco">Understand.</span>
            <br />
            <span className="text-white">Track.</span>
            <br />
            <span className="text-gradient-accent">Reduce.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-surface-300 max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Your AI-powered companion for carbon footprint awareness.
            Track emissions, get personalized insights, and join a community
            committed to a sustainable future.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link
              href="/login"
              className="group px-8 py-3.5 text-base font-semibold text-white gradient-eco rounded-2xl hover:shadow-lg hover:shadow-eco-500/25 transition-all duration-300 flex items-center gap-2"
            >
              Start Tracking
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 text-base font-semibold text-surface-300 rounded-2xl border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-300"
            >
              Explore Features
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="mt-16"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 text-surface-500 mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            custom={0}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Why This <span className="text-gradient-eco">Matters</span>
            </h2>
            <p className="text-surface-400 text-lg max-w-2xl mx-auto">
              The average Indian produces 1.8 tonnes of CO₂ per year. Here&apos;s what that means.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {WHY_IT_MATTERS.map((item, i) => (
              <motion.div
                key={i}
                className="glass-card p-8 text-center"
                variants={fadeInUp}
                custom={i}
              >
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}
                >
                  <item.icon className="w-8 h-8" style={{ color: item.color }} />
                </div>
                <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.value}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: item.color }}>
                  {item.unit}
                </div>
                <p className="text-surface-400 text-sm">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeInUp}
            custom={0}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Powered by <span className="text-gradient-eco">AI</span>, Built for <span className="text-gradient-accent">Impact</span>
            </h2>
            <p className="text-surface-400 text-lg max-w-2xl mx-auto">
              16 integrated features working together to help you understand, track, and reduce your carbon footprint.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
          >
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card p-6 group"
                variants={fadeInUp}
                custom={i}
              >
                <div
                  className="w-11 h-11 rounded-xl mb-4 flex items-center justify-center transition-shadow duration-300"
                  style={{
                    background: `${feature.color}15`,
                    border: `1px solid ${feature.color}25`,
                  }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Google Ecosystem Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="glass-card-static p-10 text-center overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 gradient-eco opacity-5" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Built on the <span className="text-gradient-eco">Google Ecosystem</span>
              </h2>
              <p className="text-surface-400 mb-8 max-w-xl mx-auto">
                Leveraging Google&apos;s most powerful AI and cloud technologies.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {[
                  'Gemini AI',
                  'Firebase Auth',
                  'Cloud Firestore',
                  'Firebase Hosting',
                  'Gemini Vision',
                ].map((service) => (
                  <span
                    key={service}
                    className="px-4 py-2 text-sm font-medium text-eco-400 bg-eco-500/10 border border-eco-500/20 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Ready to make a <span className="text-gradient-eco">difference</span>?
            </h2>
            <p className="text-surface-400 text-lg mb-8">
              Join thousands of eco-conscious individuals tracking and reducing their carbon footprint with AI.
            </p>
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 px-10 py-4 text-lg font-semibold text-white gradient-eco rounded-2xl hover:shadow-xl hover:shadow-eco-500/25 transition-all duration-300"
            >
              Start Your Green Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-eco-500" />
            <span className="text-sm text-surface-400">
              © 2025 ECO MIND AI. Built for a sustainable future.
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-surface-500">
            <Link href="/transparency" className="hover:text-white transition-colors">
              AI Transparency
            </Link>
            <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Powered by Gemini
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
