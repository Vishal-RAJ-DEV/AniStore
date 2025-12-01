import React from 'react'
import { useParams , Link , useNavigate } from 'react-router-dom'
import { useSelector , useDispatch } from 'react-redux'
import { useFetchProductByIdQuery } from '../../redux/api/productApiSlice'
import { useCreateProductReviewMutation } from '../../redux/api/productApiSlice'

const ProductDetails = () => {
    const { id : productId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userInfo = useSelector((state) => state.auth)
    const { data: ProductDetails , isLoading , isError , error } = useFetchProductByIdQuery(productId)
    const [ createProductReview , { isLoading : loadingCreateReview } ] = useCreateProductReviewMutation()
    
  return (
    <div>ProductDetails</div>
  )
}

export default ProductDetails