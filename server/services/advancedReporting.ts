// Advanced Reporting - Custom Reports and Scheduled Exports
// Generate various business reports with export capabilities

import { storage } from '../storage';
import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export interface ReportConfig {
  type: 'sales' | 'inventory' | 'performance' | 'financial' | 'custom';
  dateRange: {
    start: Date;
    end: Date;
  };
  filters?: {
    partnerId?: string;
    marketplace?: string;
    category?: string;
    status?: string;
  };
  groupBy?: 'day' | 'week' | 'month' | 'product' | 'marketplace';
  metrics?: string[];
}

export interface ReportData {
  title: string;
  generated: Date;
  config: ReportConfig;
  summary: {
    [key: string]: any;
  };
  data: any[];
  charts?: {
    type: 'line' | 'bar' | 'pie';
    data: any;
  }[];
}

class AdvancedReporting {
  // Generate Sales Report
  async generateSalesReport(config: ReportConfig): Promise<ReportData> {
    const { dateRange, filters } = config;

    // Get orders in date range
    const orders = await storage.getOrdersByDateRange(
      dateRange.start,
      dateRange.end,
      filters
    );

    // Calculate summary metrics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;

    // Group data
    const groupedData = this.groupOrdersByPeriod(orders, config.groupBy || 'day');

    return {
      title: 'Sales Report',
      generated: new Date(),
      config,
      summary: {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        completedOrders,
        conversionRate: Math.round(conversionRate * 10) / 10
      },
      data: groupedData,
      charts: [
        {
          type: 'line',
          data: {
            labels: groupedData.map(d => d.period),
            datasets: [{
              label: 'Revenue',
              data: groupedData.map(d => d.revenue)
            }]
          }
        }
      ]
    };
  }

