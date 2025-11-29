import { useState } from 'react'
import { useAddProductMutation, useUploadProductImageMutation } from '../../redux/api/productApiSlice.js'
import { useFetchCategoriesQuery } from '../../redux/api/categotyApiSlice.js'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router'
import { FaUpload, FaImage, FaDollarSign, FaBox, FaTag, FaFileAlt, FaCheck, FaTimes } from 'react-icons/fa'
import Loader from '../../components/Loader'
import AdminMenu from './AdminMenu'

const ProductList = () => {
  const [name, setname] = useState("");
  const [price, setprice] = useState(0);
  const [category, setcategory] = useState("");
  const [description, setdescription] = useState("");
  const [quantity, setquantity] = useState(0);
  const [brand, setbrand] = useState("");
  const [image, setimage] = useState(null);
  const [stock, setstock] = useState(0);
  const [imageurl, setimageurl] = useState("");

  const navigate = useNavigate();

  const { data: categories } = useFetchCategoriesQuery();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    // console.log(formData)
    // console.log("thso so " , formData.get("image"));
    // console.log("FormData entries:", [...formData.entries()]);



    try {
      const res = await uploadProductImage(formData).unwrap();
      setimageurl(res.image);
      setimage(res.image);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error || "Error uploading image");
    }
  }

  // Handle product submission
  async function handelProductdetailSubmit(e) {
    e.preventDefault()

    if (!name || !price || !category || !description || !quantity || !brand || !imageurl || !stock) {
      toast.error("All fields are required")
      return
    }

    if (price <= 0) {
      toast.error("Price must be greater than 0")
      return
    }

    if (quantity < 0 || stock < 0) {
      toast.error("Quantity and stock cannot be negative")
      return
    }

    try {
      const ProductData = new FormData()
      ProductData.append("image", image)
      ProductData.append("name", name)
      ProductData.append("price", price)
      ProductData.append("category", category)
      ProductData.append("description", description)
      ProductData.append("quantity", quantity)
      ProductData.append("brand", brand)
      // ProductData.append("image", imageurl)
      ProductData.append("countInStock", stock)

      // console.log("Submitting product data:",  [...ProductData.entries()]);

      const { data } = await addProduct(ProductData)
      // console.log("Added product data:", data)

      if (data.error) {
        toast.error("Error in product details submission")
      } else {
        toast.success(`${data.name} added successfully`)
        // // Reset form
        // setname("");
        // setprice(0);
        // setcategory("");
        // setdescription("");
        // setquantity(0);
        // setbrand("");
        // setimage(null);
        // setstock(0);
        // setimageurl("");
        navigate('/')

      }

    } catch (error) {
      console.log(error)
      toast.error(error?.data?.message || error.error || "Error in adding product")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <AdminMenu />
      <h1 className="text-3xl font-bold text-white mb-8">Create New Product</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md border border-[#333] sticky top-4">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaImage className="mr-2 text-[#ff6b9d]" />
              Product Image
            </h2>

            {imageurl ? (
              <div className="relative">
                <img
                  src={imageurl}
                  alt="Product"
                  className="w-full h-64 object-cover rounded-lg mb-4 border border-[#333]"
                />
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">
                    <FaCheck className="inline mr-2 text-green-500" />
                    {image}
                  </p>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <span className="cursor-pointer text-[#ff6b9d] hover:underline text-sm">
                      Change Image
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="border-2 border-dashed border-[#333] rounded-lg p-8 text-center cursor-pointer hover:border-[#ff6b9d] transition-colors">
                  {isUploading ? (
                    <Loader />
                  ) : (
                    <>
                      <FaUpload className="mx-auto text-3xl text-[#ff6b9d] mb-2" />
                      <p className="text-gray-300 font-medium">Click to upload image</p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Product Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-md border border-[#333]">
            <form onSubmit={handelProductdetailSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name
                </label>
                <div className="relative">
                  <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    placeholder="Enter product name"
                    className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg border border-[#333] px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent placeholder:text-[#888] transition duration-200"
                    required
                  />
                </div>
              </div>

              {/* Brand */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-2">
                  Brand
                </label>
                <div className="relative">
                  <FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    id="brand"
                    value={brand}
                    onChange={(e) => setbrand(e.target.value)}
                    placeholder="Enter brand name"
                    className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg border border-[#333] px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent placeholder:text-[#888] transition duration-200"
                    required
                  />
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                    Price
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setprice(parseFloat(e.target.value))}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg border border-[#333] px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent placeholder:text-[#888] transition duration-200"
                      required
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="relative">
                    <FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setquantity(parseInt(e.target.value))}
                      placeholder="0"
                      min="0"
                      className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg border border-[#333] px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent placeholder:text-[#888] transition duration-200"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">
                  Count in Stock
                </label>
                <div className="relative">
                  <FaBox className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="number"
                    id="stock"
                    value={stock}
                    onChange={(e) => setstock(parseInt(e.target.value))}
                    placeholder="0"
                    min="0"
                    className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg border border-[#333] px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent placeholder:text-[#888] transition duration-200"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setcategory(e.target.value)}
                  className="w-full h-[48px] bg-[#1e1e1e] text-white rounded-lg border border-[#333] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent transition duration-200"
                  required
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <div className="relative">
                  <FaFileAlt className="absolute left-3 top-3 text-gray-500" />
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                    placeholder="Enter product description"
                    rows="4"
                    className="w-full bg-[#1e1e1e] text-white rounded-lg border border-[#333] px-10 py-2 focus:outline-none focus:ring-2 focus:ring-[#ff6b9d] focus:border-transparent placeholder:text-[#888] transition duration-200"
                    required
                  ></textarea>
                </div>
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white py-3 rounded-lg font-medium hover:from-[#ff5c92] hover:to-[#ff7a99] transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAdding || isUploading}
                >
                  {isAdding ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Create Product
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/productlist')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition duration-200 flex items-center justify-center"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductList