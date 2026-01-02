import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/pawnCalculations';
import { Calculator, IndianRupee, Percent, Calendar } from 'lucide-react';

export function InterestCalculator() {
  const [amount, setAmount] = useState<string>('100000');
  const [rate, setRate] = useState<string>('2');
  const [months, setMonths] = useState<string>('1');

  const pawnAmount = parseFloat(amount || '0');
  const interestRate = parseFloat(rate || '0');
  const duration = parseFloat(months || '0');

  // Interest calculation: (Principal * Rate * Time) / 100
  const interestAmount = (pawnAmount * interestRate * duration) / 100;
  const totalPayable = pawnAmount + interestAmount;

  return (
    <div className="glass-card rounded-2xl gold-border p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gold/20 p-2 rounded-lg">
          <Calculator className="h-6 w-6 text-gold" />
        </div>
        <h2 className="text-xl font-serif font-bold text-foreground">
          Interest Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="calc-amount" className="flex items-center gap-2 text-foreground">
            <IndianRupee className="h-4 w-4 text-gold" />
            Pawn Amount
          </Label>
          <Input
            id="calc-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="calc-rate" className="flex items-center gap-2 text-foreground">
            <Percent className="h-4 w-4 text-gold" />
            Interest Rate (Monthly)
          </Label>
          <Input
            id="calc-rate"
            type="number"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Enter rate"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="calc-months" className="flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-gold" />
            Duration (Months)
          </Label>
          <Input
            id="calc-months"
            type="number"
            step="0.5"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            placeholder="Enter months"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-secondary/30 rounded-xl p-4">
        <div className="text-center p-3">
          <p className="text-sm text-muted-foreground mb-1">Duration</p>
          <p className="text-xl font-semibold text-foreground">
            {duration} {duration === 1 ? 'month' : 'months'}
          </p>
        </div>
        <div className="text-center p-3">
          <p className="text-sm text-muted-foreground mb-1">Interest Amount</p>
          <p className="text-xl font-semibold text-gold">
            {formatCurrency(interestAmount)}
          </p>
        </div>
        <div className="text-center p-3 bg-gold/10 rounded-lg gold-border">
          <p className="text-sm text-muted-foreground mb-1">Total Payable</p>
          <p className="text-2xl font-bold font-serif gradient-gold-text">
            {formatCurrency(totalPayable)}
          </p>
        </div>
      </div>
    </div>
  );
}
