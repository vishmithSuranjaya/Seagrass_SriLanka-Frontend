import React, { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";

// Skeleton loading component
const SkeletonReport = () => (
  <div className="bg-green-100 p-5 rounded-md shadow-md animate-pulse space-y-4">
    <div className="h-6 bg-green-300 rounded w-3/4"></div>
    <div className="h-4 bg-green-300 rounded w-full"></div>
    <div className="h-4 bg-green-300 rounded w-full"></div>
    <div className="h-4 bg-green-300 rounded w-5/6"></div>
  </div>
);

// Pagination component
const Pagination = ({ totalItems, itemsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center mt-10 space-x-2">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Prev
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`px-4 py-2 rounded ${
            currentPage === page
              ? "bg-green-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 4;

  // Fetch from backend
  const performSearch = async (query = "") => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await axios.get(
        `http://localhost:8000/api/research/search/?q=${query}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setResults([]);
    }

    setIsLoading(false);
  };

  // Fetch all articles on first load
  useEffect(() => {
    performSearch(""); // Load everything by default
  }, []);

  // Reset page when new results come in
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  // Trigger search on button click
  const handleSearch = () => {
    performSearch(searchQuery);
  };

  // Pagination calculations
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = results.slice(indexOfFirstReport, indexOfLastReport);

  return (
    <div className="mt-24 px-6 md:px-20 mb-10 min-h-screen">
      <Breadcrumb />

      <h1 className="text-4xl font-bold text-center text-green-700 mb-12">
        Research Papers
      </h1>

      {/* Search bar */}
      <div className="flex justify-center mb-8">
        <div className="flex w-full max-w-lg h-12">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none"
          />
          <button
            className="h-full px-6 bg-green-600 text-white rounded-r-md hover:bg-green-700 transition-colors duration-200"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Search"}
          </button>
          <button
            className="h-full px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 ml-2"
            onClick={() => {
              setSearchQuery("");
              performSearch("");
            }}
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-6">
          {isLoading ? (
            <>
              <SkeletonReport />
              <SkeletonReport />
              <SkeletonReport />
            </>
          ) : currentReports.length > 0 ? (
            <>
              {currentReports.map((report) => (
                <div
                  key={report.research_id}
                  className="bg-green-100 p-5 rounded-md shadow-md"
                >
                  <h2 className="text-xl font-bold text-green-800 underline mb-2">
                    {report.title}
                  </h2>

                  <p className="text-gray-700 mb-3">
                    {report.description.length > 250
                      ? `${report.description.slice(0, 250)}...`
                      : report.description}
                  </p>

                  <a
                    href={report.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    View Article
                  </a>
                </div>
              ))}

              {/* Pagination */}
              {results.length > reportsPerPage && (
                <Pagination
                  totalItems={results.length}
                  itemsPerPage={reportsPerPage}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              )}
            </>
          ) : (
            <p className="text-center text-gray-500">
              No matching reports found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Reports;
