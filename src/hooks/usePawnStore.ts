import { useState, useEffect } from 'react';
import { PawnRecord, DashboardStats } from '@/types/pawn';
import { calculateInterest } from '@/lib/pawnCalculations';

const STORAGE_KEY = 'adagu_kadai_pawns';

// Sample data for demonstration
const sampleData: PawnRecord[] = [
  {
    id: '1',
    serialNumber: 'AK250101',
    name: 'Rajesh Kumar',
    phoneNumber: '9876543210',
    address: '123, Gandhi Street, Chennai',
    pawnDate: '2024-12-15',
    jewelleryType: 'Gold Chain',
    jewelleryWeight: 25.5,
    pawnAmount: 125000,
    interestRate: 2,
    status: 'Active',
  },
  {
    id: '2',
    serialNumber: 'AK250102',
    name: 'Priya Devi',
    phoneNumber: '9876543211',
    address: '456, Nehru Road, Madurai',
    pawnDate: '2024-11-20',
    jewelleryType: 'Gold Bangle',
    jewelleryWeight: 30.0,
    pawnAmount: 150000,
    interestRate: 2.5,
    status: 'Active',
  },
  {
    id: '3',
    serialNumber: 'AK250103',
    name: 'Suresh Babu',
    phoneNumber: '9876543212',
    address: '789, Anna Nagar, Coimbatore',
    pawnDate: '2024-10-01',
    jewelleryType: 'Gold Necklace',
    jewelleryWeight: 45.0,
    pawnAmount: 225000,
    interestRate: 2,
    status: 'Redeemed',
    redeemedDate: '2024-12-20',
  },
];

export function usePawnStore() {
  const [records, setRecords] = useState<PawnRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setRecords(JSON.parse(stored));
    } else {
      // Initialize with sample data
      setRecords(sampleData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
    }
    setIsLoading(false);
  }, []);

  const saveRecords = (newRecords: PawnRecord[]) => {
    setRecords(newRecords);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords));
  };

  const addRecord = (record: Omit<PawnRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    saveRecords([...records, newRecord]);
    return newRecord;
  };

  const updateRecord = (id: string, updates: Partial<PawnRecord>) => {
    const newRecords = records.map((r) =>
      r.id === id ? { ...r, ...updates } : r
    );
    saveRecords(newRecords);
  };

  const deleteRecord = (id: string) => {
    saveRecords(records.filter((r) => r.id !== id));
  };

  const redeemRecord = (id: string) => {
    const newRecords = records.map((r) =>
      r.id === id
        ? { ...r, status: 'Redeemed' as const, redeemedDate: new Date().toISOString().split('T')[0] }
        : r
    );
    saveRecords(newRecords);
  };

  const getStats = (): DashboardStats => {
    const activeRecords = records.filter((r) => r.status === 'Active');
    const redeemedRecords = records.filter((r) => r.status === 'Redeemed');

    const totalInterestEarned = redeemedRecords.reduce((sum, r) => {
      const { interestAmount } = calculateInterest(
        r.pawnAmount,
        r.interestRate,
        r.pawnDate,
        r.redeemedDate
      );
      return sum + interestAmount;
    }, 0);

    return {
      totalActivePawns: activeRecords.length,
      totalRedeemedPawns: redeemedRecords.length,
      totalPawnAmount: activeRecords.reduce((sum, r) => sum + r.pawnAmount, 0),
      totalInterestEarned,
    };
  };

  const searchRecords = (query: string): PawnRecord[] => {
    const lowerQuery = query.toLowerCase();
    return records.filter(
      (r) =>
        r.serialNumber.toLowerCase().includes(lowerQuery) ||
        r.name.toLowerCase().includes(lowerQuery) ||
        r.phoneNumber.includes(query)
    );
  };

  return {
    records,
    isLoading,
    addRecord,
    updateRecord,
    deleteRecord,
    redeemRecord,
    getStats,
    searchRecords,
  };
}
