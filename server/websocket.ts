import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';

interface WebSocketMessage {
  type: 'message' | 'notification' | 'tier_upgrade' | 'system';
  data: any;
  userId?: string;
  partnerId?: string;
}

interface ConnectedClient {
  ws: WebSocket;
  userId: string;
  userRole: string;
  partnerId?: string;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocketServer();
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
      this.clients.set(userId, { ws, userId, userRole, partnerId });

      // Send welcome message
      this.sendToUser(userId, {
        type: 'system',
        data: { message: 'WebSocket ulanishi muvaffaqiyatli' }
      });

      ws.on('message', (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          this.handleMessage(userId, message);
        } catch (error) {
          console.error('WebSocket message parsing error:', error);
        }
      });

      ws.on('close', () => {
        console.log(`🔌 WebSocket connection closed for user: ${userId}`);
        this.clients.delete(userId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
        this.clients.delete(userId);
      });
    });
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
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  private async handleChatMessage(userId: string, message: WebSocketMessage) {
    const { toUserId, content } = message.data;
    
    if (!toUserId || !content) {
      this.sendToUser(userId, {
        type: 'system',
        data: { error: 'Xabar ma\'lumotlari to\'liq emas' }
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
      data: savedMessage
    });

    // Send confirmation to sender
    this.sendToUser(userId, {
      type: 'message',
      data: { ...savedMessage, status: 'sent' }
    });
  }

  private async handleTierUpgradeRequest(userId: string, message: WebSocketMessage) {
    const { requestedTier, reason } = message.data;
    
    // Get partner info
    const partner = await storage.getPartnerByUserId(userId);
    if (!partner) {
      this.sendToUser(userId, {
        type: 'system',
        data: { error: 'Hamkor ma\'lumotlari topilmadi' }
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
        }
      }
    });

    // Confirm to partner
    this.sendToUser(userId, {
      type: 'tier_upgrade',
      data: { 
        status: 'submitted',
        message: 'Tarif yaxshilash so\'rovingiz yuborildi. Admin ko\'rib chiqadi.'
      }
    });
  }

  // Send message to specific user
  public sendToUser(userId: string, message: WebSocketMessage) {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  // Send message to all admins
  public notifyAdmins(message: WebSocketMessage) {
    this.clients.forEach((client, userId) => {
      if (client.userRole === 'admin' && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  // Send message to all partners
  public notifyPartners(message: WebSocketMessage) {
    this.clients.forEach((client, userId) => {
      if (client.userRole === 'partner' && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  // Broadcast to all connected clients
  public broadcast(message: WebSocketMessage) {
    this.clients.forEach((client, userId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
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
}

export let wsManager: WebSocketManager;

export function initializeWebSocket(server: Server) {
  wsManager = new WebSocketManager(server);
  console.log('✅ WebSocket server initialized');
  return wsManager;
}