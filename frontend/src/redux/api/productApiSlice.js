import { apiSlice } from "./apiSlice";
import { PRODUCT_URL , UPLOAD_URL} from "../constant";

const productApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) =>({
        addProduct : builder.mutation({
            query : (newProduct) => ({
                url : `${PRODUCT_URL}`,
                method : "POST",
                body : newProduct,
            }),
            invalidatesTags : ['Products']
        }),
        fetchProducts : builder.query({
            query : ({page = 1 , keyword = ""} = {}) => ({
                url : `${PRODUCT_URL}`,
                params : { page, keyword }
            }),
            keepUnusedDataFor : 5, //keeping the data in cache for 5 seconds after component unmount
            providesTags : ['Products'] //providing tag to invalidate cache when a new product is added
        }),
        fetchProductById : builder.query({
            query : (productId) =>({
                url : `${PRODUCT_URL}/${productId}`,
            }),
            providesTags : (result, error, productId) => [{ type: 'Product', id: productId }]
        }),
        removeProduct : builder.mutation({
            query : (productId) => ({
                url : `${PRODUCT_URL}/${productId}`,
                method : "DELETE",
            }),
            invalidatesTags : (result, error, productId) => [{ type: 'Product', id: productId }]
        }),
        updateProductDetails : builder.mutation({
            query : (productId, formUpdateData) => ({
                url : `${PRODUCT_URL}/${productId}`,
                method : "PUT",
            }),
            invalidatesTags : (result, error, productId) => [{ type: 'Product', id: productId }]
        }),
        fetchAllProducts : builder.query({
            query : () => ({
                url : `${PRODUCT_URL}/allproducts`,
            })
        }),
        createProductReview : builder.mutation({
            query : ({ productId, reviewData }) => ({
                url : `${PRODUCT_URL}/${productId}/review`,
                method : "POST",
                body : reviewData,
            }),
            invalidatesTags : (result, error, { productId }) => [{ type: 'Product', id: productId }]
        }),
        fetchTopProducts : builder.query({
            query : () =>({
                url : `${PRODUCT_URL}/top-products`,
            }),
            providesTags : ['TopProducts']
        }),
        fetchNewProducts : builder.query({
            query : () =>({
                url : `${PRODUCT_URL}/new-products`,
            }),
            providesTags : ['NewProducts']
        }),
        filterProducts : builder.mutation({
            query : ({checked , radio }) =>({
                url : `${PRODUCT_URL}/filter-products`,
                method : "POST",
                body : { checked, radio }
            })
        }),
        uploadProductImage : builder.mutation({
            query : (data) =>({
                url : UPLOAD_URL,
                method : "POST",
                body : data,
            })
        })
        

        
    })
})

export const {
    useAddProductMutation,
    useFetchProductsQuery,
    useFetchProductByIdQuery,
    useRemoveProductMutation,
    useUpdateProductDetailsMutation,
    useFetchAllProductsQuery,
    useCreateProductReviewMutation,
    useFetchTopProductsQuery,
    useFetchNewProductsQuery,
    useFilterProductsMutation,
    useUploadProductImageMutation
} = productApiSlice