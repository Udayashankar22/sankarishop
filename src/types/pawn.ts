export type StorageLocation = 'Locker' | 'GRS' | 'Bank';

export interface PawnRecord {
  id: string;
  serialNumber: string;
  name: string;
  phoneNumber: string;
  address: string;
  pawnDate: string;
  jewelleryType: JewelleryType;
  jewelleryWeight: number;
  pawnAmount: number;
  interestRate: number;
  status: 'Active' | 'Redeemed';
  redeemedDate?: string;
  userId?: string;
  storageLocation?: StorageLocation;
  storageSerialNumber?: string;
}

export interface DashboardStats {
  totalEntries: number;
  totalActivePawns: number;
  totalRedeemedPawns: number;
  totalPawnAmount: number;
  totalUpfrontInterest: number;
  totalInterestEarned: number;
}

export type JewelleryType = 
  | 'Gold Ring'
  | 'Gold Chain'
  | 'Gold Necklace'
  | 'Gold Bangle'
  | 'Gold Earrings'
  | 'Silver Ring'
  | 'Silver Chain'
  | 'Silver Bangle'
  | 'Diamond Ring'
  | 'Diamond Necklace'
  | 'Other';
