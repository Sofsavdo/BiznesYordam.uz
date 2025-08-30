import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import { Send, MessageCircle, X, Users } from 'lucide-react';

interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  fromUser?: {
    username: string;
    firstName?: string;
    lastName?: string;
  };
}

interface ChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatSystem({ isOpen, onClose }: ChatSystemProps) {
  const { user } = useAuth();
  const { isConnected, sendMessage } = useWebSocket();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get all users for chat list
  const { data: users = [] } = useQuery({
    queryKey: ['/api/users'],
    enabled: isOpen && user?.role === 'admin',
  });

  // Get messages for selected user
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['/api/messages'],
    enabled: isOpen && !!user?.id,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { toUserId: string; content: string }) => {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Xabar yuborishda xatolik');
      return response.json();
    },
    onSuccess: () => {
      setNewMessage('');
      refetchMessages();
      queryClient.invalidateQueries({ queryKey: ['/api/messages'] });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Xabar yuborishda xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });

  // Filter messages for selected user
  const filteredMessages = messages.filter((msg: Message) => 
    (msg.fromUserId === user?.id && msg.toUserId === selectedUserId) ||
    (msg.fromUserId === selectedUserId && msg.toUserId === user?.id)
  );

  // Get unread message count
  const unreadCount = messages.filter((msg: Message) => 
    msg.toUserId === user?.id && !msg.isRead
  ).length;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUserId) return;

    sendMessageMutation.mutate({
      toUserId: selectedUserId,
      content: newMessage.trim(),
    });

    // Also send via WebSocket for real-time
    sendMessage({
      type: 'message',
      data: {
        toUserId: selectedUserId,
        content: newMessage.trim(),
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat tizimi
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? 'Ulangan' : 'Uzilgan'}
          </div>
        </CardHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* User list for admin */}
          {user?.role === 'admin' && (
            <div className="w-64 border-r flex flex-col">
              <div className="p-4 border-b">
                <h3 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Foydalanuvchilar
                </h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {users.map((userItem: any) => (
                    <button
                      key={userItem.id}
                      onClick={() => setSelectedUserId(userItem.id)}
                      className={`w-full text-left p-3 rounded-lg hover:bg-accent transition-colors ${
                        selectedUserId === userItem.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="font-medium">
                        {userItem.firstName} {userItem.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {userItem.role}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedUserId ? (
              <>
                {/* Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {filteredMessages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.fromUserId === user?.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="text-sm">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message input */}
                <div className="p-4 border-t flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Xabar yozing..."
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendMessageMutation.isPending}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                {user?.role === 'admin' ? 'Chat qilish uchun foydalanuvchi tanlang' : 'Admin bilan bog\'lanish uchun kutmoqda'}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}