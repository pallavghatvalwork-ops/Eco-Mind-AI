'use client';

// ===========================================
// Sidebar Navigation — ECO MIND AI
// ===========================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquareText,
  BookOpen,
  Receipt,
  ScanLine,
  Target,
  Users,
  SlidersHorizontal,
  Trophy,
  Medal,
  TrendingUp,
  GraduationCap,
  Brain,
  Leaf,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  MessageSquareText,
  BookOpen,
  Receipt,
  ScanLine,
  Target,
  Users,
  SlidersHorizontal,
  Trophy,
  Medal,
  TrendingUp,
  GraduationCap,
  Brain,
};

const NAV_SECTIONS = [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
      { label: 'Activity Tracker', href: '/tracker', icon: 'MessageSquareText' },
      { label: 'Green Journal', href: '/journal', icon: 'BookOpen' },
    ],
  },
  {
    title: 'AI Tools',
    items: [
      { label: 'Bill Analyzer', href: '/bills', icon: 'Receipt' },
      { label: 'Receipt Scanner', href: '/receipts', icon: 'ScanLine' },
      { label: 'Simulator', href: '/simulator', icon: 'SlidersHorizontal' },
    ],
  },
  {
    title: 'Social',
    items: [
      { label: 'Challenges', href: '/challenges', icon: 'Target' },
      { label: 'Community', href: '/community', icon: 'Users' },
      { label: 'Leaderboard', href: '/leaderboard', icon: 'Medal' },
    ],
  },
  {
    title: 'Insights',
    items: [
      { label: 'Achievements', href: '/achievements', icon: 'Trophy' },
      { label: 'Forecast', href: '/forecast', icon: 'TrendingUp' },
      { label: 'Learning Hub', href: '/learn', icon: 'GraduationCap' },
      { label: 'AI Transparency', href: '/transparency', icon: 'Brain' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen w-64 glass-surface flex flex-col"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl gradient-eco flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white font-[var(--font-display)]">
            ECO MIND AI
          </h1>
          <p className="text-[10px] text-surface-300 tracking-wider uppercase">
            Understand · Track · Reduce
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-surface-400">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const IconComponent = ICON_MAP[item.icon];

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                        relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${isActive
                          ? 'text-white bg-eco-500/15'
                          : 'text-surface-300 hover:text-white hover:bg-white/5'
                        }
                      `}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl bg-eco-500/10 border border-eco-500/20"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      {IconComponent && (
                        <IconComponent
                          className={`w-[18px] h-[18px] relative z-10 ${
                            isActive ? 'text-eco-400' : ''
                          }`}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full gradient-eco flex items-center justify-center text-white text-xs font-bold">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-[11px] text-surface-400 truncate">
              {user?.ecoPoints?.toLocaleString() || 0} eco points
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/settings"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-surface-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5" />
            Settings
          </Link>
          <button
            onClick={signOut}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-surface-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
