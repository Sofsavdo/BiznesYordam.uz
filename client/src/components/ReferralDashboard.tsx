// Referral Dashboard Widget
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Gift, Copy, Share2, TrendingUp, DollarSign, Users, CheckCircle, Clock } from 'lucide-react';

export function ReferralDashboard() {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');

  const { data: stats } = useQuery({
    queryKey: ['referral-stats'],
    queryFn: async () => {
      const res = await fetch('/api/referrals/stats', { credentials: 'include' });
      if (!res.ok) return { 
        tier: 'bronze', 
        totalReferrals: 0, 
        totalEarned: 0, 
        available: 0,
        invitedNotActivated: 0, // Taklif qilingan lekin aktivatsiya qilinmagan
        registeredNotPaid: 0, // Ro'yxatdan o'tgan lekin to'lov qilmagan
        activeReferrals: 0 // Aktiv va to'lov qilgan
      };
      return res.json();
    },
  });

  const generateCode = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/referrals/generate-code', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    onSuccess: (data) => {
      setPromoCode(data.promoCode);
      toast({ title: '✅ Promo kod yaratildi!' });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: '✅ Nusxalandi!' });
  };

  const tierIcons: any = { bronze: '🥉', silver: '🥈', gold: '🥇' };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-3">
            <Gift className="w-8 h-8 text-purple-600" />
            Referral Dasturi
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6 text-center">
            <div className="text-5xl mb-2">{tierIcons[stats?.tier || 'bronze']}</div>
            <div className="text-xl font-black">{stats?.tierName || 'Bronze'}</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-3xl font-black">{stats?.totalReferrals || 0}</div>
            <div className="text-sm text-gray-600">Referral</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <div className="text-3xl font-black">${stats?.totalEarned || 0}</div>
            <div className="text-sm text-gray-600">Daromad</div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-3xl font-black">${stats?.available || 0}</div>
            <div className="text-sm text-gray-600">Available</div>
          </CardContent>
        </Card>
      </div>

      {stats?.nextTier && (
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex justify-between mb-3">
              <span className="font-bold">Next: {stats.nextTier.toUpperCase()}</span>
              <span>{Math.round(stats.progressToNext)}%</span>
            </div>
            <Progress value={stats.progressToNext} className="h-3" />
          </CardContent>
        </Card>
      )}

      {/* Referral Status Breakdown */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Referral Holati
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium">Aktiv va to'lov qilgan</span>
            </div>
            <span className="font-black text-green-600">{stats?.activeReferrals || 0}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="font-medium">Ro'yxatdan o'tgan, to'lov kutilmoqda</span>
            </div>
            <span className="font-black text-yellow-600">{stats?.registeredNotPaid || 0}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gray-600" />
              <span className="font-medium">Taklif qilingan, aktivatsiya yo'q</span>
            </div>
            <span className="font-black text-gray-600">{stats?.invitedNotActivated || 0}</span>
          </div>
          
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500 italic">
              💡 Bonus faqat hamkor 1+ oy to'lov qilgandan keyin hisoblanadi
            </p>
          </div>
        </CardContent>
      </Card>


      <Card className="border-2">
        <CardHeader>
          <CardTitle>Promo Kod</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {promoCode ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input value={promoCode} readOnly className="font-mono text-lg" />
                <Button onClick={() => copyToClipboard(promoCode)} variant="outline">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => generateCode.mutate()} className="w-full">
              <Gift className="w-5 h-5 mr-2" />
              Kod Yaratish
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
