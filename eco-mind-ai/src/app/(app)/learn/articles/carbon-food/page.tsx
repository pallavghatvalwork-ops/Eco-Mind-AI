'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Award, Sparkles, Check, Utensils } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CarbonFoodPage() {
  const router = useRouter();
  const { user, updateUser, addNotification } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);

  const slug = 'carbon-food';
  const points = 25;
  const title = 'Carbon Footprint of Food: Farm to Fork';

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
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Food
          </span>
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              5 min read
            </span>
            <span>•</span>
            <span>Medium</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white font-[var(--font-display)]">
          {title}
        </h1>
        <p className="text-surface-400 text-sm leading-relaxed">
          Understand why animal agriculture generates significantly higher emissions than plant equivalents, how shipping distances affect carbon footprint, and how to optimize your diet.
        </p>
      </div>

      {/* Content */}
      <div className="glass-card p-6 space-y-6 text-sm text-surface-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Utensils className="w-5 h-5 text-emerald-400" />
            The High Footprint of Animal Agriculture
          </h2>
          <p>
            What we eat matters far more than how far it has traveled. Global food production accounts for approximately one-quarter to one-third of all greenhouse gas emissions, and the majority of this impact is linked directly to animal farming.
          </p>
          <p>
            Ruminant animals (like cattle, sheep, and goats) have a unique digestive process called enteric fermentation, which produces methane (CH₄). Methane is a greenhouse gas that is roughly 28 to 36 times more potent than carbon dioxide (CO₂) in trapping heat in the atmosphere over a 100-year period.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Comparing the Emission Factors</h2>
          <p>
            The difference in carbon intensity between livestock products and plant-based foods is staggering. To put it in perspective, here are the estimated emissions generated to produce 1 kg of specific foods:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-white">Beef (beef herd):</strong> ~60-99 kg CO₂-equivalent per kg.</li>
            <li><strong className="text-white">Lamb and Mutton:</strong> ~24-40 kg CO₂-equivalent per kg.</li>
            <li><strong className="text-white">Cheese and Dairy:</strong> ~21-25 kg CO₂-equivalent per kg.</li>
            <li><strong className="text-white">Poultry and Pork:</strong> ~6-10 kg CO₂-equivalent per kg.</li>
            <li><strong className="text-white">Rice:</strong> ~4 kg CO₂-equivalent per kg (paddy flooding emits methane).</li>
            <li><strong className="text-white">Lentils, Peas, Beans:</strong> ~0.9 kg CO₂-equivalent per kg.</li>
            <li><strong className="text-white">Root Vegetables (Potatoes, Carrots):</strong> ~0.4 kg CO₂-equivalent per kg.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">The Myth of "Food Miles"</h2>
          <p>
            A common misconception is that buying imported plant-based food has a higher carbon footprint than buying local meat. In reality, transport emissions (often referred to as "food miles") account for a very small fraction of food's total footprint — typically less than 10%.
          </p>
          <p>
            It is almost always better for the climate to eat imported vegetables, grains, or beans than it is to eat locally-raised beef or dairy. The exception is food transported by air (like delicate berries or fresh seafood), which has high transport emissions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-eco-400" />
            Tips for a Low-Carbon Plate
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-eco-400 block uppercase">1. Plant-Forward Eating</span>
              <p className="text-xs text-surface-400">
                Replace red meat and heavy dairy with pulses, beans, lentils, or plant alternatives a few times a week.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-eco-400 block uppercase">2. Avoid Food Waste</span>
              <p className="text-xs text-surface-400">
                About one-third of all food produced is wasted. When food decays in landfills, it releases methane. Plan meals and compost leftovers!
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
