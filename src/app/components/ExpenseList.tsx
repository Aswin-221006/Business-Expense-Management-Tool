import { useState, useRef, useEffect } from 'react';
import { Trash2, Receipt, X, Pencil } from 'lucide-react';
import type { Expense } from '../App';
import { format } from 'date-fns';
import * as Dialog from '@radix-ui/react-dialog';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, patch: Partial<Expense>) => void;
}

const CATEGORIES = [
  'Office', 'Meals', 'Travel', 'Software', 'Utilities', 'Marketing',
  'Equipment', 'Insurance', 'Subscriptions', 'Training', 'Entertainment',
  'Grocery', 'Education', 'Fuel', 'Other',
];

const CATEGORY_COLORS: Record<string, string> = {
  Office: '#0EA5E9', Meals: '#34D399', Travel: '#8B5CF6', Software: '#3B82F6',
  Utilities: '#F87171', Marketing: '#EC4899', Equipment: '#F59E0B', Insurance: '#EF4444',
  Subscriptions: '#06B6D4', Training: '#10B981', Entertainment: '#A78BFA', Grocery: '#22C55E',
  Education: '#6366F1', Fuel: '#FB923C', Other: '#64748B',
};

const GLASS_STYLE: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
  border: '1px solid rgba(255, 255, 255, 0.10)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 12px 40px rgba(0, 0, 0, 0.35)',
};

function EditableText({
  value, onSave, type = 'text', align = 'left', placeholder,
}: {
  value: string; onSave: (v: string) => void; type?: 'text' | 'number' | 'date';
  align?: 'left' | 'right'; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => {
    if (draft !== value) onSave(draft);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(value); setEditing(false); }
        }}
        className="bg-transparent outline-none w-full"
        style={{
          color: '#FFFFFF',
          fontSize: 13,
          textAlign: align,
          borderBottom: '1px solid rgba(14,165,233,0.6)',
          padding: '2px 0',
        }}
      />
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      className="cursor-text inline-block rounded px-1 -mx-1 transition-colors"
      style={{ textAlign: align, color: value ? undefined : '#475569' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {value || placeholder || '—'}
    </span>
  );
}

function EditableCategory({ value, onSave }: { value: string; onSave: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="px-2.5 py-1 rounded-full text-xs transition-all"
        style={{
          background: `linear-gradient(135deg, ${CATEGORY_COLORS[value] || CATEGORY_COLORS.Other}30, ${CATEGORY_COLORS[value] || CATEGORY_COLORS.Other}10)`,
          color: CATEGORY_COLORS[value] || CATEGORY_COLORS.Other,
          border: `1px solid ${CATEGORY_COLORS[value] || CATEGORY_COLORS.Other}40`,
        }}
      >
        {value}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 mt-2 rounded-xl p-1 z-40 max-h-56 overflow-auto"
            style={{
              background: 'rgba(15,23,42,0.92)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              minWidth: 140,
            }}
          >
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => { onSave(c); setOpen(false); }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs flex items-center gap-2"
                style={{ color: value === c ? CATEGORY_COLORS[c] : '#CBD5E1' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[c] }} />
                {c}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ExpenseList({ expenses, onDeleteExpense, onUpdateExpense }: ExpenseListProps) {
  const [viewing, setViewing] = useState<Expense | null>(null);

  if (expenses.length === 0) {
    return (
      <div className="rounded-3xl p-16 text-center" style={GLASS_STYLE}>
        <Receipt className="w-12 h-12 mx-auto mb-4" style={{ color: '#0EA5E9', opacity: 0.6 }} />
        <h3 className="font-medium mb-1" style={{ color: '#FFFFFF', fontSize: 16 }}>Nothing here yet</h3>
        <p style={{ color: '#94A3B8', fontSize: 13 }}>Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden" style={GLASS_STYLE}>
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div>
          <p style={{ color: '#94A3B8', fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            ✦ Expense List
          </p>
          <h3 style={{ color: '#FFFFFF', fontSize: 18, marginTop: 4 }}>Recent transactions</h3>
        </div>
        <div className="flex items-center gap-2" style={{ color: '#64748B', fontSize: 11 }}>
          <Pencil className="w-3 h-3" />
          Tap any cell to edit
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ fontSize: 13 }}>
          <thead>
            <tr style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Date', 'Description', 'Merchant', 'Category', 'Amount', '', ''].map((h, i) => (
                <th
                  key={i}
                  className="px-6 py-3 font-normal"
                  style={{
                    color: '#64748B',
                    textAlign: i === 4 ? 'right' : i >= 5 ? 'center' : 'left',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <td className="px-6 py-3.5 whitespace-nowrap" style={{ color: '#94A3B8' }}>
                  <EditableText
                    value={expense.date}
                    type="date"
                    onSave={v => onUpdateExpense(expense.id, { date: v })}
                  />
                  <div style={{ color: '#475569', fontSize: 10, marginTop: 2 }}>
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-3.5" style={{ color: '#FFFFFF' }}>
                  <EditableText
                    value={expense.description}
                    onSave={v => onUpdateExpense(expense.id, { description: v })}
                  />
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap" style={{ color: '#94A3B8' }}>
                  <EditableText
                    value={expense.merchant || ''}
                    placeholder="add merchant"
                    onSave={v => onUpdateExpense(expense.id, { merchant: v })}
                  />
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <EditableCategory
                    value={expense.category}
                    onSave={v => onUpdateExpense(expense.id, { category: v })}
                  />
                </td>
                <td className="px-6 py-3.5 whitespace-nowrap text-right" style={{ color: '#FFFFFF', fontWeight: 500 }}>
                  ₹<EditableText
                    value={expense.amount.toFixed(2)}
                    type="number"
                    align="right"
                    onSave={v => {
                      const n = parseFloat(v);
                      if (!isNaN(n)) onUpdateExpense(expense.id, { amount: n });
                    }}
                  />
                </td>
                <td className="px-3 py-3.5 text-center">
                  {expense.receipt ? (
                    <button
                      onClick={() => setViewing(expense)}
                      className="transition-colors"
                      style={{ color: '#0EA5E9' }}
                    >
                      <Receipt className="w-4 h-4" />
                    </button>
                  ) : <span style={{ color: '#334155' }}>—</span>}
                </td>
                <td className="px-3 py-3.5 text-center">
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="transition-colors"
                    style={{ color: '#475569' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#F87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog.Root open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 60 }} />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 max-w-[90vw] max-h-[90vh] overflow-auto"
            style={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              zIndex: 61,
              minWidth: 360,
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <Dialog.Title style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 600 }}>
                  {viewing?.description}
                </Dialog.Title>
                <div style={{ color: '#94A3B8', fontSize: 13, marginTop: 4 }}>
                  {viewing?.merchant} · ₹{viewing?.amount.toFixed(2)}
                </div>
              </div>
              <Dialog.Close style={{ color: '#94A3B8' }}>
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>
            {viewing?.receipt && (
              <img
                src={viewing.receipt}
                alt={`Receipt for ${viewing.description}`}
                style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 12, border: '1px solid rgba(148,163,184,0.2)' }}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
