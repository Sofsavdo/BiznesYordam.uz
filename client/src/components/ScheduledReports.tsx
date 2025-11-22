import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar, Mail, Clock, FileText, Plus, Trash2, Edit } from 'lucide-react';

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  email: string;
  format: 'pdf' | 'excel' | 'csv';
  enabled: boolean;
  lastSent?: string;
  nextSend: string;
}

export function ScheduledReports() {
  const [reports, setReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Haftalik Savdo Hisoboti',
      frequency: 'weekly',
      email: 'partner@example.com',
      format: 'pdf',
      enabled: true,
      lastSent: '2025-11-01',
      nextSend: '2025-11-08',
    },
    {
      id: '2',
      name: 'Oylik Foyda Tahlili',
      frequency: 'monthly',
      email: 'partner@example.com',
      format: 'excel',
      enabled: true,
      nextSend: '2025-12-01',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  const toggleReport = (id: string) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  const getFrequencyLabel = (freq: string) => {
    switch (freq) {
      case 'daily': return 'Kunlik';
      case 'weekly': return 'Haftalik';
      case 'monthly': return 'Oylik';
      default: return freq;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-green-600" />
            Rejalashtirilgan Hisobotlar
          </h2>
          <p className="text-muted-foreground mt-1">
            Avtomatik hisobotlarni sozlang va emailga qabul qiling
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Yangi Hisobot
        </Button>
      </div>

      {/* Add Report Form */}
      {showAddForm && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">Yangi Hisobot Qo'shish</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hisobot Nomi</Label>
                <Input placeholder="Masalan: Haftalik Savdo" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Chastota</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Kunlik</SelectItem>
                    <SelectItem value="weekly">Haftalik</SelectItem>
                    <SelectItem value="monthly">Oylik</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Saqlash</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Bekor qilish</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{report.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {getFrequencyLabel(report.frequency)}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {report.format.toUpperCase()}
                        </Badge>
                        {report.enabled ? (
                          <Badge className="text-xs bg-green-500">Faol</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Nofaol</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Email:</p>
                      <p className="font-medium flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {report.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Keyingi yuborish:</p>
                      <p className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(report.nextSend).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>

                  {report.lastSent && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Oxirgi yuborilgan: {new Date(report.lastSent).toLocaleDateString('uz-UZ')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={report.enabled}
                    onCheckedChange={() => toggleReport(report.id)}
                  />
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteReport(report.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Avtomatik Hisobotlar</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Rejalashtirilgan hisobotlar avtomatik ravishda yaratiladi va sizning emailingizga yuboriladi. 
                Siz istalgan vaqtda sozlamalarni o'zgartirishingiz yoki hisobotlarni to'xtatishingiz mumkin.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-white rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{reports.filter(r => r.enabled).length}</p>
                  <p className="text-xs text-muted-foreground">Faol hisobotlar</p>
                </div>
                <div className="p-3 bg-white rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">{reports.length}</p>
                  <p className="text-xs text-muted-foreground">Jami hisobotlar</p>
                </div>
                <div className="p-3 bg-white rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-600">100%</p>
                  <p className="text-xs text-muted-foreground">Yuborish muvaffaqiyati</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
