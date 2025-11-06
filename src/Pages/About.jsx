// src/components/About.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/breadcrumb/BreadCrumb";

const FloatingIcon = ({ src, style }) => (
  <img className={`absolute w-12 h-12 opacity-50 animate-float z-0 ${style}`} />
);

const About = () => {
  return (
    <div className="min-h-screen  text-gray-800 font-serif px-4 pt-36 pb-24 relative overflow-hidden">
      {/*  Decorative Wave Top */}
      <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 320">
        <path
          fill="#d1fae5"
          fillOpacity="1"
          d="M0,64L30,69.3C60,75,120,85,180,112C240,139,300,181,360,181.3C420,181,480,139,540,112C600,85,660,75,720,101.3C780,128,840,192,900,192C960,192,1020,128,1080,122.7C1140,117,1200,171,1260,186.7C1320,203,1380,181,1410,170.7L1440,160L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
        />
      </svg>

      {/* Floating Ocean Icons */}

      {/*  Seagrass Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col md:flex-row items-center justify-between bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-xl border border-green-100 mb-10 mt-[-100px] relative z-10"
      >
        <div className="md:w-1/2 w-full p-10 text-gray-800">
          {/* Breadcrumb Navigation */}
          <Breadcrumbs />

          <h2 className="text-4xl font-bold text-green-800 mb-4">
            What is Seagrass Sri Lanka?
          </h2>
          <p className="text-lg leading-relaxed">
            Seagrass Sri Lanka is a transformative platform developed for the
            “Seagrass Interest Group of Sri Lanka” Facebook community, aiming to
            overcome the limitations of social media-based community engagement.
            <br />
            <br />
            It enhances awareness, supports conservation and research efforts,
            and includes tools like an ID mechanism, AI-powered blogging, event
            calendars, research archives, and a souvenir store.
          </p>
        </div>
        <div className="md:w-1/2 w-full h-[400px] md:h-auto">
          <img
            src="/sg.png"
            alt="Seagrass"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/*Lead Researcher Section */}
      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-bold text-green-800 drop-shadow-lg">
          About Our Lead Researcher
        </h1>
        <p className="mt-3 text-lg text-gray-600 italic">
          “In the silence of the seagrass meadows, he listens to the ocean’s
          heartbeat.”
        </p>
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
            transition={{ type: "spring", stiffness: 300 }}
            src="/man1.jfif"
            alt="Dr. A. Jayawardena"
            className="rounded-3xl shadow-lg border-4 border-green-300"
          />
        </div>
        <div className="md:w-2/3 w-full space-y-5">
          <h2 className="text-3xl font-bold text-green-900">
            Dr. Ashen Jayawardena
          </h2>
          <h4 className="text-md font-medium text-green-700">
            Ocean Ecologist | Lead Researcher | Seagrass Guardian
          </h4>
          <p className="text-gray-700 leading-relaxed">
            For over 18 years, Dr. Jayawardena has dedicated his life to
            understanding the hidden wonders beneath Sri Lanka’s coastal waters.
            His mission is to protect the endangered seagrass ecosystems that
            nurture marine life and sustain our planet’s delicate balance.
          </p>
          <p className="text-gray-600">
            As the founder of the “Blue Roots” initiative, he leads critical
            restoration projects, empowers coastal communities, and inspires the
            next generation of conservation scientists.
          </p>
        </div>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className=" py-16 px-6 md:px-12 mt-25 relative z-5" // same as About Us background
      >
        <div className="bg-white py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white relative z-10">
          {/* Left Side: Contact Form */}
          <form className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-gray-100 from-blue-50 to-green-100 border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-gray-100 from-blue-50 to-green-100 border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full bg-gray-100 border border-gray-300 p-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 transition text-white font-semibold py-2 px-6 rounded-md text-sm"
            >
              Send Message
            </button>
          </form>

          {/* Right Side: Researcher Contact Info */}
          <div className="text-gray-800 text-sm">
            <h3 className="text-2xl font-bold text-green-700 mb-4">
              Research Contact
            </h3>
            <p className="mb-4">
              If you're interested in collaborating, discussing your research
              idea, or seeking project mentorship, feel free to reach out. I'm
              always open to exchanging ideas and working together on innovative
              solutions.
            </p>
            <div className="space-y-3">
              <p>
                <strong>Name:</strong> Ashen Jayasuriya
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <span className="text-green-700">ashen.j@oceanresearch.lk</span>
              </p>
              <p>
                <strong>Phone:</strong> +94 71 987 6543
              </p>
              <p>
                <strong>Location:</strong> Southern Province, Sri Lanka
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                <a
                  href="https://linkedin.com/in/ashen-ocean"
                  className="text-green-700 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  linkedin.com/in/ashen-ocean
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default About;
