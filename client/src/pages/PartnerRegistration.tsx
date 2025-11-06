import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Navigation } from '@/components/Navigation';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  businessName: string;
  businessCategory: string;
  monthlyRevenue: string;
  notes: string;
  agreeToTerms: boolean;
}

export default function PartnerRegistration() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState<RegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    businessName: '',
    businessCategory: '',
    monthlyRevenue: '',
    notes: '',
    agreeToTerms: false
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      console.log('🚀 Registering partner with data:', data);
      const response = await apiRequest('POST', '/api/partners/register', data);
      const result = await response.json();
      console.log('✅ Registration response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Registration successful:', data);
      toast({
        title: "Muvaffaqiyatli ro'yxatdan o'tdi!",
        description: "Tez orada admin tomonidan tasdiqlash kutilmoqda.",
      });
      // Redirect to activation page to show submitted data
      setTimeout(() => {
        setLocation('/partner-activation');
      }, 2000);
    },
    onError: (error: Error) => {
      console.error('❌ Registration error:', error);
      toast({
        title: "Xatolik yuz berdi",
        description: error.message || "Ro'yxatdan o'tishda xatolik",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof RegistrationForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Shartlarga rozilik",
        description: "Foydalanish shartlari va maxfiylik siyosatiga rozilik bildirishingiz kerak",
        variant: "destructive",
      });
      return;
    }

    registrationMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button
              onClick={() => setLocation('/')}
              variant="ghost"
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Orqaga
            </Button>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Hamkor Bo'ling</h1>
              <p className="text-xl text-slate-600">
                Professional marketplace xizmatlaridan foydalanish uchun ro'yxatdan o'ting
              </p>
            </div>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Ro'yxatdan O'tish</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Shaxsiy Ma'lumotlar</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">Ism *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Ismingizni kiriting"
                        required
                        data-testid="input-firstName"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Familiya *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Familiyangizni kiriting"
                        required
                        data-testid="input-lastName"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Aloqa Ma'lumotlari</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@example.com"
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+998 90 123 45 67"
                        required
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Hisob Ma'lumotlari</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="username">Username *</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Unique username kiriting"
                        required
                        data-testid="input-username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Parol *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Xavfsiz parol kiriting"
                        required
                        data-testid="input-password"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Biznes Ma'lumotlari</h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="businessName">Biznes Nomi *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => handleInputChange('businessName', e.target.value)}
                        placeholder="Biznes nomini kiriting"
                        required
                        data-testid="input-businessName"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="businessCategory">Biznes Kategoriyasi *</Label>
                        <Select 
                          value={formData.businessCategory} 
                          onValueChange={(value) => handleInputChange('businessCategory', value)}
                        >
                          <SelectTrigger data-testid="select-businessCategory">
                            <SelectValue placeholder="Kategoriyani tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Elektronika</SelectItem>
                            <SelectItem value="clothing">Kiyim-kechak</SelectItem>
                            <SelectItem value="home">Uy jihozlari</SelectItem>
                            <SelectItem value="sports">Sport tovarlari</SelectItem>
                            <SelectItem value="beauty">Go'zallik va salomatlik</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="monthlyRevenue">Oylik Savdo Hajmi *</Label>
                        <Select 
                          value={formData.monthlyRevenue} 
                          onValueChange={(value) => handleInputChange('monthlyRevenue', value)}
                        >
                          <SelectTrigger data-testid="select-monthlyRevenue">
                            <SelectValue placeholder="Hajmni tanlang" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5000000">1-10 million so'm</SelectItem>
                            <SelectItem value="25000000">10-50 million so'm</SelectItem>
                            <SelectItem value="75000000">50-100 million so'm</SelectItem>
                            <SelectItem value="200000000">100+ million so'm</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Qo'shimcha Ma'lumot</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Biznes haqida qo'shimcha ma'lumot..."
                        rows={4}
                        data-testid="textarea-notes"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    className="mt-1"
                    data-testid="checkbox-terms"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-slate-700 leading-relaxed">
                    Men <a href="#" className="text-primary hover:underline">foydalanish shartlari</a> va{' '}
                    <a href="#" className="text-primary hover:underline">maxfiylik siyosati</a>ga roziman.
                    Shuningdek, admin tomonidan tasdiqlanishini kutishga roziman.
                  </Label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white py-3 transform hover:scale-105 transition-all"
                  disabled={!formData.agreeToTerms || registrationMutation.isPending}
                  data-testid="button-submit"
                >
                  {registrationMutation.isPending ? 'Yuborilmoqda...' : "Ro'yxatdan O'tish"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Already have account */}
          <div className="text-center mt-8">
            <p className="text-slate-600">
              Allaqachon hamkor bo'lganmisiz?{' '}
              <button
                onClick={() => setLocation('/partner-dashboard')}
                className="text-primary hover:underline font-medium"
              >
                Kirish
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
