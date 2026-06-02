import { DollarSign, TrendingUp, Receipt } from 'lucide-react';
import type { Expense } from '../App';

interface ExpenseSummaryProps {
  expenses: Expense[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = ['all', 'Office', 'Meals', 'Travel', 'Software', 'Utilities', 'Marketing', 'Equipment', 'Insurance', 'Subscriptions', 'Training', 'Entertainment', 'Grocery', 'Education', 'Fuel', 'Other'];

export function ExpenseSummary({ expenses, selectedCategory, onCategoryChange }: ExpenseSummaryProps) {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageExpense = expenses.length > 0 ? totalAmount / expenses.length : 0;

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const cards = [
    {
      title: 'Total Expenses',
      value: `₹${totalAmount.toFixed(2)}`,
      subtitle: `${expenses.length} transactions`,
      icon: DollarSign,
      iconBg: 'rgba(14, 165, 233, 0.1)',
      iconColor: '#0EA5E9',
    },
    {
      title: 'Average Expense',
      value: `₹${averageExpense.toFixed(2)}`,
      subtitle: 'per transaction',
      icon: TrendingUp,
      iconBg: 'rgba(52, 211, 153, 0.1)',
      iconColor: '#34D399',
    },
    {
      title: 'Top Category',
      value: topCategory,
      subtitle: `₹${categoryTotals[topCategory]?.toFixed(2) || '0.00'}`,
      icon: Receipt,
      iconBg: 'rgba(14, 165, 233, 0.1)',
      iconColor: '#0EA5E9',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 50%, ' + card.iconBg.replace('0.1', '0.10') + ' 100%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.25), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 12px 40px rgba(0, 0, 0, 0.45)',
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-20 pointer-events-none rounded-t-3xl"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)' }}
              />
              <div
                className="absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none"
                style={{ background: `radial-gradient(circle, ${card.iconColor}55, transparent 70%)` }}
              />
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm mb-2" style={{ color: '#CBD5E1' }}>{card.title}</p>
                  <p className="text-2xl font-semibold mb-1" style={{ color: '#FFFFFF' }}>{card.value}</p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{card.subtitle}</p>
                </div>
                <div
                  className="p-3 rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${card.iconColor}40, ${card.iconColor}15)`,
                    border: '1px solid rgba(255,255,255,0.25)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.iconColor }} />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
