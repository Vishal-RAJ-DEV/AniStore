import React, { useEffect, useState } from 'react'
import { useFilterProductsMutation, useFetchAllProductsQuery } from '../redux/api/productApiSlice'
import { setCategories, setChecked, setProducts, setRadio } from '../redux/features/shop/shopSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useFetchCategoriesQuery } from '../redux/api/categotyApiSlice'
import Loader from '../components/Loader'
import SmallProducts from './Products/SmallProducts'
import { FaFilter, FaTimes, FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const Shop = () => {
    const dispatch = useDispatch();
    const { data: categoriesQuery, isLoading: categoryLoading, error: categoryError } = useFetchCategoriesQuery();
    const { data: allProductsQuery, isLoading: allProductsLoading } = useFetchAllProductsQuery();
    const { categories, products, checked, radio } = useSelector((state) => state.shop);
    const [filterProductsQuery, { isLoading: isFiltering, error: filterError }] = useFilterProductsMutation();

    // Local state
    const [pricefilter, setpricefilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedBrands, setSelectedBrands] = useState([]); // Track selected brands
    const [expandedSections, setExpandedSections] = useState({
        categories: true,
        brands: true,
        price: true
    });

    // Debug console
    console.log("🛍️ Shop Debug:", {
        categoriesQuery,
        allProductsQuery,
        products,
        checked,
        radio,
        categoryLoading,
        allProductsLoading,
        isFiltering,
        categoryError,
        filterError,
        pricefilter,
        searchTerm
    });

    // Set categories when loaded
    useEffect(() => {
        if (!categoryLoading && categoriesQuery) {
            console.log("📋 Setting categories:", categoriesQuery);
            dispatch(setCategories(categoriesQuery));
        }
    }, [categoriesQuery, dispatch, categoryLoading]);

    // Set initial products when loaded
    useEffect(() => {
        if (!allProductsLoading && allProductsQuery && allProductsQuery.length > 0) {
            console.log("🎯 Setting initial products:", allProductsQuery);
            dispatch(setProducts(allProductsQuery));
        } else if (!allProductsLoading && allProductsQuery) {
            console.log("⚠️ allProductsQuery is empty:", allProductsQuery);
        }
    }, [allProductsQuery, dispatch, allProductsLoading]);

    // Filter products effect
    useEffect(() => {
        const applyFilters = async () => {
            try {
                let filteredProducts = [];

                // If no filters are applied, use all products
                if (checked.length === 0 && radio.length === 0) {
                    console.log("🔄 No filters applied, using all products");
                    filteredProducts = allProductsQuery || [];
                } else {
                    console.log("🔍 Applying filters:", { checked, radio });

                    const result = await filterProductsQuery({
                        checked,
                        radio
                    }).unwrap();

                    console.log("✅ Filter result:", result);
                    filteredProducts = result;
                }

                // Apply price filter
                if (pricefilter) {
                    filteredProducts = filteredProducts.filter((product) => {
                        return (
                            product.price.toString().includes(pricefilter) ||
                            product.price === parseInt(pricefilter, 10)
                        );
                    });
                    console.log("💰 After price filter:", filteredProducts);
                }

                // Apply search filter
                if (searchTerm) {
                    filteredProducts = filteredProducts.filter((product) =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    console.log("🔎 After search filter:", filteredProducts);
                }

                // Apply sorting
                filteredProducts = [...filteredProducts].sort((a, b) => {
                    switch (sortBy) {
                        case 'price-low':
                            return a.price - b.price;
                        case 'price-high':
                            return b.price - a.price;
                        case 'rating':
                            return (b.rating || 0) - (a.rating || 0);
                        case 'name':
                        default:
                            return a.name.localeCompare(b.name);
                    }
                });

                console.log("📊 Final filtered products:", filteredProducts);
                dispatch(setProducts(filteredProducts));

            } catch (error) {
                console.error("❌ Filter error:", error);
                // Fallback to all products on error
                if (allProductsQuery) {
                    dispatch(setProducts(allProductsQuery));
                }
            }
        };

        // Only apply filters if we have data
        if (allProductsQuery) {
            applyFilters();
        }
    }, [checked, radio, pricefilter, searchTerm, sortBy, dispatch, allProductsQuery, filterProductsQuery]);

    // Handle brand filter toggle
    const handleBrandFilter = (brand) => {
        console.log("🏷️ Toggling brand:", brand);

        let updatedSelectedBrands;
        if (selectedBrands.includes(brand)) {
            // Remove brand from selection
            updatedSelectedBrands = selectedBrands.filter(b => b !== brand);
        } else {
            // Add brand to selection
            updatedSelectedBrands = [...selectedBrands, brand];
        }

        setSelectedBrands(updatedSelectedBrands);
        console.log("🏷️ Updated selected brands:", updatedSelectedBrands);

        // Apply brand filtering
        if (!allProductsQuery) return;

        let filteredProducts;
        if (updatedSelectedBrands.length === 0) {
            // No brands selected, show all products (or apply other filters)
            filteredProducts = allProductsQuery;
        } else {
            // Filter by selected brands
            filteredProducts = allProductsQuery.filter((product) =>
                updatedSelectedBrands.includes(product.brand)
            );
        }

        console.log("🏷️ Products filtered by brands:", filteredProducts);
        dispatch(setProducts(filteredProducts));
    };

    // Handle category checkbox
    const handlecheack = (value, id) => {
        console.log("✅ Category checkbox:", { value, id, currentChecked: checked });

        const updatedChecked = value
            ? [...checked, id]
            : checked.filter((c) => c !== id);

        console.log("✅ Updated checked:", updatedChecked);
        dispatch(setChecked(updatedChecked));
    };

    // Handle price range
    const handlePriceRange = (min, max) => {
        console.log("💰 Price range selected:", { min, max });
        dispatch(setRadio([min, max]));
    };

    // Get unique brands
    const uniqueBrands = [
        ...Array.from(
            new Set(
                (allProductsQuery || [])
                    .map((product) => product.brand)
                    .filter((brand) => brand !== undefined && brand !== null && brand !== "")
            )
        )
    ];

    console.log("🏷️ Unique brands:", uniqueBrands);

    // Clear all filters
    const clearAllFilters = () => {
        console.log("🧹 Clearing all filters");
        dispatch(setChecked([]));
        dispatch(setRadio([]));
        setpricefilter("");
        setSearchTerm("");
        setSortBy("name");
        setSelectedBrands([]); // Clear selected brands
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    if (categoryLoading || allProductsLoading) {
        return (
            <div className="min-h-screen bg-black pt-24">
                <div className="container mx-auto px-4">
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">Shop All Products</h1>
                    <p className="text-gray-400">Discover our amazing collection</p>
                </div>

                {/* Search and Sort Bar */}
                <div className="mb-8 bg-[#0a0a0a] border border-gray-900 rounded-2xl p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b9d] transition-colors"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-400 text-sm">Sort by:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#ff6b9d] transition-colors"
                            >
                                <option value="name">Name A-Z</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Rating</option>
                            </select>
                        </div>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="lg:hidden bg-[#ff6b9d] text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                        >
                            <FaFilter />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Filters Sidebar */}
                    <div className={`lg:col-span-3 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-[#0a0a0a] border border-gray-900 rounded-2xl p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Filters</h3>
                                <button
                                    onClick={clearAllFilters}
                                    className="text-[#ff6b9d] hover:text-[#ff8da8] text-sm font-medium"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Categories Filter */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection('categories')}
                                    className="w-full flex items-center justify-between text-white font-semibold mb-4 hover:text-[#ff6b9d] transition-colors"
                                >
                                    <span>Categories ({categories?.length || 0})</span>
                                    {expandedSections.categories ? <FaChevronUp /> : <FaChevronDown />}
                                </button>

                                {expandedSections.categories && (
                                    <div className="space-y-3 max-h-48 overflow-y-auto">
                                        {categories && categories.length > 0 ? (
                                            categories.map((category) => (
                                                <label key={category._id} className="flex items-center space-x-3 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={checked.includes(category._id)}
                                                        onChange={(e) => handlecheack(e.target.checked, category._id)}
                                                        className="w-4 h-4 rounded border-gray-700 bg-[#1a1a1a] text-[#ff6b9d] focus:ring-[#ff6b9d] focus:ring-offset-0"
                                                    />
                                                    <span className="text-gray-300 hover:text-white text-sm">
                                                        {category.name}
                                                    </span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No categories available</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleSection('price')}
                                    className="w-full flex items-center justify-between text-white font-semibold mb-4 hover:text-[#ff6b9d] transition-colors"
                                >
                                    <span>Price Range</span>
                                    {expandedSections.price ? <FaChevronUp /> : <FaChevronDown />}
                                </button>

                                {expandedSections.price && (
                                    <div className="space-y-3">
                                        {Object.entries({
                                            "0-50": [0, 50],
                                            "50-100": [50, 100],
                                            "100-200": [100, 200],
                                            "200-500": [200, 500],
                                            "500-1000": [500, 1000]
                                        }).map(([label, [min, max]]) => (
                                            <label key={`${min}-${max}`} className="flex items-center space-x-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="priceRange"
                                                    checked={radio.length > 0 && radio[0] === min && radio[1] === max}
                                                    onChange={() => handlePriceRange(min, max)}
                                                    className="w-4 h-4 border-gray-700 bg-[#1a1a1a] text-[#ff6b9d] focus:ring-[#ff6b9d] focus:ring-offset-0"
                                                />
                                                <span className="text-gray-300 hover:text-white text-sm">
                                                    ${min} - ${max === 1000 ? '1000+' : max}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Brands Filter */}
                            {uniqueBrands.length > 0 && (
                                <div className="mb-6">
                                    <button
                                        onClick={() => toggleSection('brands')}
                                        className="w-full flex items-center justify-between text-white font-semibold mb-4 hover:text-[#ff6b9d] transition-colors"
                                    >
                                        <span>Brands ({uniqueBrands.length})</span>
                                        {expandedSections.brands ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>

                                    {expandedSections.brands && (
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {uniqueBrands.map((brand) => {
                                                const isSelected = selectedBrands.includes(brand);
                                                return (
                                                    <button
                                                        key={brand}
                                                        onClick={() => handleBrandFilter(brand)}
                                                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${isSelected
                                                            ? 'bg-[#ff6b9d]/20 text-[#ff6b9d] border border-[#ff6b9d]/30'
                                                            : 'text-gray-300 hover:text-[#ff6b9d] hover:bg-[#ff6b9d]/10'
                                                            }`}
                                                    >
                                                        <span className="flex items-center justify-between">
                                                            {brand}
                                                            {isSelected && (
                                                                <span className="text-xs bg-[#ff6b9d] text-white px-2 py-1 rounded-full">
                                                                    ✓
                                                                </span>
                                                            )}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Active Filters */}
                            {(checked.length > 0 || radio.length > 0 || searchTerm || selectedBrands.length > 0) && (
                                <div className="border-t border-gray-800 pt-6">
                                    <h4 className="text-white font-semibold mb-3">Active Filters</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {checked.map((categoryId) => {
                                            const category = categories?.find(cat => cat._id === categoryId);
                                            return category ? (
                                                <span
                                                    key={categoryId}
                                                    className="bg-[#ff6b9d]/20 text-[#ff6b9d] px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                                                >
                                                    <span>{category.name}</span>
                                                    <button
                                                        onClick={() => handlecheack(false, categoryId)}
                                                        className="hover:text-white"
                                                    >
                                                        <FaTimes size={10} />
                                                    </button>
                                                </span>
                                            ) : null;
                                        })}
                                        {selectedBrands.map((brand) => (
                                            <span
                                                key={brand}
                                                className="bg-[#ff6b9d]/20 text-[#ff6b9d] px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                                            >
                                                <span>{brand}</span>
                                                <button
                                                    onClick={() => handleBrandFilter(brand)}
                                                    className="hover:text-white"
                                                >
                                                    <FaTimes size={10} />
                                                </button>
                                            </span>
                                        ))}
                                        {radio.length > 0 && (
                                            <span className="bg-[#ff6b9d]/20 text-[#ff6b9d] px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                                                <span>${radio[0]} - ${radio[1]}</span>
                                                <button
                                                    onClick={() => dispatch(setRadio([]))}
                                                    className="hover:text-white"
                                                >
                                                    <FaTimes size={10} />
                                                </button>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:col-span-9">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-400">
                                {products?.length || 0} products found
                            </p>
                            {isFiltering && (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ff6b9d]"></div>
                                    <span className="text-gray-400 text-sm">Filtering...</span>
                                </div>
                            )}
                        </div>

                        {/* Products Grid */}
                        {console.log("🖥️ Rendering products:", { products, productsLength: products?.length, allProductsQuery, allProductsLength: allProductsQuery?.length })}

                        {/* Show all products if no filters are applied and we have data */}
                        {(products && products.length > 0) || (checked.length === 0 && radio.length === 0 && !searchTerm && allProductsQuery && allProductsQuery.length > 0) ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {(products && products.length > 0 ? products : allProductsQuery || []).map((product) => (
                                    <SmallProducts key={product._id} product={product} />
                                ))}
                            </div>
                        ) : !isFiltering && !allProductsLoading ? (
                            <div className="text-center py-16">
                                <div className="text-6xl mb-4">🛍️</div>
                                <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                                <p className="text-gray-400 mb-6">
                                    {allProductsQuery && allProductsQuery.length === 0 ?
                                        "No products available in the store" :
                                        "Try adjusting your filters or search terms"
                                    }
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="bg-gradient-to-r from-[#ff6b9d] to-[#ff8da8] text-white px-6 py-3 rounded-full font-semibold hover:from-[#ff5c92] hover:to-[#ff7a99] transition-all"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <Loader />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Shop