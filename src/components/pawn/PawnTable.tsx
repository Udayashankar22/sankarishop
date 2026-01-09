import { useState } from 'react';
import { PawnRecord } from '@/types/pawn';
import { calculateInterest, formatCurrency, formatDate } from '@/lib/pawnCalculations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Filter,
  CalendarIcon,
  X,
  MapPin
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface PawnTableProps {
  records: PawnRecord[];
  onEdit: (record: PawnRecord) => void;
  onDelete: (id: string) => void;
  onRedeem: (id: string) => void;
  onEditStorage?: (record: PawnRecord) => void;
  
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PawnTable({
  records,
  onEdit,
  onDelete,
  onRedeem,
  onEditStorage,
  
  searchQuery,
  onSearchChange,
}: PawnTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const filteredRecords = records.filter((record) => {
    const matchesStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter;
    const matchesSearch = 
      record.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.phoneNumber.includes(searchQuery);
    
    // Date range filter - normalize dates to compare only date part (ignore time)
    const recordDate = new Date(record.pawnDate);
    recordDate.setHours(0, 0, 0, 0);
    
    let matchesDateRange = true;
    
    if (startDate && endDate) {
      // Both dates selected - filter between range
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesDateRange = recordDate >= start && recordDate <= end;
    } else if (startDate && !endDate) {
      // Only start date - filter exact date
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      matchesDateRange = recordDate.getTime() === start.getTime();
    } else if (!startDate && endDate) {
      // Only end date - filter exact date
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      matchesDateRange = recordDate.getTime() === end.getTime();
    }
    
    return matchesStatus && matchesSearch && matchesDateRange;
  });

  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="glass-card rounded-2xl gold-border overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by serial, name, or phone..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Range Filter */}
            <div className="flex items-center gap-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[130px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "From"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    defaultMonth={startDate || new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto bg-popover"
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">-</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[130px] justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "To"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    defaultMonth={endDate || new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto bg-popover"
                  />
                </PopoverContent>
              </Popover>
              {(startDate || endDate) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearDateFilter}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="redeemed">Redeemed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Serial No.</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Jewellery</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Interest</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Storage</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  No pawn records found
                </td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => {
                const { interestAmount, totalPayable, days, upfrontDeduction } = calculateInterest(
                  record.pawnAmount,
                  record.interestRate,
                  record.pawnDate,
                  record.redeemedDate,
                  record.paperLoanInterest
                );

                return (
                  <tr
                    key={record.id}
                    className="border-b border-border/50 hover:bg-secondary/20 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-4 py-4">
                      <span className="font-mono text-gold font-semibold">
                        {record.serialNumber}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-foreground">{record.name}</p>
                        <p className="text-sm text-muted-foreground">{record.phoneNumber}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-foreground">{record.jewelleryType}</p>
                        <p className="text-sm text-muted-foreground">{record.jewelleryWeight}g</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-foreground">{formatCurrency(record.pawnAmount)}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(record.pawnDate)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-gold">{formatCurrency(interestAmount)}</p>
                        <p className="text-sm text-muted-foreground">{days} days @ {record.interestRate}%</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {record.storageLocation ? (
                        <div 
                          className="cursor-pointer hover:bg-secondary/50 rounded p-1 -m-1 transition-colors"
                          onClick={() => onEditStorage?.(record)}
                          title="Click to edit storage location"
                        >
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gold" />
                            <span className="font-medium text-foreground">
                              {record.storageLocation === 'Locker' ? 'Locker (L)' : record.storageLocation}
                            </span>
                          </div>
                          {record.storageSerialNumber && (
                            <p className="text-sm text-muted-foreground">{record.storageSerialNumber}</p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => onEditStorage?.(record)}
                          className="text-sm text-muted-foreground hover:text-gold transition-colors"
                        >
                          + Add location
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === 'Active'
                            ? 'bg-gold/20 text-gold'
                            : 'bg-success/20 text-success'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {record.status === 'Active' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(record)}
                              className="h-8 w-8"
                              title="Edit record"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRedeem(record.id)}
                              className="h-8 w-8 text-success hover:text-success"
                              title="Redeem"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(record.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
