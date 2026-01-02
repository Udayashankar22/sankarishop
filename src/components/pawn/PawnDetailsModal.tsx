import { PawnRecord } from '@/types/pawn';
import { calculateInterest, formatCurrency, formatDate } from '@/lib/pawnCalculations';
import { Button } from '@/components/ui/button';
import { X, Gem, Calendar, User, Phone, MapPin, Scale, Percent, IndianRupee } from 'lucide-react';

interface PawnDetailsModalProps {
  record: PawnRecord;
  onClose: () => void;
  onRedeem: (id: string) => void;
}

export function PawnDetailsModal({ record, onClose, onRedeem }: PawnDetailsModalProps) {
  const { days, months, interestAmount, totalPayable } = calculateInterest(
    record.pawnAmount,
    record.interestRate,
    record.pawnDate,
    record.redeemedDate
  );

  const details = [
    { icon: User, label: 'Customer Name', value: record.name },
    { icon: Phone, label: 'Phone Number', value: record.phoneNumber },
    { icon: MapPin, label: 'Address', value: record.address || 'Not provided' },
    { icon: Calendar, label: 'Pawn Date', value: formatDate(record.pawnDate) },
    { icon: Gem, label: 'Jewellery Type', value: record.jewelleryType },
    { icon: Scale, label: 'Weight', value: `${record.jewelleryWeight} grams` },
    { icon: IndianRupee, label: 'Pawn Amount', value: formatCurrency(record.pawnAmount) },
    { icon: Percent, label: 'Interest Rate', value: `${record.interestRate}% per month` },
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-lg gold-border animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gold/20 p-2 rounded-lg">
              <Gem className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">
                Pawn Details
              </h2>
              <p className="text-gold font-mono">{record.serialNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Icon className="h-5 w-5 text-gold shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interest Calculation Summary */}
        <div className="bg-gold/10 rounded-xl p-4 mb-6 gold-border">
          <h3 className="text-lg font-serif font-semibold text-gold mb-4">
            Interest Calculation
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-lg font-semibold text-foreground">
                {days} days ({months} months)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interest Amount</p>
              <p className="text-lg font-semibold text-gold">
                {formatCurrency(interestAmount)}
              </p>
            </div>
            <div className="col-span-2 pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground">Total Payable</p>
              <p className="text-2xl font-bold font-serif gradient-gold-text">
                {formatCurrency(totalPayable)}
              </p>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              record.status === 'Active'
                ? 'bg-gold/20 text-gold'
                : 'bg-success/20 text-success'
            }`}
          >
            {record.status}
            {record.redeemedDate && ` on ${formatDate(record.redeemedDate)}`}
          </span>
          
          {record.status === 'Active' && (
            <Button
              variant="success"
              onClick={() => onRedeem(record.id)}
            >
              Redeem Jewellery
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
