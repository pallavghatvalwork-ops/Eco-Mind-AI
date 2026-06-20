'use client';

// ===========================================
// Emission Pie Chart — ECO MIND AI
// ===========================================

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { CarbonBreakdown } from '@/types/carbon';
import { formatCO2 } from '@/lib/utils/formatters';

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#3b82f6',
  food: '#22c55e',
  energy: '#f59e0b',
  shopping: '#8b5cf6',
  waste: '#ef4444',
};

const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transport',
  food: 'Food',
  energy: 'Energy',
  shopping: 'Shopping',
  waste: 'Waste',
};

interface EmissionPieChartProps {
  breakdown: CarbonBreakdown;
}

export default function EmissionPieChart({ breakdown }: EmissionPieChartProps) {
  const data = Object.entries(breakdown).map(([key, value]) => ({
    name: CATEGORY_LABELS[key] || key,
    value: Math.round(value * 100) / 100,
    color: CATEGORY_COLORS[key] || '#6b7280',
  }));

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              cornerRadius={4}
              animationBegin={300}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0];
                  return (
                    <div className="glass-card-static px-3 py-2 text-sm">
                      <p className="text-white font-medium">{data.name}</p>
                      <p className="text-surface-400">{formatCO2(data.value as number)}</p>
                      <p className="text-surface-500 text-xs">
                        {((data.value as number / total) * 100).toFixed(1)}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-surface-400 truncate">{item.name}</span>
            <span className="text-xs text-surface-300 ml-auto font-medium">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
