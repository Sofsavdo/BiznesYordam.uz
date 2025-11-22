import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText, Loader2, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import * as ExcelJS from 'exceljs';
import { PDFExportButton } from './PDFExportButton';

interface DataExportButtonProps {
  data: any[];
  filename: string;
  type: 'products' | 'analytics' | 'requests' | 'profit';
}

export function DataExportButton({ data, filename, type }: DataExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToExcel = async () => {
    try {
      setIsExporting(true);
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Ma\'lumotlar');

      // Configure columns based on data type
      let columns: any[] = [];
      let rows: any[] = [];

      switch (type) {
        case 'products':
          columns = [
            { header: 'Mahsulot nomi', key: 'name', width: 30 },
            { header: 'Kategoriya', key: 'category', width: 20 },
            { header: 'Narx', key: 'price', width: 15 },
            { header: 'Tan narx', key: 'costPrice', width: 15 },
            { header: 'SKU', key: 'sku', width: 15 },
            { header: 'Holat', key: 'isActive', width: 10 },
            { header: 'Yaratilgan sana', key: 'createdAt', width: 20 },
          ];
          rows = data.map(item => ({
            name: item.name,
            category: item.category,
            price: parseFloat(item.price || '0'),
            costPrice: parseFloat(item.costPrice || '0'),
            sku: item.sku || '',
            isActive: item.isActive ? 'Faol' : 'Nofaol',
            createdAt: new Date(item.createdAt).toLocaleDateString('uz-UZ'),
          }));
          break;

        case 'analytics':
          columns = [
            { header: 'Sana', key: 'date', width: 15 },
            { header: 'Marketplace', key: 'marketplace', width: 15 },
            { header: 'Aylanma', key: 'revenue', width: 15 },
            { header: 'Buyurtmalar', key: 'orders', width: 12 },
            { header: 'Foyda', key: 'profit', width: 15 },
            { header: 'Komissiya', key: 'commission', width: 15 },
            { header: 'Kategoriya', key: 'category', width: 20 },
          ];
          rows = data.map(item => ({
            date: new Date(item.date).toLocaleDateString('uz-UZ'),
            marketplace: item.marketplace || 'N/A',
            revenue: parseFloat(item.revenue || '0'),
            orders: item.orders || 0,
            profit: parseFloat(item.profit || '0'),
            commission: parseFloat(item.commissionPaid || '0'),
            category: item.category || 'N/A',
          }));
          break;

        case 'requests':
          columns = [
            { header: 'Sarlavha', key: 'title', width: 30 },
            { header: 'Turi', key: 'requestType', width: 20 },
            { header: 'Holat', key: 'status', width: 15 },
            { header: 'Muhimlik', key: 'priority', width: 12 },
            { header: 'Taxminiy xarajat', key: 'estimatedCost', width: 15 },
            { header: 'Haqiqiy xarajat', key: 'actualCost', width: 15 },
            { header: 'Yaratilgan', key: 'createdAt', width: 20 },
          ];
          rows = data.map(item => ({
            title: item.title,
            requestType: item.requestType || 'N/A',
            status: item.status,
            priority: item.priority || 'medium',
            estimatedCost: parseFloat(item.estimatedCost || '0'),
            actualCost: parseFloat(item.actualCost || '0'),
            createdAt: new Date(item.createdAt).toLocaleDateString('uz-UZ'),
          }));
          break;

        case 'profit':
          columns = [
            { header: 'Sana', key: 'date', width: 15 },
            { header: 'Aylanma', key: 'revenue', width: 15 },
            { header: 'Mahsulot xarajati', key: 'productCosts', width: 15 },
            { header: 'Fulfillment', key: 'fulfillmentCosts', width: 15 },
            { header: 'Komissiya', key: 'commission', width: 15 },
            { header: 'Soliq', key: 'taxCosts', width: 12 },
            { header: 'Logistika', key: 'logisticsCosts', width: 12 },
            { header: 'SPT', key: 'sptCosts', width: 12 },
            { header: 'Sof foyda', key: 'netProfit', width: 15 },
            { header: 'Foyda marjasi', key: 'profitMargin', width: 12 },
          ];
          rows = data.map(item => ({
            date: new Date(item.date).toLocaleDateString('uz-UZ'),
            revenue: parseFloat(item.totalRevenue || '0'),
            productCosts: parseFloat(item.productCosts || '0'),
            fulfillmentCosts: parseFloat(item.fulfillmentCosts || '0'),
            commission: parseFloat(item.marketplaceCommission || '0'),
            taxCosts: parseFloat(item.taxCosts || '0'),
            logisticsCosts: parseFloat(item.logisticsCosts || '0'),
            sptCosts: parseFloat(item.sptCosts || '0'),
            netProfit: parseFloat(item.netProfit || '0'),
            profitMargin: `${item.profitMargin || '0'}%`,
          }));
          break;
      }

      worksheet.columns = columns;

      // Style header row
      worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4F46E5' }
      };
      worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
      worksheet.getRow(1).height = 25;

      // Add data rows
      rows.forEach(row => {
        worksheet.addRow(row);
      });

      // Format number columns
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell, colNumber) => {
            if (typeof cell.value === 'number') {
              cell.numFmt = '#,##0';
              cell.alignment = { horizontal: 'right' };
            }
          });
        }
      });

      // Add borders
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Generate file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Muvaffaqiyatli!",
        description: "Ma'lumotlar Excel faylga yuklandi",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = () => {
    try {
      setIsExporting(true);

      let headers: string[] = [];
      let rows: string[][] = [];

      switch (type) {
        case 'products':
          headers = ['Mahsulot nomi', 'Kategoriya', 'Narx', 'Tan narx', 'SKU', 'Holat', 'Yaratilgan sana'];
          rows = data.map(item => [
            item.name,
            item.category,
            item.price,
            item.costPrice || '',
            item.sku || '',
            item.isActive ? 'Faol' : 'Nofaol',
            new Date(item.createdAt).toLocaleDateString('uz-UZ'),
          ]);
          break;

        case 'analytics':
          headers = ['Sana', 'Marketplace', 'Aylanma', 'Buyurtmalar', 'Foyda', 'Komissiya'];
          rows = data.map(item => [
            new Date(item.date).toLocaleDateString('uz-UZ'),
            item.marketplace || '',
            item.revenue || '0',
            item.orders?.toString() || '0',
            item.profit || '0',
            item.commissionPaid || '0',
          ]);
          break;

        case 'requests':
          headers = ['Sarlavha', 'Turi', 'Holat', 'Muhimlik', 'Taxminiy xarajat', 'Yaratilgan'];
          rows = data.map(item => [
            item.title,
            item.requestType || '',
            item.status,
            item.priority || '',
            item.estimatedCost || '0',
            new Date(item.createdAt).toLocaleDateString('uz-UZ'),
          ]);
          break;

        case 'profit':
          headers = ['Sana', 'Aylanma', 'Xarajatlar', 'Komissiya', 'Sof foyda', 'Foyda marjasi'];
          rows = data.map(item => [
            new Date(item.date).toLocaleDateString('uz-UZ'),
            item.totalRevenue || '0',
            item.fulfillmentCosts || '0',
            item.marketplaceCommission || '0',
            item.netProfit || '0',
            `${item.profitMargin || '0'}%`,
          ]);
          break;
      }

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Muvaffaqiyatli!",
        description: "Ma'lumotlar CSV faylga yuklandi",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <PDFExportButton data={data} filename={filename} type={type} title={`${filename} hisoboti`} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Yuklanmoqda...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Yuklash
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Format tanlang</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={exportToExcel}>
            <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
            Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportToCSV}>
            <FileText className="mr-2 h-4 w-4 text-blue-600" />
            CSV (.csv)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
