'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Award, Sparkles, Check, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function VampirePowerPage() {
  const router = useRouter();
  const { user, updateUser, addNotification } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);

  const slug = 'vampire-power';
  const points = 15;
  const title = 'The Hidden Standby Cost: Vampire Power';

  const isAlreadyRead = user?.readArticles?.includes(slug) || false;

  const handleClaimPoints = async () => {
    if (isAlreadyRead || !user || isClaiming) return;
    setIsClaiming(true);

    try {
      const updatedReadArticles = [...(user.readArticles || []), slug];
      updateUser({
        ecoPoints: (user.ecoPoints || 0) + points,
        readArticles: updatedReadArticles,
      });

      addNotification(
        '📚 Article Completed',
        `You read "${title}" and earned +${points} Eco Points.`,
        'quiz'
      );
      addNotification(
        '⭐ Eco Points Earned',
        `+${points} points for reading an educational article.`,
        'tip'
      );
    } catch (e) {
      console.error(e);
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Link */}
      <button
        onClick={() => router.push('/learn')}
        className="flex items-center gap-2 text-sm text-surface-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Learning Hub
      </button>

      {/* Header */}
      <div className="glass-card-static p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Energy
          </span>
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              3 min read
            </span>
            <span>•</span>
            <span>Easy</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white font-[var(--font-display)]">
          {title}
        </h1>
        <p className="text-surface-400 text-sm leading-relaxed">
          Devices plugged in but switched off still draw power. Learn how standby load (often called vampire power) accounts for up to 10% of household electricity usage and how to easily stop it.
        </p>
      </div>

      {/* Content */}
      <div className="glass-card p-6 space-y-6 text-sm text-surface-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            What is Vampire Power?
          </h2>
          <p>
            Vampire power, also known as standby power, phantom load, or vampire draw, refers to the way electricity is consumed by electronic devices while they are switched off or in standby mode. 
          </p>
          <p>
            Most modern electronics are designed to never fully turn off. Instead, they remain in a ready state, waiting to be turned on by a remote control, to receive updates, or to keep a digital clock running. This convenience comes at a steady cost to both your wallet and the planet.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">The Biggest Culprits</h2>
          <p>
            While a single phone charger left plugged in draws a negligible amount of electricity, the collective effect of dozens of devices in an average household runs 24/7. Here are the top vampire power consumers:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-white">Smart TVs and Set-Top Boxes:</strong> Keep receivers active to boot up instantly.</li>
            <li><strong className="text-white">Microwaves and Ovens:</strong> Digital clocks and control panels draw constant current.</li>
            <li><strong className="text-white">Desktop Computers and Monitors:</strong> Often left in Sleep or Hibernate states.</li>
            <li><strong className="text-white">Game Consoles:</strong> Consume high standby power to download game updates in the background.</li>
            <li><strong className="text-white">Chargers:</strong> Phone, laptop, and tablet chargers draw power even when not connected to a device.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">The Environmental and Cost Impact</h2>
          <p>
            Studies show that standby power accounts for roughly <span className="text-white font-semibold">5% to 10%</span> of residential electricity use in urban households. For an average Indian household consuming 250 units (kWh) per month, this equates to 12.5 to 25 units wasted solely on standby mode. 
          </p>
          <p>
            Multiplying this by millions of households reveals a massive grid load that relies heavily on coal combustion, generating millions of tons of avoidable carbon emissions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-eco-400" />
            Easy Ways to Eliminate Vampire Load
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-eco-400 block uppercase">1. Unplug Regularly</span>
              <p className="text-xs text-surface-400">
                Unplug phone and laptop chargers as soon as they reach full charge or when you exit the room.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-eco-400 block uppercase">2. Use Smart Power Strips</span>
              <p className="text-xs text-surface-400">
                Plug clusters of devices (like TV, console, soundbar) into a single power strip, allowing you to cut power to all of them with one switch.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Claim Rewards Panel */}
      <div className="glass-card-static p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Award className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Claim Educational Reward</p>
            <p className="text-xs text-surface-400">Earn +{points} Eco Points for reading this article.</p>
          </div>
        </div>

        <button
          onClick={handleClaimPoints}
          disabled={isAlreadyRead || isClaiming || !user}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
            isAlreadyRead
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'gradient-eco text-white hover:shadow-lg hover:shadow-eco-500/20 disabled:opacity-50'
          }`}
        >
          {isAlreadyRead ? (
            <>
              <Check className="w-4 h-4" />
              Completed & Claimed!
            </>
          ) : isClaiming ? (
            'Claiming...'
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Claim +{points} Points
            </>
          )}
        </button>
      </div>
    </div>
  );
}
