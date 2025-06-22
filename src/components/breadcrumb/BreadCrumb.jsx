import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const Breadcrumb = () => {
  const location = useLocation();
  const { id } = useParams(); // For blogFullView/:id
  const pathnames = location.pathname.split('/').filter(Boolean);
  const [blogTitle, setBlogTitle] = useState('');

  // Fetch blog title using blog ID
  useEffect(() => {
    const fetchTitle = async () => {
      if (location.pathname.includes('blogFullView') && id) {
        try {
          const res = await axios.get(`http://localhost:8000/api/blogs/${id}/`);
          setBlogTitle(res.data.title);
        } catch (error) {
          console.error('Failed to fetch blog title:', error);
        }
      }
    };
    fetchTitle();
  }, [id, location.pathname]);

  // Custom route mapping
  const routeMap = {
    blogFullView: {
      label: 'Blog',
      to: '/blog',
    },
  };

  return (
    <nav aria-label="breadcrumb" className="text-sm text-gray-600 mb-6 pl-6 font-serif">
      <ol className="flex space-x-2 items-center">
        {/* Home */}
        <li>
          <Link to="/" className="hover:underline text-black">Home</Link>
          <span className="mx-1 text-gray-400">›</span>
        </li>

        {pathnames.map((segment, index) => {
          const isLast = index === pathnames.length - 1;
          let label = segment;
          let to = '/' + pathnames.slice(0, index + 1).join('/');

          if (routeMap[segment]) {
            label = routeMap[segment].label;
            to = routeMap[segment].to;
          } else if (segment === id && blogTitle) {
            label = blogTitle; // show blog title instead of ID
          } else {
            label = decodeURIComponent(segment)
              .replace(/-/g, ' ')
              .replace(/\b\w/g, (char) => char.toUpperCase());
          }

          return (
            <li key={index} className={isLast ? 'font-semibold text-black' : ''}>
              {isLast ? (
                <span>{label}</span>
              ) : (
                <>
                  <Link to={to} className="hover:underline text-black">{label}</Link>
                  <span className="mx-1 text-gray-400">›</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
