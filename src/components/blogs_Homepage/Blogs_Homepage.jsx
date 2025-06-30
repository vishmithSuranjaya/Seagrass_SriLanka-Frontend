import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Blogs_Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/blogs/");
      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 mt-10">
      <h1 className="text-3xl font-bold text-center text-[#1B7B19] mb-8">
        Latest Blogs
      </h1>

      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        {isLoading ? (
          <p className="text-center">Loading blogs...</p>
        ) : (
          blogs.slice(0, 3).map((blog) => (
            <div
              key={blog.blog_id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col md:flex-row"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full md:w-1/3 h-64 object-cover"
              />
              <div className="p-6 w-full">
                <h2 className="text-2xl font-bold text-[#1B7B19] mb-2">{blog.title}</h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{blog.content}</p>
                <Link
                  to={`/blogFullView/${blog.blog_id}`}
                  className="text-[#1B7B19] hover:underline"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center mt-8">
        <Link
          to="/blog"
          className="inline-block bg-[#1B7B19] text-white px-6 py-3 rounded hover:bg-green-800 transition"
        >
          View All Blogs
        </Link>
      </div>
    </div>
  );
};

export default Blogs_Homepage;
