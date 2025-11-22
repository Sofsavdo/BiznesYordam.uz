import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Trash2,
  Plus,
  Database,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Package,
  Calendar,
  FileText,
  Settings,
  Globe,
  Users,
  DollarSign
} from 'lucide-react';

interface ExcelImport {
  id: string;
  partnerId: string;
  marketplace: string;
  fileName: string;
  fileSize: number;
  importType: 'sales_data' | 'product_list' | 'inventory';
  status: 'processing' | 'completed' | 'failed';
  recordsProcessed: number;
  recordsTotal: number;
  errorCount: number;
  successCount: number;
  errorDetails: any[];
  processedAt: string;
  createdAt: string;
}

interface ExcelTemplate {
  id: string;
  name: string;
  description: string;
  marketplace: string;
  templateType: 'sales_report' | 'product_catalog' | 'inventory';
  columns: string[];
  isActive: boolean;
}

interface ExcelDataManagerProps {
  partnerId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const IMPORT_TYPES = {
  sales_data: {
    label: 'Savdo Ma\'lumotlari',
    description: 'Buyurtmalar, to\'lovlar va savdo statistikasi',
    icon: ShoppingCart,
    columns: ['Sana', 'Buyurtma ID', 'Mahsulot', 'Miqdor', 'Narx', 'To\'lov turi', 'Status']
  },
  product_list: {
    label: 'Mahsulotlar Ro\'yxati',
    description: 'Mahsulotlar katalogi va narxlari',
    icon: Package,
    columns: ['Mahsulot ID', 'Nomi', 'Kategoriya', 'Narx', 'Sklon', 'Status']
  },
  inventory: {
    label: 'Sklon Ma\'lumotlari',
    description: 'Sklon qoldiqlari va harakatlar',
    icon: Database,
    columns: ['Mahsulot ID', 'Nomi', 'Sklon', 'Kelgan', 'Ketgan', 'Qoldiq']
  }
};

const MARKETPLACES = {
  uzum: { name: 'Uzum Market', color: 'bg-blue-500' },
  wildberries: { name: 'Wildberries', color: 'bg-purple-500' },
  yandex: { name: 'Yandex Market', color: 'bg-red-500' },
  ozon: { name: 'Ozon', color: 'bg-orange-500' }
};

export function ExcelDataManager({ 
  partnerId, 
  isOpen, 
  onClose, 
  onSuccess 
}: ExcelDataManagerProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imports, setImports] = useState<ExcelImport[]>([]);
  const [templates, setTemplates] = useState<ExcelTemplate[]>([]);
  const [selectedImportType, setSelectedImportType] = useState<string>('');
  const [selectedMarketplace, setSelectedMarketplace] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
        toast({
          title: "Noto'g'ri fayl turi",
          description: "Faqat Excel (.xlsx, .xls) yoki CSV fayllarini yuklashingiz mumkin",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fayl hajmi juda katta",
          description: "Fayl hajmi 10MB dan katta bo'lishi mumkin emas",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedImportType || !selectedMarketplace) {
      toast({
        title: "Ma'lumotlar to'liq emas",
        description: "Fayl, import turi va marketplace tanlang",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('importType', selectedImportType);
    formData.append('marketplace', selectedMarketplace);

    try {
      const response = await apiRequest('POST', `/api/partners/${partnerId}/excel-import`, formData, {
        headers: {
          // Don't set Content-Type, let browser set it with boundary
        }
      });

      const result = await response.json();
      
      toast({
        title: "Fayl yuklandi",
        description: "Excel fayl muvaffaqiyatli yuklandi va qayta ishlanmoqda",
      });

      // Reset form
      setSelectedFile(null);
      setSelectedImportType('');
      setSelectedMarketplace('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh imports list
      loadImports();
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Yuklash xatoligi",
        description: error.message || "Faylni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const loadImports = async () => {
    try {
      const response = await apiRequest('GET', `/api/partners/${partnerId}/excel-imports`);
      const data = await response.json();
      setImports(data);
    } catch (error) {
      console.error('Failed to load imports:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await apiRequest('GET', '/api/excel-templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleDownloadTemplate = async (templateId: string) => {
    try {
      const response = await apiRequest('GET', `/api/excel-templates/${templateId}/download`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template_${templateId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Shablon yuklandi",
        description: "Excel shablon muvaffaqiyatli yuklandi",
      });
    } catch (error: any) {
      toast({
        title: "Yuklash xatoligi",
        description: error.message || "Shablonni yuklashda xatolik",
        variant: "destructive",
      });
    }
  };

  const handleExportData = async (marketplace: string, dataType: string) => {
    try {
      const response = await apiRequest('GET', `/api/partners/${partnerId}/export/${marketplace}/${dataType}`);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${marketplace}_${dataType}_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Ma'lumotlar eksport qilindi",
        description: `${MARKETPLACES[marketplace as keyof typeof MARKETPLACES]?.name || marketplace} ma'lumotlari yuklandi`,
      });
    } catch (error: any) {
      toast({
        title: "Eksport xatoligi",
        description: error.message || "Ma'lumotlarni eksport qilishda xatolik",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      processing: { label: 'Qayta ishlanmoqda', variant: 'secondary' as const, icon: RefreshCw },
      completed: { label: 'Yakunlandi', variant: 'default' as const, icon: CheckCircle },
      failed: { label: 'Xatolik', variant: 'destructive' as const, icon: XCircle }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.processing;
    const Icon = statusConfig.icon;
    
    return (
      <Badge variant={statusConfig.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Excel Ma'lumotlar Boshqaruvi</h2>
              <p className="text-slate-600">Marketplace ma'lumotlarini Excel orqali import/export qilish</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <XCircle className="w-4 h-4 mr-2" />
              Yopish
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Excel Fayl Yuklash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="marketplace">Marketplace</Label>
                  <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                    <SelectTrigger>
                      <SelectValue placeholder="Marketplace tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(MARKETPLACES).map(([key, info]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${info.color}`}></div>
                            {info.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="importType">Import Turi</Label>
                  <Select value={selectedImportType} onValueChange={setSelectedImportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Import turini tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(IMPORT_TYPES).map(([key, info]) => {
                        const Icon = info.icon;
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {info.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file">Fayl Tanlash</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">{selectedFile.name}</h4>
                      <p className="text-sm text-blue-700">
                        Hajm: {formatFileSize(selectedFile.size)} | 
                        Tur: {selectedFile.type || 'Excel fayl'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedImportType && IMPORT_TYPES[selectedImportType as keyof typeof IMPORT_TYPES] && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {IMPORT_TYPES[selectedImportType as keyof typeof IMPORT_TYPES]?.label || 'Import Type'}
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    {IMPORT_TYPES[selectedImportType as keyof typeof IMPORT_TYPES]?.description || ''}
                  </p>
                  <div className="text-xs text-green-600">
                    <p className="font-medium">Kerakli ustunlar:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(IMPORT_TYPES[selectedImportType as keyof typeof IMPORT_TYPES]?.columns || []).map((col, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {col}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Button 
                  onClick={handleUpload}
                  disabled={isUploading || !selectedFile || !selectedImportType || !selectedMarketplace}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Yuklanmoqda...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Faylni Yuklash
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Ma'lumotlarni Eksport Qilish
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(MARKETPLACES).map(([marketplace, info]) => (
                  <div key={marketplace} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center ${info.color}`}>
                        <span className="text-white text-sm font-bold">
                          {info.name.charAt(0)}
                        </span>
                      </div>
                      <h4 className="font-semibold">{info.name}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleExportData(marketplace, 'sales')}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Savdo Ma'lumotlari
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleExportData(marketplace, 'products')}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Mahsulotlar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleExportData(marketplace, 'analytics')}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Tahlil Ma'lumotlari
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Templates Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Excel Shablonlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(IMPORT_TYPES).map(([key, info]) => {
                  const Icon = info.icon;
                  return (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-6 h-6 text-blue-600" />
                        <h4 className="font-semibold">{info.label}</h4>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{info.description}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleDownloadTemplate(key)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Shablon Yuklash
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Import History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Import Tarixi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {imports.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p>Hozircha import tarixi yo'q</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {imports.slice(0, 5).map((importItem) => (
                    <div key={importItem.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{importItem.fileName}</h4>
                            <p className="text-sm text-slate-600">
                              {MARKETPLACES[importItem.marketplace as keyof typeof MARKETPLACES]?.name || importItem.marketplace} • 
                              {IMPORT_TYPES[importItem.importType as keyof typeof IMPORT_TYPES]?.label || importItem.importType}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(importItem.status)}
                          <span className="text-xs text-slate-500">
                            {formatFileSize(importItem.fileSize)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Qayta ishlangan:</p>
                          <p className="font-medium">{importItem.recordsProcessed} / {importItem.recordsTotal}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Muvaffaqiyatli:</p>
                          <p className="font-medium text-green-600">{importItem.successCount}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Xatolar:</p>
                          <p className="font-medium text-red-600">{importItem.errorCount}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Sana:</p>
                          <p className="font-medium">
                            {new Date(importItem.createdAt).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                      </div>

                      {importItem.errorDetails.length > 0 && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm font-medium text-red-800 mb-2">Xatolar:</p>
                          <div className="space-y-1">
                            {importItem.errorDetails.slice(0, 3).map((error, index) => (
                              <p key={index} className="text-xs text-red-700">
                                {error.message}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Missing icon components
const Info = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const History = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
