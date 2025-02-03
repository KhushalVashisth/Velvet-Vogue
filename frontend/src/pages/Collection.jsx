import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
    const { products = [], search, showSearch } = useContext(ShopContext); // Ensure products is always an array
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]); // Initialize as an empty array
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setCategory((prev) => [...prev, e.target.value]);
        }
    };

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
        } else {
            setSubCategory((prev) => [...prev, e.target.value]);
        }
    };

    const applyFilter = () => {
        let filteredProducts = products;
    
        if (showSearch && search) {
            filteredProducts = filteredProducts.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }
    
        if (category.length > 0) {
            filteredProducts = filteredProducts.filter(item => 
                category.includes(item.category)
            );
        }
    
        if (subCategory.length > 0) {
            filteredProducts = filteredProducts.filter(item => 
                subCategory.includes(item.subCategory)
            );
        }
    
        return filteredProducts;
    };
    

    const applySort = (productsToSort) => {
        switch (sortType) {
            case 'low-high':
                return productsToSort.sort((a, b) => a.price - b.price);
            case 'high-low':
                return productsToSort.sort((a, b) => b.price - a.price);
            default:
                return productsToSort; // Default is "relevant" (no sorting)
        }
    };

    useEffect(() => {
        const filtered = applyFilter();
        const sorted = applySort(filtered);
        setFilterProducts(sorted);
    }, [category, subCategory, sortType, products,search,showSearch]);

    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
            {/* Filter options */}
            <div className='min-w-60'>
                <p
                    onClick={() => setShowFilter(!showFilter)}
                    className='my-2 text-xl flex items-center cursor-pointer gap-2'
                >
                    FILTERS
                    <img
                        className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
                        src={assets.dropdown_icon}
                        alt=""
                    />
                </p>

                {/* Category filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value='Men' onChange={toggleCategory} />Men
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value='Women' onChange={toggleCategory} />Women
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value='Kids' onChange={toggleCategory} />Kids
                        </p>
                    </div>
                </div>

                {/* Subcategory filter */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>TYPE</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value='Topwear' onChange={toggleSubCategory} />Topwear
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value='Bottomwear' onChange={toggleSubCategory} />Bottomwear
                        </p>
                        <p className='flex gap-2'>
                            <input className='w-3' type='checkbox' value='Winterwear' onChange={toggleSubCategory} />Winterwear
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text1={'ALL'} text2={'COLLECTIONS'} />
                    {/* Product sort */}
                    <select
                        onChange={(e) => setSortType(e.target.value)}
                        className='border-2 border-gray-300 text-sm px-2'
                    >
                        <option value='relevant'>Sort by: Relevant</option>
                        <option value='low-high'>Sort by: Low to High</option>
                        <option value='high-low'>Sort by: High to Low</option>
                    </select>
                </div>
                {/* Map products */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {filterProducts.length > 0 ? (
                        filterProducts.map((item, index) => (
                            <ProductItem
                                key={index}
                                name={item.name}
                                id={item._id}
                                price={item.price}
                                image={item.image}
                            />
                        ))
                    ) : (
                        <p className='text-gray-500 text-sm'>No products match your filters.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collection;
