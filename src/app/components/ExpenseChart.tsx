import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import type { Expense } from '../App';

interface ExpenseChartProps {
  expenses: Expense[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Office: '#0EA5E9',
  Meals: '#34D399',
  Travel: '#8B5CF6',
  Software: '#3B82F6',
  Utilities: '#F87171',
  Marketing: '#EC4899',
  Equipment: '#F59E0B',
  Insurance: '#EF4444',
  Subscriptions: '#06B6D4',
  Training: '#10B981',
  Entertainment: '#A78BFA',
  Grocery: '#22C55E',
  Education: '#6366F1',
  Fuel: '#FB923C',
  Other: '#64748B',
};

const GLASS_STYLE: React.CSSProperties = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 50%, rgba(139,92,246,0.06) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  boxShadow:
    'inset 0 1px 0 0 rgba(255,255,255,0.25), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 12px 40px rgba(0, 0, 0, 0.45)',
};

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((s, d) => s + d.value, 0);
  const [active, setActive] = useState<number | null>(null);

  if (data.length === 0) {
    return (
      <div className="rounded-3xl p-6 relative overflow-hidden" style={GLASS_STYLE}>
        <div
          className="absolute inset-x-0 top-0 h-24 pointer-events-none rounded-t-3xl"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)' }}
        />
        <h3 className="font-medium text-base mb-4 relative z-10" style={{ color: '#FFFFFF' }}>
          Category Breakdown
        </h3>
        <div className="h-64 flex items-center justify-center" style={{ color: '#64748B' }}>
          No data to display
        </div>
      </div>
    );
  }

  const focused = active !== null ? data[active] : null;
  const top = data[0];

  return (
    <div className="rounded-3xl p-6 relative overflow-hidden" style={GLASS_STYLE}>
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none rounded-t-3xl"
        style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)' }}
      />
      <motion.div
        className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none"
        style={{ background: `radial-gradient(circle, ${focused?.color ?? top.color}55, transparent 70%)` }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p
              style={{
                color: '#94A3B8',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 11,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              ✦ Category Breakdown
            </p>
            <h3 className="font-medium" style={{ color: '#FFFFFF', fontSize: 18, marginTop: 4 }}>
              Where your money lives
            </h3>
          </div>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.03))',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            <TrendingUp className="w-3 h-3" style={{ color: top.color }} />
            <span style={{ color: '#CBD5E1', fontSize: 11 }}>{data.length} categories</span>
          </div>
        </div>

        <div className="relative flex items-center justify-center" style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={78}
                outerRadius={110}
                paddingAngle={3}
                cornerRadius={6}
                dataKey="value"
                stroke="rgba(11, 15, 25, 0.6)"
                strokeWidth={2}
                onMouseEnter={(_, i) => setActive(i)}
                onMouseLeave={() => setActive(null)}
                animationBegin={0}
                animationDuration={900}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter:
                        active === index
                          ? `drop-shadow(0 0 14px ${entry.color})`
                          : `drop-shadow(0 0 6px ${entry.color}55)`,
                      transition: 'filter 0.3s ease',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `₹${value.toFixed(2)}`}
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  color: '#FFFFFF',
                }}
                itemStyle={{ color: '#FFFFFF' }}
                labelStyle={{ color: '#94A3B8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em' }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              key={focused?.name ?? 'total'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div
                style={{
                  color: '#94A3B8',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 10,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                }}
              >
                {focused ? focused.name : 'Total'}
              </div>
              <div
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Anton, Impact, sans-serif',
                  fontSize: 32,
                  letterSpacing: '-0.02em',
                  marginTop: 4,
                }}
              >
                ₹{(focused ? focused.value : total).toFixed(0)}
              </div>
              <div style={{ color: focused?.color ?? '#0EA5E9', fontSize: 12, marginTop: 2 }}>
                {focused ? `${((focused.value / total) * 100).toFixed(1)}%` : `${data.length} active`}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          {data.map((d, i) => {
            const pct = (d.value / total) * 100;
            const isActive = active === i;
            return (
              <motion.div
                key={d.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="rounded-xl px-3 py-2 cursor-pointer"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${d.color}28, ${d.color}08)`
                    : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
                  border: `1px solid ${isActive ? d.color + '60' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isActive ? `inset 0 1px 0 rgba(255,255,255,0.15)` : 'none',
                  transition: 'all 0.25s ease',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }}
                    />
                    <span style={{ color: '#E2E8F0', fontSize: 13 }}>{d.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: '#94A3B8', fontSize: 11 }}>{pct.toFixed(1)}%</span>
                    <span style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 600 }}>
                      ₹{d.value.toFixed(0)}
                    </span>
                  </div>
                </div>
                <div
                  className="mt-2 h-1 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.05 + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${d.color}, ${d.color}80)`,
                      boxShadow: `0 0 8px ${d.color}80`,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
