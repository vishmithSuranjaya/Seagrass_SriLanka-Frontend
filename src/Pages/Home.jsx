import React from 'react';
import Banner from '../assets/banner.jpg';

const Home = () => {
  return (
    <>
      <div className="relative w-screen left-1/2 right-1/2 -translate-x-1/2">
        <img
          src={Banner}
          alt="Banner"
          className="w-full h-[400px] object-cover"
        />
      </div>

      <div>
        <h1 className='p-10 text-red-500'>news component comes here..</h1> {/*call the new component to display some latest news */}
      </div>

      <div className="w-full my-10">
  <hr className="w-full mb-6" />

  <div className="grid grid-cols-2 gap-6 items-center px-4">
    {/* Left: Text */}
    <div>
      <h2 className="text-3xl font-bold mb-4 text-[#1B7B19]">What is Seagrass?</h2>
      <p className="text-gray-700">
        Seagrass refers to flowering plants that grow in shallow marine waters, 
forming dense underwater meadows. Often mistaken for seaweed, 
seagrasses are actually more closely related to land grasses and play
 a vital role in coastal ecosystems.Seagrass refers to flowering plants that 
 grow in shallow marine waters, forming dense underwater meadows. Often
 mistaken for seaweed, 
seagrasses are actually more closely related to land grasses and play
 a vital role in coastal ecosystems.Seagrass is essential for a healthy ocean and planet.
 It absorbs carbon dioxide, supports marine life, keeps water clean, and protects 
coastlines from erosion. 
Seagrass also helps global fisheries, but it's quickly disappearing due to pollution
 and human impact—making its protection more important than ever.
      </p>
    </div>

    {/* Right: Images */}
    <div className="flex flex-col gap-4">
      <img src="/path/to/image1.jpg" alt="Seagrass 1" className="w-full h-auto rounded shadow" />
      <img src="/path/to/image2.jpg" alt="Seagrass 2" className="w-full h-auto rounded shadow" />
    </div>
  </div>
</div>

    </>
  );
};

export default Home;
