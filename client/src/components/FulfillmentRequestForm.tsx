import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Upload, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FulfillmentRequestFormProps {
  products: Array<{ id: string; name: string; }>;
}

export function FulfillmentRequestForm({ products }: FulfillmentRequestFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    characteristics: '',
    quantity: '',
    costPrice: '',
    category: '',
    description: '',
    priority: 'medium',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const requestData = {
        requestType: 'product_preparation',
        title: `${data.productName} - Fulfillmentga Topshirish So'rovi`,
        description: `Mahsulot: ${data.productName}\nHususiyatlari: ${data.characteristics}\nSoni: ${data.quantity} dona\nTannarx: ${data.costPrice} UZS\nKategoriya: ${data.category}\n\nQo'shimcha ma'lumot: ${data.description}`,
        priority: data.priority,
        estimatedCost: data.costPrice,
        metadata: {
          productDetails: {
            name: data.productName,
            characteristics: data.characteristics,
            quantity: parseInt(data.quantity),
            costPrice: parseFloat(data.costPrice),
            category: data.category,
            hasImage: !!imageFile
          }
        }
      };
      
      return await apiRequest('POST', '/api/fulfillment-requests', requestData);
    },
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyat!",
        description: "Fulfillment so'rovi yuborildi. Admin tomonidan ko'rib chiqiladi.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/fulfillment-requests'] });
      resetForm();
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Xatolik!",
        description: error.message || "So'rov yaratishda xatolik yuz berdi.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      productName: '',
      characteristics: '',
      quantity: '',
      costPrice: '',
      category: '',
      description: '',
      priority: 'medium',
    });
    setImageFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName.trim() || !formData.characteristics.trim() || 
        !formData.quantity || !formData.costPrice || !formData.category) {
      toast({
        title: "Xatolik!",
        description: "Barcha majburiy maydonlarni to'ldiring.",
        variant: "destructive",
      });
      return;
    }

    createRequestMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-new-request">
          <Plus className="w-4 h-4 mr-2" />
          Fulfillmentga So'rov Yuborish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Mahsulot Fulfillmentga Topshirish So'rovi
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 mt-2">
            Mahsulotingizni fulfillmentga topshirish uchun barcha ma'lumotlarni to'ldiring. 
            Fulfillment jamoasi mahsulotingizni qabul qilib, marketplace tayyorlashdan boshlab barcha jarayonlarni amalga oshiradi.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="productName" className="text-sm font-medium">
              Mahsulot Nomi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              placeholder="Masalan: iPhone 15 Pro Max 256GB"
              data-testid="input-product-name"
              className="w-full"
            />
          </div>

          {/* Characteristics */}
          <div className="space-y-2">
            <Label htmlFor="characteristics" className="text-sm font-medium">
              Mahsulot Hususiyatlari <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="characteristics"
              value={formData.characteristics}
              onChange={(e) => handleInputChange('characteristics', e.target.value)}
              placeholder="Masalan: Rang: Titanium Blue, Xotira: 256GB, Ekran: 6.7 dyuym, Kamera: 48MP, Batareya: 4441mAh"
              rows={3}
              data-testid="textarea-characteristics"
            />
            <p className="text-xs text-slate-500">
              Mahsulotning barcha muhim xususiyatlarini kiriting (rang, o'lchami, texnik ko'rsatkichlar va boshqalar)
            </p>
          </div>

          {/* Quantity and Cost Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium">
                Miqdori (dona) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="10"
                data-testid="input-quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice" className="text-sm font-medium">
                Tannarx (UZS) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="costPrice"
                type="number"
                min="0"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                placeholder="15000000"
                data-testid="input-cost-price"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Kategoriya <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Mahsulot kategoriyasini tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">📱 Elektronika</SelectItem>
                <SelectItem value="clothing">👕 Kiyim va poyabzal</SelectItem>
                <SelectItem value="home">🏠 Uy va bog'</SelectItem>
                <SelectItem value="beauty">💄 Go'zallik va salomatlik</SelectItem>
                <SelectItem value="sports">⚽ Sport va faol dam olish</SelectItem>
                <SelectItem value="books">📚 Kitoblar</SelectItem>
                <SelectItem value="toys">🧸 O'yinchoqlar va bolalar buyumlari</SelectItem>
                <SelectItem value="automotive">🚗 Avtomobil tovar va aksessuarlar</SelectItem>
                <SelectItem value="food">🍎 Oziq-ovqat mahsulotlari</SelectItem>
                <SelectItem value="other">📦 Boshqa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Mahsulot Rasmi</Label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                data-testid="input-image"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-3">
                  {imageFile ? (
                    <>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                      <span className="text-sm font-medium text-green-700">{imageFile.name}</span>
                      <span className="text-xs text-slate-500">Rasmni o'zgartirish uchun bosing</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">Mahsulot rasmini yuklang</span>
                      <span className="text-xs text-slate-500">PNG, JPG yoki JPEG formatida (maksimal 5MB)</span>
                    </>
                  )}
                </div>
              </Label>
            </div>
          </div>

          {/* Additional Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Qo'shimcha Ma'lumot
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Maxsus talablar, qadoqlash ko'rsatmalari, muhim eslatmalar va boshqa zarur ma'lumotlar..."
              rows={3}
              data-testid="textarea-description"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">
              Muhimlik Darajasi
            </Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger data-testid="select-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Past - Odatiy jarayon (7-10 kun)</SelectItem>
                <SelectItem value="medium">🟡 O'rta - Standart (5-7 kun)</SelectItem>
                <SelectItem value="high">🟠 Yuqori - Tezroq qayta ishlash (3-5 kun)</SelectItem>
                <SelectItem value="urgent">🔴 Shoshilinch - 1-2 kun ichida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              data-testid="button-cancel"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              disabled={createRequestMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-submit"
            >
              {createRequestMutation.isPending ? 'Yuborilmoqda...' : "So'rov Yuborish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
