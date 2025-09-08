import React, { useEffect, useState } from "react";
import { useAuth } from "../Login_Register/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import AddBlogModal from "../AddNewBlog/AddNewBlog";
import { ToastContainer, toast } from "react-toastify";

const UserHome = () => {
  const { user } = useAuth();
  const [blogsCount, setBlogsCount] = useState(0);
  const [showModal, setShowModel] = useState(false);

  useEffect(() => {
    // Fetch number of blogs posted
    const fetchBlogsCount = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `http://localhost:8000/api/blogs/user/${user.user_id}/`,
          // { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlogsCount(response.data.length);
        console.log(response.data.length);
      } catch (error) {
        console.error("Failed to fetch blogs count:", error);
      }
    };

    if (user) fetchBlogsCount();
  }, [user]);

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
      toast.success("Blog posted successfully!");
      setShowModel(false);
      fetchBlogs(); // Refresh blogs after successful post
      return true; // Indicate success to modal
    } catch (err) {
      toast.error("Failed to post blog.");
      console.error(err);
      return false; // Indicate failure to modal
    }
  };
  

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6 flex flex-col items-center">
        {/* Profile Image */}
        <img
          src={user?.image || "https://via.placeholder.com/150?text=Profile"}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border mb-4"
        />

        {/* Name & Email */}
        <h1 className="text-4xl font-bold text-green-700">
          {user?.fname} {user?.lname}
        </h1>
        <p className="text-xl text-gray-500">{user?.email}</p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mt-6 w-full text-center">
          <div className="p-4 bg-gray-100 rounded-xl shadow">
            <p className="text-xl font-bold">{blogsCount}</p>
            <p className="text-md font-semibold text-gray-600">Blogs Posted</p>
          </div>
          <div className="p-4 bg-gray-100 rounded-xl shadow">
            <Link to="/cart" className="flex flex-col items-center">
              <span className="text-2xl">🛒</span>
              <p className="text-md font-semibold text-gray-600">Go to Cart</p>
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-6">
          <Link to="/user/settings">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md">
              Edit Profile
            </button>
          </Link>

          
            <button
              onClick={() => setShowModel(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
              Add New Blog
            </button>
          
          
        </div>
      </div>

      <AddBlogModal
              show={showModal}
              onClose={() => setShowModel(false)}
              onPost={handlePost} // Pass handlePost directly
              // Removed individual state props (title, content, imagePreview, etc.)
              // because AddBlogModal now manages these internally with its undo/redo logic.
              // It will pass the complete formData back via onPost.
            />
    </div>
  );
};

export default UserHome;
