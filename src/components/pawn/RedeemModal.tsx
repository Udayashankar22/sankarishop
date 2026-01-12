import { useState } from 'react';
import { PawnRecord } from '@/types/pawn';
import { calculateInterest, formatCurrency } from '@/lib/pawnCalculations';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RedeemModalProps {
  record: PawnRecord;
  onConfirm: (redemptionDate: string) => void;
  onClose: () => void;
}

export function RedeemModal({ record, onConfirm, onClose }: RedeemModalProps) {
  const [redemptionDate, setRedemptionDate] = useState<Date>(new Date());
  
  const redemptionDateString = redemptionDate.toISOString().split('T')[0];
  const { days, totalMonths, effectiveMonths, interestAmount, upfrontDeduction, oneMonthInterest, paperInterest, totalPayable } = calculateInterest(
    record.pawnAmount,
    record.interestRate,
    record.pawnDate,
    redemptionDateString,
    record.paperLoanInterest
  );

  // Total interest earned = upfront (1 month + paper loan) + additional interest for effective months
  const totalInterestEarned = upfrontDeduction + interestAmount;

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
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Redemption Date</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal h-8",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(redemptionDate, "dd/MM/yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={redemptionDate}
                  onSelect={(date) => date && setRedemptionDate(date)}
                  disabled={(date) => date < new Date(record.pawnDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium text-foreground">{days} days ({totalMonths} {totalMonths === 1 ? 'month' : 'months'})</span>
          </div>
          
          <div className="pt-3 border-t border-border space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">1 Month Interest</span>
              <span className="font-medium text-gold">{formatCurrency(oneMonthInterest)}</span>
            </div>
            {paperInterest > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Paper Loan Interest</span>
                <span className="font-medium text-gold">{formatCurrency(paperInterest)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Upfront Deduction</span>
              <span className="font-medium text-gold">{formatCurrency(upfrontDeduction)}</span>
            </div>
            {effectiveMonths > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Additional Interest ({effectiveMonths} {effectiveMonths === 1 ? 'month' : 'months'})</span>
                <span className="font-medium text-gold">{formatCurrency(interestAmount)}</span>
              </div>
            )}
            <div className="flex justify-between bg-gold/10 p-2 rounded-lg">
              <span className="font-semibold text-foreground">Total Interest Earned</span>
              <span className="font-bold text-gold">{formatCurrency(totalInterestEarned)}</span>
            </div>
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
          <Button type="button" variant="success" onClick={() => onConfirm(redemptionDateString)} className="flex-1">
            Confirm Redemption
          </Button>
        </div>
      </div>
    </div>
  );
}
