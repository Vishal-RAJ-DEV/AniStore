import React, { useState, useEffect } from 'react'
import AdminMenu from './AdminMenu'
import {
    useUpdateProductDetailsMutation,
    useFetchProductByIdQuery,
    useRemoveProductMutation,
    useUploadProductImageMutation
} from '../../redux/api/productApiSlice.js'
import { useFetchCategoriesQuery } from '../../redux/api/categotyApiSlice'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
    FaUpload, 
    FaImage, 
    FaDollarSign, 
    FaBox, 
    FaTag, 
    FaFileAlt, 
    FaSave, 
    FaTrash, 
    FaArrowLeft,
    FaEdit 
} from 'react-icons/fa'
import Loader from '../../components/Loader'
import Message from '../../components/Message'

const ProductUpdate = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();

    const { data: product, isLoading, isError, error } = useFetchProductByIdQuery(productId);
    const { data: categories = [] } = useFetchCategoriesQuery();
    const [updateProductDetails, { isLoading: isUpdating }] = useUpdateProductDetailsMutation();
    const [removeProduct, { isLoading: isDeleting }] = useRemoveProductMutation();
    const [uploadProductImage, { isLoading: isUploading }] = useUploadProductImageMutation();

    const [name, setname] = useState(product?.name || '');
    const [description, setdescription] = useState(product?.description || '');
    const [price, setprice] = useState(product?.price || 0);
    const [category, setcategory] = useState(product?.category || '');
    const [quantity, setquantity] = useState(product?.quantity || 0);
    const [brand, setbrand] = useState(product?.brand || '');
    const [image, setImage] = useState(product?.image || null);
    const [stock, setStock] = useState(product?.stock || 0);

    useEffect(() => {
        if (product && product._id) {
            setname(product.name);
            setdescription(product.description);
            setprice(product.price);
            setcategory(product.category?._id || '');
            setquantity(product.quantity);
            setbrand(product.brand);
            setImage(product.image);
            setStock(product.countInStock);
        }
    }, [product]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please select an image file");
            return;
        }
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

        try {
            const response = await uploadProductImage(formData).unwrap();
            setImage(response.image);
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload image");
        }
    }

    const handleUpdatedProduct = async (e) => {
        e.preventDefault();

        if (!name || !price || !category || !description || !quantity || !brand || !stock) {
            toast.error("All fields are required");
            return;
        }

        try {
            const updatedData = new FormData();
            updatedData.append("name", name);
            updatedData.append("description", description);
            updatedData.append("price", price);
            updatedData.append("category", category);
            updatedData.append("quantity", quantity);
            updatedData.append("brand", brand);
            updatedData.append("countInStock", stock);
            if (image) {
                updatedData.append("image", image);
            }

            const result = await updateProductDetails({ productId, updatedData }).unwrap();

            if (result?.error) { //if result is there and has error property then show error
                toast.error(result.error);
            } else {
                toast.success("Product updated successfully");
                navigate('/admin/allproductslist');
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to update product");
            console.error("Update product error:", error);
        }
    }

    const handleDeleteProduct = async () => {
        try {
            let confirmDelete = window.confirm("Are you sure you want to delete this product? This action cannot be undone.");
            if (!confirmDelete) return;

            const { data } = await removeProduct(productId);
            
            if (data?.error) {
                toast.error("errro in deleting product", data.error);
            } else {
                toast.success("Product deleted successfully");
                navigate('/admin/allproductslist');
            }
        } catch (error) {
            toast.error(error?.data?.message || "Failed to delete product");
            console.error("Delete product error:", error);
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <AdminMenu />
                <Loader />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-4">
                <AdminMenu />
                <Message variant="error">
                    {error?.data?.message || error.error || "Error loading product"}
                </Message>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 pb-20">
            <AdminMenu />

            {/* Header with Back Button */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/admin/allproductslist')}
                        className="p-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-lg transition-colors"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center">
                            <FaEdit className="mr-3 text-[#ff6b9d]" />
                            Update Product
                        </h1>
                        <p className="text-gray-400 mt-1">Edit product details and information</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Image Section */}
                <div className="lg:col-span-1">
                    <div className="bg-[#1e1e1e] p-6 rounded-lg shadow-md border border-[#333] sticky top-4">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <FaImage className="mr-2 text-[#ff6b9d]" />
                            Product Image
                        </h2>

                        {/* Current Image Display */}
                        <div className="mb-4">
                            {image ? (
                                <div className="relative group">
                                    <img
                                        src={image}
                                        alt={name}
                                        className="w-full h-64 object-cover rounded-lg border border-[#333]"
                                    />
                                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                                        <label className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                            <div className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white px-4 py-2 rounded-lg flex items-center">
                                                <FaUpload className="mr-2" />
                                                Change Image
                                            </div>
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

                        {/* Product Stats */}
                        <div className="space-y-3 mt-6 pt-6 border-t border-[#333]">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Product ID:</span>
                                <span className="text-gray-300 text-sm font-mono">{productId?.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Status:</span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                    {stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Form Section */}
                <div className="lg:col-span-2">
                    <div className="bg-[#1e1e1e] p-8 rounded-lg shadow-md border border-[#333]">
                        <form onSubmit={handleUpdatedProduct} className="space-y-6">
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

                            {/* Price and Quantity Row */}
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
                                        onChange={(e) => setStock(parseInt(e.target.value))}
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

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white py-3 rounded-lg font-medium hover:from-[#ff5c92] hover:to-[#ff7a99] transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isUpdating || isUploading}
                                >
                                    {isUpdating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="mr-2" />
                                            Update Product
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDeleteProduct}
                                    className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <FaTrash className="mr-2" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate