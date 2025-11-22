import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';

interface WebSocketMessage {
  type: 'message' | 'notification' | 'tier_upgrade' | 'system' | 'ping' | 'pong';
  data: any;
  userId?: string;
  partnerId?: string;
  timestamp?: number;
}

interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  userRole: string;
  partnerId?: string;
  lastPing?: number;
  isAlive: boolean;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();
  private heartbeatInterval!: NodeJS.Timeout;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly PING_TIMEOUT = 60000; // 60 seconds

  constructor(server: Server) {
    // Use specific path to avoid conflicts with Vite HMR WebSocket
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });
    this.setupWebSocketServer();
    this.startHeartbeat();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocket, req) => {
      console.log('🔌 New WebSocket connection');

      // Extract user info from query params or headers
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');
      const userRole = url.searchParams.get('role') || 'guest';
      const partnerId = url.searchParams.get('partnerId');

      if (!userId) {
        ws.close(1008, 'User ID required');
        return;
      }

      // Store client connection
      this.clients.set(userId, { 
        ws, 
        userId, 
        userRole, 
        partnerId: partnerId || undefined,
        isAlive: true,
        lastPing: Date.now()
      });

      // Send welcome message
      this.sendToUser(userId, {
        type: 'system',
        data: { 
          message: 'WebSocket ulanishi muvaffaqiyatli',
          timestamp: Date.now()
        }
      });

      // Set up ping/pong for connection health
      ws.on('pong', () => {
        const client = this.clients.get(userId);
        if (client) {
          client.isAlive = true;
          client.lastPing = Date.now();
        }
      });

      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(userId, message);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
          this.sendToUser(userId, {
            type: 'system',
            data: { 
              error: 'Xabar formatida xatolik',
              timestamp: Date.now()
            }
          });
        }
      });

      ws.on('close', (code, reason) => {
        console.log(`🔌 WebSocket connection closed for user: ${userId} (${code}: ${reason})`);
        this.clients.delete(userId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
        this.clients.delete(userId);
      });
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.clients.forEach((client, userId) => {
        if (!client.isAlive) {
          console.log(`Terminating connection for user: ${userId} (no heartbeat)`);
          client.ws.terminate();
          this.clients.delete(userId);
          return;
        }

        client.isAlive = false;
        client.ws.ping();
      });
    }, this.HEARTBEAT_INTERVAL);
  }

  private async handleMessage(userId: string, message: WebSocketMessage) {
    try {
      switch (message.type) {
        case 'message':
          await this.handleChatMessage(userId, message);
          break;
        case 'tier_upgrade':
          await this.handleTierUpgradeRequest(userId, message);
          break;
        case 'ping':
          this.sendToUser(userId, {
            type: 'pong',
            data: { timestamp: Date.now() }
          });
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
      this.sendToUser(userId, {
        type: 'system',
        data: { 
          error: 'Xabar qayta ishlashda xatolik',
          timestamp: Date.now()
        }
      });
    }
  }

  private async handleChatMessage(userId: string, message: WebSocketMessage) {
    const { toUserId, content } = message.data;
    
    if (!toUserId || !content) {
      this.sendToUser(userId, {
        type: 'system',
        data: { 
          error: 'Xabar ma\'lumotlari to\'liq emas',
          timestamp: Date.now()
        }
      });
      return;
    }

    // Validate content length
    if (content.length > 1000) {
      this.sendToUser(userId, {
        type: 'system',
        data: { 
          error: 'Xabar juda uzun (maksimal 1000 belgi)',
          timestamp: Date.now()
        }
      });
      return;
    }

    // Save message to database
    const savedMessage = await storage.createMessage({
      fromUserId: userId,
      toUserId,
      content,
      isRead: false
    });

    // Send to recipient if online
    this.sendToUser(toUserId, {
      type: 'message',
      data: {
        ...savedMessage,
        timestamp: Date.now()
      }
    });

    // Send confirmation to sender
    this.sendToUser(userId, {
      type: 'message',
      data: { 
        ...savedMessage, 
        status: 'sent',
        timestamp: Date.now()
      }
    });
  }

  private async handleTierUpgradeRequest(userId: string, message: WebSocketMessage) {
    const { requestedTier, reason } = message.data;
    
    // Get partner info
    const partner = await storage.getPartnerByUserId(userId);
    if (!partner) {
      this.sendToUser(userId, {
        type: 'system',
        data: { 
          error: 'Hamkor ma\'lumotlari topilmadi',
          timestamp: Date.now()
        }
      });
      return;
    }

    // Create tier upgrade request
    const request = await storage.createTierUpgradeRequest({
      partnerId: partner.id,
      requestedTier,
      reason
    });

    // Notify all admins
    this.notifyAdmins({
      type: 'tier_upgrade',
      data: {
        request,
        partner: {
          id: partner.id,
          businessName: partner.businessName,
          currentTier: partner.pricingTier
        },
        timestamp: Date.now()
      }
    });

    // Confirm to partner
    this.sendToUser(userId, {
      type: 'tier_upgrade',
      data: { 
        status: 'submitted',
        message: 'Tarif yaxshilash so\'rovingiz yuborildi. Admin ko\'rib chiqadi.',
        timestamp: Date.now()
      }
    });
  }

  // Send message to specific user
  public sendToUser(userId: string, message: WebSocketMessage) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error(`Error sending message to user ${userId}:`, error);
        this.clients.delete(userId);
      }
    }
  }

  // Send message to all admins
  public notifyAdmins(message: WebSocketMessage) {
    this.clients.forEach((client, userId) => {
      if (client.userRole === 'admin' && client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending admin notification to user ${userId}:`, error);
          this.clients.delete(userId);
        }
      }
    });
  }

  // Send message to all partners
  public notifyPartners(message: WebSocketMessage) {
    this.clients.forEach((client, userId) => {
      if (client.userRole === 'partner' && client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error sending partner notification to user ${userId}:`, error);
          this.clients.delete(userId);
        }
      }
    });
  }

  // Broadcast to all connected clients
  public broadcast(message: WebSocketMessage) {
    this.clients.forEach((client, userId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(JSON.stringify(message));
        } catch (error) {
          console.error(`Error broadcasting to user ${userId}:`, error);
          this.clients.delete(userId);
        }
      }
    });
  }

  // Get connected clients count
  public getConnectedClientsCount(): number {
    return this.clients.size;
  }

  // Get connected clients info
  public getConnectedClients(): ConnectedClient[] {
    return Array.from(this.clients.values());
  }

  // Get online status for specific user
  public isUserOnline(userId: string): boolean {
    const client = this.clients.get(userId);
    return client ? client.ws.readyState === WebSocket.OPEN : false;
  }

  // Cleanup method
  public cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.wss.close();
  }
}

export let wsManager: WebSocketManager;

export function initializeWebSocket(server: Server) {
  wsManager = new WebSocketManager(server);
  console.log('✅ WebSocket server initialized');
  return wsManager;
}