import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BreadCrumb from "../components/breadcrumb/BreadCrumb";
import axios from "axios";
import AddBlogModal from "../components/AddNewBlog/AddNewBlog";
import Skeleton from "../components/Loader/Skeleton";

const Blog = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [blogs, setBlogs] = useState([]);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
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
      await axios.post("http://localhost:8000/api/blogs/blogs", formData, {
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
        {isLoading
          ? // Show 3 skeleton loaders while fetching
            Array(1)
              .fill(0)
              .map((_, index) => <Skeleton key={index} type="blog_list" />)
          : blogs.map((blog) => (
              <div
                key={blog.blog_id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row"
              >
                <img
                  src={blog.image}
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
      <AddBlogModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onPost={async (formData) => {
          try {
            await axios.post(
              "http://localhost:8000/api/blogs/post/",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  // Authorization: `Bearer ` // replace with the actual token, this is to store as user_id
                },
              }
            );
            toast.success("Blog posted successfully!");
            setShowModal(false);
            fetchBlogs(); // Refresh blog list
            return true;
          } catch (error) {
            toast.error("Failed to post blog.");
            console.error(error);
            return false;
          }
        }}
      />
    </div>
  );
};

export default Blog;
