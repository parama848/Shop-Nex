import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import ShopLoader from "../context/ShopLoader";

const LatestCollections = () => {
  const { products } = useContext(ShopContext);

  const [latestProducts, setLatestProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  // useEffect(() => {
  //   setLatestProducts(products.slice(0, 10));
  // }, [products]);
  useEffect(() => {
  setLoading(true);

  setTimeout(() => {
    setLatestProducts(products.slice(0, 10));
    setLoading(false);
  }, 800); // smooth professional delay
}, [products]);


if(loading){
  return <ShopLoader />;
}
else {

  return (
    <div className="my-10  "> 
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEXT"} text2={"COLLECTIONS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
          impedit nesciunt asperiores enim. Soluta atque, ipsum at voluptatem
          voluptate provident. 
        </p>
      </div>

      {/* rendering products */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
  }
};


export default LatestCollections;
