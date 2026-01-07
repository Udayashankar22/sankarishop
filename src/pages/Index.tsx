import { useState } from 'react';
import { usePawnStore } from '@/hooks/usePawnStore';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { PawnTable } from '@/components/pawn/PawnTable';
import { PawnForm } from '@/components/pawn/PawnForm';
import { PawnDetailsModal } from '@/components/pawn/PawnDetailsModal';
import { InterestCalculator } from '@/components/pawn/InterestCalculator';
import { RedeemModal } from '@/components/pawn/RedeemModal';
import { StorageLocationModal } from '@/components/pawn/StorageLocationModal';
import { LoginPage } from '@/components/auth/LoginPage';
import { Button } from '@/components/ui/button';
import { PawnRecord, StorageLocation } from '@/types/pawn';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const { isAuthenticated, isLoading: authLoading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'dashboard' | 'records' | 'calculator'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PawnRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<PawnRecord | null>(null);
  const [redeemingRecord, setRedeemingRecord] = useState<PawnRecord | null>(null);
  const [editingStorageRecord, setEditingStorageRecord] = useState<PawnRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { records, isLoading, addRecord, updateRecord, deleteRecord, redeemRecord, getStats } = usePawnStore();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleAddRecord = async (data: Omit<PawnRecord, 'id'>) => {
    try {
      await addRecord(data);
      setShowForm(false);
      toast.success('Pawn record created successfully!');
    } catch (error) {
      toast.error('Failed to create record. Please try again.');
    }
  };

  const handleEditRecord = async (data: Omit<PawnRecord, 'id'>) => {
    if (editingRecord) {
      try {
        await updateRecord(editingRecord.id, data);
        setEditingRecord(null);
        toast.success('Pawn record updated successfully!');
      } catch (error) {
        toast.error('Failed to update record. Please try again.');
      }
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id);
        toast.success('Record deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete record. Please try again.');
      }
    }
  };

  const handleRedeemConfirm = async () => {
    if (redeemingRecord) {
      try {
        await redeemRecord(redeemingRecord.id);
        setRedeemingRecord(null);
        setViewingRecord(null);
        toast.success('Jewellery redeemed successfully!');
      } catch (error) {
        toast.error('Failed to redeem record. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully!');
  };

  const handleUpdateStorage = async (
    id: string, 
    storageLocation: StorageLocation | undefined, 
    storageSerialNumber: string | undefined
  ) => {
    try {
      await updateRecord(id, { storageLocation, storageSerialNumber });
      setEditingStorageRecord(null);
      toast.success('Storage location updated successfully!');
    } catch (error) {
      toast.error('Failed to update storage location. Please try again.');
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                  Welcome to <span className="gradient-gold-text">Ravi Shop</span>
                </h1>
                <p className="text-muted-foreground">
                  Manage your pawn records efficiently and securely
                </p>
              </div>
              <Button variant="gold" size="lg" onClick={() => setShowForm(true)}>
                <Plus className="h-5 w-5 mr-2" />
                New Pawn Entry
              </Button>
            </div>

            {/* Stats */}
            <StatsCards stats={stats} />

            {/* Quick Calculator */}
            <InterestCalculator />

            {/* Recent Records */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif font-semibold text-foreground">
                  Recent Pawn Records
                </h2>
                <Button variant="ghost" onClick={() => setCurrentView('records')}>
                  View All
                </Button>
              </div>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="h-6 w-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading records...</p>
                </div>
              ) : (
                <PawnTable
                  records={records.slice(0, 5)}
                  onEdit={(record) => setEditingRecord(record)}
                  onDelete={handleDeleteRecord}
                  onRedeem={(id) => {
                    const record = records.find((r) => r.id === id);
                    if (record) setRedeemingRecord(record);
                  }}
                  onEditStorage={(record) => setEditingStorageRecord(record)}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}
            </div>
          </div>
        )}

        {currentView === 'records' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                  Pawn Records
                </h1>
                <p className="text-muted-foreground">
                  View and manage all pawn transactions
                </p>
              </div>
              <Button variant="gold" size="lg" onClick={() => setShowForm(true)}>
                <Plus className="h-5 w-5 mr-2" />
                New Pawn Entry
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="h-6 w-6 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading records...</p>
              </div>
            ) : (
              <PawnTable
                records={records}
                onEdit={(record) => setEditingRecord(record)}
                onDelete={handleDeleteRecord}
                onRedeem={(id) => {
                  const record = records.find((r) => r.id === id);
                  if (record) setRedeemingRecord(record);
                }}
                onEditStorage={(record) => setEditingStorageRecord(record)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
          </div>
        )}

        {currentView === 'calculator' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
                Interest Calculator
              </h1>
              <p className="text-muted-foreground">
                Calculate interest for any pawn amount and duration
              </p>
            </div>
            <InterestCalculator />
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <PawnForm
          onSubmit={handleAddRecord}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingRecord && (
        <PawnForm
          initialData={editingRecord}
          onSubmit={handleEditRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {viewingRecord && (
        <PawnDetailsModal
          record={viewingRecord}
          onClose={() => setViewingRecord(null)}
          onRedeem={(id) => {
            setRedeemingRecord(viewingRecord);
          }}
        />
      )}

      {redeemingRecord && (
        <RedeemModal
          record={redeemingRecord}
          onConfirm={handleRedeemConfirm}
          onClose={() => setRedeemingRecord(null)}
        />
      )}

      {editingStorageRecord && (
        <StorageLocationModal
          record={editingStorageRecord}
          onSubmit={handleUpdateStorage}
          onClose={() => setEditingStorageRecord(null)}
        />
      )}
    </div>
  );
};

export default Index;
