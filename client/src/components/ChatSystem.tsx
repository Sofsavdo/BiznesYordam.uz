import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  messageType?: 'text' | 'file' | 'image';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}

interface ChatPartner {
  id: string;
  businessName: string;
  businessCategory: string;
  userData: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
  };
  isOnline: boolean;
  lastMessage?: Message;
}

interface ChatSystemProps {
  partnerId?: string;
  isAdmin?: boolean;
}

export function ChatSystem({ partnerId, isAdmin = false }: ChatSystemProps) {
  const { user } = useAuth();
  const { isConnected, sendMessage, connectionStatus, reconnect, lastMessage } = useWebSocket();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat partners (for admin)
  useEffect(() => {
    if (isAdmin) {
      loadChatPartners();
    }
  }, [isAdmin]);

  // Load messages for selected partner
  useEffect(() => {
    if (selectedPartner) {
      loadMessages(selectedPartner.userData.id);
    }
  }, [selectedPartner]);

  // Handle WebSocket messages via useWebSocket hook
  useEffect(() => {
    if (!isConnected || !selectedPartner || !lastMessage) return;

    // Process incoming WebSocket messages
    if (lastMessage.type === 'message' && lastMessage.data) {
      const message = lastMessage.data;
      if (
        (message.fromUserId === selectedPartner.userData.id && message.toUserId === user?.id) ||
        (message.fromUserId === user?.id && message.toUserId === selectedPartner.userData.id)
      ) {
        // Check if message already exists to avoid duplicates
        setMessages(prev => {
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    }
  }, [isConnected, selectedPartner, user?.id, lastMessage]);

  const loadChatPartners = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', '/api/admin/chat-partners');
      const data = await response.json();
      setPartners(data);
      
      // Auto-select first partner if none selected
      if (data.length > 0 && !selectedPartner) {
        setSelectedPartner(data[0]);
      }
    } catch (error) {
      console.error('Error loading chat partners:', error);
      toast({
        title: "Xatolik",
        description: "Hamkorlar yuklanmadi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (partnerUserId: string) => {
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', `/api/admin/chats/${partnerUserId}/messages`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Xatolik",
        description: "Xabarlar yuklanmadi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async (content: string, messageType: 'text' | 'file' = 'text', fileData?: any) => {
    if (!selectedPartner || !content.trim()) return;

    try {
      const messageData = {
        message: content,
        messageType,
        ...(fileData && { fileUrl: fileData.fileUrl, fileName: fileData.fileName, fileSize: fileData.fileSize })
      };

      const response = await apiRequest(
        'POST', 
        `/api/chat/partners/${selectedPartner.id}/message`, 
        messageData
      );

      if (response.ok) {
        const result = await response.json();
        setMessages(prev => [...prev, result.newMessage]);
        setNewMessage('');
        
        // Send via WebSocket for real-time delivery
        sendMessage({
          type: 'message',
          data: {
            toUserId: selectedPartner.userData.id,
            content,
            messageType,
            ...(fileData && { fileUrl: fileData.fileUrl, fileName: fileData.fileName, fileSize: fileData.fileSize })
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Xatolik",
        description: "Xabar yuborilmadi",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendChatMessage(newMessage.trim());
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload file (simplified - in real app, upload to cloud storage)
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiRequest('POST', '/api/chat/upload', formData);
      const fileData = await response.json();

      // Send file message
      await sendChatMessage(file.name, 'file', fileData);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Xatolik",
        description: "Fayl yuklanmadi",
        variant: "destructive"
      });
    }
  };

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!user) {
    return (
      <Card className="w-full h-full">
        <CardContent className="flex items-center justify-center h-full">
          <p>Avtorizatsiya talab qilinadi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex h-full">
      {/* Partner List (Admin only) */}
      {isAdmin && (
        <div className="w-80 border-r">
          <Card className="h-full rounded-none border-0">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center justify-between">
                <span>Hamkorlar</span>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {connectionStatus === 'connected' ? 'Online' : 'Offline'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-200px)]">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                      selectedPartner?.id === partner.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedPartner(partner)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {getInitials(partner.businessName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{partner.businessName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {partner.businessCategory}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={partner.isOnline ? "default" : "secondary"} className="text-xs">
                            {partner.isOnline ? 'Online' : 'Offline'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedPartner ? (
          <>
            {/* Chat Header */}
            <Card className="rounded-none border-0 border-b">
              <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {getInitials(selectedPartner.businessName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedPartner.businessName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {selectedPartner.businessCategory}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={selectedPartner.isOnline ? "default" : "secondary"}>
                      {selectedPartner.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.fromUserId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${message.fromUserId === user.id ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.fromUserId === user.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.messageType === 'file' ? (
                            <div className="flex items-center space-x-2">
                              <Paperclip className="h-4 w-4" />
                              <span>{message.fileName || 'Fayl'}</span>
                            </div>
                          ) : (
                            <p className="text-sm">{message.content}</p>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <p className="text-sm text-muted-foreground">Yozmoqda...</p>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <Card className="rounded-none border-0 border-t">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Xabar yozing..."
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Emoji picker */}}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Suhbatlashish uchun hamkor tanlang</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}