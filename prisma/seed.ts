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
  },
  // --- FREMONT RESOURCES (10) ---
  {
    name: "TCV Food Bank + Mobile Pantry",
    category: "food",
    type: "food_bank",
    address: "37350 Joseph Street, Fremont, CA 94536",
    lat: 37.5473,
    lng: -121.9613,
    phone: "(510) 793-4583",
    website: "https://tcvfoodbank.org",
    schedule: {
      monday: "10:00-14:00",
      tuesday: "10:00-14:00",
      wednesday: "10:00-14:00",
      thursday: "10:00-14:00",
      friday: "10:00-11:30",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce", "mobile_pantry"],
    requirements: []
  },
  {
    name: "Salaam Food Pantry",
    category: "food",
    type: "food_pantry",
    address: "4650 Cushing Parkway, Fremont, CA 94538",
    lat: 37.5015,
    lng: -121.9740,
    phone: "(510) 519-7250",
    website: "https://salaamfoodpantry.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "by appointment",
      sunday: "closed"
    },
    offerings: ["monthly_food_bags", "fresh_groceries", "community_meals"],
    requirements: []
  },
  {
    name: "Bay Area Community Health - Fremont",
    category: "health",
    type: "community_clinic",
    address: "5504 Monterey Rd, San Jose, CA 95138",
    lat: 37.2988,
    lng: -121.8490,
    phone: "(510) 770-8040",
    website: "https://bach.health",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["medical_care", "behavioral_health", "womens_health"],
    requirements: []
  },
  {
    name: "RotaCare Free Medical Clinic - Fremont",
    category: "health",
    type: "free_clinic",
    address: "100 Oak St, Fremont, CA 94536",
    lat: 37.5473,
    lng: -121.9896,
    phone: "(408) 715-3088",
    website: "https://rotacare.org",
    schedule: {
      monday: "closed",
      tuesday: "closed",
      wednesday: "17:00-20:00",
      thursday: "closed",
      friday: "closed",
      saturday: "8:00-12:00",
      sunday: "closed"
    },
    offerings: ["primary_care", "prescriptions", "referrals"],
    requirements: ["uninsured", "low_income"]
  },
  {
    name: "Fremont Family Resource Center",
    category: "shelter",
    type: "multi_service",
    address: "39155 Liberty St, Fremont, CA 94538",
    lat: 37.5015,
    lng: -121.9740,
    phone: "(510) 574-2140",
    website: "https://www.fremont.gov",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["emergency_assistance", "case_management", "housing_help"],
    requirements: []
  },
  {
    name: "Fremont Community Clothing Bank",
    category: "clothing",
    type: "clothing_closet",
    address: "4650 Thornton Ave, Fremont, CA 94536",
    lat: 37.5189,
    lng: -121.9613,
    phone: "(510) 792-4357",
    website: "",
    schedule: {
      monday: "closed",
      tuesday: "10:00-14:00",
      wednesday: "closed",
      thursday: "10:00-14:00",
      friday: "closed",
      saturday: "10:00-14:00",
      sunday: "closed"
    },
    offerings: ["clothing", "shoes", "household_items"],
    requirements: ["fremont_resident"]
  },
  {
    name: "AC Transit Fremont Office",
    category: "transportation",
    type: "bus_pass_assistance",
    address: "39801 Cedar Blvd, Newark, CA 94560",
    lat: 37.5189,
    lng: -122.0363,
    phone: "(510) 891-4700",
    website: "https://www.actransit.org",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["discount_passes", "senior_passes", "disabled_passes"],
    requirements: ["proof_of_income", "alameda_county_resident"]
  },
  {
    name: "Fremont WIC Program",
    category: "health",
    type: "nutrition_program",
    address: "39155 Liberty Street, Fremont, CA 94538",
    lat: 37.5015,
    lng: -121.9740,
    phone: "(510) 471-5913",
    website: "https://www.alamedacountywic.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["nutrition_vouchers", "health_screenings", "breastfeeding_support"],
    requirements: ["pregnant_women", "mothers_with_young_children"]
  },
  {
    name: "Salvation Army - Fremont",
    category: "food",
    type: "soup_kitchen",
    address: "37350 Fremont Blvd, Fremont, CA 94536",
    lat: 37.5473,
    lng: -121.9896,
    phone: "(510) 792-4304",
    website: "https://www.salvationarmyusa.org",
    schedule: {
      monday: "12:00-13:30",
      tuesday: "12:00-13:30",
      wednesday: "12:00-13:30",
      thursday: "12:00-13:30",
      friday: "12:00-13:30",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["hot_meals", "emergency_food", "holiday_assistance"],
    requirements: []
  },
  {
    name: "Fremont Senior Center Health Clinic",
    category: "health",
    type: "senior_health",
    address: "40086 Paseo Padre Pkwy, Fremont, CA 94538",
    lat: 37.4945,
    lng: -121.9191,
    phone: "(510) 790-6615",
    website: "https://www.fremont.gov",
    schedule: {
      monday: "9:00-16:00",
      tuesday: "9:00-16:00",
      wednesday: "9:00-16:00",
      thursday: "9:00-16:00",
      friday: "9:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["health_screenings", "blood_pressure_checks", "podiatry"],
    requirements: ["seniors_55_plus"]
  },

  // --- MOUNTAIN VIEW RESOURCES (10) ---
  {
    name: "Community Services Agency of Mountain View",
    category: "food",
    type: "food_pantry",
    address: "435 San Antonio Road, Mountain View, CA 94040",
    lat: 37.4040,
    lng: -122.1078,
    phone: "(650) 968-0836",
    website: "https://www.csacares.org",
    schedule: {
      monday: "11:30-13:30",
      tuesday: "14:00-16:00",
      wednesday: "14:00-16:00",
      thursday: "11:30-13:30",
      friday: "13:30-15:30",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce", "senior_meals"],
    requirements: ["low_income", "proof_of_residence"]
  },
  {
    name: "Hope's Corner Mountain View",
    category: "shelter",
    type: "multi_service",
    address: "748 Mercy St, Mountain View, CA 94041",
    lat: 37.3861,
    lng: -122.0820,
    phone: "(650) 965-8378",
    website: "https://www.hopes-corner.org",
    schedule: {
      monday: "8:00-12:00",
      tuesday: "closed",
      wednesday: "8:00-12:00",
      thursday: "closed",
      friday: "closed",
      saturday: "8:30-14:15",
      sunday: "closed"
    },
    offerings: ["showers", "laundry", "meals", "case_management"],
    requirements: []
  },
  {
    name: "Mountain View Community Health Center",
    category: "health",
    type: "community_clinic",
    address: "701 E El Camino Real, Mountain View, CA 94040",
    lat: 37.3861,
    lng: -122.0698,
    phone: "(650) 934-7000",
    website: "https://www.pamf.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["primary_care", "specialty_care", "urgent_care"],
    requirements: ["insurance_accepted", "sliding_scale_available"]
  },
  {
    name: "Hope Hangar Food Pantry",
    category: "food",
    type: "food_pantry",
    address: "2240 Leghorn St, Mountain View, CA 94043",
    lat: 37.4134,
    lng: -122.0981,
    phone: "(650) 961-0636",
    website: "",
    schedule: {
      monday: "18:00-19:30",
      tuesday: "closed",
      wednesday: "closed",
      thursday: "closed",
      friday: "closed",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce"],
    requirements: []
  },
  {
    name: "United Effort Organization",
    category: "shelter",
    type: "homeless_services",
    address: "748 Mercy St, Mountain View, CA 94041",
    lat: 37.3861,
    lng: -122.0820,
    phone: "(650) 996-9607",
    website: "https://theunitedeffort.org",
    schedule: {
      monday: "7:00-8:00",
      tuesday: "closed",
      wednesday: "8:00-9:00",
      thursday: "closed",
      friday: "closed",
      saturday: "8:00-10:00",
      sunday: "closed"
    },
    offerings: ["case_management", "housing_assistance", "benefits_enrollment"],
    requirements: []
  },
  {
    name: "Goodwill Mountain View",
    category: "clothing",
    type: "clothing_closet",
    address: "2585 California St, Mountain View, CA 94040",
    lat: 37.4194,
    lng: -122.0993,
    phone: "(650) 961-2711",
    website: "https://www.goodwill.org",
    schedule: {
      monday: "9:00-19:00",
      tuesday: "9:00-19:00",
      wednesday: "9:00-19:00",
      thursday: "9:00-19:00",
      friday: "9:00-19:00",
      saturday: "9:00-19:00",
      sunday: "10:00-18:00"
    },
    offerings: ["clothing", "household_items", "job_training"],
    requirements: []
  },
  {
    name: "VTA Customer Service Center",
    category: "transportation",
    type: "bus_pass_assistance",
    address: "3331 North First Street, San Jose, CA 95134",
    lat: 37.4134,
    lng: -121.9520,
    phone: "(408) 321-2300",
    website: "https://www.vta.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["discount_passes", "senior_passes", "disabled_passes"],
    requirements: ["proof_of_eligibility", "santa_clara_county_resident"]
  },
  {
    name: "Community Health Awareness Council",
    category: "health",
    type: "community_health",
    address: "590 El Camino Real W, Mountain View, CA 94041",
    lat: 37.3861,
    lng: -122.0820,
    phone: "(650) 965-2020",
    website: "",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["health_education", "counseling", "support_groups"],
    requirements: []
  },
  {
    name: "LifeMoves Mountain View",
    category: "shelter",
    type: "transitional_housing",
    address: "570 N Whisman Rd, Mountain View, CA 94043",
    lat: 37.4134,
    lng: -122.0553,
    phone: "(650) 965-4261",
    website: "https://lifemoves.org",
    schedule: {
      monday: "open 24 hours",
      tuesday: "open 24 hours",
      wednesday: "open 24 hours",
      thursday: "open 24 hours",
      friday: "open 24 hours",
      saturday: "open 24 hours",
      sunday: "open 24 hours"
    },
    offerings: ["temporary_housing", "case_management", "job_training"],
    requirements: ["homeless", "background_check"]
  },
  {
    name: "Second Harvest Food Bank - Mountain View",
    category: "food",
    type: "mobile_pantry",
    address: "Various locations in Mountain View",
    lat: 37.3861,
    lng: -122.0820,
    phone: "(408) 266-8866",
    website: "https://www.shfb.org",
    schedule: {
      monday: "call for schedule",
      tuesday: "call for schedule",
      wednesday: "call for schedule",
      thursday: "call for schedule",
      friday: "call for schedule",
      saturday: "call for schedule",
      sunday: "call for schedule"
    },
    offerings: ["mobile_pantry", "fresh_produce", "groceries"],
    requirements: []
  },

  // --- SUNNYVALE RESOURCES (10) ---
  {
    name: "Sunnyvale Community Services",
    category: "food",
    type: "food_pantry",
    address: "725 S Wolfe Rd, Sunnyvale, CA 94086",
    lat: 37.3688,
    lng: -122.0148,
    phone: "(408) 738-4321",
    website: "https://sunnyvaleca.gov",
    schedule: {
      monday: "9:00-11:30,13:00-16:00",
      tuesday: "9:00-11:30,13:00-16:00",
      wednesday: "9:00-11:30,13:00-16:00",
      thursday: "9:00-11:30,13:00-16:00",
      friday: "9:00-11:30,13:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce", "financial_assistance"],
    requirements: ["proof_of_residence", "proof_of_income"]
  },
  {
    name: "Sunnyvale Health Center",
    category: "health",
    type: "community_clinic",
    address: "660 S Fair Oaks Ave, Sunnyvale, CA 94086",
    lat: 37.3688,
    lng: -122.0308,
    phone: "(408) 737-1301",
    website: "",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["primary_care", "immunizations", "health_screenings"],
    requirements: ["sliding_scale_fees"]
  },
  {
    name: "Crosswalk Community",
    category: "shelter",
    type: "emergency_shelter",
    address: "1111 Morse Ave, Sunnyvale, CA 94089",
    lat: 37.3565,
    lng: -122.0308,
    phone: "(408) 736-0900",
    website: "https://crosswalkchurch.com",
    schedule: {
      monday: "19:00-7:00",
      tuesday: "19:00-7:00",
      wednesday: "19:00-7:00",
      thursday: "19:00-7:00",
      friday: "19:00-7:00",
      saturday: "19:00-7:00",
      sunday: "19:00-7:00"
    },
    offerings: ["emergency_beds", "meals", "showers"],
    requirements: []
  },
  {
    name: "Sunnyvale Salvation Army",
    category: "clothing",
    type: "clothing_closet",
    address: "1045 Morse Ave, Sunnyvale, CA 94089",
    lat: 37.3565,
    lng: -122.0308,
    phone: "(408) 736-0706",
    website: "https://www.salvationarmyusa.org",
    schedule: {
      monday: "10:00-16:00",
      tuesday: "10:00-16:00",
      wednesday: "10:00-16:00",
      thursday: "10:00-16:00",
      friday: "10:00-16:00",
      saturday: "10:00-16:00",
      sunday: "closed"
    },
    offerings: ["clothing", "furniture", "household_items"],
    requirements: []
  },
  {
    name: "VTA Sunnyvale Transit Center",
    category: "transportation",
    type: "transit_hub",
    address: "108 E Evelyn Ave, Sunnyvale, CA 94086",
    lat: 37.3773,
    lng: -122.0308,
    phone: "(408) 321-2300",
    website: "https://www.vta.org",
    schedule: {
      monday: "5:00-23:00",
      tuesday: "5:00-23:00",
      wednesday: "5:00-23:00",
      thursday: "5:00-23:00",
      friday: "5:00-23:00",
      saturday: "6:00-23:00",
      sunday: "6:00-23:00"
    },
    offerings: ["bus_passes", "route_information", "accessibility_services"],
    requirements: []
  },
  {
    name: "Second Harvest Mobile Pantry - Sunnyvale",
    category: "food",
    type: "mobile_pantry",
    address: "Cherry Ave Park, Sunnyvale, CA 94087",
    lat: 37.3565,
    lng: -122.0148,
    phone: "(408) 266-8866",
    website: "https://www.shfb.org",
    schedule: {
      monday: "closed",
      tuesday: "closed",
      wednesday: "15:00-17:00",
      thursday: "closed",
      friday: "closed",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["fresh_produce", "groceries", "mobile_distribution"],
    requirements: []
  },
  {
    name: "Sunnyvale Presbyterian Church Food Pantry",
    category: "food",
    type: "food_pantry",
    address: "728 W Fremont Ave, Sunnyvale, CA 94087",
    lat: 37.3483,
    lng: -122.0430,
    phone: "(408) 739-1892",
    website: "",
    schedule: {
      monday: "closed",
      tuesday: "closed",
      wednesday: "16:00-18:00",
      thursday: "closed",
      friday: "closed",
      saturday: "10:00-12:00",
      sunday: "closed"
    },
    offerings: ["groceries", "canned_goods", "fresh_items"],
    requirements: []
  },
  {
    name: "Kaiser Permanente Sunnyvale",
    category: "health",
    type: "medical_center",
    address: "700 Lawrence Expy, Santa Clara, CA 95051",
    lat: 37.3565,
    lng: -121.9981,
    phone: "(408) 851-3000",
    website: "https://healthy.kaiserpermanente.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "9:00-13:00",
      sunday: "closed"
    },
    offerings: ["primary_care", "urgent_care", "specialty_services"],
    requirements: ["kaiser_member"]
  },
  {
    name: "Family Resource Center of Sunnyvale",
    category: "shelter",
    type: "multi_service",
    address: "725 S Wolfe Rd, Sunnyvale, CA 94086",
    lat: 37.3688,
    lng: -122.0148,
    phone: "(408) 738-4321",
    website: "",
    schedule: {
      monday: "9:00-16:00",
      tuesday: "9:00-16:00",
      wednesday: "9:00-16:00",
      thursday: "9:00-16:00",
      friday: "9:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["case_management", "emergency_assistance", "counseling"],
    requirements: []
  },
  {
    name: "Sunnyvale Thrift Store",
    category: "clothing",
    type: "thrift_store",
    address: "890 W Fremont Ave, Sunnyvale, CA 94087",
    lat: 37.3483,
    lng: -122.0553,
    phone: "(408) 739-8289",
    website: "",
    schedule: {
      monday: "10:00-18:00",
      tuesday: "10:00-18:00",
      wednesday: "10:00-18:00",
      thursday: "10:00-18:00",
      friday: "10:00-18:00",
      saturday: "10:00-17:00",
      sunday: "12:00-17:00"
    },
    offerings: ["affordable_clothing", "household_items", "furniture"],
    requirements: []
  },
  // --- SAN JOSE RESOURCES (10) ---
  {
    name: "Sacred Heart Community Service",
    category: "food",
    type: "food_pantry",
    address: "1381 S 1st St, San Jose, CA 95110",
    lat: 37.3176,
    lng: -121.8847,
    phone: "(408) 944-0691",
    website: "https://www.sacredheartcs.org",
    schedule: {
      monday: "9:00-15:00",
      tuesday: "9:00-15:00",
      wednesday: "9:00-15:00",
      thursday: "9:00-15:00",
      friday: "9:00-15:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce", "clothing"],
    requirements: ["id_required", "proof_of_residence"]
  },
  {
    name: "Santa Maria Urban Ministry",
    category: "food",
    type: "soup_kitchen",
    address: "808 N 13th St, San Jose, CA 95112",
    lat: 37.3541,
    lng: -121.8977,
    phone: "(408) 293-4284",
    website: "https://www.santamariaurbanministry.org",
    schedule: {
      monday: "16:30-17:30",
      tuesday: "16:30-17:30",
      wednesday: "16:30-17:30",
      thursday: "16:30-17:30",
      friday: "16:30-17:30",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["hot_meals", "groceries", "case_management"],
    requirements: []
  },
  {
    name: "Gardner Health Services",
    category: "health",
    type: "community_clinic",
    address: "2425 Enborg Ln, San Jose, CA 95128",
    lat: 37.3230,
    lng: -121.9358,
    phone: "(408) 556-8000",
    website: "https://www.gardnerhealthservices.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["medical_care", "dental", "behavioral_health"],
    requirements: ["sliding_scale_fees"]
  },
  {
    name: "St. Joseph's Family Center",
    category: "shelter",
    type: "multi_service",
    address: "2011 Las Plumas Ave, San Jose, CA 95133",
    lat: 37.3689,
    lng: -121.8908,
    phone: "(408) 282-9735",
    website: "https://www.stjosephfamilycenter.org",
    schedule: {
      monday: "8:30-17:00",
      tuesday: "8:30-17:00",
      wednesday: "8:30-17:00",
      thursday: "8:30-17:00",
      friday: "8:30-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["emergency_assistance", "case_management", "family_services"],
    requirements: []
  },
  {
    name: "InnVision Shelter Network",
    category: "shelter",
    type: "emergency_shelter",
    address: "2011 Little Orchard St, San Jose, CA 95125",
    lat: 37.3230,
    lng: -121.9042,
    phone: "(408) 292-4286",
    website: "https://www.innvision.org",
    schedule: {
      monday: "open 24 hours",
      tuesday: "open 24 hours",
      wednesday: "open 24 hours",
      thursday: "open 24 hours",
      friday: "open 24 hours",
      saturday: "open 24 hours",
      sunday: "open 24 hours"
    },
    offerings: ["emergency_beds", "meals", "showers", "case_management"],
    requirements: []
  },
  {
    name: "Working Partnerships USA",
    category: "shelter",
    type: "housing_services",
    address: "2102 Almaden Rd, San Jose, CA 95125",
    lat: 37.3098,
    lng: -121.8908,
    phone: "(408) 269-7872",
    website: "https://www.wpusa.org",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["housing_assistance", "tenant_rights", "advocacy"],
    requirements: []
  },
  {
    name: "Goodwill Industries of Silicon Valley",
    category: "clothing",
    type: "clothing_closet",
    address: "1080 N 7th St, San Jose, CA 95112",
    lat: 37.3541,
    lng: -121.9042,
    phone: "(408) 998-8400",
    website: "https://www.goodwillsv.org",
    schedule: {
      monday: "9:00-19:00",
      tuesday: "9:00-19:00",
      wednesday: "9:00-19:00",
      thursday: "9:00-19:00",
      friday: "9:00-19:00",
      saturday: "9:00-19:00",
      sunday: "10:00-18:00"
    },
    offerings: ["clothing", "household_items", "job_training"],
    requirements: []
  },
  {
    name: "VTA Access Paratransit",
    category: "transportation",
    type: "accessible_transport",
    address: "3331 N 1st Street, San Jose, CA 95134",
    lat: 37.4134,
    lng: -121.9520,
    phone: "(408) 321-2300",
    website: "https://www.vta.org/go/paratransit",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["door_to_door_transport", "disabled_accessible", "medical_transport"],
    requirements: ["disability_certification", "ada_eligible"]
  },
  {
    name: "Asian Americans for Community Involvement",
    category: "health",
    type: "community_health",
    address: "2400 Moorpark Ave, San Jose, CA 95128",
    lat: 37.3230,
    lng: -121.9358,
    phone: "(408) 975-2730",
    website: "https://www.aaci.org",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["mental_health", "substance_abuse", "cultural_services"],
    requirements: []
  },
  {
    name: "Dress for Success San Jose",
    category: "clothing",
    type: "clothing_closet",
    address: "504 Valley Way, Milpitas, CA 95035",
    lat: 37.4323,
    lng: -121.9066,
    phone: "(408) 770-4848",
    website: "https://www.dressforsuccess.org",
    schedule: {
      monday: "closed",
      tuesday: "10:00-14:00",
      wednesday: "closed",
      thursday: "10:00-14:00",
      friday: "closed",
      saturday: "10:00-14:00",
      sunday: "closed"
    },
    offerings: ["professional_clothing", "career_coaching", "interview_prep"],
    requirements: ["women_only", "appointment_required"]
  },

  // --- SAN MATEO RESOURCES (10) ---
  {
    name: "Samaritan House San Mateo",
    category: "food",
    type: "food_pantry",
    address: "19 W 37th Ave, San Mateo, CA 94403",
    lat: 37.5312,
    lng: -122.3036,
    phone: "(650) 347-3648",
    website: "https://samaritanhousesanmateo.org",
    schedule: {
      monday: "9:00-16:00",
      tuesday: "9:00-16:00",
      wednesday: "9:00-16:00",
      thursday: "9:00-16:00",
      friday: "9:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "hot_meals", "drive_thru_pantry"],
    requirements: ["income_verification", "san_mateo_county_resident"]
  },
  {
    name: "CALL Primrose Food Pantry",
    category: "food",
    type: "food_pantry",
    address: "1375 Hillsdale Blvd, San Mateo, CA 94402",
    lat: 37.5427,
    lng: -122.3036,
    phone: "(650) 341-4081",
    website: "https://www.callprimrose.org",
    schedule: {
      monday: "11:30-16:45",
      tuesday: "11:30-16:45",
      wednesday: "11:30-16:45",
      thursday: "11:30-16:45",
      friday: "11:30-16:45",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce", "dairy_products"],
    requirements: ["proof_of_residence"]
  },
  {
    name: "Samaritan House Free Clinic - San Mateo",
    category: "health",
    type: "free_clinic",
    address: "4031 Pacific Blvd, San Mateo, CA 94403",
    lat: 37.5312,
    lng: -122.2925,
    phone: "(650) 578-0400",
    website: "https://samaritanhousesanmateo.org",
    schedule: {
      monday: "8:30-17:00",
      tuesday: "8:30-17:00",
      wednesday: "8:30-17:00",
      thursday: "8:30-17:00",
      friday: "8:30-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["medical_care", "dental_care", "food_pharmacy"],
    requirements: ["uninsured", "low_income"]
  },
  {
    name: "San Mateo County Health System",
    category: "health",
    type: "community_clinic",
    address: "225 37th Ave, San Mateo, CA 94403",
    lat: 37.5312,
    lng: -122.3036,
    phone: "(650) 573-2222",
    website: "https://www.smchealth.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["primary_care", "specialty_care", "behavioral_health"],
    requirements: ["sliding_scale_fees"]
  },
  {
    name: "LifeMoves Maple Street Shelter",
    category: "shelter",
    type: "emergency_shelter",
    address: "1580 Maple St, Redwood City, CA 94063",
    lat: 37.4852,
    lng: -122.2364,
    phone: "(650) 802-3030",
    website: "https://lifemoves.org",
    schedule: {
      monday: "open 24 hours",
      tuesday: "open 24 hours",
      wednesday: "open 24 hours",
      thursday: "open 24 hours",
      friday: "open 24 hours",
      saturday: "open 24 hours",
      sunday: "open 24 hours"
    },
    offerings: ["emergency_beds", "meals", "case_management"],
    requirements: []
  },
  {
    name: "Home & Hope Network",
    category: "shelter",
    type: "transitional_housing",
    address: "1310 S El Camino Real, San Mateo, CA 94402",
    lat: 37.5312,
    lng: -122.3148,
    phone: "(650) 652-1103",
    website: "https://www.homeandhope.org",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["temporary_housing", "family_services", "case_management"],
    requirements: ["families_with_children"]
  },
  {
    name: "Samaritan House Clothing Program",
    category: "clothing",
    type: "clothing_closet",
    address: "19 W 37th Ave, San Mateo, CA 94403",
    lat: 37.5312,
    lng: -122.3036,
    phone: "(650) 347-3648",
    website: "https://samaritanhousesanmateo.org",
    schedule: {
      monday: "9:00-16:00",
      tuesday: "9:00-16:00",
      wednesday: "9:00-16:00",
      thursday: "9:00-16:00",
      friday: "9:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["children_clothing", "adult_clothing", "shoes"],
    requirements: ["low_income", "appointment_required"]
  },
  {
    name: "SamTrans Customer Service",
    category: "transportation",
    type: "bus_pass_assistance",
    address: "1250 San Carlos Ave, San Carlos, CA 94070",
    lat: 37.5074,
    lng: -122.2606,
    phone: "(800) 660-4287",
    website: "https://www.samtrans.com",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["discount_passes", "senior_passes", "disabled_passes"],
    requirements: ["proof_of_eligibility", "san_mateo_county_resident"]
  },
  {
    name: "San Mateo-Foster City Health Department",
    category: "health",
    type: "public_health",
    address: "1700 W Hillsdale Blvd, San Mateo, CA 94402",
    lat: 37.5372,
    lng: -122.3259,
    phone: "(650) 372-6300",
    website: "https://www.cityofsanmateo.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["immunizations", "health_screenings", "family_planning"],
    requirements: []
  },
  {
    name: "Peninsula Family Service",
    category: "shelter",
    type: "family_services",
    address: "1700 S El Camino Real, San Mateo, CA 94402",
    lat: 37.5250,
    lng: -122.3148,
    phone: "(650) 780-7500",
    website: "https://www.peninsulafamilyservice.org",
    schedule: {
      monday: "9:00-17:00",
      tuesday: "9:00-17:00",
      wednesday: "9:00-17:00",
      thursday: "9:00-17:00",
      friday: "9:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["counseling", "family_support", "emergency_assistance"],
    requirements: []
  },

  // --- HAYWARD/SAN LEANDRO RESOURCES (10) ---
  {
    name: "Davis Street Family Resource Center",
    category: "food",
    type: "food_pantry",
    address: "3081 Teagarden St, San Leandro, CA 94577",
    lat: 37.6907,
    lng: -122.1564,
    phone: "(510) 347-4620",
    website: "https://www.davisstreet.org",
    schedule: {
      monday: "9:00-16:00",
      tuesday: "9:00-16:00",
      wednesday: "9:00-16:00",
      thursday: "9:00-16:00",
      friday: "9:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce", "emergency_food"],
    requirements: ["proof_of_income", "proof_of_residence"]
  },
  {
    name: "South Hayward Parish Food Pantry",
    category: "food",
    type: "food_pantry",
    address: "27287 Patrick Ave, Hayward, CA 94544",
    lat: 37.6707,
    lng: -122.1025,
    phone: "(510) 785-3663",
    website: "https://www.southhaywardparish.org",
    schedule: {
      monday: "13:00-16:00",
      tuesday: "13:00-16:00",
      wednesday: "closed",
      thursday: "13:00-16:00",
      friday: "13:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce", "household_supplies"],
    requirements: ["hayward_castro_valley_union_city_resident"]
  },
  {
    name: "San Leandro Community Food Pantry",
    category: "food",
    type: "food_pantry",
    address: "14235 Bancroft Ave, San Leandro, CA 94578",
    lat: 37.6907,
    lng: -122.1241,
    phone: "(510) 483-0273",
    website: "https://www.slcfp.org",
    schedule: {
      monday: "closed",
      tuesday: "closed",
      wednesday: "closed",
      thursday: "18:00-20:00",
      friday: "closed",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["groceries", "fresh_produce", "client_choice"],
    requirements: []
  },
  {
    name: "Davis Street Health Center",
    category: "health",
    type: "community_clinic",
    address: "3081 Teagarden St, San Leandro, CA 94577",
    lat: 37.6907,
    lng: -122.1564,
    phone: "(510) 347-4620",
    website: "https://www.davisstreet.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["medical_care", "dental_care", "behavioral_health"],
    requirements: ["sliding_scale_fees"]
  },
  {
    name: "Alameda County Health Care for the Homeless",
    category: "health",
    type: "mobile_clinic",
    address: "1000 San Leandro Blvd, San Leandro, CA 94577",
    lat: 37.7249,
    lng: -122.1564,
    phone: "(510) 618-1600",
    website: "https://www.acgov.org",
    schedule: {
      monday: "call for schedule",
      tuesday: "call for schedule",
      wednesday: "call for schedule",
      thursday: "call for schedule",
      friday: "call for schedule",
      saturday: "call for schedule",
      sunday: "call for schedule"
    },
    offerings: ["mobile_medical", "mental_health", "substance_abuse"],
    requirements: ["homeless"]
  },
  {
    name: "FESCO Family Emergency Shelter",
    category: "shelter",
    type: "emergency_shelter",
    address: "21455 Birch St, Hayward, CA 94541",
    lat: 37.6688,
    lng: -122.0858,
    phone: "(510) 581-3223",
    website: "https://www.fescoshelter.org",
    schedule: {
      monday: "open 24 hours",
      tuesday: "open 24 hours",
      wednesday: "open 24 hours",
      thursday: "open 24 hours",
      friday: "open 24 hours",
      saturday: "open 24 hours",
      sunday: "open 24 hours"
    },
    offerings: ["emergency_beds", "family_housing", "case_management"],
    requirements: ["families_with_children"]
  },
  {
    name: "Ruby's Place Women's Shelter",
    category: "shelter",
    type: "emergency_shelter",
    address: "1180 B Street, Hayward, CA 94541",
    lat: 37.6688,
    lng: -122.0858,
    phone: "(888) 339-7233",
    website: "",
    schedule: {
      monday: "open 24 hours",
      tuesday: "open 24 hours",
      wednesday: "open 24 hours",
      thursday: "open 24 hours",
      friday: "open 24 hours",
      saturday: "open 24 hours",
      sunday: "open 24 hours"
    },
    offerings: ["emergency_beds", "meals", "counseling"],
    requirements: ["women_and_minors_only"]
  },
  {
    name: "First Presbyterian Church Hayward Clothing Closet",
    category: "clothing",
    type: "clothing_closet",
    address: "2490 Grove Way, Castro Valley, CA 94546",
    lat: 37.6907,
    lng: -122.0697,
    phone: "(510) 581-6203",
    website: "https://firstpreshayward.com",
    schedule: {
      monday: "10:00-16:00",
      tuesday: "10:00-16:00",
      wednesday: "10:00-16:00",
      thursday: "10:00-16:00",
      friday: "10:00-16:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["clothing", "shoes", "household_items"],
    requirements: []
  },
  {
    name: "AC Transit East Bay Paratransit",
    category: "transportation",
    type: "accessible_transport",
    address: "1600 Franklin St, Oakland, CA 94612",
    lat: 37.8055,
    lng: -122.2680,
    phone: "(510) 287-5000",
    website: "https://www.actransit.org",
    schedule: {
      monday: "8:00-17:00",
      tuesday: "8:00-17:00",
      wednesday: "8:00-17:00",
      thursday: "8:00-17:00",
      friday: "8:00-17:00",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["door_to_door_transport", "disabled_accessible", "medical_transport"],
    requirements: ["disability_certification", "alameda_county_resident"]
  },
  {
    name: "San Lorenzo Family Help Center",
    category: "food",
    type: "mobile_pantry",
    address: "520 Grant Avenue, San Lorenzo, CA 94580",
    lat: 37.6816,
    lng: -122.1241,
    phone: "(341) 314-6770",
    website: "https://www.slzhelp.org",
    schedule: {
      monday: "closed",
      tuesday: "closed",
      wednesday: "10:30-14:00",
      thursday: "closed",
      friday: "closed",
      saturday: "closed",
      sunday: "closed"
    },
    offerings: ["mobile_pantry", "groceries", "fresh_produce"],
    requirements: ["san_lorenzo_area_resident"]
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
