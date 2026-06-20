'use client';

// ===========================================
// Trend Line Chart — ECO MIND AI
// ===========================================

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { CarbonReport } from '@/types/carbon';
import { getMonthName, formatCO2 } from '@/lib/utils/formatters';

interface TrendLineChartProps {
  reports: CarbonReport[];
}

export default function TrendLineChart({ reports }: TrendLineChartProps) {
  const data = reports.map((report) => ({
    month: getMonthName(report.period),
    emission: Math.round(report.totalEmission),
    score: report.carbonScore,
  }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEmission" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="glass-card-static px-3 py-2">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-surface-400">
                      {formatCO2(payload[0].value as number)}
                    </p>
                    <p className="text-xs text-eco-400">
                      Score: {payload[0].payload.score}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="emission"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#colorEmission)"
            animationBegin={300}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
