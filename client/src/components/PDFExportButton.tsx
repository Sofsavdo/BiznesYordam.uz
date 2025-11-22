import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportButtonProps {
  data: any[];
  filename: string;
  type: 'products' | 'analytics' | 'requests' | 'profit';
  title?: string;
}

export function PDFExportButton({ data, filename, type, title }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const exportToPDF = async () => {
    try {
      setIsExporting(true);

      const doc = new jsPDF();
      
      // Add logo/header
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229); // Primary color
      doc.text('BiznesYordam.uz', 14, 20);
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(title || 'Hisobot', 14, 30);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Sana: ${new Date().toLocaleDateString('uz-UZ')}`, 14, 38);
      
      // Prepare table data based on type
      let columns: any[] = [];
      let rows: any[] = [];

      switch (type) {
        case 'products':
          columns = [
            { header: 'Mahsulot', dataKey: 'name' },
            { header: 'Kategoriya', dataKey: 'category' },
            { header: 'Narx', dataKey: 'price' },
            { header: 'SKU', dataKey: 'sku' },
            { header: 'Holat', dataKey: 'status' },
          ];
          rows = data.map(item => ({
            name: item.name,
            category: item.category,
            price: `${parseFloat(item.price || '0').toLocaleString()} so'm`,
            sku: item.sku || '-',
            status: item.isActive ? 'Faol' : 'Nofaol',
          }));
          break;

        case 'analytics':
          columns = [
            { header: 'Sana', dataKey: 'date' },
            { header: 'Aylanma', dataKey: 'revenue' },
            { header: 'Buyurtmalar', dataKey: 'orders' },
            { header: 'Foyda', dataKey: 'profit' },
            { header: 'Komissiya', dataKey: 'commission' },
          ];
          rows = data.map(item => ({
            date: new Date(item.date).toLocaleDateString('uz-UZ'),
            revenue: `${parseFloat(item.revenue || '0').toLocaleString()} so'm`,
            orders: item.orders || 0,
            profit: `${parseFloat(item.profit || '0').toLocaleString()} so'm`,
            commission: `${parseFloat(item.commissionPaid || '0').toLocaleString()} so'm`,
          }));
          break;

        case 'requests':
          columns = [
            { header: 'Sarlavha', dataKey: 'title' },
            { header: 'Holat', dataKey: 'status' },
            { header: 'Muhimlik', dataKey: 'priority' },
            { header: 'Xarajat', dataKey: 'cost' },
            { header: 'Sana', dataKey: 'date' },
          ];
          rows = data.map(item => ({
            title: item.title,
            status: item.status,
            priority: item.priority || '-',
            cost: `${parseFloat(item.estimatedCost || '0').toLocaleString()} so'm`,
            date: new Date(item.createdAt).toLocaleDateString('uz-UZ'),
          }));
          break;

        case 'profit':
          columns = [
            { header: 'Sana', dataKey: 'date' },
            { header: 'Aylanma', dataKey: 'revenue' },
            { header: 'Xarajat', dataKey: 'costs' },
            { header: 'Foyda', dataKey: 'profit' },
            { header: 'Marja', dataKey: 'margin' },
          ];
          rows = data.map(item => ({
            date: new Date(item.date).toLocaleDateString('uz-UZ'),
            revenue: `${parseFloat(item.totalRevenue || '0').toLocaleString()} so'm`,
            costs: `${parseFloat(item.fulfillmentCosts || '0').toLocaleString()} so'm`,
            profit: `${parseFloat(item.netProfit || '0').toLocaleString()} so'm`,
            margin: `${item.profitMargin || '0'}%`,
          }));
          break;
      }

      // Add table
      autoTable(doc, {
        startY: 45,
        columns: columns,
        body: rows,
        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 45, left: 14, right: 14 },
      });

      // Add footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Sahifa ${i} / ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
        doc.text(
          'BiznesYordam.uz - Professional Marketplace Fulfillment',
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 5,
          { align: 'center' }
        );
      }

      // Save PDF
      doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);

      toast({
        title: "Muvaffaqiyatli!",
        description: "PDF fayl yuklab olindi",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Xatolik",
        description: "PDF yaratishda xatolik yuz berdi",
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
    <Button
      onClick={exportToPDF}
      variant="outline"
      size="sm"
      disabled={isExporting}
    >
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Yuklanmoqda...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4 text-red-600" />
          PDF
        </>
      )}
    </Button>
  );
}
