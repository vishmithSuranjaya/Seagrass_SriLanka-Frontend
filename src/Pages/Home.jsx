import React from "react";
import Banner from "../assets/banner.webp"; // Make sure this path is correct
import imag1 from "../assets/Photo-1.jpg";
import imag2 from "../assets/PC290412.jpg";
import imag3 from "../assets/Photo-6.jpg";
import imag4 from "../assets/seagrass_leaves.jpg";

const Home = () => {
  return (
    <div className="w-full">
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
        <h1 className="p-10 text-red-500 text-center">
          news component comes here..
        </h1>
      </div>

      {/* What is Seagrass Section */}
      <div className="w-full my-10 px-4 max-w-7xl mx-auto">
        <hr className="w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10">
          {/* Left: Text */}
          <div className="justify-center h-[400] ">
            <h2 className="text-5xl sm:text-6xl font-bold mb-4 pb-4  text-[#1B7B19] text-center font-serif">
              What is Seagrass?
            </h2>
            <p className="text-gray-900 leading-relaxed text-xl text-left font-serif">
              Seagrass refers to flowering plants that grow in shallow marine
              waters, forming dense underwater meadows. Often mistaken for
              seaweed, seagrasses are actually more closely related to land
              grasses and play a vital role in coastal ecosystems. Seagrass is
              essential for a healthy ocean and planet. It absorbs carbon
              dioxide, supports marine life, keeps water clean, and protects
              coastlines from erosion. Seagrass also helps global fisheries, but
              it's quickly disappearing due to pollution and human impact—making
              its protection more important than ever.
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
      <h3 className="text-center text-red-500">Some blogs comes here..</h3>

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
            Seagrass is essential for a healthy ocean and planet. It absorbs
            carbon dioxide, supports marine life, keeps water clean, and
            protects coastlines from erosion. Seagrass also helps global
            fisheries, but it's quickly disappearing due to pollution and human
            impact—making its protection more important than ever.
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
