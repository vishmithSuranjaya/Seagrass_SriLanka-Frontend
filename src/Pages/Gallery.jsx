import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [popupImage, setPopupImage] = useState(null);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/core/gallery/");
        if (response.data && response.data.data) {
          setImages(response.data.data);
        } else {
          setErrorMessage("No images found.");
        }
      } catch (error) {
        setErrorMessage("Failed to load images from the server.");
        console.error("Error fetching gallery images:", error);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <div className="relative">
      {/* Main gallery container */}
      <div className="mt-24 px-4 sm:px-10 lg:px-20 pb-20 max-w-7xl mx-auto transition duration-200">
        <Breadcrumb />
        <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
          Gallery
        </h1>

        {errorMessage && (
          <div className="text-red-600 text-center mb-6 font-semibold">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img.image_id}
              className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
              onClick={() => setPopupImage(img)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={img.image}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              {img.caption && (
                <div className="text-sm p-2 text-center text-gray-700">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Popup modal (centered, scrollable if needed) */}
      {popupImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 border border-gray-300 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPopupImage(null)}
              aria-label="Close popup"
              className="absolute top-2 right-3 text-gray-600 text-3xl hover:text-black transition-colors cursor-pointer bg-transparent border-none"
            >
              &times;
            </button>

            <div className="w-full aspect-square rounded-lg overflow-hidden">
              <img
                src={popupImage.image}
                alt={popupImage.caption}
                className="w-full h-full object-cover"
              />
            </div>

            {popupImage.caption && (
              <p className="text-center text-sm text-gray-600 mt-2 px-2 truncate">
                {popupImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
