import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock nodemailer before importing email module
vi.mock('nodemailer', () => {
  const mockSendMail = vi.fn();
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: mockSendMail
      }))
    }
  };
});

// Import after mocking
import { sendEmail } from '../email';
import nodemailer from 'nodemailer';

describe('Email - sendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up SMTP credentials for tests
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'testpassword';
  });

  it('should send tier upgrade email successfully', async () => {
    const mockTransporter = nodemailer.createTransport({} as any);
    const mockSendMail = mockTransporter.sendMail as any;
    mockSendMail.mockResolvedValue({ messageId: 'test-message-id' });

    const result = await sendEmail(
      'partner@example.com',
      'tierUpgradeApproved',
      { name: 'Test Partner', newTier: 'Premium' }
    );

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('test-message-id');
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: '"BiznesYordam" <test@example.com>',
        to: 'partner@example.com',
        subject: expect.stringContaining('Tarif Yangilash Tasdiqlandi'),
        html: expect.stringContaining('Test Partner')
      })
    );
  });
});
