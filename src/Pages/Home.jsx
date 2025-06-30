import React from "react";
import Banner from "../assets/banner.webp"; // Make sure this path is correct
import imag1 from "../assets/Photo-1.jpg";
import imag2 from "../assets/PC290412.jpg";
import imag3 from "../assets/Photo-6.jpg";
import imag4 from "../assets/seagrass_leaves.jpg";
import NewsHomepage from "../components/news_homepage/NewsHomepage";
import Blogs_Homepage from "../components/blogs_Homepage/Blogs_Homepage";

const Home = () => {
  return (
    <div className="w-full ">
      {/* Banner Section */}
      <div className="w-full">
        <img
          src={Banner}
          alt="Banner"
          className="w-full h-[400px] object-cover my-20"
        />
      </div>

      {/* this is to display some news from the db */}
      <div>
        <NewsHomepage />
      </div>

      {/* What is Seagrass Section */}
      <div className="w-full my-10 px-4 max-w-7xl mx-auto">
        <hr className="w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10">
          {/* Left: Text */}
          <div className="justify-center h-[400] ">
            <h2 className="text-5xl sm:text-6xl font-bold mb-4 pb-4  text-[#1B7B19] text-center font-serif">
              Nature’s Underwater Wonder: Seagrass
            </h2>
            <p className="text-gray-900 leading-relaxed text-xl text-left font-serif">
              Beneath the ocean’s surface lies a world of green — seagrass meadows, delicate yet powerful. These flowering plants sway gently with the tides, 
              covering the sea floor like an underwater rainforest.They’re not seaweed, but true plants with roots, leaves, and even tiny blossoms. Quietly working behind the scenes, 
              seagrass brings life to the ocean, offering a home to marine creatures and helping our planet breathe.Seagrass is beauty, balance, and life — all beneath the waves.


            </p>
          </div>

          {/* Right: Images */}
          <div className="grid grid-cols-2 gap-4">
            {/* First row - two images */}
            <img
              src={imag1}
              alt="Seagrass 1"
              className="w-full h-auto rounded shadow"
            />
            <img
              src={imag2}
              alt="Seagrass 2"
              className="w-full h-auto rounded shadow"
            />

            {/* Second row - one centered image */}
            <div className="col-span-2 flex justify-center top-[-10]">
              <img
                src={imag3}
                alt="Seagrass 3"
                className="w-1/2 h-auto rounded shadow"
              />
            </div>
          </div>
        </div>

        <hr className="w-full mb-6" />
      </div>
      {/* some blogs comes here */}
      <div>
        <Blogs_Homepage />
      </div>

      <div className="flex flex-wrap md:flex-nowrap px-4 py-8 gap-8">
        {/* Left Column - Heading */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-4 text-[#1B7B19] text-center font-serif">
            Why We Need to <br /> Save Seagrass ?
          </h2>
        </div>

        {/* Right Column - Paragraph */}
        <div className="w-full md:w-1/2 flex items-center">
          <p className="text-gray-900 leading-relaxed text-xl font-serif">
            Seagrasses are the ocean’s hidden heroes.They fight climate change by absorbing carbon faster than rainforests, protect coastlines from erosion, and keep our waters clean. 
            These underwater plants are home to fish, turtles, and countless marine creatures—and support millions of people who depend on the sea.
            But seagrasses are disappearing fast due to pollution and human activity.Saving seagrass means saving marine life, protecting coastlines, and securing our planet’s future
          </p>
        </div>
      </div>

      {/*to include the seagrass leaves image */}
      <div className="mt-0 mb-0">
        <img src={imag4} alt="Seagrass Leaves" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default Home;
