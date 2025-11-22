import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { 
  CheckCircle, 
  Clock, 
  Edit3, 
  Save, 
  X, 
  User, 
  Building, 
  CreditCard,
  Crown,
  Shield,
  Mail,
  Phone
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { TierSelectionModal } from '@/components/TierSelectionModal';

interface PartnerData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  businessName: string;
  businessCategory: string;
  monthlyRevenue: string;
  notes: string;
  pricingTier: string;
  bankAccount?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function PartnerActivation() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showTierModal, setShowTierModal] = useState(false);
  const [formData, setFormData] = useState<Partial<PartnerData>>({});
  const queryClient = useQueryClient();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/partner-dashboard');
    }
  }, [user, setLocation]);

  const { data: partnerData, isLoading } = useQuery<PartnerData>({
    queryKey: ['/api/partners/me'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/partners/me');
      return response.json();
    },
    enabled: !!user && user.role === 'partner',
  });

  const updatePartnerMutation = useMutation({
    mutationFn: async (data: Partial<PartnerData>) => {
      console.log('🚀 Updating partner data:', data);
      const response = await apiRequest('PUT', '/api/partners/me', data);
      const result = await response.json();
      console.log('✅ Partner update response:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('🎉 Partner update successful:', data);
      toast({
        title: "Ma'lumotlar yangilandi!",
        description: "Sizning ma'lumotlaringiz muvaffaqiyatli yangilandi.",
      });
      setEditingSection(null);
      queryClient.invalidateQueries({ queryKey: ['/api/partners/me'] });
    },
    onError: (error: Error) => {
      console.error('❌ Partner update error:', error);
      toast({
        title: "Xatolik",
        description: error.message || "Ma'lumotlarni yangilashda xatolik",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (section: string) => {
    setEditingSection(section);
    setFormData(partnerData || {});
  };

  const handleSave = (section: string) => {
    const updateData: Partial<PartnerData> = {};
    
    if (section === 'personal') {
      updateData.firstName = formData.firstName;
      updateData.lastName = formData.lastName;
      updateData.email = formData.email;
      updateData.phone = formData.phone;
    } else if (section === 'business') {
      updateData.businessName = formData.businessName;
      updateData.businessCategory = formData.businessCategory;
      updateData.monthlyRevenue = formData.monthlyRevenue;
      updateData.notes = formData.notes;
    } else if (section === 'banking') {
      updateData.bankAccount = formData.bankAccount;
    }

    updatePartnerMutation.mutate(updateData);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setFormData({});
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-accent" />;
      case 'rejected':
        return <X className="h-6 w-6 text-destructive" />;
      default:
        return <Clock className="h-6 w-6 text-primary" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Tasdiqlangan';
      case 'rejected':
        return 'Rad etilgan';
      default:
        return 'Kutilmoqda';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Ma'lumotlar yuklanmoqda...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!partnerData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Ma'lumot topilmadi</h2>
              <p className="text-muted-foreground mb-6">
                Hamkor ma'lumotlari topilmadi. Iltimos, avval ro'yxatdan o'ting.
              </p>
              <Button onClick={() => setLocation('/partner-registration')} variant="premium">
                Ro'yxatdan o'tish
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 gradient-business rounded-2xl shadow-business">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient-business">
                  Hamkor Profili
                </h1>
                <p className="text-muted-foreground mt-2">
                  Ma'lumotlaringizni ko'ring va tahrirlang
                </p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center justify-center gap-3">
              {getStatusIcon(partnerData.status)}
              <Badge className={`text-lg px-6 py-2 ${getStatusColor(partnerData.status)}`}>
                Holat: {getStatusText(partnerData.status)}
              </Badge>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Personal Information */}
            <Card className="shadow-elegant hover-lift animate-slide-up">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 gradient-primary rounded-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    Shaxsiy Ma'lumotlar
                  </CardTitle>
                  {editingSection !== 'personal' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit('personal')}
                      className="hover:bg-primary/10"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingSection === 'personal' ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Ism</Label>
                        <Input
                          value={formData.firstName || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Familiya</Label>
                        <Input
                          value={formData.lastName || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Telefon</Label>
                      <Input
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleSave('personal')}
                        disabled={updatePartnerMutation.isPending}
                        variant="success"
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{partnerData.firstName} {partnerData.lastName}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{partnerData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{partnerData.phone}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card className="shadow-elegant hover-lift animate-slide-up">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 gradient-secondary rounded-lg">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    Biznes Ma'lumotlari
                  </CardTitle>
                  {editingSection !== 'business' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit('business')}
                      className="hover:bg-secondary/10"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingSection === 'business' ? (
                  <>
                    <div>
                      <Label>Biznes Nomi</Label>
                      <Input
                        value={formData.businessName || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Kategoriya</Label>
                      <Select
                        value={formData.businessCategory || ''}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, businessCategory: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
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
                      <Label>Oylik Aylanma</Label>
                      <Select
                        value={formData.monthlyRevenue || ''}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, monthlyRevenue: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5000000">1-10 million so'm</SelectItem>
                          <SelectItem value="25000000">10-50 million so'm</SelectItem>
                          <SelectItem value="75000000">50-100 million so'm</SelectItem>
                          <SelectItem value="200000000">100+ million so'm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Qo'shimcha Ma'lumot</Label>
                      <Textarea
                        value={formData.notes || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleSave('business')}
                        disabled={updatePartnerMutation.isPending}
                        variant="success"
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20">
                      <h4 className="font-semibold text-secondary mb-2">Biznes Nomi</h4>
                      <p className="text-lg font-medium">{partnerData.businessName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Kategoriya</p>
                        <p className="font-medium">{partnerData.businessCategory}</p>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Oylik Aylanma</p>
                        <p className="font-medium">
                          {partnerData.monthlyRevenue === '5000000' && '1-10 million'}
                          {partnerData.monthlyRevenue === '25000000' && '10-50 million'}
                          {partnerData.monthlyRevenue === '75000000' && '50-100 million'}
                          {partnerData.monthlyRevenue === '200000000' && '100+ million'}
                          {' so\'m'}
                        </p>
                      </div>
                    </div>
                    {partnerData.notes && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Qo'shimcha Ma'lumot</p>
                        <p className="mt-1">{partnerData.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tier Information */}
            <Card className="shadow-elegant hover-lift animate-slide-up">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 gradient-business rounded-lg">
                    <Crown className="h-5 w-5 text-white" />
                  </div>
                  Tarif Ma'lumotlari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 gradient-business/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-primary">Hozirgi Tarif</h4>
                    <Badge variant="secondary" className="text-sm">
                      {partnerData.pricingTier === 'starter_pro' && 'Starter Pro'}
                      {partnerData.pricingTier === 'business_standard' && 'Business Standard'}
                      {partnerData.pricingTier === 'professional_plus' && 'Professional Plus'}
                      {partnerData.pricingTier === 'enterprise_elite' && 'Enterprise Elite'}
                    </Badge>
                  </div>
                  <Button
                    onClick={() => setShowTierModal(true)}
                    variant="premium"
                    className="w-full"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Tarifni Yangilash
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Banking Information */}
            <Card className="shadow-elegant hover-lift animate-slide-up">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 gradient-success rounded-lg">
                      <CreditCard className="h-5 w-5 text-white" />
                    </div>
                    Bank Ma'lumotlari
                  </CardTitle>
                  {editingSection !== 'banking' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit('banking')}
                      className="hover:bg-accent/10"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingSection === 'banking' ? (
                  <>
                    <div>
                      <Label>Bank Hisob Raqami</Label>
                      <Input
                        value={formData.bankAccount || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
                        placeholder="Bank hisob raqamingizni kiriting"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => handleSave('banking')}
                        disabled={updatePartnerMutation.isPending}
                        variant="success"
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Saqlash
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        Bekor qilish
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    {partnerData.bankAccount ? (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Bank Hisob Raqami</p>
                        <p className="font-mono text-lg">{partnerData.bankAccount}</p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Bank hisob raqami kiritilmagan</p>
                        <Button
                          onClick={() => handleEdit('banking')}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          Qo'shish
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="text-center mt-12">
            <Button
              onClick={() => setLocation('/partner-dashboard')}
              variant="outline"
              size="lg"
              className="min-w-[200px]"
            >
              Dashboard ga qaytish
            </Button>
          </div>
        </div>
      </div>

      {/* Tier Selection Modal */}
      <TierSelectionModal
        isOpen={showTierModal}
        onClose={() => setShowTierModal(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/partners/me'] });
          setShowTierModal(false);
        }}
        currentTier={partnerData.pricingTier}
      />
    </div>
  );
}