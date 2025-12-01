import React from 'react'
import ProductTitle from './ProductTitle'
import ProductPrice from './ProductPrice'
import ProductSizeSelector from './ProductSizeSelector'
import ProductQuantitySelector from './ProductQuantitySelector'
import AddToCartSection from './AddToCartSection'
import DescriptionAccordion from './DescriptionAccordion'
import ProductMeta from './ProductMeta'

const ProductInfo = ({ product }) => {
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
            <ProductQuantitySelector product={product} />

            {/* Add to Cart Section */}
            <AddToCartSection product={product} />

            {/* Description Accordion */}
            <DescriptionAccordion product={product} />
        </div>
    )
}

export default ProductInfo