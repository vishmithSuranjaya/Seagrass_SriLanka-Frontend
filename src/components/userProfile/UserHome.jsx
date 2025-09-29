import React, { useEffect, useState } from "react";
import { useAuth } from "../Login_Register/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";
import AddBlogModal from "../AddNewBlog/AddNewBlog";
import { ToastContainer, toast } from "react-toastify";
import { FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";

const UserHome = () => {
  const { user } = useAuth();
  const [blogsCount, setBlogsCount] = useState(0);
  const [showModal, setShowModel] = useState(false);
  const [comments, setRecentComments] = useState(0);

  useEffect(() => {
    // Fetch number of blogs posted
    const token = localStorage.getItem("access_token");
    const fetchBlogsCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/blogs/user/${user.user_id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlogsCount(response.data.length);
        console.log(response.data.length);
      } catch (error) {
        console.error("Failed to fetch blogs count:", error);
      }
    };

    const fetchRecentComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/blogs/user/blog_comments/${user.user_id}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentComments(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch recent comments:", error);
      }
    };

    if (user) fetchBlogsCount();
    fetchRecentComments();
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

  

const handleDeleteComment = async (comment_id) => {
  const token = localStorage.getItem("access_token");

  // Show confirmation popup
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This comment will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return; // user clicked cancel

  try {
    await axios.delete(
      `http://localhost:8000/api/blogs/user/delete_comment/${comment_id}/`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update UI (remove deleted comment)
    setRecentComments((prev) =>
      prev.filter((c) => c.comment_id !== comment_id)
    );

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Your comment has been removed.",
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error("Failed to delete comment:", err);
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: "Something went wrong while deleting the comment.",
    });
  }
};


  return (
    <div className="max-w-6xl mx-auto p-6 flex gap-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left: Profile and Actions */}
      <div className="flex-1">
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
              <p className="text-md font-semibold text-gray-600">
                Blogs Posted
              </p>
            </div>
            <div className="p-4 bg-gray-100 rounded-xl shadow">
              <Link to="/cart" className="flex flex-col items-center">
                <span className="text-2xl">🛒</span>
                <p className="text-md font-semibold text-gray-600">
                  Go to Cart
                </p>
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
      </div>

      {/* Right: Recent Comments */}
      <div className="w-1/3">
        <div className="p-6 bg-gray-100 rounded-xl shadow h-full">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Recent Comments
          </h2>
          {comments.length > 0 ? (
            <ul className="space-y-4">
              {comments.slice(0, 3).map((c, index) => (
                <li
                  key={index}
                  className="p-6 bg-white rounded-md shadow-sm border"
                >
                  <p className="text-gray-800 font-bold">{c.text || c.content}</p>
                  <p className="text-sm .text-white">
                    on blog{" "}
                    <Link
                      to={`/blogFullView/${c.blog_id}`}
                      className="text-green-600 hover:underline font-semibold"
                    >
                      {c.blog_title}
                    </Link>
                  </p>

                  {/* delete comment operation */}
                  <button
                    onClick={() => handleDeleteComment(c.comment_id)}
                    className="text-red-500 hover:text-red-700 float-right mb-3"
                  >
                    <FaTrashCan size={18} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent comments.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddBlogModal
        show={showModal}
        onClose={() => setShowModel(false)}
        onPost={handlePost}
      />
    </div>
  );
};

export default UserHome;
