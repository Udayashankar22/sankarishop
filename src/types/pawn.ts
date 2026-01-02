export interface PawnRecord {
  id: string;
  serialNumber: string;
  name: string;
  phoneNumber: string;
  address: string;
  pawnDate: string;
  jewelleryType: string;
  jewelleryWeight: number;
  pawnAmount: number;
  interestRate: number;
  status: 'Active' | 'Redeemed';
  redeemedDate?: string;
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
  | 'Gold Bracelet'
  | 'Silver Items'
  | 'Diamond Jewellery'
  | 'Other';
