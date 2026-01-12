import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PawnRecord, JewelleryType, StorageLocation } from '@/types/pawn';
import { formatCurrency } from '@/lib/pawnCalculations';

import { X, Gem, MapPin, IndianRupee } from 'lucide-react';

const storageLocations: StorageLocation[] = ['Locker', 'GRS', 'Bank'];

const jewelleryTypes: JewelleryType[] = [
  'Gold Ring',
  'Gold Chain',
  'Gold Necklace',
  'Gold Bangle',
  'Gold Earrings',
  'Silver Ring',
  'Silver Chain',
  'Silver Bangle',
  'Diamond Ring',
  'Diamond Necklace',
  'Other',
];

interface PawnFormProps {
  onSubmit: (record: Omit<PawnRecord, 'id'>) => void;
  onClose: () => void;
  initialData?: PawnRecord;
}

interface FormErrors {
  serialNumber?: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  pawnDate?: string;
  redeemedDate?: string;
  jewelleryType?: string;
  customJewelleryType?: string;
  jewelleryWeight?: string;
  pawnAmount?: string;
  interestRate?: string;
  paperLoanInterest?: string;
  storageSerialNumber?: string;
}

export function PawnForm({ onSubmit, onClose, initialData }: PawnFormProps) {
  const isCustomType = initialData?.jewelleryType && !jewelleryTypes.includes(initialData.jewelleryType);
  
  const [formData, setFormData] = useState({
    serialNumber: initialData?.serialNumber || '',
    name: initialData?.name || '',
    phoneNumber: initialData?.phoneNumber || '',
    address: initialData?.address || '',
    pawnDate: initialData?.pawnDate || new Date().toISOString().split('T')[0],
    jewelleryType: isCustomType ? 'Other' : (initialData?.jewelleryType || 'Gold Ring') as JewelleryType,
    customJewelleryType: isCustomType ? initialData?.jewelleryType : '',
    jewelleryWeight: initialData?.jewelleryWeight?.toString() || '',
    pawnAmount: initialData?.pawnAmount?.toString() || '',
    interestRate: initialData?.interestRate?.toString() || '2',
    paperLoanInterest: initialData?.paperLoanInterest?.toString() || '0',
    status: initialData?.status || 'Active' as const,
    redeemedDate: initialData?.redeemedDate || '',
    storageLocation: (initialData?.storageLocation || '') as StorageLocation | '',
    storageSerialNumber: initialData?.storageSerialNumber || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'serialNumber':
        if (!value.trim()) return 'Serial number is required';
        if (value.trim().length < 2) return 'Serial number must be at least 2 characters';
        return undefined;

      case 'name':
        if (!value.trim()) return 'Customer name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        return undefined;

      case 'phoneNumber':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Enter a valid 10-digit phone number';
        return undefined;

      case 'address':
        if (value && value.length > 500) return 'Address must be less than 500 characters';
        return undefined;

      case 'pawnDate':
        if (!value) return 'Pawn date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selectedDate > today) return 'Pawn date cannot be in the future';
        return undefined;

      case 'redeemedDate':
        if (formData.status === 'Redeemed' && !value) return 'Redemption date is required for redeemed pawns';
        if (value) {
          const redemptionDate = new Date(value);
          const pawnDate = new Date(formData.pawnDate);
          if (redemptionDate < pawnDate) return 'Redemption date cannot be before pawn date';
        }
        return undefined;

      case 'customJewelleryType':
        if (formData.jewelleryType === 'Other' && !value.trim()) return 'Custom jewellery type is required';
        if (value && value.trim().length > 50) return 'Type must be less than 50 characters';
        return undefined;

      case 'jewelleryWeight':
        if (!value) return 'Weight is required';
        const weight = parseFloat(value);
        if (isNaN(weight) || weight <= 0) return 'Enter a valid weight greater than 0';
        if (weight > 10000) return 'Weight seems too high. Please verify';
        return undefined;

      case 'pawnAmount':
        if (!value) return 'Pawn amount is required';
        const amount = parseFloat(value);
        if (isNaN(amount) || amount <= 0) return 'Enter a valid amount greater than 0';
        if (amount > 100000000) return 'Amount seems too high. Please verify';
        return undefined;

      case 'interestRate':
        if (!value) return 'Interest rate is required';
        const rate = parseFloat(value);
        if (isNaN(rate) || rate < 0) return 'Enter a valid interest rate';
        if (rate > 100) return 'Interest rate cannot exceed 100%';
        return undefined;

      case 'paperLoanInterest':
        if (value) {
          const paperRate = parseFloat(value);
          if (isNaN(paperRate) || paperRate < 0) return 'Enter a valid rate';
          if (paperRate > 1) return 'Paper loan interest cannot exceed 1%';
        }
        return undefined;

      case 'storageSerialNumber':
        if ((formData.storageLocation === 'GRS' || formData.storageLocation === 'Bank') && !value.trim()) {
          return 'Storage serial number is required for GRS/Bank';
        }
        if (value && value.trim().length > 50) return 'Serial number must be less than 50 characters';
        return undefined;

      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    newErrors.serialNumber = validateField('serialNumber', formData.serialNumber);
    newErrors.name = validateField('name', formData.name);
    newErrors.phoneNumber = validateField('phoneNumber', formData.phoneNumber);
    newErrors.address = validateField('address', formData.address);
    newErrors.pawnDate = validateField('pawnDate', formData.pawnDate);
    newErrors.redeemedDate = validateField('redeemedDate', formData.redeemedDate);
    newErrors.customJewelleryType = validateField('customJewelleryType', formData.customJewelleryType || '');
    newErrors.jewelleryWeight = validateField('jewelleryWeight', formData.jewelleryWeight);
    newErrors.pawnAmount = validateField('pawnAmount', formData.pawnAmount);
    newErrors.interestRate = validateField('interestRate', formData.interestRate);
    newErrors.paperLoanInterest = validateField('paperLoanInterest', formData.paperLoanInterest);
    newErrors.storageSerialNumber = validateField('storageSerialNumber', formData.storageSerialNumber);

    // Remove undefined errors
    const filteredErrors: FormErrors = {};
    Object.keys(newErrors).forEach((key) => {
      const errorKey = key as keyof FormErrors;
      if (newErrors[errorKey]) {
        filteredErrors[errorKey] = newErrors[errorKey];
      }
    });

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const value = formData[field as keyof typeof formData];
    const stringValue = typeof value === 'string' ? value : String(value ?? '');
    const error = validateField(field, stringValue);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    const finalJewelleryType = formData.jewelleryType === 'Other' && formData.customJewelleryType
      ? formData.customJewelleryType
      : formData.jewelleryType;
    
    onSubmit({
      serialNumber: formData.serialNumber.trim(),
      name: formData.name.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      address: formData.address.trim(),
      pawnDate: formData.pawnDate,
      jewelleryType: finalJewelleryType as JewelleryType,
      jewelleryWeight: parseFloat(formData.jewelleryWeight),
      pawnAmount: parseFloat(formData.pawnAmount),
      interestRate: parseFloat(formData.interestRate),
      paperLoanInterest: parseFloat(formData.paperLoanInterest) || 0,
      status: formData.status,
      redeemedDate: formData.redeemedDate || undefined,
      storageLocation: formData.storageLocation || undefined,
      storageSerialNumber: formData.storageLocation === 'Locker' ? undefined : formData.storageSerialNumber.trim() || undefined,
    });
  };

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return <p className="text-sm text-destructive mt-1">{error}</p>;
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
            <Label htmlFor="serialNumber" className="text-foreground">Serial Number *</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
              onBlur={() => handleBlur('serialNumber')}
              placeholder="Enter serial number"
              className={`font-mono ${errors.serialNumber && touched.serialNumber ? 'border-destructive' : ''}`}
            />
            {touched.serialNumber && <ErrorMessage error={errors.serialNumber} />}
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Customer Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Enter customer name"
                className={errors.name && touched.name ? 'border-destructive' : ''}
              />
              {touched.name && <ErrorMessage error={errors.name} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                onBlur={() => handleBlur('phoneNumber')}
                placeholder="Enter 10-digit phone number"
                className={errors.phoneNumber && touched.phoneNumber ? 'border-destructive' : ''}
              />
              {touched.phoneNumber && <ErrorMessage error={errors.phoneNumber} />}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-foreground">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              placeholder="Enter customer address"
              rows={2}
              className={errors.address && touched.address ? 'border-destructive' : ''}
            />
            {touched.address && <ErrorMessage error={errors.address} />}
          </div>

          {/* Jewellery Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jewelleryType" className="text-foreground">Jewellery Type *</Label>
              <Select
                value={formData.jewelleryType}
                onValueChange={(value: string) => {
                  setFormData({ ...formData, jewelleryType: value as JewelleryType, customJewelleryType: value === 'Other' ? formData.customJewelleryType : '' });
                  setTouched({ ...touched, jewelleryType: true });
                }}
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
                onChange={(e) => handleChange('jewelleryWeight', e.target.value)}
                onBlur={() => handleBlur('jewelleryWeight')}
                placeholder="Enter weight"
                className={errors.jewelleryWeight && touched.jewelleryWeight ? 'border-destructive' : ''}
              />
              {touched.jewelleryWeight && <ErrorMessage error={errors.jewelleryWeight} />}
            </div>
          </div>

          {/* Custom Jewellery Type Input */}
          {formData.jewelleryType === 'Other' && (
            <div className="space-y-2">
              <Label htmlFor="customJewelleryType" className="text-foreground">Custom Jewellery Type *</Label>
              <Input
                id="customJewelleryType"
                value={formData.customJewelleryType}
                onChange={(e) => handleChange('customJewelleryType', e.target.value)}
                onBlur={() => handleBlur('customJewelleryType')}
                placeholder="Enter custom jewellery type"
                className={errors.customJewelleryType && touched.customJewelleryType ? 'border-destructive' : ''}
              />
              {touched.customJewelleryType && <ErrorMessage error={errors.customJewelleryType} />}
            </div>
          )}

          {/* Pawn Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pawnDate" className="text-foreground">Pawn Date *</Label>
              <Input
                id="pawnDate"
                type="date"
                value={formData.pawnDate}
                onChange={(e) => handleChange('pawnDate', e.target.value)}
                onBlur={() => handleBlur('pawnDate')}
                className={`[color-scheme:dark] ${errors.pawnDate && touched.pawnDate ? 'border-destructive' : ''}`}
              />
              {touched.pawnDate && <ErrorMessage error={errors.pawnDate} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-foreground">Pawn Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.pawnAmount}
                onChange={(e) => handleChange('pawnAmount', e.target.value)}
                onBlur={() => handleBlur('pawnAmount')}
                placeholder="Enter amount"
                className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.pawnAmount && touched.pawnAmount ? 'border-destructive' : ''}`}
              />
              {touched.pawnAmount && <ErrorMessage error={errors.pawnAmount} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate" className="text-foreground">Interest Rate (%) *</Label>
              <Input
                id="rate"
                type="number"
                step="0.1"
                value={formData.interestRate}
                onChange={(e) => handleChange('interestRate', e.target.value)}
                onBlur={() => handleBlur('interestRate')}
                placeholder="Monthly rate"
                className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.interestRate && touched.interestRate ? 'border-destructive' : ''}`}
              />
              {touched.interestRate && <ErrorMessage error={errors.interestRate} />}
            </div>
            <div className="space-y-2">
              <Label htmlFor="paperLoanInterest" className="text-foreground">Paper Loan Interest (0-1%)</Label>
              <Input
                id="paperLoanInterest"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={formData.paperLoanInterest}
                onChange={(e) => handleChange('paperLoanInterest', e.target.value)}
                onBlur={() => handleBlur('paperLoanInterest')}
                placeholder="0-1%"
                className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${errors.paperLoanInterest && touched.paperLoanInterest ? 'border-destructive' : ''}`}
              />
              {touched.paperLoanInterest && <ErrorMessage error={errors.paperLoanInterest} />}
            </div>
          </div>

          {/* Redemption Date (only shown for redeemed records) */}
          {initialData?.status === 'Redeemed' && (
            <div className="space-y-2">
              <Label htmlFor="redeemedDate" className="text-foreground">Redemption Date *</Label>
              <Input
                id="redeemedDate"
                type="date"
                value={formData.redeemedDate}
                onChange={(e) => handleChange('redeemedDate', e.target.value)}
                onBlur={() => handleBlur('redeemedDate')}
                min={formData.pawnDate}
                className={`[color-scheme:dark] ${errors.redeemedDate && touched.redeemedDate ? 'border-destructive' : ''}`}
              />
              {touched.redeemedDate && <ErrorMessage error={errors.redeemedDate} />}
              <p className="text-sm text-muted-foreground">
                Changing the redemption date will recalculate the final interest amount.
              </p>
            </div>
          )}

          {/* Upfront Deduction Summary */}
          {formData.pawnAmount && formData.interestRate && (
            <div className="bg-gold/10 rounded-xl p-4 gold-border">
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="h-4 w-4 text-gold" />
                <span className="font-medium text-foreground">Upfront Deduction Summary</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Pawn Amount</p>
                  <p className="text-lg font-semibold text-foreground">
                    {formatCurrency(parseFloat(formData.pawnAmount) || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">1 Month Interest</p>
                  <p className="text-lg font-semibold text-gold">
                    {formatCurrency(((parseFloat(formData.pawnAmount) || 0) * (parseFloat(formData.interestRate) || 0)) / 100)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paper Loan</p>
                  <p className="text-lg font-semibold text-gold">
                    {formatCurrency(((parseFloat(formData.pawnAmount) || 0) * (parseFloat(formData.paperLoanInterest) || 0)) / 100)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deduction</p>
                  <p className="text-lg font-semibold text-gold">
                    {formatCurrency(
                      (((parseFloat(formData.pawnAmount) || 0) * (parseFloat(formData.interestRate) || 0)) / 100) +
                      (((parseFloat(formData.pawnAmount) || 0) * (parseFloat(formData.paperLoanInterest) || 0)) / 100)
                    )}
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-2">
                  <p className="text-sm text-muted-foreground">Amount to Give</p>
                  <p className="text-xl font-bold gradient-gold-text">
                    {formatCurrency(
                      (parseFloat(formData.pawnAmount) || 0) - 
                      (((parseFloat(formData.pawnAmount) || 0) * (parseFloat(formData.interestRate) || 0)) / 100) -
                      (((parseFloat(formData.pawnAmount) || 0) * (parseFloat(formData.paperLoanInterest) || 0)) / 100)
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Storage Location */}
          <div className="space-y-4 p-4 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-gold" />
              <Label className="text-foreground font-medium">Storage Location</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storageLocation" className="text-foreground">Location</Label>
                <Select
                  value={formData.storageLocation}
                  onValueChange={(value: string) => {
                    setFormData({ 
                      ...formData, 
                      storageLocation: value as StorageLocation,
                      storageSerialNumber: value === 'Locker' ? '' : formData.storageSerialNumber 
                    });
                    setTouched({ ...touched, storageLocation: true });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage location" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc === 'Locker' ? 'Locker (L)' : loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(formData.storageLocation === 'GRS' || formData.storageLocation === 'Bank') && (
                <div className="space-y-2">
                  <Label htmlFor="storageSerialNumber" className="text-foreground">
                    Storage Serial Number *
                  </Label>
                  <Input
                    id="storageSerialNumber"
                    value={formData.storageSerialNumber}
                    onChange={(e) => handleChange('storageSerialNumber', e.target.value)}
                    onBlur={() => handleBlur('storageSerialNumber')}
                    placeholder={`Enter ${formData.storageLocation} serial number`}
                    className={errors.storageSerialNumber && touched.storageSerialNumber ? 'border-destructive' : ''}
                  />
                  {touched.storageSerialNumber && <ErrorMessage error={errors.storageSerialNumber} />}
                </div>
              )}
            </div>
            {formData.storageLocation === 'Locker' && (
              <p className="text-sm text-muted-foreground">No serial number required for Locker storage.</p>
            )}
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
