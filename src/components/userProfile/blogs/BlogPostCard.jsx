import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../Login_Register/AuthContext";
import { toast } from "react-toastify";
import EditBlogModal from "./EditBlogModel";
import Swal from "sweetalert2";

const BlogPostCard = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    if (!user?.user_id) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/blogs/user/${user.user_id}/`
      );
      setBlogs(response.data);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      toast.error("Failed to fetch blogs.");
    } finally {
      setIsLoading(false);
    }
  };

 

const handleDelete = async (blog_id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes",
  });

  if (!result.isConfirmed) return;

  try {
    const token = localStorage.getItem("access_token");
    await axios.delete(`http://localhost:8000/api/blogs/${blog_id}/delete/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Blog deleted successfully!");
    setBlogs((prev) => prev.filter((b) => b.blog_id !== blog_id));
  } catch (error) {
    console.error("Failed to delete blog:", error);
    toast.error("Failed to delete blog.");
  }
};


  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsEditOpen(true);
  };

  const handleUpdate = (updatedBlog) => {
    setBlogs((prev) =>
      prev.map((b) => (b.blog_id === updatedBlog.blog_id ? updatedBlog : b))
    );
  };

  return (
    <div className="px-6 mt-10">
      <div className="flex flex-wrap justify-between gap-4 max-w-6xl mx-auto">
        {isLoading ? (
          <p className="text-center w-full">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-center w-full text-gray-500">No blogs found.</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog.blog_id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition duration-300 flex flex-col w-full md:w-[32%]"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-2xl font-bold text-[#1B7B19] mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-700 mb-4 line-clamp-3">{blog.content}</p>
                <div className="mt-auto flex justify-between items-center gap-2">
                  <Link
                    to={`/blogFullView/${blog.blog_id}`}
                    className="text-[#1B7B19] hover:underline"
                  >
                    read more
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.blog_id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/*  Edit Modal */}
      <EditBlogModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        blog={selectedBlog}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default BlogPostCard;
