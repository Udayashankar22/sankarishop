import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PawnRecord, StorageLocation } from '@/types/pawn';
import { X, MapPin } from 'lucide-react';
import { formatDate } from '@/lib/pawnCalculations';

const storageLocations: StorageLocation[] = ['Locker', 'GRS', 'Bank'];

interface StorageLocationModalProps {
  record: PawnRecord;
  onSubmit: (id: string, storageLocation: StorageLocation | undefined, storageSerialNumber: string | undefined) => void;
  onClose: () => void;
}

export function StorageLocationModal({ record, onSubmit, onClose }: StorageLocationModalProps) {
  const [storageLocation, setStorageLocation] = useState<StorageLocation | ''>(record.storageLocation || '');
  const [storageSerialNumber, setStorageSerialNumber] = useState(record.storageSerialNumber || '');
  const [error, setError] = useState<string | undefined>();

  const daysSincePawn = Math.floor(
    (new Date().getTime() - new Date(record.pawnDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((storageLocation === 'GRS' || storageLocation === 'Bank') && !storageSerialNumber.trim()) {
      setError('Storage serial number is required for GRS/Bank');
      return;
    }

    onSubmit(
      record.id,
      storageLocation || undefined,
      storageLocation === 'Locker' ? undefined : storageSerialNumber.trim() || undefined
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card rounded-2xl p-6 w-full max-w-md gold-border animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gold/20 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-gold" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">
                Update Storage Location
              </h2>
              <p className="text-sm text-muted-foreground">
                {record.name} • {record.serialNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Pawn Info */}
        <div className="mb-6 p-4 rounded-lg bg-secondary/30 border border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Pawn Date</p>
              <p className="font-medium text-foreground">{formatDate(record.pawnDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Days Since Pawn</p>
              <p className="font-medium text-foreground">{daysSincePawn} days</p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Location</p>
              <p className="font-medium text-foreground">
                {record.storageLocation ? (
                  <>
                    {record.storageLocation === 'Locker' ? 'Locker (L)' : record.storageLocation}
                    {record.storageSerialNumber && ` - ${record.storageSerialNumber}`}
                  </>
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Jewellery</p>
              <p className="font-medium text-foreground">{record.jewelleryType}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="storageLocation" className="text-foreground">Storage Location</Label>
            <Select
              value={storageLocation}
              onValueChange={(value: string) => {
                setStorageLocation(value as StorageLocation);
                if (value === 'Locker') {
                  setStorageSerialNumber('');
                  setError(undefined);
                }
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

          {(storageLocation === 'GRS' || storageLocation === 'Bank') && (
            <div className="space-y-2">
              <Label htmlFor="storageSerialNumber" className="text-foreground">
                Storage Serial Number *
              </Label>
              <Input
                id="storageSerialNumber"
                value={storageSerialNumber}
                onChange={(e) => {
                  setStorageSerialNumber(e.target.value);
                  setError(undefined);
                }}
                placeholder={`Enter ${storageLocation} serial number`}
                className={error ? 'border-destructive' : ''}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}

          {storageLocation === 'Locker' && (
            <p className="text-sm text-muted-foreground">
              No serial number required for Locker storage.
            </p>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="gold" className="flex-1">
              Update Storage
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}