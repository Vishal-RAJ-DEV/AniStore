import React from 'react'
import { useFilterProductsMutation } from '../../redux/api/productApiSlice'
import { setCategories , setChecked , setProducts } from '../../redux/features/shop/shopSlice'
import { useDispatch , useSelector } from 'react-redux'
import { useFetchCategoriesQuery } from '../../redux/api/categotyApiSlice'
import Loader from '../../components/Loader'
import SmallProducts from '../Products/SmallProducts'
const Shop = () => {

    const dispatch = useDispatch();
    const { data : categoriesQuery , categoryLoading ,  error } = useFetchCategoriesQuery();
    const { categories , products , checked , radio} = useSelector(( state ) => state.shop);
    const [ filterProducts , { isLoading: isFiltering } ] = useFilterProductsMutation({
        checked,
        radio
    });
  return (
    <div>Shop</div>
  )
}

export default Shop