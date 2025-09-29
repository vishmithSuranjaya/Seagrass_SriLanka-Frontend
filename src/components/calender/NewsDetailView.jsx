import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../breadcrumb/BreadCrumb";
import Skeleton from "../Loader/Skeleton";
import { useNavigate } from "react-router-dom";

const NewsDetailView = () => {
  const { news_id } = useParams();
  const [news, setNews] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!news_id) return;

    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/news/${news_id}/`,
          { withCredentials: true }
        );
        setNews(response.data.data);
        console.log("Fetched news:", response.data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setNews(null); // ensures "News not found" shows
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [news_id]);

  if (loading) return <Skeleton type="blog-full" />;
  if (!news) return <p className="p-4">News not found.</p>;

  return (
    <div className="mt-24 px-20">
         <Breadcrumb />
         <button
        onClick={() => navigate(-1)}
        className=" ml-20 mb-6 text-white bg-[#1B7B19] px-4 py-2 rounded hover:bg-green-800 transition-colors"
      >
        ← Back
      </button>
        <div className="p-6 max-w-4xl mx-auto">
       
      {/* Display title */}
      <h1 className="text-3xl font-bold mb-4">{news.title || "No Title"}</h1>

      {/* Display image if available */}
      {news.image && (
        <img
          src={news.image.startsWith("http") ? news.image : `http://localhost:8000${news.image}`}
          alt={news.title || "News image"}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      {/* Display content */}
      <p className="text-gray-700 whitespace-pre-line">{news.content || "No content available."}</p>
    </div>
    </div>
  );
};

export default NewsDetailView;
