'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Award, Sparkles, Check, Car } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function EvVsHybridPage() {
  const router = useRouter();
  const { user, updateUser, addNotification } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);

  const slug = 'ev-vs-hybrid';
  const points = 30;
  const title = 'EVs vs Hybrid vs Combustion in India';

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
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Transport
          </span>
          <div className="flex items-center gap-3 text-xs text-surface-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              6 min read
            </span>
            <span>•</span>
            <span>Hard</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white font-[var(--font-display)]">
          {title}
        </h1>
        <p className="text-surface-400 text-sm leading-relaxed">
          Electric vehicles are cleaner, but in a coal-heavy grid like India&apos;s, how do they compare with hybrids and petrol cars? A transparent breakdown of lifetime emissions.
        </p>
      </div>

      {/* Content */}
      <div className="glass-card p-6 space-y-6 text-sm text-surface-300 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-blue-400" />
            The Grid Intensity Question
          </h2>
          <p>
            An electric vehicle (EV) produces zero tailpipe emissions while driving, which is excellent for urban air quality. However, to truly understand its carbon footprint, we must look at the source of the electricity used to charge its battery.
          </p>
          <p>
            In India, approximately <span className="text-white font-semibold">70%</span> of the electricity grid is powered by fossil fuels, primarily coal. Coal combustion has a high emission factor (~0.82 kg CO₂ per kWh). When you charge an EV from this grid, the emissions are shifted from the car&apos;s tailpipe to the power plant chimney.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Why EVs are Still Better Than Combustion</h2>
          <p>
            Even when powered by coal-heavy grids, EVs generate fewer lifetime emissions than conventional internal combustion engine (ICE) petrol or diesel cars. Why?
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li><strong className="text-white">Motor Efficiency:</strong> Electric motors are incredibly efficient, converting over 85-90% of electrical energy into motion. Gasoline engines, by contrast, waste 70-80% of fuel energy as heat.</li>
            <li><strong className="text-white">Regenerative Braking:</strong> EVs capture energy during braking and feed it back into the battery, saving power in stop-and-go city traffic.</li>
            <li><strong className="text-white">Grid Greenification:</strong> As India adds massive solar and wind capacity, EVs automatically become cleaner over time. An ICE car remains just as dirty as the day it was bought.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">Life Cycle Analysis (LCA) Comparison</h2>
          <p>
            A full Life Cycle Analysis includes battery manufacturing emissions (which are high for EVs initially) and tailpipe/grid operational emissions over 1,50,000 km.
          </p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs border border-white/10 rounded-lg">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white">
                  <th className="p-2.5">Vehicle Type</th>
                  <th className="p-2.5">Manufacturing Footprint</th>
                  <th className="p-2.5">Operational Footprint (per km)</th>
                  <th className="p-2.5">Lifetime Carbon (Tons CO₂)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="p-2.5 font-medium text-white">Petrol ICE Car</td>
                  <td className="p-2.5">~6 Tons</td>
                  <td className="p-2.5">~210 g CO₂ / km</td>
                  <td className="p-2.5">~37.5 Tons</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="p-2.5 font-medium text-white">Strong Hybrid Car</td>
                  <td className="p-2.5">~7 Tons</td>
                  <td className="p-2.5">~120 g CO₂ / km</td>
                  <td className="p-2.5">~25.0 Tons</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-white">Electric Vehicle (EV)</td>
                  <td className="p-2.5">~11 Tons</td>
                  <td className="p-2.5">~90 g CO₂ / km (grid)</td>
                  <td className="p-2.5">~24.5 Tons</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-surface-400 mt-2">
            *Source: Industry estimates for mid-sized sedans/SUVs driven 1,50,000 km in India.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-eco-400" />
            Which Should You Choose?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-eco-400 block uppercase">EVs (Best for High Mileage)</span>
              <p className="text-xs text-surface-400">
                If you drive long distances daily or can install rooftop solar at home, an EV offers the absolute lowest carbon emissions and fuel costs.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/3 border border-white/5 space-y-2">
              <span className="text-xs font-bold text-eco-400 block uppercase">Hybrids (Great for Highway/No charging)</span>
              <p className="text-xs text-surface-400">
                If you travel between cities with poor charging infrastructure, a strong hybrid cuts fuel use by 40% over petrol without needing plugin charging.
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
