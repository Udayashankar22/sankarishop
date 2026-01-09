import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PawnRecord, DashboardStats, JewelleryType, StorageLocation } from '@/types/pawn';
import { calculateInterest } from '@/lib/pawnCalculations';

type DbPawnStatus = 'Active' | 'Redeemed';

// Fixed user ID for the shop owner
const SHOP_USER_ID = 'ravisankari-shop-owner';

interface DbPawnRecord {
  id: string;
  user_id: string;
  serial_number: string;
  customer_name: string;
  phone_number: string;
  address: string;
  pawn_date: string;
  jewellery_type: string;
  jewellery_weight: number;
  pawn_amount: number;
  interest_rate: number;
  paper_loan_interest: number;
  status: DbPawnStatus;
  redeemed_date: string | null;
  created_at: string;
  updated_at: string;
  storage_location: string | null;
  storage_serial_number: string | null;
}

function mapDbToRecord(db: DbPawnRecord): PawnRecord {
  return {
    id: db.id,
    serialNumber: db.serial_number,
    name: db.customer_name,
    phoneNumber: db.phone_number,
    address: db.address,
    pawnDate: db.pawn_date,
    jewelleryType: db.jewellery_type as JewelleryType,
    jewelleryWeight: Number(db.jewellery_weight),
    pawnAmount: Number(db.pawn_amount),
    interestRate: Number(db.interest_rate),
    paperLoanInterest: Number(db.paper_loan_interest),
    status: db.status,
    redeemedDate: db.redeemed_date || undefined,
    userId: db.user_id,
    storageLocation: db.storage_location as StorageLocation | undefined,
    storageSerialNumber: db.storage_serial_number || undefined,
  };
}

export function usePawnStore() {
  const { isAuthenticated } = useAuth();
  const [records, setRecords] = useState<PawnRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    if (!isAuthenticated) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from('pawn_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching records:', error);
    } else {
      setRecords((data as DbPawnRecord[]).map(mapDbToRecord));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [isAuthenticated]);

  const addRecord = async (record: Omit<PawnRecord, 'id'>) => {
    if (!isAuthenticated) return null;

    const { data, error } = await supabase
      .from('pawn_records')
      .insert({
        user_id: SHOP_USER_ID,
        serial_number: record.serialNumber,
        customer_name: record.name,
        phone_number: record.phoneNumber,
        address: record.address,
        pawn_date: record.pawnDate,
        jewellery_type: record.jewelleryType,
        jewellery_weight: record.jewelleryWeight,
        pawn_amount: record.pawnAmount,
        interest_rate: record.interestRate,
        paper_loan_interest: record.paperLoanInterest,
        status: 'Active' as DbPawnStatus,
        storage_location: record.storageLocation || null,
        storage_serial_number: record.storageSerialNumber || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding record:', error);
      throw error;
    }

    await fetchRecords();
    return mapDbToRecord(data as DbPawnRecord);
  };

  const updateRecord = async (id: string, updates: Partial<PawnRecord>) => {
    const updateData: Record<string, unknown> = {};
    
    if (updates.serialNumber) updateData.serial_number = updates.serialNumber;
    if (updates.name) updateData.customer_name = updates.name;
    if (updates.phoneNumber) updateData.phone_number = updates.phoneNumber;
    if (updates.address) updateData.address = updates.address;
    if (updates.pawnDate) updateData.pawn_date = updates.pawnDate;
    if (updates.jewelleryType) updateData.jewellery_type = updates.jewelleryType;
    if (updates.jewelleryWeight) updateData.jewellery_weight = updates.jewelleryWeight;
    if (updates.pawnAmount) updateData.pawn_amount = updates.pawnAmount;
    if (updates.interestRate) updateData.interest_rate = updates.interestRate;
    if (updates.paperLoanInterest !== undefined) updateData.paper_loan_interest = updates.paperLoanInterest;
    if (updates.status) updateData.status = updates.status;
    if (updates.redeemedDate) updateData.redeemed_date = updates.redeemedDate;
    if (updates.storageLocation !== undefined) updateData.storage_location = updates.storageLocation || null;
    if (updates.storageSerialNumber !== undefined) updateData.storage_serial_number = updates.storageSerialNumber || null;

    const { error } = await supabase
      .from('pawn_records')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating record:', error);
      throw error;
    }

    await fetchRecords();
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase
      .from('pawn_records')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting record:', error);
      throw error;
    }

    await fetchRecords();
  };

  const redeemRecord = async (id: string) => {
    const { error } = await supabase
      .from('pawn_records')
      .update({
        status: 'Redeemed' as DbPawnStatus,
        redeemed_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', id);

    if (error) {
      console.error('Error redeeming record:', error);
      throw error;
    }

    await fetchRecords();
  };

  const getStats = (): DashboardStats => {
    const activeRecords = records.filter((r) => r.status === 'Active');
    const redeemedRecords = records.filter((r) => r.status === 'Redeemed');

    // Total upfront interest collected from all active pawns (1 month interest + paper loan interest each)
    const totalUpfrontInterest = activeRecords.reduce((sum, r) => {
      const oneMonthInterest = (r.pawnAmount * r.interestRate) / 100;
      const paperInterest = (r.pawnAmount * r.paperLoanInterest) / 100;
      return sum + oneMonthInterest + paperInterest;
    }, 0);

    // Total interest earned from redeemed pawns (upfront + additional)
    const totalInterestEarned = redeemedRecords.reduce((sum, r) => {
      const { upfrontDeduction, interestAmount } = calculateInterest(
        r.pawnAmount,
        r.interestRate,
        r.pawnDate,
        r.redeemedDate,
        r.paperLoanInterest
      );
      return sum + upfrontDeduction + interestAmount;
    }, 0);

    return {
      totalEntries: records.length,
      totalActivePawns: activeRecords.length,
      totalRedeemedPawns: redeemedRecords.length,
      totalPawnAmount: activeRecords.reduce((sum, r) => sum + r.pawnAmount, 0),
      totalUpfrontInterest,
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
    refetch: fetchRecords,
  };
}
