// Chat API Routes - Partner-Admin Communication
import express, { Request, Response } from 'express';
import { asyncHandler } from '../errorHandler';
import { storage } from '../storage';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get or create chat room
router.get('/room', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  
  if (!user || !partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }

  // Mock chat room for now
  const chatRoom = {
    id: `chat-${partner.id}`,
    partnerId: partner.id,
    adminId: null,
    status: 'active',
    partnerName: partner.businessName,
    createdAt: new Date().toISOString()
  };

  res.json(chatRoom);
}));

// Get messages
router.get('/messages', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  
  if (!user || !partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }

  // Mock messages
  const messages = [
    {
      id: 'msg-1',
      chatRoomId: `chat-${partner.id}`,
      senderId: 'admin-123',
      senderRole: 'admin',
      senderName: 'Admin Support',
      content: 'Salom! Sizga qanday yordam bera olaman?',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      readAt: new Date().toISOString()
    }
  ];

  res.json(messages);
}));

// Send message
router.post('/messages', asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const partner = (req as any).partner;
  const { content } = req.body;
  
  if (!user || !partner) {
    return res.status(404).json({ message: 'Partner not found' });
  }

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Xabar bo\\'sh bo\\'lishi mumkin emas' });
  }

  const message = {
    id: `msg-${uuidv4()}`,
    chatRoomId: `chat-${partner.id}`,
    senderId: user.id,
    senderRole: user.role,
    senderName: `${user.firstName} ${user.lastName}`,
    content,
    createdAt: new Date().toISOString(),
    readAt: null
  };

  res.status(201).json({
    message: 'Xabar yuborildi',
    data: message
  });
}));

export default router;
