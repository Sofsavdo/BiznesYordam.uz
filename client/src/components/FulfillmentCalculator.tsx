import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingUp, Target, DollarSign, Zap, Crown, Package, Truck } from "lucide-react";

interface FulfillmentResult {
  tierName: string;
  fixedPayment: number;
  commissionRate: number;
  marketpleysCommissionRate: number;
  commissionAmount: number;
  totalFulfillmentFee: number;
  partnerProfit: number;
  profitPercentage: number;
  netProfit: number;
  marketpleysCommission: number;
  logisticsFee: number;
  sptCost: number;
  tax: number;
}

interface FulfillmentCalculatorProps {
  className?: string;
}

// YANGI Fulfillment model - v3.0.0 (6-Nov-2025)
// Komissiya endi SAVDODAN olinadi (oldin foyda edi)
const FULFILLMENT_TIERS = {
  starter_pro: {
    name: "Starter Pro",
    monthlyFee: 2500000, // YANGI: 2.5M oylik to'lov
    commissionRate: 25, // YANGI: 25% savdodan (fixed)
    description: "Yangi boshlovchilar uchun",
    limits: {
      marketplaces: 1,
      products: 100,
      warehouseKg: 100
    }
  },
  business_standard: {
    name: "Business Standard", 
    monthlyFee: 5000000, // YANGI: 5M oylik to'lov
    commissionRate: 20, // YANGI: 20% savdodan (fixed)
    description: "O'sib borayotgan bizneslar uchun",
    limits: {
      marketplaces: 2,
      products: 500,
      warehouseKg: 500
    }
  },
  professional_plus: {
    name: "Professional Plus",
    monthlyFee: 10000000, // YANGI: 10M oylik to'lov
    commissionRate: 15, // YANGI: 15% savdodan (fixed)
    description: "Katta bizneslar uchun",
    limits: {
      marketplaces: 4,
      products: 2000,
      warehouseKg: 2000
    }
  },
  enterprise_elite: {
    name: "Enterprise Elite",
    monthlyFee: 20000000, // YANGI: 20M oylik to'lov
    commissionRate: 10, // YANGI: 10% savdodan (fixed)
    description: "Yirik kompaniyalar uchun",
    limits: {
      marketplaces: 999,
      products: 999999,
      warehouseKg: 999999
    }
  }
};

// Uzum Market 2024 haqiqiy komissiya stavkalari (kategoriya + narx asosida)
const UZUM_MARKETPLACE_CATEGORIES = {
  // 1-iyundan 25%dan 10%ga tushirilgan kategoriyalar
  electronics: { name: "Elektronika", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 10 : 25) },
  baby: { name: "Bolalar kiyim-kechak", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 10 : 25) },
  home: { name: "Uy-ro'zg'or mollari", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 10 : 25) },
  garden: { name: "Bog' uchun mollar", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 10 : 25) },
  appliances: { name: "Konditsionerlar", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 10 : 25) },
  stabilizers: { name: "Kuchlanish stabilizatorlari", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 10 : 25) },
  
  // Umumiy kategoriyalar (3-35% oralig'ida)
  clothing: { name: "Kiyim-kechak", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 15 : 30) },
  beauty: { name: "Go'zallik", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 18 : 35) },
  books: { name: "Kitoblar", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 8 : 20) },
  sports: { name: "Sport", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 12 : 25) },
  automotive: { name: "Avto", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 10 : 22) },
  jewelry: { name: "Zargarlik", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 20 : 35) },
  health: { name: "Salomatlik", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 16 : 30) },
  furniture: { name: "Mebel", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 12 : 25) },
  other: { name: "Boshqa", getCommission: (price: number) => price > 5000000 ? 3 : (price > 50000 ? 12 : 25) }
};

// Uzum Market FBO logistika haqlari (rasm asosida to'liq sodda tizim)
const UZUM_LOGISTICS_FEES = {
  kgt: { name: "KGT (99,999 so'm gacha)", fee: 4000 },
  ogt: { name: "O'GT (100k+ so'm)", fee: 6000 },
  ygt_middle: { name: "YGT o'rta (sim-kartalar)", fee: 8000 },
  ygt_large: { name: "YGT katta gabarit", fee: 20000 }
};

