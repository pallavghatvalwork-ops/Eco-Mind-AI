'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Award, Sparkles, Check, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function WasteSeparationPage() {
  const router = useRouter();
  const { user, updateUser, addNotification } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);

  const slug = 'waste-separation';
  const points = 15;
  const title = 'Demystifying Wet and Dry Waste Separation';

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
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
            Waste
          </span>
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              4 min read
            </span>
            <span>•</span>
            <span>Easy</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white font-[var(--font-display)]">
          {title}
        </h1>
        <p className="text-surface-400 text-sm leading-relaxed">
          Composting wet waste prevents anaerobic methane release in landfills. Learn simple kitchen segregation techniques to make a significant difference.
        </p>
      </div>

      {/* Content */}
      <div className="glass-card p-6 space-y-6 text-sm text-surface-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-rose-400" />
            The Crisis of Mixed Waste
          </h2>
          <p>
            When we throw all our garbage into a single bin, we create mixed waste. Mixed waste is extremely difficult to sort at municipality levels, meaning the vast majority of it ends up directly in massive city landfills (like Ghazipur in Delhi or Deonar in Mumbai).
          </p>
          <p>
            When wet organic waste (like food scraps and vegetable peels) is buried under dry waste in a landfill, it is deprived of oxygen. It undergoes anaerobic decomposition, which generates <span className="text-white font-semibold">methane gas</span> — a super-pollutant that accelerates global warming.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Demystifying the Segregation</h2>
          <p>
            Successful waste management starts in your kitchen. By keeping wet waste and dry waste in separate bins, we enable wet waste to be composted and dry waste to be recycled. Here is what goes where:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-emerald-400 block uppercase">🟢 Wet Waste (Biodegradable)</span>
              <ul className="list-disc list-inside text-xs text-surface-400 space-y-1">
                <li>Fruit and vegetable peels</li>
                <li>Leftover food and tea bags</li>
                <li>Eggshells and small bones</li>
                <li>Flowers and garden leaves</li>
                <li>Soiled paper plates (uncoated)</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-2">
              <span className="text-xs font-bold text-blue-400 block uppercase">🔵 Dry Waste (Recyclable/Non-biodegradable)</span>
              <ul className="list-disc list-inside text-xs text-surface-400 space-y-1">
                <li>Paper, cardboard, newspapers</li>
                <li>Plastic bottles, wraps, containers</li>
                <li>Glass bottles and jars</li>
                <li>Metal cans and foil</li>
                <li>Dry coconut shells and wood</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Why Composting is a Superpower</h2>
          <p>
            When wet waste is composted in the presence of oxygen (aerobic composting), it decomposes naturally without releasing methane. Instead, it turns into rich nutrient-filled soil conditioner (compost) that can be used to grow plants and lock carbon back into the soil.
          </p>
          <p>
            Composting at home or at the community level reduces your household footprint by up to <span className="text-white font-semibold">150 kg of CO₂ per year</span>!
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-eco-400" />
            Tips to Start Today
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-eco-400 block uppercase">1. Two-Bin Rule</span>
              <p className="text-xs text-surface-400">
                Place two separate bins in your kitchen. Use green for wet and blue for dry. Ensure everyone in the house knows the difference.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-eco-400 block uppercase">2. Clean Dry Recyclables</span>
              <p className="text-xs text-surface-400">
                Rinse milk packets, plastic food containers, and jars before throwing them into the dry bin. Soiled dry waste cannot be recycled!
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
