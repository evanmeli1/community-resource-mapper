import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const resources = await prisma.resource.findMany({
    select: { id: true, updatedAt: true }
  })

  const resourceUrls = resources.map((resource) => ({
    url: `http://localhost:3000/resource/${resource.id}`,
    lastModified: resource.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: 'http://localhost:3000',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...resourceUrls,
  ]
}