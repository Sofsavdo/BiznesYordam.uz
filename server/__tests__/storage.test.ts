import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfitBreakdown } from '../storage';
import { db } from '../db';

// Mock the database
vi.mock('../db', () => ({
  db: {
    select: vi.fn()
  }
}));

describe('Storage - getProfitBreakdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should filter profit breakdown by period (7days)', async () => {
    const mockPartnerId = 'partner-123';
    const mockResults = [
      {
        id: '1',
        partnerId: mockPartnerId,
        date: new Date(),
        revenue: '1000',
        profit: '300',
        marketplace: 'uzum'
      }
    ];

    // Mock the query chain - where() returns an object with where() and orderBy()
    const mockOrderBy = vi.fn().mockResolvedValue(mockResults);
    const mockWhereChain = {
      where: vi.fn().mockReturnThis(),
      orderBy: mockOrderBy
    };
    mockWhereChain.where.mockReturnValue(mockWhereChain);
    
    const mockFrom = vi.fn().mockReturnValue(mockWhereChain);
    
    (db.select as any).mockReturnValue({ from: mockFrom });

    const result = await getProfitBreakdown(mockPartnerId, { period: '7days' });

    expect(db.select).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhereChain.where).toHaveBeenCalledTimes(2); // Once for partnerId, once for date filter
    expect(result).toEqual(mockResults);
  });

  it('should filter profit breakdown by marketplace', async () => {
    const mockPartnerId = 'partner-123';
    const mockResults = [
      {
        id: '1',
        partnerId: mockPartnerId,
        date: new Date(),
        revenue: '1000',
        profit: '300',
        marketplace: 'uzum'
      }
    ];

    // Mock the query chain - where() returns an object with where() and orderBy()
    const mockOrderBy = vi.fn().mockResolvedValue(mockResults);
    const mockWhereChain = {
      where: vi.fn().mockReturnThis(),
      orderBy: mockOrderBy
    };
    mockWhereChain.where.mockReturnValue(mockWhereChain);
    
    const mockFrom = vi.fn().mockReturnValue(mockWhereChain);
    
    (db.select as any).mockReturnValue({ from: mockFrom });

    const result = await getProfitBreakdown(mockPartnerId, { marketplace: 'uzum' });

    expect(db.select).toHaveBeenCalled();
    expect(mockWhereChain.where).toHaveBeenCalledTimes(2); // Once for partnerId, once for marketplace
    expect(result).toEqual(mockResults);
  });

  it('should return empty array on database error', async () => {
    const mockPartnerId = 'partner-123';
    
    // Mock database error
    const mockFrom = vi.fn().mockReturnValue({
      where: vi.fn().mockImplementation(() => {
        throw new Error('Database error');
      })
    });
    
    (db.select as any).mockReturnValue({ from: mockFrom });

    const result = await getProfitBreakdown(mockPartnerId);

    expect(result).toEqual([]);
  });
});
