import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/breadcrumb/BreadCrumb";

// Dummy data
const dummyReports = [
  {
    id: 1,
    title:
      "For other uses, see Research (disambiguation). “Researched” redirects here...",
    description:
      "Research is creative and systematic work undertaken to increase the stock of knowledge...",
  },
  {
    id: 2,
    title:
      "This is a different research topic about technology and education...",
    description:
      "This study explores the integration of technology in education systems...",
  },
  {
    id: 3,
    title:
      "Another perspective on scientific methodology and progress...",
    description:
      "This article discusses how scientific progress is driven by both creativity and empirical testing...",
  },
];

// Skeleton component
const SkeletonReport = () => (
  <div className="bg-green-100 p-5 rounded-md shadow-md animate-pulse space-y-4">
    <div className="h-6 bg-green-300 rounded w-3/4"></div>
    <div className="h-4 bg-green-300 rounded w-full"></div>
    <div className="h-4 bg-green-300 rounded w-full"></div>
    <div className="h-4 bg-green-300 rounded w-5/6"></div>
  </div>
);

const Reports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading = true

  // This handles the filtering (simulated API)
  const performSearch = (query = "") => {
    setIsLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      const filtered = dummyReports.filter(
        (report) =>
          report.title.toLowerCase().includes(query.toLowerCase()) ||
          report.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 1500);
  };

  // Run search when page loads
  useEffect(() => {
    performSearch(); // Default search with empty query
  }, []);

  // Triggered when user clicks search button
  const handleSearch = () => {
    performSearch(searchQuery);
  };

  return (
    <div className="mt-24 px-6 md:px-20">
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
        </div>
      </div>

      {/* Results or Skeleton */}
      {hasSearched && (
        <div className="space-y-6">
          {isLoading ? (
            <>
              <SkeletonReport />
              <SkeletonReport />
              <SkeletonReport />
            </>
          ) : results.length > 0 ? (
            results.map((report) => (
              <div
                key={report.id}
                className="bg-green-100 p-5 rounded-md shadow-md"
              >
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold">{report.title}</span>{" "}
                  <a
                    href="#"
                    className="text-green-800 underline hover:text-green-600"
                  >
                    (disambiguation)
                  </a>
                </p>
                <p className="text-gray-800 leading-relaxed">
                  {report.description}
                </p>
              </div>
            ))
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
