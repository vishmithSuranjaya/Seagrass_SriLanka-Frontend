import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Calendar } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const News = () => {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const yearRef = useRef(null);
  const monthRef = useRef(null);
  const calendarBtnRef = useRef(null);

  const navigate = useNavigate();

  const years = Array.from({ length: 91 }, (_, i) => 2000 + i);
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
      .catch(err => {
        console.error('Error fetching news:', err);
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    let results = allNews;

    if (year) {
      results = results.filter(item =>
        new Date(item.created_at).getFullYear() === parseInt(year)
      );
    }

    if (month) {
      results = results.filter(item =>
        new Date(item.created_at).getMonth() + 1 === parseInt(month)
      );
    }

    setFilteredNews(results);
  };

  const handleReset = () => {
    setYear('');
    setMonth('');
    setFilteredNews(allNews);
    setSelectedDate(null);
  };

  const handleCalendarSelect = (date) => {
    setSelectedDate(date);
    setYear(date?.getFullYear() || '');
    setMonth(date ? date.getMonth() + 1 : '');

    const filtered = allNews.filter(item =>
      new Date(item.created_at).toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );

    setFilteredNews(filtered);
    setShowCalendar(false);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto relative">
      {/* Calendar Button */}
      <div ref={calendarBtnRef} className="absolute left-0 mt-20 ml-4">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1B7B19] text-gray-100 rounded-md"
        >
          <Calendar size={20} />
          Filter by Calendar
        </button>
        {showCalendar && (
          <div className="absolute z-10 mt-2 p-4 bg-gray-100 shadow-md rounded-md">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => handleCalendarSelect(date)}
              dateFormat="yyyy-MM-dd"
              inline
            />
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-green-700 pt-32 mb-12">
        News And Updates
      </h1>

      {/* Filters */}
      <div className="flex justify-center items-center mb-16">
        <div className="flex flex-wrap gap-6 items-end">
          {/* Year Filter */}
          <div className="flex flex-col" ref={yearRef}>
            <label className="mb-1 font-medium text-gray-800">Year</label>
            <div className="relative w-44">
              <input
                type="text"
                value={year}
                readOnly
                className="bg-gray-300 text-black px-4 py-3 rounded-l-md w-full text-lg"
                placeholder="YYYY"
              />
              <button
                onClick={() => {
                  setShowYearDropdown(!showYearDropdown);
                  setShowMonthDropdown(false);
                }}
                className="absolute right-0 top-0 h-full px-3 bg-[#1B7B19] text-white rounded-r-md"
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

          {/* Month Filter */}
          <div className="flex flex-col" ref={monthRef}>
            <label className="mb-1 font-medium text-gray-800">Month</label>
            <div className="relative w-44">
              <input
                type="text"
                value={months.find(m => m.number === parseInt(month))?.name || ''}
                readOnly
                className="bg-gray-300 text-black px-4 py-3 rounded-l-md w-full text-lg"
                placeholder="MM"
              />
              <button
                onClick={() => {
                  setShowMonthDropdown(!showMonthDropdown);
                  setShowYearDropdown(false);
                }}
                className="absolute right-0 top-0 h-full px-3 bg-[#1B7B19] text-white rounded-r-md"
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

          {/* Search / Reset Buttons */}
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

      {/* News Cards */}
      {loading ? (
        <div className="flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton height={200} key={idx} />
          ))}
        </div>
      ) : (
        <>
          {filteredNews.length === 0 ? (
            <p className="text-center text-gray-500">No news found for selected criteria.</p>
          ) : (
            filteredNews.map((news, index) => (
              <div
                key={index}
                className="border rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6 items-start mb-12"
              >
                <img
                  src={`http://localhost:8000/media/${news.image}`}
                  alt="News Poster"
                  className="w-full md:w-96 rounded-lg"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-green-700 font-semibold mb-2 text-lg">{news.title}</p>
                    <p className="mb-3 font-medium">{new Date(news.created_at).toDateString()}</p>
                    <div className="text-sm mb-3 leading-relaxed">{news.content}</div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate('/viewFullNews', { state: { news } })}
                      className="bg-[#1B7B19] hover:bg-green-800 text-white px-5 mt-10 py-2 rounded-md"
                    >
                      See more
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default News;
