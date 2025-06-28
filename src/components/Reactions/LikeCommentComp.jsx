import React, { use, useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { PiShareFat } from "react-icons/pi";
import { BiComment } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LikeCommentComp = (props) => {

  const blog_id = props.blog_id;
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Number(props.likeCount) || 0);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const toggleLike = async () => {
    const token = localStorage.getItem("access_token");

  if (!token) {
    toast.error("Please log in to like this post");
    return;
  }

  try {
    const response = await axios.post(
      `http://localhost:8000/api/blogs/${props.blog_id}/like/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update UI with backend response
    setLiked(response.data.liked);         // true or false
    setLikes(response.data.like_count);    // updated count
  } catch (error) {
    console.error("Error toggling like:", error);
    toast.error("Failed to like/unlike the blog");
  }
  };

  // to fetch all the comments from the backend

  // to handle the comment submittion
  const handleCommentSubmit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in to post a comment");
        return false;
      }
      
      await axios.post(
        "http://localhost:8000/api/blogs/create/comment/",
        {
          blog_id: blog_id,
          content: comment,
          type: '1'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":"application/json"
          },
        }
      );
      toast.success("Comment posted Successfully!");
      setShowCommentModal(false);
      await props.fetchBlog();
      
    } catch (error) {
      toast.error("Failed to post comment");
      console.error(error);
      return false;
    }
  };

  return (
    <div>
      <div className="flex justify-center">
        <ToastContainer />
        <div className="flex gap-4 pt-5 pb-5 text-2xl items-center">
          {/* LIKE */}
          <div className="flex items-center gap-1 cursor-pointer">
            <AiOutlineLike
              className={`hover:scale-105 transition duration-200 ${
                liked ? "text-blue-600" : "text-gray-600"
              }`}
              onClick={toggleLike}
            />
            <span className="text-sm">{likes}</span>
          </div>

          {/* COMMENT */}
          <div className="flex items-center gap-1">
            <BiComment
              className="hover:scale-105 transition duration-200 cursor-pointer"
              onClick={() => setShowCommentModal(true)}
            />
            <span className="text-sm"></span>
          </div>

          {/* SHARE */}
          <div className="cursor-pointer">
            <PiShareFat className="hover:scale-105 transition duration-200" />
          </div>
        </div>
        {/* COMMENT MODAL */}
        {showCommentModal && (
          <div className="fixed inset-0 z-50 bg- backdrop-blur pacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowCommentModal(false)}
                className="absolute top-2 right-4 text-gray-500 hover:text-black text-2xl font-bold"
              >
                &times;
              </button>

              <h2 className="text-lg font-semibold mb-4 text-center">
                Leave a Comment
              </h2>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Write your comment..."
                className="w-full border border-gray-300 p-2 rounded-md resize-none"
              ></textarea>

              <button
                onClick={handleCommentSubmit}
                className="mt-4 w-full bg-[#1B7B19] hover:bg-[#1d8c1b] text-white py-2 rounded"
              >
                Submit Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeCommentComp;
