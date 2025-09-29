import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const Breadcrumb = () => {
  const location = useLocation();
  const { id, news_id } = useParams(); // destructure both blog id and news id if needed
  const pathnames = location.pathname.split('/').filter(Boolean);
  const [blogTitle, setBlogTitle] = useState('');
  const [newsTitle, setNewsTitle] = useState('');

  // Fetch titles if needed
  useEffect(() => {
    const fetchTitle = async () => {
      if (location.pathname.includes('blogFullView') && id) {
        try {
          const res = await axios.get(`http://localhost:8000/api/blogs/${id}/`);
          setBlogTitle(res.data.title);
        } catch (error) {
          console.error('Failed to fetch blog title:', error);
        }
      } else if (location.pathname.includes('newsdetails') && id) {
        try {
          const res = await axios.get(`http://localhost:8000/api/news/${id}/`);
          setNewsTitle(res.data.title);
        } catch (error) {
          console.error('Failed to fetch news title:', error);
        }
      }
    };
    fetchTitle();
  }, [id, location.pathname]);

  // Custom route mapping
  const routeMap = {
    blogFullView: { label: 'Blog', to: '/blog' },
    newsdetails: { label: 'Calendar', to: '/calender' }, 
    productfulldetails: { label: 'Products', to: '/product'},
  };

  return (
    <nav aria-label="breadcrumb" className="text-sm text-600 mb-6 pl-6 font-serif">
      <ol className="flex space-x-2 items-center">
        <li>
          <Link to="/" className="hover:underline text">Home</Link>
          <span className="mx-1 text-400">›</span>
        </li>

        {pathnames.map((segment, index) => {
  const isLast = index === pathnames.length - 1;
  let label = segment;
  let to = '/' + pathnames.slice(0, index + 1).join('/');

  // Route mappings
  if (routeMap[segment]) {
    label = routeMap[segment].label;
    to = routeMap[segment].to;

  // Blog ID case
  } else if (pathnames[index - 1] === "blogFullView") {
    label = blogTitle || "Blog Details";

  // News ID case
  } else if (pathnames[index - 1] === "newsdetails") {
    label = newsTitle || "News Details";

  // Product ID case
  } else if (pathnames[index - 1] === "productfulldetails") {
    label = "Product Details"; // 👉 can fetch actual product name if needed

  // Default: prettify text
  } else {
    label = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <li key={index} className={isLast ? "font-semibold text-900" : ""}>
      {isLast ? (
        <span>{label}</span>
      ) : (
        <>
          <Link to={to} className="hover:underline text-900">{label}</Link>
          <span className="mx-1 text-400">›</span>
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
