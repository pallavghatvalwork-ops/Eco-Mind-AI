'use client';

// ===========================================
// Navbar — ECO MIND AI
// ===========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Leaf, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, markAllNotificationsAsRead } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = user?.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 glass-surface border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="search"
              placeholder="Search activities, challenges..."
              className="w-full pl-10 pr-4 py-2 text-sm glass-input text-white placeholder-surface-400"
              aria-label="Search"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Carbon Score Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-eco-500/10 border border-eco-500/20">
            <Leaf className="w-3.5 h-3.5 text-eco-400" />
            <span className="text-sm font-semibold text-eco-400">
              {user?.carbonScore || 0}
            </span>
            <span className="text-xs text-surface-400">score</span>
          </div>

          {/* Streak */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="text-sm">🔥</span>
            <span className="text-sm font-semibold text-orange-400">
              {user?.streakDays || 0}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="w-5 h-5 text-surface-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold text-white bg-eco-500 rounded-full min-w-[18px] min-h-[18px]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-80 glass-card-static p-0 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-eco-500 text-[10px] font-bold text-white">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[10px] text-eco-400 hover:text-white font-semibold transition-colors"
                        >
                          Mark all as read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg hover:bg-white/5"
                        aria-label="Close notifications"
                      >
                        <X className="w-4 h-4 text-surface-400" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-xs text-surface-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-white/5 hover:bg-white/3 transition-colors ${
                            !notif.read ? 'bg-eco-500/5' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-white">{notif.title}</p>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-eco-400 shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-surface-400 mt-1 leading-relaxed">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full gradient-eco flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
