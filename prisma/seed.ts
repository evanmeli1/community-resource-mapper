import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const realResources = [
  {
    name: "SF-Marin Food Bank - Mission Branch",
    category: "food",
    type: "food_bank",
    address: "3180 20th St, San Francisco, CA 94110",
    lat: 37.7589,
    lng: -122.4096,
    phone: "(415) 282-1900",
    website: "https://www.sfmfoodbank.org",
    schedule: {
      "monday": "9:00-12:00",
      "tuesday": "closed", 
      "wednesday": "9:00-12:00",
      "thursday": "closed",
      "friday": "9:00-12:00",
      "saturday": "closed",
      "sunday": "closed"
    },
    offerings: ["groceries", "produce", "baby_food"],
    requirements: ["id_required", "proof_of_income"]
  },
  {
    name: "Glide Memorial Church Meals",
    category: "food", 
    type: "soup_kitchen",
    address: "330 Ellis St, San Francisco, CA 94102",
    lat: 37.7849,
    lng: -122.4094,
    phone: "(415) 674-6000",
    website: "https://www.glide.org",
    schedule: {
      "monday": "11:30-13:30",
      "tuesday": "11:30-13:30",
      "wednesday": "11:30-13:30", 
      "thursday": "11:30-13:30",
      "friday": "11:30-13:30",
      "saturday": "11:30-13:30",
      "sunday": "11:30-13:30"
    },
    offerings: ["hot_meals", "breakfast", "dinner"],
    requirements: []
  },
  {
    name: "Hamilton Family Center Food Pantry",
    category: "food",
    type: "food_pantry", 
    address: "582 Market St, San Francisco, CA 94104",
    lat: 37.7890,
    lng: -122.4024,
    phone: "(415) 292-4700",
    schedule: {
      "monday": "closed",
      "tuesday": "14:00-17:00",
      "wednesday": "closed",
      "thursday": "14:00-17:00", 
      "friday": "closed",
      "saturday": "closed",
      "sunday": "closed"
    },
    offerings: ["groceries", "produce", "hygiene_items"],
    requirements: ["families_only"]
  }
]

async function main() {
  console.log('🌱 Starting seed...')
  
  // Delete existing test data
  await prisma.resource.deleteMany({})
  console.log('🗑️  Cleared existing resources')
  
  // Add real resources
  for (const resource of realResources) {
    await prisma.resource.create({
      data: resource
    })
  }
  
  console.log(`✅ Created ${realResources.length} real resources`)
  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })