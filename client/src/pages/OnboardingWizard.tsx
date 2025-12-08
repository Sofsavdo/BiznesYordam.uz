// ONBOARDING WIZARD - Partner Initial Setup
// Step-by-step guided setup (30-60 minutes one-time)

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle2,
  Circle,
  Building,
  Globe,
  Key,
  TestTube,
  Settings,
  Warehouse,
  Package,
  Sparkles,
  GraduationCap,
  CheckCheck,
  ArrowRight,
  ArrowLeft,
  Loader2
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  required: boolean;
  completed: boolean;
}

const steps: OnboardingStep[] = [
  { id: "business_info", title: "Biznes Ma'lumotlari", description: "Kompaniya haqida", icon: Building, required: true, completed: false },
  { id: "marketplace_selection", title: "Marketplace", description: "Platformalar tanlash", icon: Globe, required: true, completed: false },
  { id: "marketplace_credentials", title: "Kirish Ma'lumotlari", description: "API yoki login/parol", icon: Key, required: true, completed: false },
  { id: "test_connection", title: "Test", description: "Ulanishni tekshirish", icon: TestTube, required: true, completed: false },
  { id: "ai_settings", title: "AI Sozlamalari", description: "Avtomatlashtirish", icon: Settings, required: true, completed: false },
  { id: 'warehouse_setup', title: 'Ombor', description: 'Sklad sozlash', icon: Warehouse, required: true, completed: false },
  { id: 'initial_products', title: 'Mahsulotlar', description: 'Dastlabki mahsulotlar', icon: Package, required: false, completed: false },
  { id: 'automation_test', title: 'AI Test', description: 'Avtomatlashtirish test', icon: Sparkles, required: true, completed: false },
  { id: 'training', title: 'O\'qitish', description: 'Platform ko\'rsatmasi', icon: GraduationCap, required: false, completed: false },
  { id: 'final_review', title: 'Yakuniy', description: 'Tasdiq va faollashtirish', icon: CheckCheck, required: true, completed: false },
];