export function FulfillmentCalculator({ className }: FulfillmentCalculatorProps) {
  const [selectedTier, setSelectedTier] = useState<keyof typeof FULFILLMENT_TIERS>("starter_pro");
  const [salesInput, setSalesInput] = useState<string>("20,000,000");
  const [costInput, setCostInput] = useState<string>("12,000,000");
  const [quantityInput, setQuantityInput] = useState<string>("1");
  const [logisticsSize, setLogisticsSize] = useState<keyof typeof UZUM_LOGISTICS_FEES>("ogt");
  const [commissionRate, setCommissionRate] = useState<string>("3");
  const [result, setResult] = useState<FulfillmentResult | null>(null);

  // Format number input with commas
  const formatNumberInput = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const cleanNumbers = numbers.replace(/^0+/, '') || '0';
    return cleanNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumberInput = (value: string): number => {
    return parseInt(value.replace(/,/g, '') || '0', 10);
  };

  const handleSalesInputChange = (value: string) => {
    const formatted = formatNumberInput(value);
    setSalesInput(formatted);
  };

  const handleCostInputChange = (value: string) => {
    const formatted = formatNumberInput(value);
    setCostInput(formatted);
  };

  // Haqiqiy Fulfillment hisobi
  const calculateFulfillment = (
    sales: number, 
    cost: number, 
    quantity: number, 
    tier: keyof typeof FULFILLMENT_TIERS,
    logisticsKey: keyof typeof UZUM_LOGISTICS_FEES,
    commissionPercentage: number
  ): FulfillmentResult => {
    const tierConfig = FULFILLMENT_TIERS[tier];
    const marketpleysCommissionRate = commissionPercentage;
    const logisticsPerItem = UZUM_LOGISTICS_FEES[logisticsKey].fee;
    
    // Marketpleys harajatlari (sotuv narxidan hisoblanadi)
    const marketpleysCommission = (sales * marketpleysCommissionRate) / 100;
    const logisticsFee = logisticsPerItem * quantity;
    const sptCost = 2000 * quantity; // SPT harajati har bir mahsulot uchun 2000 som
    const tax = sales * 0.03; // 3% soliq sotuv narxidan
    
    // YANGI MODEL: Komissiya savdodan (oldin foyda edi)
    const commissionRate = tierConfig.commissionRate; // Fixed rate
    const commissionAmount = (sales * commissionRate) / 100; // Savdodan
    
    // YANGI: Oylik to'lov (prorated for calculation)
    const monthlyFee = tierConfig.monthlyFee;
    
    // Jami fulfillment haqi = Oylik to'lov + savdodan komissiya
    const totalFulfillmentFee = monthlyFee + commissionAmount;
    
    // Hamkor foyda = Sotish - Xarid - SPT - Marketpleys komissiya - Logistika - Soliq - Fulfillment haqi
    const netProfit = sales - cost - sptCost - marketpleysCommission - logisticsFee - tax;
    const partnerProfit = netProfit - totalFulfillmentFee;
    const profitPercentage = sales > 0 ? (partnerProfit / sales) * 100 : 0;

    return {
      tierName: tierConfig.name,
      fixedPayment: monthlyFee,
      commissionRate,
      marketpleysCommissionRate,
      commissionAmount,
      totalFulfillmentFee,
      partnerProfit,
      profitPercentage,
      netProfit,
      marketpleysCommission,
      logisticsFee,
      sptCost,
      tax
    };
  };

  useEffect(() => {
    const sales = parseNumberInput(salesInput);
    const cost = parseNumberInput(costInput);
    const quantity = parseInt(quantityInput || '1', 10);
    const commission = parseFloat(commissionRate) || 0;
    const calculatedResult = calculateFulfillment(sales, cost, quantity, selectedTier, logisticsSize, commission);
    setResult(calculatedResult);
  }, [salesInput, costInput, quantityInput, selectedTier, logisticsSize, commissionRate]);

  const formatSom = (amount: number): string => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(amount)) + ' so\'m';
  };

  const getTierIcon = (tier: keyof typeof FULFILLMENT_TIERS) => {
    switch (tier) {
      case 'starter_pro': return <Zap className="h-4 w-4" />;
      case 'business_standard': return <Target className="h-4 w-4" />;
      case 'professional_plus': return <TrendingUp className="h-4 w-4" />;
      case 'enterprise_elite': return <Crown className="h-4 w-4" />;
      default: return <Calculator className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: keyof typeof FULFILLMENT_TIERS) => {
    switch (tier) {
      case 'starter_pro': return 'text-green-600';
      case 'business_standard': return 'text-blue-600';
      case 'professional_plus': return 'text-purple-600';
      case 'enterprise_elite': return 'text-amber-700 font-bold';
      default: return 'text-gray-600';
    }
  };

  return (
    <section id="calculator" className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Fulfillment Kalkulyatori</h2>
          <p className="text-xl text-slate-600">Logistika va fulfillment xarajatlarini professional hisoblang</p>
        </div>

        <Card className={`bg-white shadow-2xl border-0 ${className}`}>
          <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
            <CardTitle className="flex items-center justify-center gap-2 text-slate-900">
              <Calculator className="h-6 w-6 text-primary" />
              Fulfillment Foyda Kalkulyatori
            </CardTitle>
            <CardDescription className="text-slate-600">
              Haqiqiy Uzum Market FBO modeli asosida - marketpleys komissiyalari va logistika harajatlari hisobida
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 p-8">
            {/* Tier Selection */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Fulfillment Tarifi</Label>
              <Select value={selectedTier} onValueChange={(value: keyof typeof FULFILLMENT_TIERS) => setSelectedTier(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FULFILLMENT_TIERS).map(([key, tier]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        {getTierIcon(key as keyof typeof FULFILLMENT_TIERS)}
                        <span>{tier.name}</span>
                        <Badge variant="outline" className={getTierColor(key as keyof typeof FULFILLMENT_TIERS)}>
                          {formatSom(tier.monthlyFee)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Details */}
              <div className="space-y-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm">Mahsulot Ma'lumotlari</h3>
                
                <div className="space-y-2">
                  <Label className="text-slate-900 text-sm font-medium">Sotish Narxi (so'm)</Label>
                  <Input
                    type="text"
                    value={salesInput}
                    onChange={(e) => handleSalesInputChange(e.target.value)}
                    placeholder="20,000,000"
                    className="text-right font-mono text-2xl h-12 font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-900 text-sm font-medium">Xarid Narxi (so'm)</Label>
                  <Input
                    type="text"
                    value={costInput}
                    onChange={(e) => handleCostInputChange(e.target.value)}
                    placeholder="12,000,000"
                    className="text-right font-mono text-2xl h-12 font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-900 text-sm font-medium">Miqdor</Label>
                  <Input
                    type="number"
                    value={quantityInput}
                    onChange={(e) => setQuantityInput(e.target.value)}
                    placeholder="1"
                    min="1"
                    className="text-right text-2xl h-12 font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Marketplace Settings */}
              <div className="space-y-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg p-4 border border-secondary/20">
                <h3 className="font-semibold text-slate-900 mb-3 text-sm">Marketpleys Parametrlari</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="commissionRate" className="text-slate-900 text-sm font-medium">Marketpleys Komissiya (%)</Label>
                  <Input
                    id="commissionRate"
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    placeholder="3"
                    min="0"
                    max="35"
                    step="0.1"
                    className="text-right text-2xl h-12 font-bold text-slate-900"
                  />
                  <div className="text-xs text-slate-700 font-medium">
                    Marketpleys seller panelida ko'rsatilgan aniq komissiya foizini kiriting
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-900 text-sm font-medium">Logistika Gabariti</Label>
                  <Select value={logisticsSize} onValueChange={(value: keyof typeof UZUM_LOGISTICS_FEES) => setLogisticsSize(value)}>
                    <SelectTrigger className="h-12 text-base font-bold text-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(UZUM_LOGISTICS_FEES).map(([key, fee]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center justify-between w-full">
                            <span>{fee.name}</span>
                            <Badge variant="outline">{formatSom(fee.fee)}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4 mt-8">
                <Separator />
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Marketpleys Harajatlari */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-red-900">Marketpleys Harajatlari</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-medium">Marketpleys komissiya ({result.marketpleysCommissionRate}%):</span>
                        <span className="font-semibold text-red-600 text-lg text-slate-900 whitespace-nowrap">{formatSom(result.marketpleysCommission)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-medium">Logistika ({UZUM_LOGISTICS_FEES[logisticsSize].name}):</span>
                        <span className="font-semibold text-red-600 text-lg text-slate-900 whitespace-nowrap">{formatSom(result.logisticsFee)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-medium">Soliq (3%):</span>
                        <span className="font-semibold text-red-600 text-lg text-slate-900 whitespace-nowrap">{formatSom(result.tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-slate-900">Sof Foyda:</span>
                        <span className="text-green-600 text-2xl whitespace-nowrap">{formatSom(result.netProfit)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fulfillment Harajatlari */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-900">Fulfillment Harajatlari</h4>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-medium">Fixed to'lov:</span>
                        <span className="font-semibold text-blue-600 text-xl whitespace-nowrap">{result.fixedPayment === null ? 'Individual' : formatSom(result.fixedPayment)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-medium">Komissiya ({result.commissionRate}%):</span>
                        <span className="font-semibold text-blue-600 text-xl whitespace-nowrap">{formatSom(result.commissionAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-800 font-medium">SPT harajat:</span>
                        <span className="font-semibold text-blue-600 text-lg whitespace-nowrap">{formatSom(result.sptCost)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-slate-900">Jami Fulfillment harajat:</span>
                        <span className="text-blue-600 text-2xl whitespace-nowrap">{formatSom(result.totalFulfillmentFee + result.sptCost)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Final Foyda */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-900">Sizning Final Foydangiz</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2 whitespace-nowrap">
                        {formatSom(result.netProfit - (result.totalFulfillmentFee + result.sptCost))}
                      </div>
                      <div className="text-sm text-green-700">
                        Foyda foizi: {(((result.netProfit - (result.totalFulfillmentFee + result.sptCost)) / parseNumberInput(salesInput)) * 100).toFixed(1)}%
                      </div>
                      <Badge variant="outline" className="mt-2 text-green-700 border-green-300">
                        {result.tierName}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}