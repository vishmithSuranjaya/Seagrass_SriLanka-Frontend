import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";
import axios from "axios";
import AddBlogModal from "../components/AddNewBlog/AddNewBlog";
import Skeleton from "../components/Loader/Skeleton";
import Pagination from "../components/pagination/Pagination";
import { IoMdClose } from "react-icons/io"; // Import the close icon

const Blog = () => {
  const [showModal, setShowModal] = useState(false);
  // Removed title, content, imageFile, imagePreview from here
  // as they are now managed internally by AddBlogModal for its undo/redo feature.
  // The onPost prop will receive the final formData.
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* Search-related state */
  const [searchKeyword, setSearchKeyword] = useState(""); // what user is typing
  const [searchQuery, setSearchQuery] = useState(""); // confirmed on button click

  /* Pagination */
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  const navigate = useNavigate();

  /* Fetch blogs once on component mount and when modal closes after post */
  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/blogs/");
      setBlogs(data);
    } catch (err) {
      toast.error("Failed to fetch blogs.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSeeMore = (blog_id, user_id) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/blogFullView/${blog_id}`, { state: { user_id } });
  };

  // Modified handlePost to accept formData directly from AddBlogModal
  const handlePost = async (formData) => {
    if (!formData.get("title").trim() || !formData.get("content").trim()) {
      toast.error("Blog title and content cannot be empty.");
      return false; // Indicate failure to modal
    }
    if (!formData.get("image")) {
      toast.error("Please upload an image for the blog.");
      return false; // Indicate failure to modal
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in to post a blog.");
        return false; // Indicate failure to modal
      }
      await axios.post("http://localhost:8000/api/blogs/post/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // toast.success("Blog posted successfully!");
      setShowModal(false);
      fetchBlogs(); // Refresh blogs after successful post
      return true; // Indicate success to modal
    } catch (err) {
      // toast.error("Failed to post blog.");
      console.error(err);
      return false; // Indicate failure to modal
    }
  };

  /* -------------------------------- Search & Pagination ----------------- */

  // Function to clear the search bar and reset results
  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchQuery(""); // Clear the actual filter
    setCurrentPage(1); // Reset to the first page
  };

  const filteredBlogs = blogs
    .filter((blog) => blog.status === "active")
    .filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  return (
    <div className="mt-24 px-20 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <BreadCrumb />

      <h1 className="mt-2 mb-10 text-[#1B7B19] text-4xl font-bold text-center">
        Blogs
      </h1>

      <div className="w-4/5 max-w-6xl mx-auto p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1B7B19] text-white text-base px-5 py-2 rounded-md hover:bg-green-800 hover:scale-105 transition duration-200"
        >
          Add Blog
        </button>

        <div className="relative flex items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchQuery(searchKeyword);
                setCurrentPage(1);
              }
            }}
            className="flex-grow pr-10 pl-4 py-2 border border-gray-300 rounded-l-md focus:outline-none w-full"
          />
          {searchKeyword && ( // Conditionally render the clear icon
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-24 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Clear search"
            >
              <IoMdClose size={20} />
            </button>
          )}
          <button
            className="h-full bg-[#1B7B19] py-2 px-5 text-white rounded-r-md hover:bg-green-700 transition-colors duration-200 hover:cursor-pointer"
            onClick={() => {
              setSearchQuery(searchKeyword);
              setCurrentPage(1);
            }}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>

      {/* Blog list ----------------------------------------------------------- */}
      <div className="flex flex-col gap-6 w-4/5 max-w-6xl mx-auto mt-10 mb-8">
        {isLoading ? (
          Array(4)
            .fill(0)
            .map((_, idx) => <Skeleton key={idx} type="blog_list" />)
        ) : currentBlogs.length ? (
          currentBlogs.map((blog) => (
            <div
              key={blog.blog_id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row hover:scale-105 transition-transform duration-200 hover:shadow-lg"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full md:w-1/3 h-64 object-cover"
              />
              <div className="p-4 w-full">
                <h3 className="text-2xl font-bold text-[#1B7B19] mb-2">
                  {blog.title}
                </h3>
                <p className="text-lg  mb-2 line-clamp-3 font-serif">
                  {blog.content}
                </p>
                <button
                  className="text-lg text-[#1B7B19] hover:underline pt-5 font-serif"
                  onClick={() => handleSeeMore(blog.blog_id, blog.user_id)}
                >
                  read more
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-xl font-medium">
            No blogs found for your search.
          </p>
        )}
      </div>

      {/* Pagination ---------------------------------------------------------- */}
      {!isLoading && filteredBlogs.length > blogsPerPage && (
        <Pagination
          totalBlogs={filteredBlogs.length}
          blogsPerPage={blogsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* Add-blog modal ------------------------------------------------------ */}
      <AddBlogModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onPost={handlePost} // Pass handlePost directly
        // Removed individual state props (title, content, imagePreview, etc.)
        // because AddBlogModal now manages these internally with its undo/redo logic.
        // It will pass the complete formData back via onPost.
      />
    </div>
  );
};

export default Blog;