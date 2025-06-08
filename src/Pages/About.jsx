// src/components/About.jsx
import React from 'react';
import { motion } from 'framer-motion';

const FloatingIcon = ({ src, style }) => (
  <img
    src={src}
    alt="floating"
    className={`absolute w-12 h-12 opacity-50 animate-float z-0 ${style}`}
  />
);


const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-100 text-gray-800 font-serif px-4 pt-36 pb-24 relative overflow-hidden">

      {/* 🌊 Decorative Wave Top */}
      <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 320">
        <path fill="#d1fae5" fillOpacity="1" d="M0,64L30,69.3C60,75,120,85,180,112C240,139,300,181,360,181.3C420,181,480,139,540,112C600,85,660,75,720,101.3C780,128,840,192,900,192C960,192,1020,128,1080,122.7C1140,117,1200,171,1260,186.7C1320,203,1380,181,1410,170.7L1440,160L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z" />
      </svg>

      {/* Floating Ocean Icons */}
      <FloatingIcon src="/fish1.png" style="top-[20%] left-[10%]" />
      <FloatingIcon src="/seaweed.png" style="top-[60%] left-[5%]" />
      <FloatingIcon src="/bubble.png" style="top-[40%] right-[10%]" />

      {/* 🌿 Seagrass Introduction - Image on Right */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="flex flex-col md:flex-row items-center justify-between bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-green-100 mb-10 mt-[-100px] relative z-10"
      >
        {/* 📝 Text Section */}
        <div className="md:w-1/2 w-full p-10 text-gray-800">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            What is Seagrass Sri Lanka?
          </h2>
          <p className="text-lg leading-relaxed">
            Seagrass Sri Lanka is a transformative platform developed for the 
            “Seagrass Interest Group of Sri Lanka” Facebook community, aiming 
            to overcome the limitations of social media-based community engagement.
            <br /><br />
            It enhances awareness, supports conservation and research efforts, and 
            includes tools like an ID mechanism, AI-powered blogging, event calendars, 
            research archives, and a souvenir store.
          </p>
        </div>

        {/* 🌱 Image Section */}
        <div className="md:w-1/2 w-full h-[400px] md:h-auto">
          <img
            src="/sg.png"
            alt="Seagrass"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* 👨‍🔬 Lead Researcher Section */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-bold text-green-800 drop-shadow-lg">About Our Lead Researcher</h1>
        <p className="mt-3 text-lg text-gray-600 italic">“In the silence of the seagrass meadows, he listens to the ocean’s heartbeat.”</p>
      </div>

      {/* Profile Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }} 
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white relative z-10"
      >
        <div className="md:w-1/3 w-full">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            src="/man1.jfif"
            alt="Dr. A. Jayawardena"
            className="rounded-3xl shadow-lg border-4 border-green-300"
          />
        </div>

        <div className="md:w-2/3 w-full space-y-5">
          <h2 className="text-3xl font-bold text-green-900">Dr. Ashen Jayawardena</h2>
          <h4 className="text-md font-medium text-green-700">Ocean Ecologist | Lead Researcher | Seagrass Guardian</h4>
          <p className="text-gray-700 leading-relaxed">
            For over 18 years, Dr. Jayawardena has dedicated his life to understanding the hidden wonders beneath Sri Lanka’s coastal waters. His mission is to protect the endangered seagrass ecosystems that nurture marine life and sustain our planet’s delicate balance.
          </p>
          <p className="text-gray-600">
            As the founder of the “Blue Roots” initiative, he leads critical restoration projects, empowers coastal communities, and inspires the next generation of conservation scientists.
          </p>
        </div>
      </motion.div>

      {/*  Contact Info */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1.2 }} 
        className="max-w-4xl mx-auto mt-20 p-6 bg-green-50 rounded-xl shadow-inner border border-green-200 relative z-10"
      >
        <h3 className="text-2xl font-semibold text-green-800 mb-4">Contact Information</h3>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700 text-md">
          <div>
            <p><i className="fas fa-envelope text-green-700 mr-2"></i><strong>Email:</strong> ashen.j@oceanresearch.lk</p>
            <p><i className="fas fa-phone text-green-700 mr-2"></i><strong>Phone:</strong> +94 71 987 6543</p>
          </div>
          <div>
            <p><i className="fas fa-map-marker-alt text-green-700 mr-2"></i><strong>Location:</strong> Matara, Sri Lanka</p>
            <p><i className="fab fa-linkedin text-green-700 mr-2"></i><strong>LinkedIn:</strong> <a href="#" className="underline text-green-800">linkedin.com/in/ashen-ocean</a></p>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default About;

// Add this CSS to your global stylesheet or tailwind.config.js theme
// .animate-float {
//   @apply animate-[float_4s_ease-in-out_infinite];
// }
// @keyframes float {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-15px); }
// }
