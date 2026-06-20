'use client';

// ===========================================
// Mobile Bottom Navigation — ECO MIND AI
// ===========================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquareText,
  Target,
  Trophy,
  GraduationCap,
} from 'lucide-react';

const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Track', href: '/tracker', icon: MessageSquareText },
  { label: 'Challenges', href: '/challenges', icon: Target },
  { label: 'Rewards', href: '/achievements', icon: Trophy },
  { label: 'Learn', href: '/learn', icon: GraduationCap },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-surface border-t border-white/5"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around h-16 px-2">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                  isActive ? 'text-eco-400' : 'text-surface-400'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-active"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-eco-400"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
