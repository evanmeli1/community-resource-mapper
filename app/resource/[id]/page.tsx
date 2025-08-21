import { Metadata } from 'next';
import { PrismaClient } from '@prisma/client';
import ResourcePageClient from './ResourcePageClient';

const prisma = new PrismaClient();

interface ResourcePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for each resource page
export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    
    // Fetch resource data for metadata
    const resource = await prisma.resource.findUnique({
      where: { id }
    });

    if (!resource) {
      return {
        title: 'Resource Not Found | Bay Area Community Resources',
        description: 'The requested community resource could not be found.',
      };
    }

    const resourceType = resource.type.replace('_', ' ');
    const city = resource.address.includes('San Francisco') ? 'San Francisco' : 
                 resource.address.includes('San Jose') ? 'San Jose' :
                 resource.address.includes('Oakland') ? 'Oakland' : 'Bay Area';

    return {
      title: `${resource.name} - ${resourceType} in ${city} | Bay Area Community Resources`,
      description: `${resource.name} is a ${resourceType} located at ${resource.address}. Find contact information, hours, and real-time availability for this ${resource.category} resource in ${city}.`,
      keywords: [
        resource.name,
        resourceType,
        resource.category,
        city,
        'community resource',
        'Bay Area',
        resource.address,
        ...(resource.phone ? ['phone contact'] : []),
        ...(resource.website ? ['website'] : [])
      ],
      openGraph: {
        title: `${resource.name} - ${resourceType} in ${city}`,
        description: `${resource.name} provides ${resource.category} services in ${city}. Located at ${resource.address}.`,
        type: 'website',
        url: `/resource/${id}`,
        images: [
          {
            url: `/og-resource.jpg`, // You'll need to create this generic image
            width: 1200,
            height: 630,
            alt: `${resource.name} - ${resourceType} in ${city}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${resource.name} - ${resourceType}`,
        description: `${resource.category} services in ${city}`,
      },
      alternates: {
        canonical: `/resource/${id}`,
      },
      // Structured data for LocalBusiness
      other: {
        'application/ld+json': JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": resource.name,
          "description": `${resourceType} providing ${resource.category} services`,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": resource.address,
            "addressLocality": city,
            "addressRegion": "CA",
            "addressCountry": "US"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": resource.lat,
            "longitude": resource.lng
          },
          ...(resource.phone && {
            "telephone": resource.phone
          }),
          ...(resource.website && {
            "url": resource.website
          }),
          "serviceArea": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": resource.lat,
              "longitude": resource.lng
            },
            "geoRadius": "10000" // 10km radius
          },
          "openingHours": resource.schedule ? Object.entries(resource.schedule as Record<string, string>).map(([day, hours]) => 
            hours !== 'closed' ? `${day.charAt(0).toUpperCase() + day.slice(1)} ${hours}` : null
          ).filter(Boolean) : undefined
        })
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Community Resource | Bay Area Community Resources',
      description: 'Find community resources in the Bay Area',
    };
  }
}

export default function ResourcePage({ params }: ResourcePageProps) {
  return <ResourcePageClient params={params} />;
}