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

  }
};

export default Skeleton;
