import React from "react";

const Pagination = ({ totalBlogs, blogsPerPage, currentPage, setCurrentPage }) => {
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // optional: scroll to top on page change
  };

  return (
    <div className="flex justify-center mt-6 mb-6">
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <button
          key={number}
          onClick={() => handleClick(number)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === number ? "bg-[#1B7B19] text-white" : "bg-gray-200"
          } hover:bg-[#1B7B19] hover:text-white transition`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
