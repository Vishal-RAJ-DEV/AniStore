import { Link } from 'react-router-dom'
import { useFetchAllProductsQuery } from '../../redux/api/productApiSlice'
import moment from 'moment'
import AdminMenu from './AdminMenu'
import Loader from '../../components/Loader'
import Message from '../../components/Message'
import { FaEdit, FaDollarSign, FaBox, FaCalendar, FaTag } from 'react-icons/fa'

const AllProducts = () => {
  const { data: products, isLoading, isError, error } = useFetchAllProductsQuery();

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
          {error?.data?.message || error.error || "Error loading products"}
        </Message>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      <AdminMenu />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">All Products</h1>
        <p className="text-gray-400">Manage and update your product inventory</p>
      </div>

      {/* Products Grid */}
      {products?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No products found</p>
          <Link
            to="/admin/productlist"
            className="inline-block mt-4 bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white py-2 px-6 rounded-lg hover:from-[#ff5c92] hover:to-[#ff7a99] transition duration-200"
          >
            Create Your First Product
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.map((product) => (
            <Link
              key={product._id}
              to={`/admin/product/update/${product._id}`}
              className="group bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#333] hover:border-[#ff6b9d] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-[#2a2a2a] overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaBox className="text-gray-600 text-5xl" />
                  </div>
                )}
                
                {/* Edit Overlay */}
                <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <FaEdit />
                      <span className="font-medium">Edit Product</span>
                    </div>
                  </div>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.countInStock > 0
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                {/* Product Name */}
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[#ff6b9d] transition-colors">
                  {product.name}
                </h3>

                {/* Brand */}
                <div className="flex items-center text-gray-400 text-sm mb-3">
                  <FaTag className="mr-2 text-[#ff6b9d]" size={12} />
                  <span>{product.brand}</span>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>

                {/* Price and Stock */}
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#333]">
                  <div className="flex items-center">
                    <FaDollarSign className="text-[#ff6b9d] mr-1" size={16} />
                    <span className="text-white font-bold text-xl">
                      {product.price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <FaBox className="mr-1" size={12} />
                    <span>{product.countInStock} units</span>
                  </div>
                </div>

                {/* Category and Date */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Category:</span>
                    <span className="text-gray-400">{product.category?.name || 'Uncategorized'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <FaCalendar className="mr-1" size={10} />
                    <span className="text-gray-400">
                      {moment(product.createdAt).format('MMM DD, YYYY')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default AllProducts