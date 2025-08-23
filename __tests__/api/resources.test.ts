import { NextRequest } from 'next/server';
import { GET } from '../../app/api/resources/route';

// Declare mockFindMany FIRST
const mockFindMany = jest.fn();

// Then use it in the mock
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    resource: {
      findMany: mockFindMany
    }
  }))
}));

// Mock your prisma singleton too
jest.mock('../../app/lib/prisma', () => ({
  prisma: {
    resource: {
      findMany: mockFindMany
    }
  }
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
});