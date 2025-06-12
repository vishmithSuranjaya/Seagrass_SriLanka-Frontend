import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";

const Blog = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  {
    /**navigate to the full view of a blog */
  }
  const navigate = useNavigate();

  const handleSeeMore = (id) => {
    navigate(`/blogFullView/${id}`);
  };

  {
    /**to handle the post button */
  }
  const handlePost = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Blog title and content cannot be empty.");
      return;
    }

    if (!imageFile) {
      toast.error("Please upload an image for the blog.");
      return;
    }

    console.log("Posting blog:", { title, content, imageFile });

    // Reset form
    setShowModal(false);
    setTitle("");
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    toast.success("Blog posted successfully!");
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

      {/* Breadcrumb Navigation */}
      <div>
        <BreadCrumb />
      </div>


      <h1 className="mt-2 mb-10 text-[#1B7B19] text-4xl font-bold text-center">
        Blogs
      </h1>

      {/* Add blogs section */}
      <div className="w-4/5 max-w-6xl mx-auto  p-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#1B7B19] text-white text-base px-5 py-2 rounded-md hover:bg-green-800 hover:scale-105 transition duration-200"
        >
          Add Blogs
        </button>
      </div>

      {/* Blog Posts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-4/5 max-w-6xl mx-auto mt-10">
        {[1, 2, 3].map((id) => (
          <div
            key={id}
            className="bg-white shadow-md rounded-lg overflow-hidden"
          >
            <img
              src="https://via.placeholder.com/400x200"
              alt="Blog"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-[#1B7B19] mb-2">
                Blog Title {id}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
              <button
                className="text-sm text-[#1B7B19] hover:underline"
                onClick={() => handleSeeMore(id)}
              >
                See More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl h-[550px] overflow-y-auto relative">
            {/* Close Button */}
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
              {/* Image Upload Column */}
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

              {/* Form Column */}
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