  // Generate Inventory Report
  async generateInventoryReport(partnerId: string): Promise<ReportData> {
    const products = await storage.getProductsByPartnerId(partnerId);

    // Calculate metrics
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, p) => {
      const stock = p.stockQuantity || 0;
      const price = Number(p.costPrice || p.price || 0);
      return sum + (stock * price);
    }, 0);

    const lowStockProducts = products.filter(p => 
      (p.stockQuantity || 0) <= (p.lowStockThreshold || 10)
    ).length;

    const outOfStockProducts = products.filter(p => 
      (p.stockQuantity || 0) === 0
    ).length;

    // Group by category
    const byCategory: { [key: string]: any } = {};
    products.forEach(p => {
      const category = p.category || 'Uncategorized';
      if (!byCategory[category]) {
        byCategory[category] = {
          category,
          count: 0,
          totalStock: 0,
          totalValue: 0
        };
      }
      byCategory[category].count++;
      byCategory[category].totalStock += p.stockQuantity || 0;
      byCategory[category].totalValue += (p.stockQuantity || 0) * Number(p.costPrice || p.price || 0);
    });

    return {
      title: 'Inventory Report',
      generated: new Date(),
      config: { type: 'inventory', dateRange: { start: new Date(), end: new Date() } },
      summary: {
        totalProducts,
        totalStockValue,
        lowStockProducts,
        outOfStockProducts,
        stockTurnoverRate: 0 // TODO: Calculate based on sales
      },
      data: Object.values(byCategory),
      charts: [
        {
          type: 'pie',
          data: {
            labels: Object.keys(byCategory),
            datasets: [{
              data: Object.values(byCategory).map((c: any) => c.totalValue)
            }]
          }
        }
      ]
    };
  }

  // Generate Performance Report
  async generatePerformanceReport(partnerId: string, config: ReportConfig): Promise<ReportData> {
    const { dateRange } = config;

    // Get orders and products
    const orders = await storage.getOrdersByDateRange(dateRange.start, dateRange.end, { partnerId });
    const products = await storage.getProductsByPartnerId(partnerId);

    // Top selling products
    const productSales: { [key: string]: { product: any, quantity: number, revenue: number } } = {};
    
    orders.forEach(order => {
      order.items?.forEach((item: any) => {
        if (!productSales[item.productId]) {
          const product = products.find(p => p.id === item.productId);
          productSales[item.productId] = {
            product: product || { name: 'Unknown' },
            quantity: 0,
            revenue: 0
          };
        }
        productSales[item.productId].quantity += item.quantity || 0;
        productSales[item.productId].revenue += Number(item.price || 0) * (item.quantity || 0);
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Marketplace performance
    const marketplacePerformance: { [key: string]: { orders: number, revenue: number } } = {};
    orders.forEach(order => {
      const marketplace = order.marketplace || 'Direct';
      if (!marketplacePerformance[marketplace]) {
        marketplacePerformance[marketplace] = { orders: 0, revenue: 0 };
      }
      marketplacePerformance[marketplace].orders++;
      marketplacePerformance[marketplace].revenue += Number(order.totalAmount || 0);
    });

    return {
      title: 'Performance Report',
      generated: new Date(),
      config,
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
        topProduct: topProducts[0]?.product.name || 'N/A',
        topMarketplace: Object.keys(marketplacePerformance).sort((a, b) => 
          marketplacePerformance[b].revenue - marketplacePerformance[a].revenue
        )[0] || 'N/A'
      },
      data: {
        topProducts,
        marketplacePerformance: Object.entries(marketplacePerformance).map(([name, data]) => ({
          marketplace: name,
          ...data
        }))
      }
    };
  }

  // Export to Excel
  async exportToExcel(reportData: ReportData): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(reportData.title);

    // Add title
    worksheet.addRow([reportData.title]);
    worksheet.addRow([`Generated: ${reportData.generated.toLocaleString()}`]);
    worksheet.addRow([]);

    // Add summary
    worksheet.addRow(['Summary']);
    Object.entries(reportData.summary).forEach(([key, value]) => {
      worksheet.addRow([key, value]);
    });
    worksheet.addRow([]);

    // Add data
    if (Array.isArray(reportData.data) && reportData.data.length > 0) {
      const headers = Object.keys(reportData.data[0]);
      worksheet.addRow(headers);
      
      reportData.data.forEach(row => {
        worksheet.addRow(headers.map(h => row[h]));
      });
    }

    // Style
    worksheet.getRow(1).font = { bold: true, size: 16 };
    worksheet.getRow(4).font = { bold: true };

    return await workbook.xlsx.writeBuffer() as Buffer;
  }

  // Export to PDF
  async exportToPDF(reportData: ReportData): Promise<Buffer> {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(reportData.title, 14, 20);

    // Generated date
    doc.setFontSize(10);
    doc.text(`Generated: ${reportData.generated.toLocaleString()}`, 14, 30);

    // Summary
    doc.setFontSize(14);
    doc.text('Summary', 14, 45);
    
    let y = 55;
    doc.setFontSize(10);
    Object.entries(reportData.summary).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 14, y);
      y += 7;
    });

    // Data table
    if (Array.isArray(reportData.data) && reportData.data.length > 0) {
      const headers = Object.keys(reportData.data[0]);
      const rows = reportData.data.map(row => headers.map(h => row[h]));

      (doc as any).autoTable({
        startY: y + 10,
        head: [headers],
        body: rows,
        theme: 'grid',
        styles: { fontSize: 8 }
      });
    }

    return Buffer.from(doc.output('arraybuffer'));
  }

  // Helper: Group orders by period
  private groupOrdersByPeriod(orders: any[], groupBy: string): any[] {
    const grouped: { [key: string]: { period: string, orders: number, revenue: number } } = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      let period: string;

      switch (groupBy) {
        case 'day':
          period = date.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          period = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          period = date.toISOString().split('T')[0];
      }

      if (!grouped[period]) {
        grouped[period] = { period, orders: 0, revenue: 0 };
      }

      grouped[period].orders++;
      grouped[period].revenue += Number(order.totalAmount || 0);
    });

    return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
  }
}

// Export singleton instance
export const advancedReporting = new AdvancedReporting();

// Export for testing
export { AdvancedReporting };
