import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogFullView = () => {
  const { id } = useParams();

  return (
    <div className="px-6 py-30">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-600 mb-6 font-serif">
        <ul className="flex space-x-2">
          <li>
            <Link to="/" className="text-black hover:underline">
              Home
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li>
            <Link to="/blog" className="text-black hover:underline">
              Blogs
            </Link>
            <span className="mx-1">/</span>
          </li>
          <li className="text-black">{id}</li>
        </ul>
      </nav>

     
    </div>
  );
};

export default BlogFullView;
