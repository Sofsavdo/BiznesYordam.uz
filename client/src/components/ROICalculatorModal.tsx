// ROI Calculator Modal
// Tarif taqqoslash va investitsiya qaytimini hisoblash

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Percent, Calendar, CheckCircle, ArrowRight } from 'lucide-react';

interface ROICalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: string;
}

interface TierData {
  name: string;
  monthlyFee: number;
  commissionRate: number;
  color: string;
}

const tiers: Record<string, TierData> = {
  starter_pro: { name: 'Starter Pro', monthlyFee: 2500000, commissionRate: 0.25, color: 'blue' },
  business_standard: { name: 'Business Standard', monthlyFee: 5000000, commissionRate: 0.20, color: 'green' },
  professional_plus: { name: 'Professional Plus', monthlyFee: 10000000, commissionRate: 0.15, color: 'purple' },
  enterprise_elite: { name: 'Enterprise Elite', monthlyFee: 20000000, commissionRate: 0.10, color: 'orange' }
};

export function ROICalculatorModal({ isOpen, onClose, currentTier }: ROICalculatorModalProps) {
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(50000000); // 50M so'm
  const [avgProfit, setAvgProfit] = useState<number>(30); // 30% profit margin

  // Hisoblashlar
  const calculateROI = (tier: string) => {
    const tierData = tiers[tier];
    const grossProfit = monthlyRevenue * (avgProfit / 100);
    const commission = monthlyRevenue * tierData.commissionRate;
    const totalCost = tierData.monthlyFee + commission;
    const netProfit = grossProfit - totalCost;
    const roi = grossProfit > 0 ? (netProfit / totalCost) * 100 : 0;

    return {
      grossProfit,
      commission,
      monthlyFee: tierData.monthlyFee,
      totalCost,
      netProfit,
      roi
    };
  };

  const currentCalc = calculateROI(currentTier);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <TrendingUp className="h-6 w-6 text-primary" />
            ROI Kalkulyator va Tarif Taqqoslash
          </DialogTitle>
          <p className="text-muted-foreground">
            Qaysi tarif sizga ko'proq foyda keltiradi? Hisoblang!
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Section */}
          <Card className="bg-muted/30">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revenue">Oylik savdo aylanmangiz (so'm)</Label>
                  <Input
                    id="revenue"
                    type="number"
                    value={monthlyRevenue}
                    onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                    className="text-lg font-semibold"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {monthlyRevenue.toLocaleString()} so'm
                  </p>
                </div>

                <div>
                  <Label htmlFor="profit">O'rtacha foyda marjasi (%)</Label>
                  <Input
                    id="profit"
                    type="number"
                    value={avgProfit}
                    onChange={(e) => setAvgProfit(Number(e.target.value))}
                    className="text-lg font-semibold"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(monthlyRevenue * (avgProfit / 100)).toLocaleString()} so'm gross profit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Tier */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Badge variant="secondary">Hozirgi tarifingiz</Badge>
              {tiers[currentTier].name}
            </h3>
            <Card className="border-2 border-primary">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Oylik to'lov</p>
                    <p className="font-bold">{currentCalc.monthlyFee.toLocaleString()} so'm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Komissiya ({(tiers[currentTier].commissionRate * 100)}%)</p>
                    <p className="font-bold">{currentCalc.commission.toLocaleString()} so'm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Jami xarajat</p>
                    <p className="font-bold text-red-600">{currentCalc.totalCost.toLocaleString()} so'm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sof foyda</p>
                    <p className="font-bold text-green-600">{currentCalc.netProfit.toLocaleString()} so'm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ROI</p>
                    <p className="font-bold text-blue-600">{currentCalc.roi.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Other Tiers Comparison */}
          <div>
            <h3 className="font-semibold mb-3">Boshqa tariflar bilan taqqoslash</h3>
            <div className="grid gap-4">
              {Object.entries(tiers).filter(([key]) => key !== currentTier).map(([key, tier]) => {
                const calc = calculateROI(key);
                const difference = calc.netProfit - currentCalc.netProfit;
                const isBetter = difference > 0;

                return (
                  <Card key={key} className={isBetter ? 'border-2 border-green-500' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{tier.name}</h4>
                          {isBetter && (
                            <Badge className="bg-green-600">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Yaxshiroq
                            </Badge>
                          )}
                        </div>
                        {isBetter && (
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Qo'shimcha foyda</p>
                            <p className="font-bold text-green-600">+{difference.toLocaleString()} so'm</p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Oylik to'lov</p>
                          <p className="font-semibold">{calc.monthlyFee.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Komissiya ({(tier.commissionRate * 100)}%)</p>
                          <p className="font-semibold">{calc.commission.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Jami xarajat</p>
                          <p className="font-semibold text-red-600">{calc.totalCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sof foyda</p>
                          <p className="font-semibold text-green-600">{calc.netProfit.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ROI</p>
                          <p className="font-semibold text-blue-600">{calc.roi.toFixed(1)}%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                Tavsiyalar
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Oylik aylanmangiz {monthlyRevenue < 30000000 ? 'kam' : 'yaxshi'} ko'rsatkichda</li>
                <li>• Foyda marjangizni oshirish uchun xarajatlarni optimallashtiring</li>
                <li>• Yuqori tarifga o'tish aylanmangiz oshganda foydali bo'ladi</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Yopish
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
