import { PawnRecord } from '@/types/pawn';
import { calculateInterest, formatCurrency } from '@/lib/pawnCalculations';
import { Button } from '@/components/ui/button';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

interface RedeemModalProps {
  record: PawnRecord;
  onConfirm: () => void;
  onClose: () => void;
}

export function RedeemModal({ record, onConfirm, onClose }: RedeemModalProps) {
  const { days, months, interestAmount, totalPayable } = calculateInterest(
    record.pawnAmount,
    record.interestRate,
    record.pawnDate
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md gold-border animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-success/20 p-2 rounded-lg">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">
              Redeem Jewellery
            </h2>
            <p className="text-sm text-muted-foreground">{record.serialNumber}</p>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer</span>
            <span className="font-medium text-foreground">{record.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jewellery</span>
            <span className="font-medium text-foreground">{record.jewelleryType} ({record.jewelleryWeight}g)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pawn Amount</span>
            <span className="font-medium text-foreground">{formatCurrency(record.pawnAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium text-foreground">{days} days ({months} months)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Interest ({record.interestRate}%)</span>
            <span className="font-semibold text-gold">{formatCurrency(interestAmount)}</span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between">
            <span className="font-semibold text-foreground">Total to Collect</span>
            <span className="text-xl font-bold gradient-gold-text">{formatCurrency(totalPayable)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gold/10 rounded-lg mb-6 gold-border">
          <AlertCircle className="h-5 w-5 text-gold shrink-0" />
          <p className="text-sm text-muted-foreground">
            Confirming will mark this pawn as redeemed and the jewellery can be returned to the customer.
          </p>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="button" variant="success" onClick={onConfirm} className="flex-1">
            Confirm Redemption
          </Button>
        </div>
      </div>
    </div>
  );
}
