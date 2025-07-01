import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [news, setNews] = useState([]);
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

  const latestNews = news.slice(0, 3); // First 3 news
  const featuredImages = news.slice(0, 5); // First 5 for featured section

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-green-700 mb-10">Latest News & Updates</h2>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left: Latest News Section */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {latestNews.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
              onClick={() => navigate('/viewFullNews', { state: { news: item } })}
            >
              <img
                src={`http://localhost:8000/media/${item.image}`}
                alt={item.title}
                className="w-36 h-36 object-cover rounded-md"
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

        {/* Right: Featured Image-Only Section */}
        <div className="p-2">
          <h4 className="text-xl font-semibold text-green-700 mb-4">Featured</h4>
          <div className="flex flex-col gap-4">
            {featuredImages.map((item, index) => (
              <div
                key={index}
                className="w-full h-28 overflow-hidden rounded-lg"
              >
                <img
                  src={`http://localhost:8000/media/${item.image}`}
                  alt="Featured News"
                  className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
                  onClick={() => navigate('/viewFullNews', { state: { news: item } })}
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
