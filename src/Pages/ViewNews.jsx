import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/breadcrumb/BreadCrumb';

const ViewFullNews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Check if news data is passed from the previous page
    if (location.state && location.state.news) {
      setNewsData(location.state.news);
    } else {
      // Fallback: redirect back if no data
      navigate('/news');
    }
  }, [location, navigate]);

  // Function to get proper image URL (same logic as in News.jsx)
  const getImageUrl = (news) => {
    if (imageError) {
      return 'https://via.placeholder.com/800x400?text=Image+Not+Available';
    }
    if (news.image && (news.image.startsWith('http://') || news.image.startsWith('https://'))) {
      return news.image;
    }
    if (news.image && news.image.startsWith('/')) {
      return `http://localhost:8000${news.image}`;
    }
    if (news.image) {
      return `http://localhost:8000/media/${news.image}`;
    }
    return 'https://via.placeholder.com/800x400?text=No+Image';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (!newsData) {
    return <p className="text-center mt-20 text-gray-500">Loading news details...</p>;
  }

  return (
    <div className="mx-auto p-6 mt-20">
      <button
        onClick={() => navigate(-1)}
        className=" ml-20 mb-6 text-white bg-[#1B7B19] px-4 py-2 rounded hover:bg-green-800 transition-colors"
      >
        ← Back
      </button>
      <div className="max-w-4xl mx-auto">
      
      

      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">{newsData.title}</h1>
      <p className="text-gray-500 mb-4 font-medium">{new Date(newsData.created_at).toDateString()}</p>
      
      <img
        src={getImageUrl(newsData)}
        alt={newsData.title || "News Image"}
        className="w-full h-auto mb-6 rounded-md shadow-md"
        onError={handleImageError}
        loading="lazy"
      />

      <div className="prose max-w-none text-gray-800 text-lg font-serif text-justify whitespace-pre-wrap leading-relaxed">
        {newsData.content}
      </div>
    </div>
  </div>
  );
};

export default ViewFullNews;