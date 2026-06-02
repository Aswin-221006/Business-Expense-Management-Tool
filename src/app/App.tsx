import { useState, useEffect } from 'react';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseSummary } from './components/ExpenseSummary';
import { AddExpenseDialog } from './components/AddExpenseDialog';
import { ExpenseChart } from './components/ExpenseChart';
import { Button } from '@mui/material';
import { Plus } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { motion } from 'motion/react';

const HERO_WORDS = ['EXPENSE', 'MANAGER'];

function KineticHero() {
  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute -top-10 -left-6 select-none pointer-events-none"
        style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: 'clamp(80px, 14vw, 220px)',
          lineHeight: 0.85,
          letterSpacing: '-0.05em',
          color: 'rgba(14, 165, 233, 0.06)',
          whiteSpace: 'nowrap',
        }}
        animate={{ x: ['0%', '-30%', '0%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        MONEY · SPEND · TRACK · FLOW · BUDGET · MONEY · SPEND · TRACK
      </motion.div>

      <div className="relative z-10 py-2">
        {HERO_WORDS.map((word, wi) => (
          <div key={word} className="flex overflow-hidden" style={{ lineHeight: 0.9 }}>
            {word.split('').map((ch, ci) => (
              <motion.span
                key={ci}
                initial={{ y: '110%', rotate: 8, opacity: 0 }}
                animate={{ y: '0%', rotate: 0, opacity: 1 }}
                transition={{
                  delay: wi * 0.25 + ci * 0.06,
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -8,
                  color: '#0EA5E9',
                  textShadow: '0 0 30px rgba(14,165,233,0.8)',
                  transition: { duration: 0.25 },
                }}
                style={{
                  display: 'inline-block',
                  fontFamily: 'Anton, Impact, sans-serif',
                  fontSize: 'clamp(56px, 9vw, 140px)',
                  fontWeight: 400,
                  color: wi === 0 ? '#FFFFFF' : 'rgba(14,165,233,0)',
                  WebkitTextStroke: wi === 1 ? '2px #FFFFFF' : 'none',
                  letterSpacing: '-0.02em',
                  cursor: 'default',
                }}
              >
                {ch}
              </motion.span>
            ))}
          </div>
        ))}
        <motion.div
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, #0EA5E9, #8B5CF6, transparent)',
            maxWidth: '420px',
          }}
        />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-3"
          style={{
            color: '#94A3B8',
            fontFamily: 'Space Grotesk, sans-serif',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontSize: '12px',
          }}
        >
          ▸ Track · ▸ Manage · ▸ Master your expenses
        </motion.p>
      </div>
    </div>
  );
}

