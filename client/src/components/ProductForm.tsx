import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  products?: Array<{ id: string; name: string; }>;
}

export function ProductForm({ products = [] }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    costPrice: '',
    sku: '',
    barcode: '',
    weight: '',
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest('POST', '/api/products', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Mahsulot yaratildi",
        description: "Mahsulot muvaffaqiyatli yaratildi",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsOpen(false);
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        costPrice: '',
        sku: '',
        barcode: '',
        weight: '',
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90" data-testid="button-new-product">
          <Plus className="w-4 h-4 mr-2" />
          Yangi Mahsulot
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-accent" />
            Yangi Mahsulot Qo'shish
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Mahsulot Nomi</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Mahsulot nomini kiriting"
              required
              data-testid="input-name"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Kategoriya</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger data-testid="select-category">
                  <SelectValue placeholder="Kategoriyani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Elektronika</SelectItem>
                  <SelectItem value="clothing">Kiyim-kechak</SelectItem>
                  <SelectItem value="home">Uy jihozlari</SelectItem>
                  <SelectItem value="sports">Sport tovarlari</SelectItem>
                  <SelectItem value="beauty">Go'zallik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Narx (so'm)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="Narxni kiriting"
                required
                data-testid="input-price"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Tavsif</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mahsulot haqida ma'lumot"
              rows={3}
              data-testid="textarea-description"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="costPrice">Tannarx (so'm)</Label>
              <Input
                id="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                placeholder="Tannarx"
                data-testid="input-costPrice"
              />
            </div>

            <div>
              <Label htmlFor="weight">Og'irlik (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="Og'irlik"
                data-testid="input-weight"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="SKU kodi"
                data-testid="input-sku"
              />
            </div>

            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleInputChange('barcode', e.target.value)}
                placeholder="Barcode"
                data-testid="input-barcode"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Bekor qilish
            </Button>
            <Button 
              type="submit" 
              disabled={createProductMutation.isPending}
              data-testid="button-submit"
            >
              {createProductMutation.isPending ? 'Yaratilmoqda...' : 'Mahsulot Yaratish'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
