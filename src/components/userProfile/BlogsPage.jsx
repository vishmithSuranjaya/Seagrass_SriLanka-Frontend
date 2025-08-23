import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../Login_Register/AuthContext";
import Blogs_Homepage from "./blogs/BlogPostCard";
import BlogPostCard from "./blogs/BlogPostCard";

const UserBlogs = () => {
  const { user } = useAuth(); // current logged-in user
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  

  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Blogs</h2>

    <BlogPostCard />
    </div>
  );
};

export default UserBlogs;
