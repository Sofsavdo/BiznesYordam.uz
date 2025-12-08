// AI MANAGER LIVE MONITOR
// Real-time monitoring of AI Manager activities - Admin only

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Brain,
  Activity,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Eye,
  Pause,
  Play,
  Settings,
  MessageSquare,
  BarChart3,
  Cpu,
  Database,
  Globe,
  Image as ImageIcon,
  Video,
  FileText,
  Search,
  RefreshCw
} from 'lucide-react';

interface AIActivity {
  id: string;
  timestamp: Date;
  type: 'research' | 'strategy' | 'image' | 'video' | 'content' | 'upload' | 'quality_check';
  status: 'processing' | 'completed' | 'failed';
  partnerId: string;
  partnerName: string;
  productName: string;
  marketplace: string;
  duration?: number;
  details?: string;
  progress?: number;
}

interface AIStats {
  activeWorkers: number;
  queuedTasks: number;
  completedToday: number;
  successRate: number;
  avgProcessingTime: number;
  totalCost: number;
}

export function AIManagerLiveMonitor() {
  const [activities, setActivities] = useState<AIActivity[]>([]);
  const [stats, setStats] = useState<AIStats>({
    activeWorkers: 0,
    queuedTasks: 0,
    completedToday: 0,
    successRate: 0,
    avgProcessingTime: 0,
    totalCost: 0
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<AIActivity | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      // Get current user info for WebSocket authentication
      const userId = localStorage.getItem('userId') || 'admin';
      const role = 'admin';

      // Production-ready WebSocket URL
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/ws?userId=${userId}&role=${role}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected for AI monitoring');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          switch (message.type) {
            case 'ai_activity':
              // Add new activity to the list
              setActivities(prev => [message.data, ...prev.slice(0, 49)]);
              break;
            case 'ai_stats':
              // Update stats
              setStats(message.data);
              break;
            case 'system':
              console.log('WebSocket system message:', message.data);
              break;
            default:
              console.log('Unknown WebSocket message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Manual refresh function (fallback)
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Fetch current data (you might want to implement an API endpoint for this)
      // For now, we'll just simulate a refresh
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error refreshing data:', error);
      setIsRefreshing(false);
    }
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      research: Search,
      strategy: Brain,
      image: ImageIcon,
      video: Video,
      content: FileText,
      upload: Globe,
      quality_check: CheckCircle
    };
    return icons[type as keyof typeof icons] || Activity;
  };

  const getActivityColor = (type: string) => {
    const colors = {
      research: 'text-blue-600 bg-blue-50',
      strategy: 'text-purple-600 bg-purple-50',
      image: 'text-pink-600 bg-pink-50',
      video: 'text-orange-600 bg-orange-50',
      content: 'text-green-600 bg-green-50',
      upload: 'text-cyan-600 bg-cyan-50',
      quality_check: 'text-emerald-600 bg-emerald-50'
    };
    return colors[type as keyof typeof colors] || 'text-slate-600 bg-slate-50';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Tugallandi</Badge>;
    }
    if (status === 'failed') {
      return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Xato</Badge>;
    }
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1 animate-spin" />Jarayonda</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Manager Live Monitor
          </h2>
          <p className="text-slate-600 mt-1">
            AI Manager faoliyatini kuzating
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="lg"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Yangilash
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="h-5 w-5 mr-2" />
            Sozlamalar
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="h-8 w-8" />
              <Activity className="h-6 w-6 animate-pulse" />
            </div>
            <div className="text-3xl font-bold">{stats.activeWorkers}</div>
            <div className="text-sm opacity-90">Active Workers</div>
            <Progress value={(stats.activeWorkers / 100) * 100} className="mt-2 bg-white/20" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8" />
              <Badge className="bg-white/20">Queue</Badge>
            </div>
            <div className="text-3xl font-bold">{stats.queuedTasks}</div>
            <div className="text-sm opacity-90">Navbatda</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-8 w-8" />
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="text-3xl font-bold">{stats.completedToday}</div>
            <div className="text-sm opacity-90">Bugun Tugallandi</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-8 w-8" />
              <Badge className="bg-white/20">Success</Badge>
            </div>
            <div className="text-3xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <div className="text-sm opacity-90">Muvaffaqiyat</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Zap className="h-8 w-8" />
              <Badge className="bg-white/20">Avg</Badge>
            </div>
            <div className="text-3xl font-bold">{stats.avgProcessingTime.toFixed(1)}s</div>
            <div className="text-sm opacity-90">O'rtacha Vaqt</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card className="border-2 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-purple-600 animate-pulse" />
              Live Activity Feed
            </div>
            <Badge className="bg-green-500 animate-pulse">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-6 space-y-3">
              {activities.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Brain className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Hozircha faoliyat yo'q</p>
                </div>
              ) : (
                activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  const colorClass = getActivityColor(activity.type);
                  
                  return (
                    <div
                      key={activity.id}
                      className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => setSelectedActivity(activity)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className={`${colorClass} p-3 rounded-lg`}>
                          <Icon className="h-6 w-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {activity.type.replace('_', ' ').toUpperCase()}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {activity.productName} - {activity.partnerName}
                              </p>
                            </div>
                            {getStatusBadge(activity.status)}
                          </div>

                          {/* Details */}
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              <span className="capitalize">{activity.marketplace}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{activity.timestamp.toLocaleTimeString('uz-UZ')}</span>
                            </div>
                            {activity.duration && (
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4" />
                                <span>{activity.duration}s</span>
                              </div>
                            )}
                          </div>

                          {/* Progress bar for processing */}
                          {activity.status === 'processing' && activity.progress !== undefined && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>Jarayon</span>
                                <span>{activity.progress}%</span>
                              </div>
                              <Progress value={activity.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Activity Details Modal */}
      {selectedActivity && (
        <Card className="fixed inset-4 z-50 max-w-2xl mx-auto my-auto h-fit border-2 border-purple-300 shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-6 w-6 text-purple-600" />
                Activity Details
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedActivity(null)}
              >
                ✕
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Type:</span>
                <span className="font-semibold ml-2">{selectedActivity.type}</span>
              </div>
              <div>
                <span className="text-slate-600">Status:</span>
                <span className="ml-2">{getStatusBadge(selectedActivity.status)}</span>
              </div>
              <div>
                <span className="text-slate-600">Partner:</span>
                <span className="font-semibold ml-2">{selectedActivity.partnerName}</span>
              </div>
              <div>
                <span className="text-slate-600">Product:</span>
                <span className="font-semibold ml-2">{selectedActivity.productName}</span>
              </div>
              <div>
                <span className="text-slate-600">Marketplace:</span>
                <span className="font-semibold ml-2 capitalize">{selectedActivity.marketplace}</span>
              </div>
              <div>
                <span className="text-slate-600">Duration:</span>
                <span className="font-semibold ml-2">{selectedActivity.duration}s</span>
              </div>
            </div>

            {selectedActivity.details && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Tafsilotlar:</h4>
                <p className="text-sm text-slate-700">{selectedActivity.details}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
