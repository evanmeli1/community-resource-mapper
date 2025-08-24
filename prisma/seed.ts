import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const realResources = [
  // --- FOOD ---
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
      monday: "9:00-12:00",
      tuesday: "closed",
      wednesday: "9:00-12:00",
      thursday: "closed",
      friday: "9:00-12:00",
      saturday: "closed",
      sunday: "closed"
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
      monday: "8:00-9:00,12:00-13:30,16:00-17:30",
      tuesday: "8:00-9:00,12:00-13:30,16:00-17:30",
      wednesday: "8:00-9:00,12:00-13:30,16:00-17:30",
      thursday: "8:00-9:00,12:00-13:30,16:00-17:30",
      friday: "8:00-9:00,12:00-13:30,16:00-17:30",
      saturday: "8:00-9:00,12:00-13:30",
      sunday: "8:00-9:00,12:00-13:30"
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
    website: "",
    schedule: {
      monday: "closed",
      tuesday: "14:00-17:00",
      wednesday: "closed",
      thursday: "14:00-17:00",
      friday: "closed",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "produce", "hygiene_items"],
    requirements: ["families_only"]
  },
  {
    name: "CityTeam Mobile Pantry – San Jose",
    category: "food",
    type: "mobile_pantry",
    address: "580 Charles St, San Jose, CA 95112",
    lat: 37.3382,
    lng: -121.8863,
    phone: "(408) 232-5600",
    website: "https://www.cityteam.org",
    schedule: {
      monday: "closed",
      tuesday: "closed",
      wednesday: "closed",
      thursday: "closed",
      friday: "closed",
      saturday: "9:30-11:30",
      sunday: "closed"
    },
    offerings: ["groceries", "clothing", "hygiene_kits"],
    requirements: []
  },
  {
    name: "Project Open Hand – San Francisco",
    category: "food",
    type: "meal_service",
    address: "730 Polk St, San Francisco, CA 94109",
    lat: 37.7836,
    lng: -122.4192,
    phone: "(415) 447-2300",
    website: "https://www.openhand.org",
    schedule: {
      monday: "10:00-16:00",
      tuesday: "10:00-16:00",
      wednesday: "10:00-16:00",
      thursday: "10:00-16:00",
      friday: "10:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["meals", "grocery_bags", "medically_tailored_meals"],
    requirements: []
  },

  // --- HEALTH ---
  {
    name: "San Francisco Free Clinic",
    category: "health",
    type: "free_clinic",
    address: "4900 California St, San Francisco, CA 94118",
    lat: 37.7864,
    lng: -122.4647,
    phone: "(415) 750-9894",
    website: "https://www.sffc.org",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["primary_care", "insurance_help"],
    requirements: ["appointment_required"]
  },
  {
    name: "Clinic by the Bay",
    category: "health",
    type: "free_clinic",
    address: "35 Onondaga Ave, San Francisco, CA 94112",
    lat: 37.7190,
    lng: -122.4520,
    phone: "(415) 405-0207",
    website: "https://www.clinicbythebay.org",
    schedule: {
      monday: "by appointment",
      tuesday: "by appointment",
      wednesday: "by appointment",
      thursday: "by appointment",
      friday: "by appointment",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["primary_care", "preventative"],
    requirements: ["uninsured_only", "sf_sanmateo_residents"]
  },
  {
    name: "Berkeley Free Clinic",
    category: "health",
    type: "free_clinic",
    address: "2339 Durant Ave, Berkeley, CA 94704",
    lat: 37.8670,
    lng: -122.2594,
    phone: "(510) 548-2570",
    website: "https://www.berkeleyfreeclinic.org",
    schedule: {
      monday: "10:00-16:00",
      tuesday: "10:00-16:00",
      wednesday: "10:00-16:00",
      thursday: "10:00-16:00",
      friday: "10:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["medical_care", "dental", "counseling"],
    requirements: []
  },
  {
    name: "Native American Health Center – Oakland",
    category: "health",
    type: "community_clinic",
    address: "2950 International Blvd, Oakland, CA 94601",
    lat: 37.7772,
    lng: -122.2226,
    phone: "(510) 535-4400",
    website: "https://www.nativehealth.org",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["medical_care", "dental", "mental_health"],
    requirements: []
  },

  // --- SHELTER ---
  {
    name: "Covenant House Oakland",
    category: "shelter",
    type: "emergency_shelter",
    address: "200 Harrison St, Oakland, CA 94607",
    lat: 37.7962,
    lng: -122.2730,
    phone: "(510) 379-1010",
    website: "https://www.covenanthouse.org",
    schedule: {
      monday: "open 24 hours",
      tuesday: "open 24 hours",
      wednesday: "open 24 hours",
      thursday: "open 24 hours",
      friday: "open 24 hours",
      saturday: "open 24 hours",
      sunday: "open 24 hours"
    },
    offerings: ["meals", "showers", "clothing", "medical_care", "transportation_referrals"],
    requirements: ["youth_under_21"]
  },
  {
    name: "MSC South Shelter",
    category: "shelter",
    type: "emergency_shelter",
    address: "525 5th St, San Francisco, CA 94107",
    lat: 37.7781,
    lng: -122.3987,
    phone: "(415) 597-7960",
    website: "https://www.sfhsa.org",
    schedule: {
      monday: "open 24 hours",
      tuesday: "open 24 hours",
      wednesday: "open 24 hours",
      thursday: "open 24 hours",
      friday: "open 24 hours",
      saturday: "open 24 hours",
      sunday: "open 24 hours"
    },
    offerings: ["beds", "meals", "case_management"],
    requirements: ["id_required"]
  },
  {
    name: "St. Vincent de Paul Shelter – Oakland",
    category: "shelter",
    type: "multi_service",
    address: "675 23rd St, Oakland, CA 94612",
    lat: 37.8161,
    lng: -122.2792,
    phone: "(510) 638-7600",
    website: "https://www.svdp-alameda.org",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["showers", "laundry", "clothing", "hygiene_kits"],
    requirements: []
  },
  {
    name: "Oakland Elizabeth House",
    category: "shelter",
    type: "transitional_housing",
    address: "6423 Colby St, Oakland, CA 94618",
    lat: 37.8490,
    lng: -122.2562,
    phone: "(510) 658-1380",
    website: "https://oakehouse.org",
    schedule: {
      monday: "open 24 hours",
      tuesday: "open 24 hours",
      wednesday: "open 24 hours",
      thursday: "open 24 hours",
      friday: "open 24 hours",
      saturday: "open 24 hours",
      sunday: "open 24 hours"
    },
    offerings: ["transitional_housing", "case_management"],
    requirements: ["women_with_children"]
  },

  // --- CLOTHING ---
  {
    name: "St. Anthony's Free Clothing Program",
    category: "clothing",
    type: "clothing_closet",
    address: "121 Golden Gate Ave, San Francisco, CA 94102",
    lat: 37.7817,
    lng: -122.4136,
    phone: "(415) 241-2600",
    website: "https://www.stanthonysf.org",
    schedule: {
      monday: "8:15-12:00",
      tuesday: "13:00-16:00",
      wednesday: "8:15-12:00",
      thursday: "13:00-16:00",
      friday: "8:15-12:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["clothing", "business_attire", "children_clothing"],
    requirements: ["appointment_required"]
  },
  {
    name: "BAWCC Free Clothing Closet",
    category: "clothing",
    type: "clothing_closet",
    address: "318 Leavenworth St, San Francisco, CA 94102",
    lat: 37.7832,
    lng: -122.4149,
    phone: "(415) 474-2400",
    website: "https://www.bawcc.org",
    schedule: {
      monday: "9:00-15:00",
      tuesday: "9:00-15:00",
      wednesday: "9:00-15:00",
      thursday: "9:00-15:00",
      friday: "9:00-15:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["clothing", "bedding", "books"],
    requirements: []
  },

  // --- TRANSPORTATION ---
  {
    name: "SFMTA Lifeline Pass Program",
    category: "transportation",
    type: "bus_pass_assistance",
    address: "1 South Van Ness Ave, San Francisco, CA 94103",
    lat: 37.7735,
    lng: -122.4194,
    phone: "(415) 701-2311",
    website: "https://www.sfmta.com/fares/lifeline-pass",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["discounted_bus_passes", "train_passes"],
    requirements: ["proof_of_income", "sf_resident"]
  },
  {
    name: "AC Transit Low Income Fare",
    category: "transportation",
    type: "bus_pass_assistance",
    address: "1600 Franklin St, Oakland, CA 94612",
    lat: 37.8055,
    lng: -122.2680,
    phone: "(510) 891-4700",
    website: "https://www.actransit.org/fares-discounts",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["discounted_bus_passes"],
    requirements: ["proof_of_income", "alameda_county_resident"]
  }
]

async function main() {
  console.log('🌱 Starting seed...')
  await prisma.resource.deleteMany({})
  console.log('🗑️  Cleared existing resources')

  for (const resource of realResources) {
    await prisma.resource.create({ data: resource })
  }

  console.log(`✅ Created ${realResources.length} resources`)
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
