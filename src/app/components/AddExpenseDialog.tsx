import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Upload, X, Receipt } from 'lucide-react';
import type { Expense } from '../App';

interface AddExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: Omit<Expense, 'id'>) => void;
}

const CATEGORIES = ['Office', 'Meals', 'Travel', 'Software', 'Utilities', 'Marketing', 'Equipment', 'Insurance', 'Subscriptions', 'Training', 'Entertainment', 'Grocery', 'Education', 'Fuel', 'Other'];

export function AddExpenseDialog({ open, onClose, onAdd }: AddExpenseDialogProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Office');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [merchant, setMerchant] = useState('');
  const [receipt, setReceipt] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceipt(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!description || !amount) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      category,
      date,
      merchant: merchant || undefined,
      receipt: receipt || undefined,
    });

    setDescription('');
    setAmount('');
    setCategory('Office');
    setDate(new Date().toISOString().split('T')[0]);
    setMerchant('');
    setReceipt(null);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(148, 163, 184, 0.2)',
        },
      }}
    >
      <DialogTitle className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
        Add New Expense
      </DialogTitle>
      <DialogContent className="space-y-4 pt-4">
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g., Office supplies"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF',
              backgroundColor: 'rgba(148, 163, 184, 0.05)',
              '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
              '&:hover fieldset': { borderColor: '#0EA5E9' },
              '&.Mui-focused fieldset': { borderColor: '#0EA5E9' },
            },
            '& .MuiInputLabel-root': { color: '#94A3B8' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#0EA5E9' },
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            slotProps={{
              input: {
                startAdornment: <span className="mr-1" style={{ color: '#FFFFFF' }}>₹</span>,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                backgroundColor: 'rgba(148, 163, 184, 0.05)',
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                '&:hover fieldset': { borderColor: '#0EA5E9' },
                '&.Mui-focused fieldset': { borderColor: '#0EA5E9' },
              },
              '& .MuiInputLabel-root': { color: '#94A3B8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#0EA5E9' },
            }}
          />

          <TextField
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={(e) => setDate(e.target.value)}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#FFFFFF',
                backgroundColor: 'rgba(148, 163, 184, 0.05)',
                '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
                '&:hover fieldset': { borderColor: '#0EA5E9' },
                '&.Mui-focused fieldset': { borderColor: '#0EA5E9' },
              },
              '& .MuiInputLabel-root': { color: '#94A3B8' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#0EA5E9' },
            }}
          />
        </div>

        <FormControl fullWidth>
          <InputLabel sx={{ color: '#94A3B8', '&.Mui-focused': { color: '#0EA5E9' } }}>
            Category
          </InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
            sx={{
              color: '#FFFFFF',
              backgroundColor: 'rgba(148, 163, 184, 0.05)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(148, 163, 184, 0.2)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#0EA5E9' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0EA5E9' },
              '& .MuiSvgIcon-root': { color: '#94A3B8' },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: '#1E293B',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  '& .MuiMenuItem-root': {
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
                    },
                  },
                },
              },
            }}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Merchant (optional)"
          fullWidth
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          placeholder="e.g., Office Depot"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#FFFFFF',
              backgroundColor: 'rgba(148, 163, 184, 0.05)',
              '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
              '&:hover fieldset': { borderColor: '#0EA5E9' },
              '&.Mui-focused fieldset': { borderColor: '#0EA5E9' },
            },
            '& .MuiInputLabel-root': { color: '#94A3B8' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#0EA5E9' },
          }}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium" style={{ color: '#FFFFFF' }}>Receipt (optional)</label>
          {receipt ? (
            <div className="relative inline-block">
              <img
                src={receipt}
                alt="Receipt preview"
                className="w-32 h-32 object-cover rounded-lg"
                style={{ border: '1px solid rgba(148, 163, 184, 0.2)' }}
              />
              <button
                onClick={() => setReceipt(null)}
                className="absolute -top-2 -right-2 p-1 rounded-full transition-all"
                style={{
                  backgroundColor: '#F87171',
                  color: '#FFFFFF',
                  boxShadow: '0 0 10px rgba(248, 113, 113, 0.5)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FCA5A5';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(248, 113, 113, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F87171';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(248, 113, 113, 0.5)';
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all"
              style={{
                borderColor: 'rgba(148, 163, 184, 0.2)',
                backgroundColor: 'rgba(148, 163, 184, 0.05)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0EA5E9';
                e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.05)';
              }}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: '#0EA5E9' }} />
                <span className="text-sm" style={{ color: '#94A3B8' }}>Click to upload receipt</span>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>
      </DialogContent>
      <DialogActions className="p-4">
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            color: '#94A3B8',
            '&:hover': {
              backgroundColor: 'rgba(148, 163, 184, 0.1)',
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!description || !amount}
          startIcon={<Receipt className="w-4 h-4" />}
          sx={{
            textTransform: 'none',
            backgroundColor: '#0EA5E9',
            color: '#FFFFFF',
            boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
            '&:hover': {
              backgroundColor: '#0284C7',
              boxShadow: '0 0 30px rgba(14, 165, 233, 0.5)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(148, 163, 184, 0.2)',
              color: '#64748B',
              boxShadow: 'none',
            }
          }}
        >
          Add Expense
        </Button>
      </DialogActions>
    </Dialog>
  );
}
