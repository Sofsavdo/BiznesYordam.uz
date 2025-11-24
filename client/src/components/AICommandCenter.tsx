// AI COMMAND CENTER
// Admin control panel for AI Manager - Send commands, configure, monitor

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Terminal,
  Send,
  Brain,
  Settings,
  Sliders,
  Database,
  Zap,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Code,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AICommand {
  id: string;
  command: string;
  timestamp: Date;
  response?: string;
  status: 'pending' | 'executed' | 'failed';
}

export function AICommandCenter() {
  const { toast } = useToast();
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<AICommand[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // AI Configuration
  const [aiConfig, setAiConfig] = useState({
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.7,
    maxTokens: 4096,
    parallelWorkers: 100,
    retryAttempts: 3,
    timeout: 300
  });

  // Send command to AI
  const handleSendCommand = async () => {
    if (!command.trim()) return;

    const newCommand: AICommand = {
      id: `cmd_${Date.now()}`,
      command: command,
      timestamp: new Date(),
      status: 'pending'
    };

    setCommandHistory(prev => [newCommand, ...prev]);
    setIsProcessing(true);
    setCommand('');

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = `AI Manager: Buyruq qabul qilindi va bajarilmoqda.\n\nCommand: "${command}"\nStatus: Executing\nEstimated time: 30 seconds`;

      setCommandHistory(prev =>
        prev.map(cmd =>
          cmd.id === newCommand.id
            ? { ...cmd, response, status: 'executed' }
            : cmd
        )
      );

      toast({
        title: "Buyruq Yuborildi",
        description: "AI Manager buyruqni bajarmoqda",
        duration: 3000
      });

    } catch (error) {
      setCommandHistory(prev =>
        prev.map(cmd =>
          cmd.id === newCommand.id
            ? { ...cmd, status: 'failed', response: 'Xatolik yuz berdi' }
            : cmd
        )
      );

      toast({
        title: "Xatolik",
        description: "Buyruqni yuborishda xatolik",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="commands" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="commands">
            <Terminal className="h-4 w-4 mr-2" />
            Buyruqlar
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Sozlamalar
          </TabsTrigger>
          <TabsTrigger value="chat">
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Chat
          </TabsTrigger>
        </TabsList>

        {/* Commands Tab */}
        <TabsContent value="commands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-6 w-6 text-purple-600" />
                AI Manager'ga Buyruq Berish
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Command Input */}
              <div>
                <Label>Buyruq</Label>
                <Textarea
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Masalan: 'Barcha iPhone mahsulotlarini Uzum Market'da narxini 5% pasaytir'"
                  className="mt-1 min-h-[100px] font-mono"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSendCommand();
                    }
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ctrl+Enter - yuborish
                </p>
              </div>

              <Button
                onClick={handleSendCommand}
                disabled={isProcessing || !command.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Buyruqni Yuborish
                  </>
                )}
              </Button>

              {/* Quick Commands */}
              <div>
                <Label className="mb-2 block">Tez Buyruqlar:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCommand("Barcha mahsulotlarni SEO optimizatsiya qil")}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    SEO Optimize
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCommand("Raqiblar narxini tekshir va bizning narxni moslashtir")}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Price Sync
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCommand("Barcha rasmlarni quality check qil")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Quality Check
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCommand("Eng yaxshi sotilayotgan mahsulotlarni tahlil qil")}
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Trend Analysis
                  </Button>
                </div>
              </div>

              {/* Command History */}
              <div className="mt-6">
                <Label className="mb-3 block">Buyruqlar Tarixi:</Label>
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {commandHistory.map((cmd) => (
                    <div
                      key={cmd.id}
                      className="bg-slate-50 border border-slate-200 rounded-lg p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Code className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-mono text-slate-900">
                              {cmd.command}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">
                            {cmd.timestamp.toLocaleString('uz-UZ')}
                          </div>
                        </div>
                        <Badge
                          variant={
                            cmd.status === 'executed' ? 'default' :
                            cmd.status === 'failed' ? 'destructive' :
                            'secondary'
                          }
                        >
                          {cmd.status === 'executed' ? 'Bajarildi' :
                           cmd.status === 'failed' ? 'Xato' :
                           'Kutilmoqda'}
                        </Badge>
                      </div>

                      {cmd.response && (
                        <div className="mt-2 bg-white border border-slate-200 rounded p-2">
                          <p className="text-xs font-mono text-slate-700 whitespace-pre-wrap">
                            {cmd.response}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-6 w-6 text-blue-600" />
                AI Manager Sozlamalari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AI Model */}
              <div>
                <Label>AI Model</Label>
                <select
                  value={aiConfig.model}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                >
                  <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet (Recommended)</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-4-turbo">GPT-4 Turbo</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                </select>
              </div>

              {/* Temperature */}
              <div>
                <Label>Temperature (Creativity): {aiConfig.temperature}</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={aiConfig.temperature}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                  className="w-full mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  0 = Aniq, 1 = Kreativ
                </p>
              </div>

              {/* Max Tokens */}
              <div>
                <Label>Max Tokens</Label>
                <Input
                  type="number"
                  value={aiConfig.maxTokens}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                  className="mt-1"
                />
              </div>

              {/* Parallel Workers */}
              <div>
                <Label>Parallel Workers: {aiConfig.parallelWorkers}</Label>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={aiConfig.parallelWorkers}
                  onChange={(e) => setAiConfig(prev => ({ ...prev, parallelWorkers: parseInt(e.target.value) }))}
                  className="w-full mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Ko'proq worker = tezroq, lekin ko'proq server kerak
                </p>
              </div>

              {/* Save Button */}
              <Button className="w-full" size="lg">
                <Settings className="h-5 w-5 mr-2" />
                Sozlamalarni Saqlash
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-green-600" />
                AI Manager bilan Suhbat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 text-center">
                <Brain className="h-16 w-16 text-green-600 mx-auto mb-4 animate-pulse" />
                <h3 className="text-xl font-bold text-green-900 mb-2">
                  AI Chat Interface
                </h3>
                <p className="text-green-800 mb-4">
                  AI Manager bilan to'g'ridan-to'g'ri suhbatlashing.
                  Savollar bering, buyruqlar yuboring, natijalarni muhokama qiling.
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Suhbatni Boshlash
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
