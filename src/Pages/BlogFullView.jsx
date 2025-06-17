import  { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import testImg from "../assets/Photo-1.jpg";
import placeholderBlogImg from "../assets/blog.jpg";
import LikeCommentComp from "../components/Reactions/LikeCommentComp";

const BlogFullView = () => {
  const { id } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState(location.state?.blog || null);
  const [loading, setLoading] = useState(!blog);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!blog) {
      const fetchBlog = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/blogs/${id}/`);
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
          const data = await response.json();
          setBlog(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [blog, id]);

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="mt-25 px-6">
      <Breadcrumb />

      <div className="w-3/4 mx-auto p-10">
        {/* Profile and Title Section */}
        <div className="grid gap-4 mb-6">
          <div className="flex items-center gap-4">
            {loading ? (
              <>
                <Skeleton circle width={64} height={64} />
                <div>
                  <Skeleton width={120} height={20} />
                  <Skeleton width={100} height={16} />
                </div>
              </>
            ) : (
              <>
                <img src={testImg} alt="profile" className="w-16 h-16 rounded-full" />
                <div>
                  <h5 className="font-bold font-serif text-lg">{blog.author || "Unknown Author"}</h5>
                  <time className="text-sm font-semibold">
                    {blog.date} <br />
                    {blog.time}
                  </time>
                </div>
              </>
            )}
          </div>
          <h4 className="underline font-serif font-semibold text-xl">
            {loading ? <Skeleton width={`50%`} /> : blog.title}
          </h4>
        </div>

        {/* Blog Image */}
        <div className="mb-6">
          {loading ? (
            <Skeleton height={300} />
          ) : (
            <img
              src={blog.image_url || placeholderBlogImg}
              alt="blog"
              className="w-full max-h-[400px] object-cover rounded-md"
            />
          )}
        </div>

        {/* Blog Content */}
        <div className="prose max-w-none text-gray-800 text-lg leading-relaxed font-serif">
          {loading ? (
            <>
              <Skeleton count={5} />
              <Skeleton width="80%" />
            </>
          ) : (
            blog.content
          )}
        </div>

        {/* Like and Comment Buttons */}
        {!loading && (
          <LikeCommentComp blog_id={blog.comment_id} cmtCount={blog.comment_id} />
        )}
      </div>
    </div>
  );
};

export default BlogFullView;
