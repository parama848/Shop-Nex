import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products,search,showSearch } = useContext(ShopContext); // Get all products from context

  const [showFilter, setShowFilter] = useState(false); // Show/hide filters on small screens
  const [filterProducts, setFilterProducts] = useState([]); // Final filtered products to display

  const [category, setCategory] = useState([]); // Selected categories (e.g., Men, Women)
  const [subCategory, setSubCategory] = useState([]); // Selected types (e.g., Topwear)
  const [sortType, setSortType ] = useState('relavent');

  
  

  // Handle selecting/unselecting a category
  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Handle selecting/unselecting a sub-category
  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

 //filtering products based on the category
 const applyFilter = () => {
  

  let productsCopy = products; //  copy of all products

  if(showSearch && search ){
    productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  }

  // Step 3: Filter by main category
  if (category.length > 0) {
    productsCopy = productsCopy.filter(item =>
      category.includes(item.category) 
    );
  }

  // Step 4: Filter by sub-category
  if (subCategory.length > 0) {
    productsCopy = productsCopy.filter(item =>
      subCategory.includes(item.subCategory) 
    );
  }
  // Step 5: Update filtered product state
  setFilterProducts(productsCopy);
};

const sortProduct = () => {
  let sortedProducts = [...filterProducts]; // create a copy

  switch (sortType) {
    case 'low-high':
      sortedProducts.sort((a, b) => a.price - b.price);
      setFilterProducts(sortedProducts);
      break;

    case 'high-low':
      sortedProducts.sort((a, b) => b.price - a.price);
      setFilterProducts(sortedProducts);
      break;

    default:
      // Reapply filters and reset to original filter order
      applyFilter(); 
      break;
  }
};


 useEffect(()=>{
  applyFilter();
 },[category,subCategory,search,showSearch,products])

 useEffect(()=>{
  sortProduct();
 },[sortType,products])
 

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t '>

      {/* Left: Filter Section */}
      <div className='min-w-60'>

        {/* Filter Toggle Button (for small screens) */}
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS
          <img
            src={assets.dropdown_icon}
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            alt="dropdown"
          />
        </p>

        {/* Categories (Men, Women, Kids) */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm text-gray-700'>
            <p className='flex-gap-2'>
             <input className='w-3 accent-gray-500 cursor-pointer' type="checkbox" value={'Men'} onChange={toggleCategory} /> Men
            </p>
            <p className='flex-gap-2'>
             <input className='w-3 accent-gray-500 cursor-pointer' type="checkbox" value={'Women'} onChange={toggleCategory} /> Women
            </p>
            <p className='flex-gap-2'>
             <input  className='w-3 accent-gray-500 cursor-pointer' type="checkbox" value={'Kids'} onChange={toggleCategory} /> Kids
            </p>
          </div>
        </div>

        {/* Subcategories (Topwear, Bottomwear, Winterwear) */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm text-gray-700'>
          <p className='flex-gap-2'> 
            <input  className='w-3 accent-gray-500 cursor-pointer' type="checkbox" value={'Topwear'} onChange={toggleSubCategory} /> Topwear
          </p>
          <p className='flex-gap-2'> 
            <input  className='w-3 accent-gray-500 cursor-pointer' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory} /> Bottomwear
          </p>
          <p className='flex-gap-2'> 
            <input  className='w-3 accent-gray-500 cursor-pointer' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory} /> Winterwear
          </p>
          </div>
        </div>
      </div>

      {/* Right: Product Section */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1='ALL' text2='COLLECTIONS' />
          
          {/* Sorting Dropdown */}
          <select onChange={(e)=> setSortType(e.target.value)} className='border-2  text-sm px-2'>
            <option  value='relavent' > Relavant</option>
            <option value='low-high' > Low to High</option>
            <option value='high-low'> High to Low</option>
          </select>
        </div>

        {/* Display Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
