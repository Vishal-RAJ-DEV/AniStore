import React from 'react'
import ProductTitle from './ProductTitle'
import ProductPrice from './ProductPrice'
import ProductSizeSelector from './ProductSizeSelector'
import ProductQuantitySelector from './ProductQuantitySelector'
import AddToCartSection from './AddToCartSection'
import DescriptionAccordion from './DescriptionAccordion'
import ProductMeta from './ProductMeta'

const ProductInfo = ({ product }) => {

    const [ qty , setQty ] = React.useState(1);
    return (
        <div className="flex flex-col space-y-6 lg:space-y-8">
            {/* Product Title */}
            <ProductTitle product={product} />

            {/* Product Price */}
            <ProductPrice product={product} />

            {/* Product Meta Info */}
            <ProductMeta product={product} />

            {/* Size Selector */}
            <ProductSizeSelector product={product} />

            {/* Quantity Selector */}
            <ProductQuantitySelector product={product} qty={qty} setQty={setQty} />

            {/* Add to Cart Section */}
            <AddToCartSection product={product} qty={qty} />

            {/* Description Accordion */}
            <DescriptionAccordion product={product} />
        </div>
    )
}

export default ProductInfo