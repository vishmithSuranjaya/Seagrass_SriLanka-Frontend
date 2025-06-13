import React, { useState } from "react";
import { AiOutlineLike } from "react-icons/ai";
import { PiShareFat } from "react-icons/pi";
import { BiComment } from "react-icons/bi";

const LikeCommentComp = (props) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(Number(props.cmtCount) || 0);  // ✅ Ensure it's a number

  const toggleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
    } else {
      setLikes((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex gap-4 pt-5 pb-5 text-2xl items-center">
          {/* LIKE */}
          <div onClick={toggleLike} className="flex items-center gap-1 cursor-pointer">
            <AiOutlineLike
              className={`hover:scale-105 transition duration-200 ${
                liked ? "text-blue-600" : "text-gray-600"
              }`}
            />
            <span className="text-sm">{likes}</span>
          </div>

          {/* COMMENT */}
          <div className="flex items-center gap-1">
            <BiComment className="hover:scale-105 transition duration-200" />
            <span className="text-sm"></span>
          </div>

          {/* SHARE */}
          <div className="cursor-pointer">
            <PiShareFat className="hover:scale-105 transition duration-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikeCommentComp;
