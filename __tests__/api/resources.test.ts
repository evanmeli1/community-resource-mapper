import { NextRequest } from 'next/server';
import { GET } from '../../app/api/resources/route';

// Mock Prisma
const mockFindMany = jest.fn();
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    resource: {
      findMany: mockFindMany
    }
  }))
}));

describe('/api/resources', () => {
  beforeEach(() => {
    mockFindMany.mockClear();
    mockFindMany.mockResolvedValue([
      {
        id: '1',
        name: 'Test Food Bank',
        category: 'food',
        lat: 37.7749,
        lng: -122.4194,
        address: '123 Test St'
      }
    ]);
  });

  it('should return resources successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/resources');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveLength(1);
  });
  
  it('should filter by geographic bounds', async () => {
    const request = new NextRequest('http://localhost:3000/api/resources?north=38&south=37&east=-122&west=-123');
    const response = await GET(request);
    
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        lat: { gte: 37, lte: 38 },
        lng: { gte: -123, lte: -122 }
      },
      select: expect.any(Object),
      orderBy: { name: 'asc' },
      take: 200
    });
  });

  it('should filter by category', async () => {
    const request = new NextRequest('http://localhost:3000/api/resources?category=food');
    await GET(request);
    
    expect(mockFindMany).toHaveBeenCalledWith({
      where: { category: 'food' },
      select: expect.any(Object),
      orderBy: { name: 'asc' },
      take: 200
    });
  });
});