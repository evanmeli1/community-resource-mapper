const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Create a test food bank
  const foodBank = await prisma.resource.create({
    data: {
      name: "Test Food Bank",
      category: "food",
      type: "food_bank", 
      address: "123 Main St, San Francisco, CA",
      lat: 37.7749,
      lng: -122.4194,
      schedule: { "monday": "9-5", "tuesday": "9-5" },
      offerings: ["groceries", "hot_meals"],
      requirements: ["id_required"]
    }
  })
  
  console.log("✅ Created resource:", foodBank)
  
  // Now fetch it back
  const allResources = await prisma.resource.findMany()
  console.log("📋 All resources:", allResources)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())