function AmbientField({ palette }: { palette: { a: string; b: string; c: string } }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ width: 520, height: 520, background: `radial-gradient(circle, ${palette.a} 0%, transparent 70%)`, opacity: 0.35 }}
        initial={{ x: '5%', y: '8%' }}
        animate={{ x: ['5%', '20%', '-5%', '5%'], y: ['8%', '20%', '5%', '8%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ width: 480, height: 480, right: 0, bottom: 0, background: `radial-gradient(circle, ${palette.b} 0%, transparent 70%)`, opacity: 0.28 }}
        animate={{ x: ['0%', '-10%', '10%', '0%'], y: ['0%', '-15%', '-5%', '0%'] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ width: 360, height: 360, left: '40%', top: '40%', background: `radial-gradient(circle, ${palette.c} 0%, transparent 70%)`, opacity: 0.22 }}
        animate={{ scale: [1, 1.25, 0.95, 1], opacity: [0.22, 0.32, 0.18, 0.22] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function getTimeContext() {
  const h = new Date().getHours();
  if (h < 5) return { greet: 'Still up', mood: 'night', palette: { a: '#6366F1', b: '#8B5CF6', c: '#1E40AF' } };
  if (h < 12) return { greet: 'Good morning', mood: 'morning', palette: { a: '#F59E0B', b: '#0EA5E9', c: '#FB923C' } };
  if (h < 17) return { greet: 'Good afternoon', mood: 'afternoon', palette: { a: '#0EA5E9', b: '#34D399', c: '#8B5CF6' } };
  if (h < 21) return { greet: 'Good evening', mood: 'evening', palette: { a: '#F472B6', b: '#8B5CF6', c: '#F59E0B' } };
  return { greet: 'Winding down', mood: 'night', palette: { a: '#6366F1', b: '#8B5CF6', c: '#0EA5E9' } };
}

function AmbientGreeting({ greet, total, topCategory }: { greet: string; total: number; topCategory: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        backgroundColor: 'rgba(30, 41, 59, 0.35)',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <motion.div
        className="absolute -right-10 -top-10 rounded-full blur-2xl"
        style={{ width: 200, height: 200, background: 'radial-gradient(circle, rgba(14,165,233,0.4), transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
        <div>
          <div style={{ color: '#94A3B8', fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            ✦ {greet}, you
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-2"
            style={{ color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif', fontSize: 18 }}
          >
            {total > 0 ? (
              <>You've spent <span style={{ color: '#0EA5E9', fontWeight: 600 }}>₹{total.toFixed(2)}</span> recently — mostly on <span style={{ color: '#F59E0B', fontWeight: 600 }}>{topCategory}</span>.</>
            ) : (
              <>Your ledger is empty. Add your first expense to start tracking.</>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function MarqueeStrip() {
  const items = ['BUDGET', '✦', 'CASHFLOW', '✦', 'SAVINGS', '✦', 'INSIGHT', '✦', 'CONTROL', '✦'];
  return (
    <div className="overflow-hidden py-3" style={{ borderTop: '1px solid rgba(148,163,184,0.15)', borderBottom: '1px solid rgba(148,163,184,0.15)' }}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items, ...items, ...items].map((it, i) => (
          <span
            key={i}
            className="mx-6"
            style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '28px',
              letterSpacing: '0.15em',
              color: i % 2 === 0 ? '#0EA5E9' : 'rgba(255,255,255,0.5)',
            }}
          >
            {it}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  receipt?: string;
  merchant?: string;
}

const MOCK_EXPENSES: Expense[] = [];

const STORAGE_KEY = 'expense-manager:expenses';

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Expense[]) : MOCK_EXPENSES;
    } catch {
      return MOCK_EXPENSES;
    }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)); } catch {}
  }, [expenses]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const ctx = getTimeContext();
  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0);
  const catTotals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const topCategory = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'nothing yet';

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    };
    setExpenses([newExpense, ...expenses]);
    setIsAddDialogOpen(false);
    toast.success('Expense added successfully');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    toast.success('Expense deleted');
  };

  const handleUpdateExpense = (id: string, patch: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...e, ...patch } : e)));
  };

  const filteredExpenses = selectedCategory === 'all'
    ? expenses
    : expenses.filter(e => e.category === selectedCategory);

  return (
    <div className="size-full overflow-auto relative" style={{ backgroundColor: '#0B0F19' }}>
      <AmbientField palette={ctx.palette} />
      <Toaster position="top-right" richColors />
      <div className="max-w-7xl mx-auto p-8 space-y-8 relative z-10">
        <div className="flex items-end justify-between gap-8 flex-wrap">
          <KineticHero />
          <Button
            variant="contained"
            startIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddDialogOpen(true)}
            sx={{
              textTransform: 'none',
              backgroundColor: 'rgba(14, 165, 233, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              color: '#FFFFFF',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: '500',
              borderRadius: '10px',
              boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)',
              '&:hover': {
                backgroundColor: 'rgba(14, 165, 233, 0.3)',
                boxShadow: '0 0 35px rgba(14, 165, 233, 0.6)',
                border: '1px solid rgba(14, 165, 233, 0.5)',
              },
            }}
          >
            Add Expense
          </Button>
        </div>

        <AmbientGreeting greet={ctx.greet} total={totalSpend} topCategory={topCategory} />

        <MarqueeStrip />

        <ExpenseSummary
          expenses={expenses}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 50%, rgba(14,165,233,0.06) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(28px) saturate(180%)',
                WebkitBackdropFilter: 'blur(28px) saturate(180%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.25), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 12px 40px rgba(0, 0, 0, 0.45)',
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-24 pointer-events-none rounded-t-3xl"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)' }}
              />
              <div
                className="absolute -top-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.35), transparent 70%)' }}
              />
              <p className="text-sm font-medium mb-4 relative z-10" style={{ color: '#FFFFFF' }}>Filter by Category</p>
              <div className="flex flex-wrap gap-2">
                {['all', 'Office', 'Meals', 'Travel', 'Software', 'Utilities', 'Marketing', 'Equipment', 'Insurance', 'Subscriptions', 'Training', 'Entertainment', 'Grocery', 'Education', 'Fuel', 'Other'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={
                      selectedCategory === category
                        ? {
                            background: 'linear-gradient(135deg, rgba(14,165,233,0.45), rgba(14,165,233,0.20))',
                            color: '#FFFFFF',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 24px rgba(14,165,233,0.55)',
                            border: '1px solid rgba(255, 255, 255, 0.35)',
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                          }
                        : {
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                            color: '#CBD5E1',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(16px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                          }
                    }
                    onMouseEnter={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.15)';
                        e.currentTarget.style.color = '#0EA5E9';
                        e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedCategory !== category) {
                        e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.05)';
                        e.currentTarget.style.color = '#94A3B8';
                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                      }
                    }}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <ExpenseChart expenses={expenses} />
          </div>
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          onDeleteExpense={handleDeleteExpense}
          onUpdateExpense={handleUpdateExpense}
        />

        <AddExpenseDialog
          open={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={handleAddExpense}
        />
      </div>
    </div>
  );
}
