import React, { useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import Skeleton from "../components/Loader/Skeleton";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [popupImage, setPopupImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const imagesPerPage = 12;

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/core/gallery/"
        );
        if (response.data && response.data.data) {
          setImages(response.data.data);
          setFilteredImages(response.data.data);
        } else {
          setErrorMessage("No images found.");
        }
      } catch (error) {
        setErrorMessage("Failed to load images from the server.");
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = images.filter((img) =>
      img.caption?.toLowerCase().includes(query)
    );
    setFilteredImages(filtered);
    setCurrentPage(1); // reset to first page on search
  }, [searchQuery, images]);

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const getImageUrl = (img) => {
    if (imageErrors[img.image_id]) {
      return "https://via.placeholder.com/400x400?text=Image+Not+Available";
    }
    if (img.image?.startsWith("http://") || img.image?.startsWith("https://")) {
      return img.image;
    }
    if (img.image?.startsWith("/")) {
      return `http://localhost:8000${img.image}`;
    }
    if (img.image) {
      return `http://localhost:8000/media/${img.image}`;
    }
    return "https://via.placeholder.com/400x400?text=No+Image";
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = filteredImages.slice(
    startIndex,
    startIndex + imagesPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0);
    }
  };

  return (
    <div className="mt-24 px-20 relative min-h-screen">
      <Breadcrumb />
      <div className="sm:px-10 lg:px-20 pb-20 max-w-7xl mx-auto transition duration-200">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
          Gallery
        </h1>

        {/* Search Input */}
        <div className="flex justify-center mb-8">
          <input
            type="text"
            placeholder="Search by caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200"
          />
        </div>

        {/* Conditional Rendering */}
        {loading ? (
          <Skeleton type="gallery_list" />
        ) : errorMessage ? (
          <div className="text-red-600 text-center mb-6 font-semibold">
            {errorMessage}
          </div>
        ) : currentImages.length === 0 ? (
          <p className="text-center text-gray-600">No images found.</p>
        ) : (
          <>
            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentImages.map((img) => (
                <div
                  key={img.image_id}
                  className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
                  onClick={() => setPopupImage(img)}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={getImageUrl(img)}
                      alt={img.caption}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={() => handleImageError(img.image_id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => goToPage(idx + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === idx + 1
                        ? "bg-green-700 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Popup View */}
      {popupImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="relative max-w-auto bg-white rounded-2xl shadow-2xl p-4 border border-gray-300 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setPopupImage(null)}
              aria-label="Close popup"
              className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center 
             rounded-full bg-red-500 text-white text-2xl font-bold 
             hover:bg-red-600 active:bg-red-700 
             shadow-lg transition-all cursor-pointer"
            >
              &times;
            </button>

            <div className="rounded-lg overflow-hidden mb-4 h-[550px]">
              <img
                src={getImageUrl(popupImage)}
                alt={popupImage.caption}
                className="w-full h-full object-cover"
                onError={() => handleImageError(popupImage.image_id)}
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
