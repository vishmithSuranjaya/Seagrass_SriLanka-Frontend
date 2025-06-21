import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewFullNews = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState(null);

  useEffect(() => {
    // Check if news data is passed from the previous page
    if (location.state && location.state.news) {
      setNewsData(location.state.news);
    } else {
      // Fallback: fetch from backend using news_id from URL params or redirect
      navigate('/'); // Redirect back if no data (optional)
    }
  }, [location, navigate]);

  if (!newsData) {
    return <p className="text-center mt-20 text-gray-500">Loading news details...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white bg-[#1B7B19] px-4 py-2 rounded hover:bg-green-800"
      >
        ← Back
      </button>

      <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">{newsData.title}</h1>
      <p className="text-gray-600 mb-4 font-medium">{new Date(newsData.created_at).toDateString()}</p>
      
      <img
        src={`http://localhost:8000/media/${newsData.image}`}
        alt="News"
        className="w-full h-auto mb-6 rounded-md shadow-md"
      />

      <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
        {newsData.content}
      </div>
    </div>
  );
};

export default ViewFullNews;
