import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [news, setNews] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8000/api/news/')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setNews(data.data);
        }
      })
      .catch((err) => console.error('News fetch error:', err));
  }, []);

  const handleImageError = (index) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true
    }));
  };

  const getImageUrl = (item, index) => {
    if (imageErrors[index]) {
      return 'https://via.placeholder.com/400x200?text=Image+Not+Available';
    }
    if (item.image?.startsWith('http://') || item.image?.startsWith('https://')) {
      return item.image;
    }
    if (item.image?.startsWith('/')) {
      return `http://localhost:8000${item.image}`;
    }
    if (item.image) {
      return `http://localhost:8000/media/${item.image}`;
    }
    return 'https://via.placeholder.com/400x200?text=No+Image';
  };

  const latestNews = news.slice(0, 3);
  const featuredImages = news.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-green-700 mb-10">Latest News & Updates</h2>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 flex flex-col gap-8">
          {latestNews.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
              onClick={() => navigate('/viewFullNews', { state: { news: item } })}
            >
              <img
                src={getImageUrl(item, index)}
                alt={item.title}
                className="w-36 h-36 object-cover rounded-md"
                onError={() => handleImageError(index)}
                loading="lazy"
              />
              <div className="flex-1">
                <h3 className="text-green-700 font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(item.created_at).toDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  {item.content.length > 100
                    ? item.content.slice(0, 100) + '...'
                    : item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2">
          <h4 className="text-xl font-semibold text-green-700 mb-4">Featured</h4>
          <div className="flex flex-col gap-4">
            {featuredImages.map((item, index) => (
              <div
                key={index}
                className="w-full h-28 overflow-hidden rounded-lg"
              >
                <img
                  src={getImageUrl(item, index)}
                  alt="Featured News"
                  className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/viewFullNews', { state: { news: item } })}
                  onError={() => handleImageError(index)}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
