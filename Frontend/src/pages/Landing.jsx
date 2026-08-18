import { motion } from 'motion/react';

// Staggered entrance variants for hero section
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Bottom card entrance variant
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Landing() {
  return (
    <main className="relative min-h-screen bg-linear-to-b from-[#2d6260] via-[#204947] to-[#122b2a] text-white pt-32 pb-20 px-4 overflow-hidden flex flex-col items-center justify-between">
      
      {/* Background Graphic / Arc Effect with Slow Ambient Breathing */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-overlay overflow-hidden">
        <motion.img 
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{
            duration: 16,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0d2221] via-transparent to-[#2d6260]" />
      </div>

      {/* Hero Content Section */}
      <motion.div 
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6 mt-8"
      >
        
        {/* Announcement Pill Badge */}
        <motion.div variants={heroItemVariants}>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs md:text-sm text-emerald-100/90 shadow-sm cursor-default"
          >
            <span>Great News: Enhancing reliability in managing tenants across all communication channels!</span>
          </motion.div>
        </motion.div>

        {/* Main Headline */}
        <motion.h1 
          variants={heroItemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight text-emerald-50 leading-[1.15] max-w-3xl"
        >
          The Premier Property Management Solution for Today's Landlords.
        </motion.h1>

        {/* Subtitle Paragraph */}
        <motion.p 
          variants={heroItemVariants}
          className="text-base sm:text-lg text-emerald-100/70 max-w-2xl font-light leading-relaxed"
        >
          Tenants tackles every tenant request head-on, learning from each interaction to improve the efficiency of your property management systems.
        </motion.p>

        {/* Call To Action Button with Spring Physics */}
        <motion.div variants={heroItemVariants} className="mt-2">
          <motion.button 
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96, y: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 17, mass: 1 }}
            className="group relative inline-flex items-center gap-3 bg-[#114042] hover:bg-[#0d3335] text-emerald-100 px-8 py-3.5 rounded-full font-medium text-sm transition-colors duration-300 border border-emerald-400/20 shadow-lg hover:shadow-emerald-950/50 cursor-pointer"
          >
            <span>Schedule your demo now!</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Bottom Floating Arc Card / "Trusted By" Section */}
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-2xl mt-16 sm:mt-24"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-t-[100px] md:rounded-t-[140px] pt-10 pb-8 px-8 text-center shadow-2xl">
          <p className="text-xs uppercase tracking-widest text-emerald-200/60 mb-6 font-medium">
            Trusted by leaders in
          </p>

          {/* Partner / Brand Logos Grid with Micro-Interactions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center opacity-80 text-white font-semibold text-sm">
            {['Creatio', 'HubSpot', 'Zendesk', 'Bitrix24', 'Apptivo', 'FreshBooks', 'Pipedrive', 'Salesforce'].map((brand) => (
              <motion.span 
                key={brand}
                whileHover={{ scale: 1.1, opacity: 1, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="opacity-70 cursor-pointer transition-opacity"
              >
                {brand}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

    </main>
  );
}