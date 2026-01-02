import { Gem, LogOut, LayoutDashboard, Calculator, List, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  currentView: 'dashboard' | 'records' | 'calculator';
  onViewChange: (view: 'dashboard' | 'records' | 'calculator') => void;
  onLogout: () => void;
}

export function Header({ currentView, onViewChange, onLogout }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'records', label: 'Records', icon: List },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
  ] as const;

  return (
    <header className="glass-card border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gold/20 p-2 rounded-lg gold-glow">
              <Gem className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold gradient-gold-text">
                Adagu Kadai
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Pawn Broker Management
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentView === id
                    ? 'bg-gold/20 text-gold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout} className="hidden sm:flex">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-center gap-1 py-2 border-t border-border">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                currentView === id
                  ? 'bg-gold/20 text-gold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
