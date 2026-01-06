export function calculateInterest(
  pawnAmount: number,
  interestRate: number,
  pawnDate: string,
  endDate?: string
): { days: number; months: number; interestAmount: number; totalPayable: number } {
  const start = new Date(pawnDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const months = days / 30;
  
  // Interest calculation: (Principal * Rate * Time) / 100
  // Monthly interest rate applied
  const interestAmount = (pawnAmount * interestRate * months) / 100;
  const totalPayable = pawnAmount + interestAmount;
  
  return {
    days,
    months: parseFloat(months.toFixed(2)),
    interestAmount: parseFloat(interestAmount.toFixed(2)),
    totalPayable: parseFloat(totalPayable.toFixed(2)),
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
