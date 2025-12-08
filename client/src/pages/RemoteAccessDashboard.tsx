// REMOTE ACCESS DASHBOARD - Admin Panel
// AnyDesk-like remote access to partner dashboards

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Monitor, 
  Eye, 
  MousePointer2, 
  Play, 
  Square, 
  Users, 
  Clock,
  Shield,
  Video,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface RemoteSession {
  sessionId: string;
  partnerId: string;
  partnerName: string;
  adminId: string;
  status: 'pending' | 'active' | 'ended';
  startedAt: string;
  endedAt?: string;
  permissions: {
    viewOnly: boolean;
    canEdit: boolean;
    canExecuteActions: boolean;
  };
  duration?: number;
}

export default function RemoteAccessDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPartner, setSelectedPartner] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [permissions, setPermissions] = useState({
    viewOnly: false,
    canEdit: true,
    canExecuteActions: true,
  });
  const [activeSession, setActiveSession] = useState<RemoteSession | null>(null);

  // Fetch active sessions
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['remote-sessions'],
    queryFn: async () => {
      const res = await fetch('/api/remote-access/sessions', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch sessions');
      return res.json();
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Fetch partners
  const { data: partners } = useQuery({
    queryKey: ['partners-list'],
    queryFn: async () => {
      const res = await fetch('/api/partners', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch partners');
      return res.json();
    },
  });

  // Request access mutation
  const requestAccessMutation = useMutation({
    mutationFn: async (data: { partnerId: string; permissions: any }) => {
      const res = await fetch('/api/remote-access/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to request access');
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "✅ Access so'rovi yuborildi",
        description: "Hamkor tasdiqini kutmoqda...",
      });
      setShowRequestDialog(false);
      queryClient.invalidateQueries({ queryKey: ['remote-sessions'] });
    },
    onError: () => {
      toast({
        title: "❌ Xatolik",
        description: "So'rov yuborishda xatolik",
        variant: 'destructive',
      });
    },
  });

  // Connect to session
  const connectToSession = (session: RemoteSession) => {
    setActiveSession(session);
    // Open remote viewer in new window
    window.open(`/remote-viewer/${session.sessionId}`, '_blank', 'width=1920,height=1080');
  };

  // End session mutation
  const endSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await fetch(`/api/remote-access/end/${sessionId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to end session');
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: '✅ Session yakunlandi',
      });
      setActiveSession(null);
      queryClient.invalidateQueries({ queryKey: ['remote-sessions'] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Kutilmoqda
        </Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Faol
        </Badge>;
      case 'ended':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">
          <XCircle className="w-3 h-3 mr-1" />
          Tugatilgan
        </Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🖥️ Remote Access Control
            </h1>
            <p className="text-muted-foreground mt-2">
              Hamkorlar kabinetiga masofaviy kirish va yordam
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setShowRequestDialog(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Monitor className="w-5 h-5 mr-2" />
            Yangi Session Boshlash
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Faol Sessionlar</p>
                  <p className="text-3xl font-bold text-green-600">
                    {sessions?.filter((s: RemoteSession) => s.status === 'active').length || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kutilmoqda</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {sessions?.filter((s: RemoteSession) => s.status === 'pending').length || 0}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bugun</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {sessions?.filter((s: RemoteSession) => 
                      new Date(s.startedAt).toDateString() === new Date().toDateString()
                    ).length || 0}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">O'rtacha Vaqt</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {sessions?.filter((s: RemoteSession) => s.duration).length > 0
                      ? Math.round(sessions.filter((s: RemoteSession) => s.duration).reduce((sum: number, s: RemoteSession) => sum + (s.duration || 0), 0) / sessions.filter((s: RemoteSession) => s.duration).length)
                      : 0} min
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Remote Access Sessions</CardTitle>
            <CardDescription>Barcha masofaviy kirish sessionlari</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Yuklanmoqda...</p>
              </div>
            ) : sessions?.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium mb-2">Hech qanday session yo'q</p>
                <p className="text-muted-foreground mb-4">Hamkor kabinetiga kirish uchun yangi session boshlang</p>
                <Button onClick={() => setShowRequestDialog(true)}>
                  <Play className="w-4 h-4 mr-2" />
                  Session Boshlash
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions?.map((session: RemoteSession) => (
                  <div
                    key={session.sessionId}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{session.partnerName}</h3>
                          {getStatusBadge(session.status)}
                          {session.permissions.viewOnly && (
                            <Badge variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View Only
                            </Badge>
                          )}
                          {session.permissions.canExecuteActions && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              <MousePointer2 className="w-3 h-3 mr-1" />
                              Full Control
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>📅 {new Date(session.startedAt).toLocaleString('uz-UZ')}</span>
                          {session.duration && <span>⏱️ {session.duration} minut</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.status === 'pending' && (
                          <Button variant="outline" size="sm" disabled>
                            <Clock className="w-4 h-4 mr-2" />
                            Kutilmoqda
                          </Button>
                        )}
                        {session.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => connectToSession(session)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Monitor className="w-4 h-4 mr-2" />
                              Ulanish
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => endSessionMutation.mutate(session.sessionId)}
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Tugatish
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Request Dialog */}
        <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>🖥️ Remote Access So'rovi</DialogTitle>
              <DialogDescription>
                Hamkor kabinetiga masofaviy kirish uchun so'rov yuboring
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hamkorni tanlang</label>
                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Hamkor" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners?.map((partner: any) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Ruxsatlar:</label>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={permissions.viewOnly}
                    onChange={(e) => setPermissions({
                      viewOnly: e.target.checked,
                      canEdit: !e.target.checked,
                      canExecuteActions: !e.target.checked,
                    })}
                    id="viewOnly"
                  />
                  <label htmlFor="viewOnly" className="text-sm">
                    <Eye className="w-4 h-4 inline mr-1" />
                    Faqat ko'rish (View Only)
                  </label>
                </div>

                {!permissions.viewOnly && (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={permissions.canEdit}
                        onChange={(e) => setPermissions({ ...permissions, canEdit: e.target.checked })}
                        id="canEdit"
                      />
                      <label htmlFor="canEdit" className="text-sm">
                        <MousePointer2 className="w-4 h-4 inline mr-1" />
                        Tahrirlash (Edit)
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={permissions.canExecuteActions}
                        onChange={(e) => setPermissions({ ...permissions, canExecuteActions: e.target.checked })}
                        id="canExecute"
                      />
                      <label htmlFor="canExecute" className="text-sm">
                        <Shield className="w-4 h-4 inline mr-1" />
                        Amallarni bajarish (Execute)
                      </label>
                    </div>
                  </>
                )}
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Hamkor sizning so'rovingizni qabul qilishi kerak
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                Bekor qilish
              </Button>
              <Button
                onClick={() => {
                  if (!selectedPartner) {
                    toast({
                      title: '⚠️ Diqqat',
                      description: 'Hamkorni tanlang',
                      variant: 'destructive',
                    });
                    return;
                  }
                  requestAccessMutation.mutate({
                    partnerId: selectedPartner,
                    permissions,
                  });
                }}
                disabled={!selectedPartner || requestAccessMutation.isPending}
              >
                {requestAccessMutation.isPending ? "Yuborilmoqda..." : "So'rov Yuborish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
