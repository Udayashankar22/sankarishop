import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateInterest, formatCurrency } from '@/lib/pawnCalculations';
import { Calculator, IndianRupee, Percent, Calendar } from 'lucide-react';

export function InterestCalculator() {
  const [amount, setAmount] = useState<string>('100000');
  const [rate, setRate] = useState<string>('2');
  const [days, setDays] = useState<string>('30');

  const pawnDate = new Date();
  pawnDate.setDate(pawnDate.getDate() - parseInt(days || '0'));

  const { interestAmount, totalPayable, months } = calculateInterest(
    parseFloat(amount || '0'),
    parseFloat(rate || '0'),
    pawnDate.toISOString().split('T')[0]
  );

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
          <Label htmlFor="calc-days" className="flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-gold" />
            Duration (Days)
          </Label>
          <Input
            id="calc-days"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="Enter days"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-secondary/30 rounded-xl p-4">
        <div className="text-center p-3">
          <p className="text-sm text-muted-foreground mb-1">Duration</p>
          <p className="text-xl font-semibold text-foreground">
            {months.toFixed(2)} months
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
