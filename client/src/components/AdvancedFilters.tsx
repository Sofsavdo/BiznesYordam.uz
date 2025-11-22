import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar as CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

export interface FilterOptions {
  dateFrom?: Date;
  dateTo?: Date;
  marketplace?: string;
  category?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  searchTerm?: string;
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  marketplaces?: string[];
  categories?: string[];
  statuses?: string[];
}

export function AdvancedFilters({
  onFilterChange,
  marketplaces = ['uzum', 'wildberries', 'yandex', 'ozon'],
  categories = [],
  statuses = ['pending', 'approved', 'completed', 'cancelled'],
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  const marketplaceNames: Record<string, string> = {
    uzum: 'Uzum Market',
    wildberries: 'Wildberries',
    yandex: 'Yandex Market',
    ozon: 'Ozon',
  };

  const statusNames: Record<string, string> = {
    pending: 'Kutilmoqda',
    approved: 'Tasdiqlangan',
    completed: 'Yakunlangan',
    cancelled: 'Bekor qilingan',
    in_progress: 'Jarayonda',
  };

  return (
    <div className="space-y-4">
      {/* Quick Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Qidirish..."
            value={filters.searchTerm || ''}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="pl-10"
          />
        </div>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filtrlar
              {activeFiltersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="end">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Kengaytirilgan Filtrlar</CardTitle>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-2"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Tozalash
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Sana Oralig'i</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateFrom ? format(filters.dateFrom, 'PPP', { locale: uz }) : 'Dan'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateFrom}
                          onSelect={(date) => updateFilter('dateFrom', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateTo ? format(filters.dateTo, 'PPP', { locale: uz }) : 'Gacha'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateTo}
                          onSelect={(date) => updateFilter('dateTo', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Marketplace */}
                {marketplaces.length > 0 && (
                  <div className="space-y-2">
                    <Label>Marketplace</Label>
                    <Select
                      value={filters.marketplace || ''}
                      onValueChange={(value) => updateFilter('marketplace', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Barchasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Barchasi</SelectItem>
                        {marketplaces.map((mp) => (
                          <SelectItem key={mp} value={mp}>
                            {marketplaceNames[mp] || mp}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Category */}
                {categories.length > 0 && (
                  <div className="space-y-2">
                    <Label>Kategoriya</Label>
                    <Select
                      value={filters.category || ''}
                      onValueChange={(value) => updateFilter('category', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Barchasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Barchasi</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Status */}
                {statuses.length > 0 && (
                  <div className="space-y-2">
                    <Label>Holat</Label>
                    <Select
                      value={filters.status || ''}
                      onValueChange={(value) => updateFilter('status', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Barchasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Barchasi</SelectItem>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {statusNames[status] || status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Amount Range */}
                <div className="space-y-2">
                  <Label>Summa Oralig'i (so'm)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount || ''}
                      onChange={(e) => updateFilter('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount || ''}
                      onChange={(e) => updateFilter('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setIsOpen(false)}
                  className="w-full"
                >
                  Qo'llash
                </Button>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Qidiruv: {filters.searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('searchTerm', undefined)}
              />
            </Badge>
          )}
          {filters.dateFrom && (
            <Badge variant="secondary" className="gap-1">
              Dan: {format(filters.dateFrom, 'dd.MM.yyyy')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('dateFrom', undefined)}
              />
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="gap-1">
              Gacha: {format(filters.dateTo, 'dd.MM.yyyy')}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('dateTo', undefined)}
              />
            </Badge>
          )}
          {filters.marketplace && (
            <Badge variant="secondary" className="gap-1">
              {marketplaceNames[filters.marketplace]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('marketplace', undefined)}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              {filters.category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('category', undefined)}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary" className="gap-1">
              {statusNames[filters.status]}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => updateFilter('status', undefined)}
              />
            </Badge>
          )}
          {(filters.minAmount || filters.maxAmount) && (
            <Badge variant="secondary" className="gap-1">
              {filters.minAmount || 0} - {filters.maxAmount || '∞'} so'm
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  updateFilter('minAmount', undefined);
                  updateFilter('maxAmount', undefined);
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
