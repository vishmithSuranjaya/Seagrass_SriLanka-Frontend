import React, { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { PiShareFat } from "react-icons/pi";
import { BiComment } from "react-icons/bi";

const Comments = (props) => {
  const blog_id = props.blog_id;
  console.log(blog_id)
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState("");

  

  const handleCommentSubmit = () => {
    if (comment.trim() !== "") {
      console.log(comment)
      console.log("Submit to backend:", {
        blog_id,
        comment,
      });
      setComment("");
      setShowCommentModal(false);
    }
  };

  return (
    <div>
      {/* Like/Comment/Share Row */}
      <div className="flex justify-center">
        <div className="flex gap-4 pt-5 pb-5 text-2xl items-center">
          

          {/* COMMENT */}
          <div
            onClick={() => setShowCommentModal(true)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <BiComment className="hover:scale-105 transition duration-200" />
            <span className="text-sm"></span>
          </div>

          
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
              className="mt-4 w-full bg-[#1B7B19] hover:bg-[#1d8c1b] text-white py-2 rounded hover:cursor-pointer"
            >
              Submit Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
