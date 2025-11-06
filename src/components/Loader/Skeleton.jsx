import React from "react";

const Skeleton = ({ type }) => {
  switch (type) {
    case "blog_list":
      return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row mb-6 border-gray-200 p-25">
          <p className="text-gray-500 text-xl font-serif w-full mx-auto">Loading Blogs...</p>
          <div className="p-4 w-full">
            
          </div>
        </div>
      );
    case "blog-full":
  return (
    <div className="w-3/4 mx-auto p-10 animate-pulse">
      {/* Profile and Title Skeleton */}
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-gray-300 rounded-full w-16 h-16"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="bg-gray-300 h-4 w-1/3 rounded"></div>
          <div className="bg-gray-300 h-3 w-1/4 rounded"></div>
        </div>
      </div>

      <div className="bg-gray-300 h-6 w-3/4 rounded mb-6"></div>

      {/* Image Skeleton */}
      <div className="bg-gray-300 h-[300px] w-full rounded mb-6"></div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="bg-gray-300 h-4 w-full rounded"></div>
        <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
        <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
        <div className="bg-gray-300 h-4 w-full rounded"></div>
      </div>
    </div>
  );

  case "product_list":
      return (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {/* Repeat 8 skeleton cards */}
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center"
            >
              <div className="bg-gray-300 rounded-md w-full h-48 mb-4"></div>
              <div className="bg-gray-300 h-5 w-3/4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      );
  case "product-full":
  return (
    <div className="mt-24 px-20">
  <div className="m-10 max-w-5xl mx-auto animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Image Skeleton */}
      <div className="flex flex-col gap-4">
        {/* Main Image */}
        <div className="bg-gray-300 w-full h-96 rounded-lg"></div>

        {/* Thumbnails */}
        <div className="flex flex-row gap-2 overflow-x-auto mt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="bg-gray-300 w-20 h-20 rounded-md flex-shrink-0"></div>
          ))}
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="space-y-6">
        {/* Title */}
        <div className="bg-gray-300 h-8 w-2/3 rounded"></div>

        {/* Description */}
        <div className="space-y-3">
          <div className="bg-gray-300 h-4 w-full rounded"></div>
          <div className="bg-gray-300 h-4 w-5/6 rounded"></div>
          <div className="bg-gray-300 h-4 w-2/3 rounded"></div>
        </div>

        {/* Price */}
        <div className="bg-gray-300 h-6 w-1/4 rounded"></div>

        {/* Buttons */}
        <div className="flex gap-4">
          <div className="bg-gray-300 h-10 w-32 rounded-md"></div>
          <div className="bg-gray-300 h-10 w-32 rounded-md"></div>
        </div>
      </div>
    </div>
  </div>
</div>

  );

  case "cart":
  return (
    <div className="max-w-4xl mx-auto p-6 animate-pulse">
      {/* Title */}
      <div className="bg-gray-300 h-8 w-1/3 rounded mb-6"></div>

      {/* Simulate cart items */}
      {[...Array(3)].map((_, idx) => (
        <div key={idx} className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gray-300 w-20 h-20 rounded-md"></div>
            <div className="space-y-2">
              <div className="bg-gray-300 h-4 w-40 rounded"></div>
              <div className="bg-gray-300 h-4 w-24 rounded"></div>
              <div className="bg-gray-300 h-4 w-28 rounded"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-300 h-8 w-8 rounded"></div>
            <div className="bg-gray-300 h-6 w-6 rounded"></div>
            <div className="bg-gray-300 h-8 w-8 rounded"></div>
          </div>
        </div>
      ))}

      {/* Total Section */}
      <div className="bg-gray-300 h-6 w-32 rounded ml-auto mt-6"></div>
    </div>
  );
  case "gallery_list":
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="rounded-xl overflow-hidden shadow-md border border-gray-200"
            >
              <div className="aspect-square bg-gray-300"></div>
              <div className="bg-gray-300 h-4 w-3/4 mx-auto my-3 rounded"></div>
            </div>
          ))}
        </div>
      );
  }
};

export default Skeleton;
