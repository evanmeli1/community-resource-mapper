// app/help/page.tsx
import Link from 'next/link';

export default function HelpPage() {
 return (
   <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-100 p-4">
     <div className="max-w-4xl mx-auto">
       {/* Back Button */}
       <div className="mb-6">
         <Link 
           href="/"
           className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
         >
           <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
           </svg>
           Back to Resource Map
         </Link>
       </div>

       {/* Header */}
       <div className="text-center mb-8">
         <h1 className="text-4xl font-bold text-slate-900 mb-2">Help & Support</h1>
         <p className="text-slate-600">We're here to help you find community resources</p>
       </div>

       {/* Main Content Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
         {/* Contact Card */}
         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
           <div className="flex items-center mb-4">
             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
               <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
             </div>
             <h2 className="text-xl font-semibold text-slate-900">Contact Support</h2>
           </div>
           <p className="text-slate-600 mb-4">
             Having trouble finding resources or experiencing technical issues? We're here to help.
           </p>
           <a 
             href="mailto:support@bayarea-resources.com" 
             className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
           >
             support@bayarea-resources.com
             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
             </svg>
           </a>
           <p className="mt-3 text-sm text-slate-500">
             Response time: Usually within 24 hours
           </p>
         </div>

         {/* FAQ Card */}
         <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
           <div className="flex items-center mb-4">
             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
               <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <h2 className="text-xl font-semibold text-slate-900">Quick Help</h2>
           </div>
           <div className="space-y-3">
             <div>
               <h3 className="font-medium text-slate-800">How to search for resources:</h3>
               <p className="text-sm text-slate-600">Use the search bar or filter by category (Food, Shelter, Health, etc.)</p>
             </div>
             <div>
               <h3 className="font-medium text-slate-800">Resource not accurate?</h3>
               <p className="text-sm text-slate-600">Leave a comment to help others with updated information</p>
             </div>
             <div>
               <h3 className="font-medium text-slate-800">Want to add a resource?</h3>
               <p className="text-sm text-slate-600">Contact us with details and we'll add it to the map</p>
             </div>
           </div>
         </div>
       </div>

       {/* Additional Help Section */}
       <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
         <h2 className="text-xl font-semibold text-slate-900 mb-4">Using the Community Resource Mapper</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="text-center">
             <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
               <span className="text-xl">🔍</span>
             </div>
             <h3 className="font-medium text-slate-800 mb-2">Search & Filter</h3>
             <p className="text-sm text-slate-600">
               Find resources by name, location, or category. Use filters to narrow down results.
             </p>
           </div>
           <div className="text-center">
             <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
               <span className="text-xl">🗺️</span>
             </div>
             <h3 className="font-medium text-slate-800 mb-2">Map View</h3>
             <p className="text-sm text-slate-600">
               See resources plotted on a map to find the closest options to your location.
             </p>
           </div>
           <div className="text-center">
             <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-3">
               <span className="text-xl">💬</span>
             </div>
             <h3 className="font-medium text-slate-800 mb-2">Community Comments</h3>
             <p className="text-sm text-slate-600">
               Share experiences and get real-time updates from other community members.
             </p>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}