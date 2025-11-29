import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    const showPages = 5 // Show 5 page numbers at a time
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    let endPage = Math.min(totalPages, startPage + showPages - 1)
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors ${
          currentPage === 1
            ? 'bg-[#1e1e1e] text-gray-600 cursor-not-allowed border border-[#333]'
            : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] border border-[#333] hover:border-[#ff6b9d]'
        }`}
      >
        <FaChevronLeft size={14} />
      </button>

      {/* First Page */}
      {getPageNumbers()[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-10 h-10 rounded-lg font-medium transition-colors bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] border border-[#333] hover:border-[#ff6b9d]"
          >
            1
          </button>
          {getPageNumbers()[0] > 2 && (
            <span className="text-gray-600">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
            currentPage === pageNum
              ? 'bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white'
              : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] border border-[#333] hover:border-[#ff6b9d]'
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Last Page */}
      {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
        <>
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
            <span className="text-gray-600">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-10 h-10 rounded-lg font-medium transition-colors bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] border border-[#333] hover:border-[#ff6b9d]"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors ${
          currentPage === totalPages
            ? 'bg-[#1e1e1e] text-gray-600 cursor-not-allowed border border-[#333]'
            : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] border border-[#333] hover:border-[#ff6b9d]'
        }`}
      >
        <FaChevronRight size={14} />
      </button>
    </div>
  )
}

export default Pagination