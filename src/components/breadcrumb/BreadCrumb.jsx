import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  // Custom route mapping
  const routeMap = {
    blogFullView: {
      label: 'Blog',
      to: '/blog', // where to actually go
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

          // Apply custom route label and redirect if in routeMap
          if (routeMap[segment]) {
            label = routeMap[segment].label;
            to = routeMap[segment].to;
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
