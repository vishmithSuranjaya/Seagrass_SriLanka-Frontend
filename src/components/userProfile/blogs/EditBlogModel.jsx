import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const EditBlogModal = ({ isOpen, onClose, blog, onUpdate }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setPreview(blog.image || null);
      setImage(null); // reset when opening
    }
  }, [blog]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `http://localhost:8000/api/blogs/${blog.blog_id}/update/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("✅ Blog updated successfully!");
      onUpdate(response.data); // update parent state
      onClose();
    } catch (error) {
      console.error("Failed to update blog:", error);

      if (error.response?.data?.detail) {
        toast.error(`❌ ${error.response.data.detail}`);
      } else {
        toast.error("❌ Failed to update blog.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg relative">
        <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
        <form onSubmit={handleSubmit}>
          {/* Image Preview + Upload */}
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover mb-3 rounded"
            />
          )}

          <label className="inline-block bg-[#1B7B19] text-white px-4 py-2 rounded cursor-pointer hover:bg-green-800 transition mb-4">
            Browse Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden" // ✅ hides default input
            />
          </label>

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2 mb-3"
            placeholder="Title"
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded p-2 mb-3"
            rows="6"
            placeholder="Content"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>

        {/* ✅ Local ToastContainer */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default EditBlogModal;
