import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean); // ['blogFullView', '1']

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
          const fullPath = '/' + pathnames.slice(0, index + 1).join('/');

          // Map or format readable labels
          let label = segment;

          if (segment === 'blog') label = 'blog';
          else if (segment === 'blogFullView') label = 'Blog';
          else if (!isNaN(segment)) label = `blog ${segment}`;

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
