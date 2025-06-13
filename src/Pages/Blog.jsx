import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";
import axios from "axios";

const Blog = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/blogs/blogs");
      setBlogs(response.data);
    } catch (error) {
      toast.error("Failed to fetch blogs.");
      console.error(error);
    }
  };

  const handleSeeMore = (id) => {
    navigate(`/blogFullView/${id}`);
  };

  const handlePost = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Blog title and content cannot be empty.");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload an image for the blog.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", imageFile);

    try {
      await axios.post("http://localhost:8000/api/blogs/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Blog posted successfully!");
      setShowModal(false);
      setTitle("");
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      fetchBlogs(); // refresh list
    } catch (error) {
      toast.error("Failed to post blog.");
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mt-25 px-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <BreadCrumb />

      <h1 className="mt-2 mb-10 text-[#1B7B19] text-4xl font-bold text-center">
        Blogs
      </h1>

      {/* Add Blog Button */}
      <div className="w-4/5 max-w-6xl mx-auto p-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1B7B19] text-white text-base px-5 py-2 rounded-md hover:bg-green-800 hover:scale-105 transition duration-200"
        >
          Add Blog
        </button>
      </div>

      {/* Blogs */}
      <div className="flex flex-col gap-6 w-4/5 max-w-6xl mx-auto mt-10 mb-8 hover:scale-105 transition-transform duration-200 hover:shadow-lg transition-shadow duration-300">
        {blogs.map((blog) => (
          <div
            key={blog.blog_id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row"
          >
            <img
              src={blog.image} // assuming it's a full URL; if not, prepend server domain
              alt="Blog"
              className="w-full md:w-1/3 h-64 object-cover"
            />
            <div className="p-4 w-full">
              <h3 className="text-2xl font-bold text-[#1B7B19] mb-2 ">
                {blog.title}
              </h3>
              <p className="text-lg text-gray-900 mb-2 line-clamp-3 font-serif">
                {blog.content}
              </p>
              <button
                className="text-lg text-[#1B7B19] hover:underline pt-5 font-serif"
                onClick={() => handleSeeMore(blog.blog_id)}
              >
                see more
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-[550px] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-600 transition"
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-[#1B7B19]">
              Add a New Blog
            </h2>

            <form
              onSubmit={handlePost}
              className="flex flex-col md:flex-row gap-6"
            >
              <div className="w-full md:w-1/3 flex flex-col items-center justify-center border border-dashed border-gray-400 rounded p-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-500 mb-4 bg-gray-100 rounded">
                    No image selected
                  </div>
                )}
                <div className="flex flex-col gap-2 w-full items-center">
                  <label className="bg-[#1B7B19] text-white px-4 py-2 rounded cursor-pointer hover:bg-green-800 transition">
                    Browse Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="px-4 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Clear Image
                    </button>
                  )}
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <input
                  type="text"
                  placeholder="Blog Title"
                  className="w-full mb-4 p-2 border border-gray-300 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Blog Content"
                  className="w-full mb-4 p-2 border border-gray-300 rounded h-70"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                ></textarea>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Optimize
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1B7B19] text-white rounded hover:bg-green-800"
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
