import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Blogs_Homepage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleViewAllBlogs = () => {
    navigate("/blog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.div
      className="px-6 mt-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Heading */}
      <motion.h1
        className="text-3xl font-bold ml-35 text-[#1B7B19] mb-8"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Latest Blogs
      </motion.h1>

      {/* Blog Cards */}
      <motion.div
        className="flex flex-wrap justify-between gap-4 max-w-6xl mx-auto"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
      >
        {isLoading ? (
          <p className="text-center w-full">Loading blogs...</p>
        ) : (
          blogs.slice(0, 3).map((blog) => (
            <motion.div
              key={blog.blog_id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col w-full md:w-[32%]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4 }}
            >
              <motion.img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-[#1B7B19] mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {blog.content}
                </p>
                <Link
                  to={`/blogFullView/${blog.blog_id}`}
                  onClick={handleScrollToTop}
                  className="text-[#1B7B19] hover:underline"
                >
                  read more
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* View All Blogs Button */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <button
          onClick={handleViewAllBlogs}
          className="inline-block bg-[#1B7B19] text-white px-6 py-3 rounded hover:bg-green-800 transition"
        >
          View All Blogs
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Blogs_Homepage;
