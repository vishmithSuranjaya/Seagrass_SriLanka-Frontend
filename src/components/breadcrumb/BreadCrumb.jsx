import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean); // e.g. ['blogFullView', '1']

  return (
    <nav aria-label="breadcrumb" className="text-sm text-gray-600 mb-6 pl-6 font-serif">
      <ol className="flex space-x-2 items-center">
        {/* Home */}
        <li>
          <Link to="/" className="hover:underline text-black">Home</Link>
          <span className="mx-1 text-gray-400">›</span>
        </li>

        {/* Dynamic segments */}
        {pathnames.map((segment, index) => {
          const isLast = index === pathnames.length - 1;

          // Handle segment labels and links
          let label = segment;
          let fullPath = '/' + pathnames.slice(0, index + 1).join('/');

          // Override for specific known routes
          if (segment === 'blog') {
            label = 'Blog';
            fullPath = '/blog';
          } else if (segment === 'blogFullView') {
            label = 'Blog';
            fullPath = '/blog'; // Redirect back to the actual blog list
          } else if (!isNaN(segment)) {
            label = `Blog ${segment}`;
            fullPath = `/blogFullView/${segment}`; // Optional: make last breadcrumb linkable
          }

          return (
            <li key={index} className={isLast ? 'font-semibold text-black' : ''}>
              {isLast ? (
                <span>{label}</span>
              ) : (
                <>
                  <Link to={fullPath} className="hover:underline text-black">
                    {label}
                  </Link>
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