export default function OnboardingWizard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepsState, setStepsState] = useState(steps);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async (data: { stepId: string; data: any }) => {
      const res = await fetch('/api/onboarding/complete-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to complete step');
      }
      return res.json();
    },
    onSuccess: (data) => {
      // Mark current step as completed
      const updatedSteps = [...stepsState];
      updatedSteps[currentStep].completed = true;
      setStepsState(updatedSteps);

      toast({
        title: '✅ Bosqich yakunlandi',
        description: steps[currentStep].title,
      });

      // Move to next step
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    },
    onError: (error: any) => {
      toast({
        title: '❌ Xatolik',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const currentStepData = stepsState[currentStep];
  const progress = ((currentStep + 1) / stepsState.length) * 100;
  const Icon = currentStepData.icon;

  const handleNext = () => {
    const stepData = formData[currentStepData.id] || {};
    
    completeStepMutation.mutate({
      stepId: currentStepData.id,
      data: stepData,
    });
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (!currentStepData.required) {
      setCurrentStep(currentStep + 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case 'business_info':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Biznes nomi *</label>
              <Input
                value={formData.business_info?.businessName || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  business_info: { ...formData.business_info, businessName: e.target.value }
                })}
                placeholder="Mening Kompaniyam"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">INN *</label>
              <Input
                value={formData.business_info?.inn || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  business_info: { ...formData.business_info, inn: e.target.value }
                })}
                placeholder="123456789"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Manzil *</label>
              <Input
                value={formData.business_info?.address || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  business_info: { ...formData.business_info, address: e.target.value }
                })}
                placeholder="Toshkent, Amir Temur ko'chasi"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Telefon *</label>
              <Input
                value={formData.business_info?.phone || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  business_info: { ...formData.business_info, phone: e.target.value }
                })}
                placeholder="+998 90 123 45 67"
              />
            </div>
          </div>
        );

      case 'marketplace_selection':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Qaysi marketplacelarda ishlaysiz? (Bir nechta tanlash mumkin)
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['uzum', 'wildberries', 'yandex', 'ozon'].map((mp) => (
                <Card
                  key={mp}
                  className={`cursor-pointer border-2 transition-all ${
                    formData.marketplace_selection?.marketplaces?.includes(mp)
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    const current = formData.marketplace_selection?.marketplaces || [];
                    const updated = current.includes(mp)
                      ? current.filter((m: string) => m !== mp)
                      : [...current, mp];
                    setFormData({
                      ...formData,
                      marketplace_selection: { marketplaces: updated }
                    });
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {mp[0].toUpperCase()}
                    </div>
                    <h3 className="font-semibold capitalize">{mp}</h3>
                    {formData.marketplace_selection?.marketplaces?.includes(mp) && (
                      <CheckCircle2 className="w-5 h-5 mx-auto mt-2 text-blue-600" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'marketplace_credentials':
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Tanlagan marketplacelar uchun kirish ma'lumotlarini kiriting
            </p>
            {(formData.marketplace_selection?.marketplaces || []).map((mp: string) => (
              <Card key={mp}>
                <CardHeader>
                  <CardTitle className="capitalize">{mp}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">API Key (tavsiya etiladi)</label>
                    <Input
                      type="password"
                      placeholder="API Key"
                      value={formData.marketplace_credentials?.[mp]?.apiKey || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        marketplace_credentials: {
                          ...formData.marketplace_credentials,
                          [mp]: { ...formData.marketplace_credentials?.[mp], apiKey: e.target.value }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Login/Email</label>
                    <Input
                      placeholder="Login yoki Email"
                      value={formData.marketplace_credentials?.[mp]?.username || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        marketplace_credentials: {
                          ...formData.marketplace_credentials,
                          [mp]: { ...formData.marketplace_credentials?.[mp], username: e.target.value }
                        }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Parol</label>
                    <Input
                      type="password"
                      placeholder="Parol"
                      value={formData.marketplace_credentials?.[mp]?.password || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        marketplace_credentials: {
                          ...formData.marketplace_credentials,
                          [mp]: { ...formData.marketplace_credentials?.[mp], password: e.target.value }
                        }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'test_connection':
        return (
          <div className="text-center py-12">
            {completeStepMutation.isPending ? (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
                <h3 className="text-lg font-semibold mb-2">Ulanish tekshirilmoqda...</h3>
                <p className="text-muted-foreground">Bu bir necha soniya davom etishi mumkin</p>
              </>
            ) : (
              <>
                <TestTube className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold mb-2">Testga tayyor</h3>
                <p className="text-muted-foreground mb-4">
                  "Davom etish" tugmasini bosing va biz barcha ulanishlarni tekshiramiz
                </p>
              </>
            )}
          </div>
        );

      case 'ai_settings':
        return (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Avtomatlashtirish darajasi</label>
              <Select
                value={formData.ai_settings?.automationLevel || ''}
                onValueChange={(value) => setFormData({
                  ...formData,
                  ai_settings: { ...formData.ai_settings, automationLevel: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal (AI taklif qiladi, siz tasdiqlaysiz)</SelectItem>
                  <SelectItem value="balanced">Balansli (AI yaratadi, siz ko'rib chiqasiz)</SelectItem>
                  <SelectItem value="maximum">Maksimal (AI to'liq avtomatik)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Oylik AI budget limiti ($)</label>
              <Input
                type="number"
                value={formData.ai_settings?.monthlyLimit || '10'}
                onChange={(e) => setFormData({
                  ...formData,
                  ai_settings: { ...formData.ai_settings, monthlyLimit: e.target.value }
                })}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tavsiya: $10-20 (100-200 mahsulot/oy)
              </p>
            </div>
          </div>
        );

      case 'warehouse_setup':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Ombor joylashuvi</label>
              <Input
                value={formData.warehouse_setup?.location || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  warehouse_setup: { ...formData.warehouse_setup, location: e.target.value }
                })}
                placeholder="Toshkent"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Ombor hajmi (kg)</label>
              <Input
                type="number"
                value={formData.warehouse_setup?.capacity || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  warehouse_setup: { ...formData.warehouse_setup, capacity: e.target.value }
                })}
                placeholder="1000"
              />
            </div>
          </div>
        );

      case 'automation_test':
        return (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Keling, AI bilan birinchi mahsulot kartochkasini yaratib ko'ramiz!
            </p>
            <div>
              <label className="text-sm font-medium mb-2 block">Mahsulot nomi</label>
              <Input
                value={formData.automation_test?.productName || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  automation_test: { ...formData.automation_test, productName: e.target.value }
                })}
                placeholder="Masalan: Smart Watch Pro"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Kategoriya</label>
              <Select
                value={formData.automation_test?.category || ''}
                onValueChange={(value) => setFormData({
                  ...formData,
                  automation_test: { ...formData.automation_test, category: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'final_review':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-center mb-2">Hammasi tayyor!</h3>
              <p className="text-center text-muted-foreground">
                Barcha sozlamalar muvaffaqiyatli yakunlandi
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">Yakuniy ko'rib chiqish:</h4>
                <div className="space-y-2 text-sm">
                  {stepsState.filter(s => s.completed).map((step) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>{step.title}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-lg font-medium mb-2">
                Platformadan foydalanishga tayyorsiz!
              </p>
              <p className="text-muted-foreground">
                "Faollashtirish" tugmasini bosib, dashboard ga o'ting
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Bu bosqich hali ishlanmoqda...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🚀 Platformaga Xush Kelibsiz!
          </h1>
          <p className="text-muted-foreground">
            Keling, platformani sozlash bilan boshlaymiz (30-60 minut)
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Bosqich {currentStep + 1} / {stepsState.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% bajarildi
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
          {stepsState.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = step.completed;
            const isPast = index < currentStep;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center min-w-[80px] ${
                  isActive ? 'scale-110' : 'scale-90'
                } transition-transform`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>
                <span className={`text-xs text-center ${isActive ? 'font-semibold' : ''}`}>
                  {step.title}
                </span>
                {!step.required && (
                  <span className="text-xs text-muted-foreground">(opsional)</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>{currentStepData.title}</CardTitle>
                <CardDescription>{currentStepData.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0 || completeStepMutation.isPending}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Orqaga
          </Button>

          <div className="flex items-center gap-2">
            {!currentStepData.required && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={completeStepMutation.isPending}
              >
                O'tkazib yuborish
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={completeStepMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {completeStepMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Jarayonda...
                </>
              ) : currentStep === stepsState.length - 1 ? (
                <>
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Faollashtirish
                </>
              ) : (
                <>
                  Davom etish
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
