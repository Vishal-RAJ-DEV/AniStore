import React from 'react';
import { FaPlus, FaTrash, FaSave, FaTags } from 'react-icons/fa';

const CategoryForm = ({ 
  value, 
  setValue, 
  handleSubmit, 
  buttonText = "Submit",
  handleDelete
}) => {
  return (
    <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md border border-[#333]">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
        <FaTags className="mr-2 text-[#ff6b9d]" /> 
        {buttonText === "Update" ? "Update Category" : "Create New Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label 
            htmlFor="category" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Category Name
          </label>
          <div className="relative">
            <FaTags className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              id="category"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter category name"
              className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg
                        border border-[#333] px-10 py-2
                        focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent
                        placeholder:text-[#888] transition duration-200"
              required
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white py-2 px-4 rounded-lg font-medium hover:from-[#ff5c92] hover:to-[#ff7a99] transition duration-200 flex items-center justify-center"
          >
            {buttonText === "Update" ? (
              <>
                <FaSave className="mr-2" />
                {buttonText}
              </>
            ) : (
              <>
                <FaPlus className="mr-2" />
                {buttonText}
              </>
            )}
          </button>

          {handleDelete && (
            <button
              onClick={handleDelete}
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition duration-200 flex items-center justify-center"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;