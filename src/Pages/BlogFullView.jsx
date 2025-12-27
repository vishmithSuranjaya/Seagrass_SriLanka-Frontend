import  { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import testImg from "../assets/Photo-1.jpg";
import placeholderBlogImg from "../assets/blog.jpg";
import LikeCommentComp from "../components/Reactions/LikeCommentComp";
import { useNavigate } from "react-router-dom";

const BlogFullView = () => {
  const { id } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState(location.state?.blog || null);
  const [loading, setLoading] = useState(!blog);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user_id = location.state?.user_id;


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

  useEffect(() => {
    if (!blog) {
      fetchBlog();
    }else {
      
      navigate('/blog');
    }
  }, [id]);

  if (error) {
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="mt-24 px-20">
      <Breadcrumb />
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-white bg-[#1B7B19] px-4 py-2 rounded hover:bg-green-800 transition-colors"
      >
        ← Back
      </button>

      <div className="w-3/4 mx-auto p-10 pt-0">
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
                <img src={blog.user_profile_picture} alt="profile" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h5 className="font-bold font-serif text-lg">{blog.user_fname} {blog.user_lname || "Unknown Author"}</h5>
                  <h1>{blog.user_has_liked}</h1>
                  <time className="text-sm font-semibold">
                    {blog.date} <br />
                    {new Date(`1970-01-01T${blog.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              src={blog.image || placeholderBlogImg}
              alt="blog"
              className="w-full max-h-[400px] object-cover rounded-md"
            />
          )}
        </div>

        {/* Blog Content */}
        <div className="prose max-w-none text-gray-800 text-lg font-serif text-justify whitespace-pre-wrap leading-relaxed">
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
        <div className="text-base font-normal not-prose">
          {!loading && (
          <LikeCommentComp 
            blog_id={blog.blog_id} 
            cmtCount={blog.comment_id} 
            fetchBlog={fetchBlog} 
            like_count={blog.like_count}
            user_has_liked={blog.user_has_liked}
            />
        )}
        </div>

        {/* <Comments /> */}
        <div className="mt-4">
  <h3 className="text-lg font-semibold mb-2">Comments</h3>
  {!blog || !blog.comments.length === 0 ? (
    <p>No comments yet.</p>
  ) : (
    blog.comments.map((c) => (
      <div key={c.comment_id} className="mb-2 p-2 bg-gray-100 rounded">
        <div className="flex flex-wrap gap-5 items-center">
          <img src={c.author_image} alt={c.author_image} className="rounded-full object-cover w-16 h-16 bg-gray-300"/>
          <div>
            <h4 className="text-md font-bold">{c.author_full_name}</h4>
          <p className="text-lg font-serif">{c.content}</p>
          </div>
        </div>
        
      </div>
    ))
  )}
</div>

      </div>
    </div>
  );
};

export default BlogFullView;
