// SIMPLE PARTNER REGISTRATION - SellerCloudX
// Fast onboarding - Admin activates later

import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Rocket, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

export default function PartnerRegistration() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    businessName: '',
    agreeToTerms: false
  });

  const registrationMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          businessCategory: 'general',
          monthlyRevenue: '0',
          notes: ''
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "✅ Muvaffaqiyatli!",
        description: "Admin tez orada tasdiqlab, platformaga kirish beradi.",
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Xatolik",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      toast({
        title: "Shartlarni qabul qiling",
        variant: "destructive"
      });
      return;
    }
    registrationMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-purple-300">
        <CardHeader className="text-center pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-9 h-9 text-white" />
          </div>
          <CardTitle className="text-3xl font-black">SellerCloudX ga Qo'shiling!</CardTitle>
          <p className="text-white/90 mt-2">2 daqiqada ro'yxatdan o'ting - Admin tasdiqlab platformaga kirish beradi</p>
        </CardHeader>
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                Shaxsiy Ma'lumotlar
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Ism *</Label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                    placeholder="Rustam"
                  />
                </div>
                <div>
                  <Label>Familiya *</Label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                    placeholder="Karimov"
                  />
                </div>
              </div>
              
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="rustam@example.uz"
                />
              </div>
              
              <div>
                <Label>Telefon *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  placeholder="+998901234567"
                />
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                Akkaunt Ma'lumotlari
              </h3>
              
              <div>
                <Label>Username *</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  placeholder="rustam_seller"
                />
              </div>
              
              <div>
                <Label>Parol *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  placeholder="Minimal 6 belgi"
                  minLength={6}
                />
              </div>
              
              <div>
                <Label>Biznes Nomi *</Label>
                <Input
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  required
                  placeholder="ElectroMart UZ"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Checkbox
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                id="terms"
              />
              <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                Men <span className="font-bold">Shartlar va Qoidalar</span> bilan tanishdim va roziman.
                Admin tasdiqlagandan keyin platformaga kirishim mumkin bo'ladi.
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!formData.agreeToTerms || registrationMutation.isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
            >
              {registrationMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Yuborilmoqda...
                </div>
              ) : (
                <>
                  <Rocket className="w-5 h-5 mr-2" />
                  Ro'yxatdan O'tish
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Allaqachon akkauntingiz bormi?{' '}
              <button
                onClick={() => setLocation('/')}
                className="text-blue-600 font-semibold hover:underline"
              >
                Kirish
              </button>
            </p>
          </div>
          
          {/* Info Box */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-300">
            <p className="text-sm text-gray-700 text-center">
              <CheckCircle className="w-4 h-4 inline mr-1 text-green-600" />
              Yuridik ma'lumotlar, tarif tanlash va to'liq aktivatsiya admin tomonidan amalga oshiriladi
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
