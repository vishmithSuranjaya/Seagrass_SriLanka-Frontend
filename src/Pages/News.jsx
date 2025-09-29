import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate, Link } from 'react-router-dom';
import Breadcrumb from "../components/breadcrumb/BreadCrumb";
import Pagination from '../components/pagination/Pagination';

const News = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 4;

  const navigate = useNavigate();
  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const calendarBtnRef = useRef(null);

  const years = Array.from({ length: 10 }, (_, i) => 2020 + i);
  const months = [
    { name: 'January', number: 1 },
    { name: 'February', number: 2 },
    { name: 'March', number: 3 },
    { name: 'April', number: 4 },
    { name: 'May', number: 5 },
    { name: 'June', number: 6 },
    { name: 'July', number: 7 },
    { name: 'August', number: 8 },
    { name: 'September', number: 9 },
    { name: 'October', number: 10 },
    { name: 'November', number: 11 },
    { name: 'December', number: 12 },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        yearRef.current && !yearRef.current.contains(e.target) &&
        monthRef.current && !monthRef.current.contains(e.target) &&
        calendarBtnRef.current && !calendarBtnRef.current.contains(e.target)
      ) {
        setShowYearDropdown(false);
        setShowMonthDropdown(false);
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8000/api/news/')
      .then(res => res.json())
      .then(response => {
        const publishedNews = response.data || [];
        setAllNews(publishedNews);
        setFilteredNews(publishedNews);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredNews]);

  const handleImageError = (newsIndex) => {
    setImageErrors(prev => ({
      ...prev,
      [newsIndex]: true
    }));
  };

  const getImageUrl = (news, index) => {
    if (imageErrors[index]) {
      return 'https://via.placeholder.com/400x200?text=Image+Not+Available';
    }
    if (news.image?.startsWith('http')) {
      return news.image;
    }
    if (news.image?.startsWith('/')) {
      return `http://localhost:8000${news.image}`;
    }
    if (news.image) {
      return `http://localhost:8000/media/${news.image}`;
    }
    return 'https://via.placeholder.com/400x200?text=No+Image';
  };

  const handleSearch = () => {
    let results = allNews;
    if (year) {
      results = results.filter(item =>
        new Date(item.updated_at).getFullYear() === parseInt(year)
      );
    }
    if (month) {
      results = results.filter(item =>
        new Date(item.updated_at).getMonth() + 1 === parseInt(month)
      );
    }
    setFilteredNews(results);
  };

  const handleReset = () => {
    setYear('');
    setMonth('');
    setFilteredNews(allNews);
    setImageErrors({});
  };

  // Pagination logic
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

  return (
    <div className="mt-24 px-6 md:px-20 mb-10 relative">
      <Breadcrumb />
      <div ref={calendarBtnRef} className="absolute left-0 m-2 ml-20">
       
        <Link
          to={'/calender'}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B7B19] text-gray-100 rounded-md hover:bg-green-800 transition-colors"
        >
          <Calendar size={20} />
          Calendar
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-center text-green-700 pt-15 mb-12">
        News And Updates
      </h1>

      {/* Filter dropdowns */}
      <div className="flex justify-center items-center mb-16">
        <div className="flex flex-wrap gap-6 items-end">
          <div className="flex flex-col" ref={yearRef}>
            <label className="mb-1 font-medium text-gray-800">Year</label>
            <div className="relative w-44">
              <input
                type="text"
                value={year}
                readOnly
                className="bg-gray-300  px-4 py-3 rounded-l-md w-full text-lg cursor-pointer"
                placeholder="YYYY"
              />
              <button
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
                className="absolute right-0 top-0 h-full px-3 bg-[#1B7B19] text-white rounded-r-md hover:bg-green-800"
              >
                <ChevronDown size={20} />
              </button>
              {showYearDropdown && (
                <ul className="absolute z-10 mt-1 bg-white border rounded-md shadow-md w-full max-h-40 overflow-y-auto">
                  {years.map((y) => (
                    <li
                      key={y}
                      onClick={() => {
                        setYear(y);
                        setShowYearDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    >
                      {y}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col" ref={monthRef}>
            <label className="mb-1 font-medium text-gray-800">Month</label>
            <div className="relative w-44">
              <input
                type="text"
                value={months.find(m => m.number === parseInt(month))?.name || ''}
                readOnly
                className="bg-gray-300  px-4 py-3 rounded-l-md w-full text-lg cursor-pointer"
                placeholder="MM"
              />
              <button
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
                className="absolute right-0 top-0 h-full px-3 bg-[#1B7B19] text-white rounded-r-md hover:bg-green-800"
              >
                <ChevronDown size={20} />
              </button>
              {showMonthDropdown && (
                <ul className="absolute z-10 mt-1 bg-white border rounded-md shadow-md w-full max-h-40 overflow-y-auto">
                  {months.map((m) => (
                    <li
                      key={m.number}
                      onClick={() => {
                        setMonth(m.number);
                        setShowMonthDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                    >
                      {m.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="opacity-0 mb-1">Search</label>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="bg-[#1B7B19] hover:bg-green-800 text-white px-6 py-3 text-lg rounded-md"
              >
                Search
              </button>
              {(year || month) && (
                <button
                  onClick={handleReset}
                  className="bg-gray-400 hover:bg-gray-600 text-white px-6 py-3 text-lg rounded-md"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* News Content */}
      {loading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton height={200} key={idx} />
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No news found for selected criteria.</p>
      ) : (
        <>
          {currentNews
            .map((news, index) => (
            <div
              key={news.id || index}
              className="border rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6 items-start mb-12 hover:shadow-lg transition-shadow"
            >
              <div className="w-full md:w-96 flex-shrink-0">
                <img
                  src={getImageUrl(news, index)}
                  alt={news.title || "News Image"}
                  className="w-full h-48 md:h-64 object-cover rounded-lg"
                  onError={() => handleImageError(index)}
                  loading="lazy"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-green-700 font-semibold mb-2 text-xl">{news.title}</h2>
                  <p className="mb-3 font-medium text-gray-500">
                    {new Date(news.updated_at || news.created_at).toDateString()}
                  </p>
                  <div className="mb-3 leading-relaxed line-clamp-4">
                    {news.content}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => navigate('/viewFullNews', { state: { news } })}
                    className="bg-[#1B7B19] hover:bg-green-800 text-white px-5 mt-4 py-2 rounded-md"
                  >
                    See more
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/*  Pagination rendered here */}
          {filteredNews.length > newsPerPage && (
            <Pagination
              totalBlogs={filteredNews.length}
              blogsPerPage={newsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default News;
