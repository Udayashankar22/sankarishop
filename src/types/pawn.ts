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
}

export interface DashboardStats {
  totalActivePawns: number;
  totalRedeemedPawns: number;
  totalPawnAmount: number;
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
