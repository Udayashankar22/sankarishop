// Calculate months where any period > 2 days counts as 1 full month
export function calculateMonths(pawnDate: string, endDate?: string): { days: number; totalMonths: number } {
  const start = new Date(pawnDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Any period > 2 days counts as 1 full month
  const totalMonths = days > 2 ? Math.ceil(days / 30) : 0;
  
  return { days, totalMonths };
}

// Calculate upfront deduction at loan initiation (1 month interest)
export function calculateUpfrontDeduction(pawnAmount: number, interestRate: number): number {
  return parseFloat(((pawnAmount * interestRate) / 100).toFixed(2));
}

// Calculate amount given to customer after upfront deduction
export function calculateAmountGiven(pawnAmount: number, interestRate: number): number {
  const upfrontDeduction = calculateUpfrontDeduction(pawnAmount, interestRate);
  return parseFloat((pawnAmount - upfrontDeduction).toFixed(2));
}

export function calculateInterest(
  pawnAmount: number,
  interestRate: number,
  pawnDate: string,
  endDate?: string
): { 
  days: number; 
  totalMonths: number; 
  effectiveMonths: number; 
  interestAmount: number; 
  upfrontDeduction: number;
  totalPayable: number;
  amountGiven: number;
} {
  const { days, totalMonths } = calculateMonths(pawnDate, endDate);
  
  // Effective months = totalMonths - 1 (since 1 month was deducted upfront)
  const effectiveMonths = Math.max(0, totalMonths - 1);
  
  // Upfront deduction (1 month interest deducted at loan initiation)
  const upfrontDeduction = calculateUpfrontDeduction(pawnAmount, interestRate);
  
  // Amount actually given to customer
  const amountGiven = pawnAmount - upfrontDeduction;
  
  // Interest for effective months (remaining months after upfront deduction)
  const interestAmount = parseFloat(((pawnAmount * interestRate * effectiveMonths) / 100).toFixed(2));
  
  // Total payable = original pawn amount + interest for effective months
  const totalPayable = parseFloat((pawnAmount + interestAmount).toFixed(2));
  
  return {
    days,
    totalMonths,
    effectiveMonths,
    interestAmount,
    upfrontDeduction,
    totalPayable,
    amountGiven,
  };
}

export function generateSerialNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `AK${year}${month}${random}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
