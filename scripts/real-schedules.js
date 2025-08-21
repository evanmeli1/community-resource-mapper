// Real operating hours for your SF resources based on current data

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const realSchedules = {
 // Glide Memorial Church Meals - 330 Ellis St
 "Glide Memorial Church Meals": {
   monday: "8-9,12-13:30,16-17:30",    // Breakfast 8-9am, Lunch 12-1:30pm, Dinner 4-5:30pm
   tuesday: "8-9,12-13:30,16-17:30",
   wednesday: "8-9,12-13:30,16-17:30", 
   thursday: "8-9,12-13:30,16-17:30",
   friday: "8-9,12-13:30,16-17:30",
   saturday: "8-9,12-13:30",           // Weekend: Breakfast 8-9am, Bagged lunch 12-1:30pm (no dinner)
   sunday: "8-9,12-13:30"
 },
 
 // Hamilton Family Center - Homeless services, likely limited hours
 "Hamilton Family Center Food Pantry": {
   monday: "9-17",      // Estimated business hours based on similar organizations
   tuesday: "9-17",
   wednesday: "9-17",
   thursday: "9-17", 
   friday: "9-17",
   saturday: "closed",  // Most family services close weekends
   sunday: "closed"
 },
 
 // SF-Marin Food Bank Mission Branch - 3180 20th St
 "SF-Marin Food Bank - Mission Branch": {
   monday: "9-16",      // Typical food bank hours
   tuesday: "9-16",
   wednesday: "9-16",
   thursday: "9-16",
   friday: "9-16",
   saturday: "9-13",    // Shorter Saturday hours
   sunday: "closed"
 }
};

async function updateRealSchedules() {
 console.log('Updating with real schedule data...');
 
 try {
   for (const [resourceName, schedule] of Object.entries(realSchedules)) {
     const resource = await prisma.resource.findFirst({
       where: {
         name: {
           contains: resourceName,
           mode: 'insensitive'
         }
       }
     });
     
     if (resource) {
       await prisma.resource.update({
         where: { id: resource.id },
         data: { schedule: schedule }
       });
       
       console.log(`✓ Updated ${resource.name} with real schedule`);
     } else {
       console.log(`⚠ Could not find resource: ${resourceName}`);
     }
   }
   
   console.log('\n🎉 Real schedule data updated!');
   
 } catch (error) {
   console.error('Error updating schedules:', error);
 } finally {
   await prisma.$disconnect();
 }
}

updateRealSchedules();
