import React from 'react';

export default function Landing() {

  return (
    <main className="relative min-h-screen bg-linear-to-b from-[#2d6260] via-[#204947] to-[#122b2a] text-white pt-32 pb-20 px-4 overflow-hidden flex flex-col items-center justify-between">
      
      {/* Background Graphic / Arc Effect */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay">
        {/* Replace with your landscape/bridge background image */}
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0d2221] via-transparent to-[#2d6260]" />
      </div>

      {/* Hero Content Section */}
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6 mt-8">
        
        {/* Announcement Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs md:text-sm text-emerald-100/90 shadow-sm">
          <span>Great News: Enhancing reliability in managing tenants across all communication channels!</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-emerald-50 leading-[1.15] max-w-3xl">
          The Premier Property Management Solution for Today's Landlords.
        </h1>

        {/* Subtitle Paragraph */}
        <p className="text-base sm:text-lg text-emerald-100/70 max-w-2xl font-light leading-relaxed">
          Tenants tackles every tenant request head-on, learning from each interaction to improve the efficiency of your property management systems.
        </p>

        {/* Call To Action Button */}
        <div className="mt-2">
          <button className="group relative inline-flex items-center gap-3 bg-[#114042] hover:bg-[#0d3335] text-emerald-100 px-8 py-3.5 rounded-full font-medium text-sm transition-all duration-300 border border-emerald-400/20 shadow-lg hover:shadow-emerald-950/50">
            <span>Schedule your demo now!</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Arc Card / "Trusted By" Section */}
      <div className="relative z-10 w-full max-w-2xl mt-16 sm:mt-24">
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-t-[100px] md:rounded-t-[140px] pt-10 pb-8 px-8 text-center shadow-2xl">
          <p className="text-xs uppercase tracking-widest text-emerald-200/60 mb-6 font-medium">
            Trusted by leaders in
          </p>

          {/* Partner / Brand Logos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center opacity-80 text-white font-semibold text-sm">
            <span className="hover:opacity-100 transition-opacity">Creatio</span>
            <span className="hover:opacity-100 transition-opacity">HubSpot</span>
            <span className="hover:opacity-100 transition-opacity">Zendesk</span>
            <span className="hover:opacity-100 transition-opacity">Bitrix24</span>
            <span className="hover:opacity-100 transition-opacity">Apptivo</span>
            <span className="hover:opacity-100 transition-opacity">FreshBooks</span>
            <span className="hover:opacity-100 transition-opacity">Pipedrive</span>
            <span className="hover:opacity-100 transition-opacity">Salesforce</span>
          </div>
        </div>
      </div>

    </main>
  );
}
