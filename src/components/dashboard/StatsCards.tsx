import { Gem, TrendingUp, Archive, IndianRupee, ClipboardList } from 'lucide-react';
import { DashboardStats } from '@/types/pawn';
import { formatCurrency } from '@/lib/pawnCalculations';

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Entries',
      value: stats.totalEntries,
      icon: ClipboardList,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Active Pawns',
      value: stats.totalActivePawns,
      icon: Gem,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
    {
      title: 'Redeemed Pawns',
      value: stats.totalRedeemedPawns,
      icon: Archive,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Total Pawn Amount',
      value: formatCurrency(stats.totalPawnAmount),
      icon: IndianRupee,
      color: 'text-gold-light',
      bgColor: 'bg-gold-light/10',
    },
    {
      title: 'Upfront Interest (1 Month)',
      value: formatCurrency(stats.totalUpfrontInterest),
      icon: TrendingUp,
      color: 'text-gold',
      bgColor: 'bg-gold/10',
    },
    {
      title: 'Interest Earned (Redeemed)',
      value: formatCurrency(stats.totalInterestEarned),
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className="glass-card rounded-xl p-6 gold-border animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">
                {card.title}
              </p>
              <p className={`text-2xl font-bold font-serif ${card.color}`}>
                {card.value}
              </p>
            </div>
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
