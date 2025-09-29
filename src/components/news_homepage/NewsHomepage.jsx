import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NewsHomepage = () => {
  const [news, setNews] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/news/")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setNews(data.data);
        }
      })
      .catch((err) => console.error("News fetch error:", err));
  }, []);

  const handleImageError = (index) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const getImageUrl = (item, index) => {
    if (imageErrors[index]) {
      return "https://via.placeholder.com/400x200?text=Image+Not+Available";
    }
    if (
      item.image?.startsWith("http://") ||
      item.image?.startsWith("https://")
    ) {
      return item.image;
    }
    if (item.image?.startsWith("/")) {
      return `http://localhost:8000${item.image}`;
    }
    if (item.image) {
      return `http://localhost:8000/media/${item.image}`;
    }
    return "https://via.placeholder.com/400x200?text=No+Image";
  };

  const latestNews = news.slice(0, 4);

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl font-bold text-green-700 mb-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        News
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left Column (Other News) */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {latestNews.slice(1, 5).map((item, index) => (
            <motion.div
              key={index}
              className="flex gap-4 items-start cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() =>
                navigate("/viewFullNews", { state: { news: item } })
              }
            >
              <motion.img
                src={getImageUrl(item, index)}
                alt={item.title}
                className="w-36 h-36 object-cover rounded-md"
                onError={() => handleImageError(index)}
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="flex-1">
                <h3 className="text-green-700 font-semibold text-lg">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-1">
                  {new Date(item.created_at).toDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  {item.content.length > 100
                    ? item.content.slice(0, 100) + "..."
                    : item.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column (Top News) */}
        <motion.div
          className="p-2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {latestNews[0] && (
            <motion.div
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                navigate("/viewFullNews", { state: { news: latestNews[0] } })
              }
            >
              <motion.img
                src={getImageUrl(latestNews[0], 0)}
                alt={latestNews[0].title}
                className="w-full h-64 object-cover rounded-md mb-2"
                onError={() => handleImageError(0)}
                loading="lazy"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <h2 className="text-xl font-bold text-green-700">
                {latestNews[0].title}
              </h2>
              <p className="text-sm text-gray-700 mb-1">
                {latestNews[0].content.length > 100
                  ? latestNews[0].content.slice(0, 100) + "..."
                  : latestNews[0].content}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default NewsHomepage;
