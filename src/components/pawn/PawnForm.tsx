import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PawnRecord, JewelleryType } from '@/types/pawn';
import { generateSerialNumber } from '@/lib/pawnCalculations';
import { X, Gem } from 'lucide-react';

const jewelleryTypes: JewelleryType[] = [
  'Gold Ring',
  'Gold Chain',
  'Gold Necklace',
  'Gold Bangle',
  'Gold Earrings',
  'Gold Bracelet',
  'Silver Items',
  'Diamond Jewellery',
  'Other',
];

interface PawnFormProps {
  onSubmit: (record: Omit<PawnRecord, 'id'>) => void;
  onClose: () => void;
  initialData?: PawnRecord;
}

export function PawnForm({ onSubmit, onClose, initialData }: PawnFormProps) {
  const [formData, setFormData] = useState({
    serialNumber: initialData?.serialNumber || generateSerialNumber(),
    name: initialData?.name || '',
    phoneNumber: initialData?.phoneNumber || '',
    address: initialData?.address || '',
    pawnDate: initialData?.pawnDate || new Date().toISOString().split('T')[0],
    jewelleryType: initialData?.jewelleryType || '',
    jewelleryWeight: initialData?.jewelleryWeight?.toString() || '',
    pawnAmount: initialData?.pawnAmount?.toString() || '',
    interestRate: initialData?.interestRate?.toString() || '2',
    status: initialData?.status || 'Active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      serialNumber: formData.serialNumber,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      pawnDate: formData.pawnDate,
      jewelleryType: formData.jewelleryType,
      jewelleryWeight: parseFloat(formData.jewelleryWeight),
      pawnAmount: parseFloat(formData.pawnAmount),
      interestRate: parseFloat(formData.interestRate),
      status: formData.status,
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto gold-border animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gold/20 p-2 rounded-lg">
              <Gem className="h-6 w-6 text-gold" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {initialData ? 'Edit Pawn Record' : 'New Pawn Entry'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Serial Number */}
          <div className="space-y-2">
            <Label htmlFor="serialNumber" className="text-foreground">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              readOnly
              className="bg-secondary/50 font-mono text-gold"
            />
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Customer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter customer name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter customer address"
              rows={2}
            />
          </div>

          {/* Jewellery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jewelleryType" className="text-foreground">Jewellery Type *</Label>
              <Select
                value={formData.jewelleryType}
                onValueChange={(value) => setFormData({ ...formData, jewelleryType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {jewelleryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-foreground">Weight (grams) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.jewelleryWeight}
                onChange={(e) => setFormData({ ...formData, jewelleryWeight: e.target.value })}
                placeholder="Enter weight"
                required
              />
            </div>
          </div>

          {/* Pawn Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pawnDate" className="text-foreground">Pawn Date *</Label>
              <Input
                id="pawnDate"
                type="date"
                value={formData.pawnDate}
                onChange={(e) => setFormData({ ...formData, pawnDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">Pawn Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.pawnAmount}
                onChange={(e) => setFormData({ ...formData, pawnAmount: e.target.value })}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate" className="text-foreground">Interest Rate (%) *</Label>
              <Input
                id="rate"
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="Monthly rate"
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gold" className="flex-1">
              {initialData ? 'Update Record' : 'Create Pawn Entry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
