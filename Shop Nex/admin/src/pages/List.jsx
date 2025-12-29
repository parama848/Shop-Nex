// import axios from "axios";
// import React from "react";
// import { useEffect } from "react";
// import { useState } from "react";
// import { backendUrl, currency } from "../App";
// import { toast } from "react-toastify";

// const List = ({ token }) => {
//   const [list, setList] = useState([]);

//   const fetchList = async () => {
//     try {
//       const response = await axios.get(backendUrl + "/api/product/list");
//       if (response.data.success) {
//         setList(response.data.products);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const removeProduct = async (id) => {
//     try {
//       const response = await axios.post(
//         backendUrl + "/api/product/remove",
//         { id },
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         toast.success(response.data.message);
//         await fetchList();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     fetchList();
//   }, []);
//   return (
//     <>
//       <p className="mb-2 ml-4 text-lg font-semibold">All Products List</p>
//       <div className="ml-4 flex flex-col gap-2 w-[95%]">
//         {/* Table header for md and above */}
//         <div className="hidden md:grid grid-cols-[1fr_3fr_2fr_1fr_1fr] items-center py-2 border bg-gray-100 text-sm font-medium">
//           <b className="pl-4">Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b className="text-center">Action</b>
          
//         </div>

//         {/* Product list */}
//         {list.map((item, index) => (
//           <div
//             key={index}
//             className="grid grid-cols-[1fr_3fr_auto] md:grid-cols-[1fr_3fr_2fr_1fr_1fr] items-center gap-4 py-2 px-2 border text-sm"
//           >
//             {/* Image */}
//             <img
//               className="w-12 h-12 object-cover rounded-md"
//               src={item.image[0]}
//               alt="Product"
//             />

//             {/* Name */}
//             <p className="truncate">{item.name}</p>

//             {/* Category – visible on md+ */}
//             <p className="hidden md:block">{item.category}</p>

//             {/* Price – visible on md+ */}
//             <p className="hidden md:block">
//               {currency}
//               {item.price}
//             </p>

//             {/* Action (delete) */}
//             <p onClick={()=>removeProduct(item._id)} className="text-right md:text-center cursor-pointer text-lg text-red-600 font-bold">
//               X
//             </p>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default List;




import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); // currently editing product
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    category: "",
  });

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditForm({ name: "", price: "", category: "" });
  };

  const updateProduct = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/update", // your update route
        {
          id: editingProduct,
          ...editForm,
        },
        {
          headers: { token },
        }
      );
      if (response.data.success) {
        toast.success("Product updated");
        cancelEditing();
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2 ml-10 text-lg font-semibold">All Products List</p>
      <div className="ml-10 flex flex-col gap-2 w-[95%] ">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_2fr_1fr_2fr]  py-2 border bg-gray-100 text-sm font-medium">
          <b className="pl-4">Image</b>
          <b className="ml-4">Name</b>
          <b className="mr-32">Category</b>
          <b className="mr-16">Price</b>
          <b className="text-center">Action</b> 
        </div>

        {/* Product List */}
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_3fr_auto] md:grid-cols-[1fr_3fr_2fr_1fr_2fr] items-center gap-2 py-2 px-2 border text-sm"
          >
            <img
              className="w-12 h-12 object-cover rounded-md"
              src={item.image[0]}
              alt="Product"
            />

            {/* If editing, show form */}
            {editingProduct === item._id ? (
              <>
                <input
                  className="border px-2 py-1 rounded"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <input
                  className="hidden md:block border px-2 py-1 rounded"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
                <input
                  className="hidden md:block border px-2 py-1 rounded"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                />
              </>
            ) : (
              <>
                <p className="truncate">{item.name}</p>
                <p className="hidden md:block">{item.category}</p>
                <p className="hidden md:block">
                  {currency}
                  {item.price}
                </p>
              </>
            )}

            {/* Action buttons */}
            <div className="flex justify-end md:justify-center gap-2">
              {editingProduct === item._id ? (
                <>
                  <button
                    className="text-gray-700 font-medium"
                    onClick={updateProduct}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-500 font-medium"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                 
                  <button
                    className="text-black-600 font-bold ml-20"
                    onClick={() => removeProduct(item._id)}
                  >
                    X
                  </button>
                   <button
                    className="text-gray-600 font-medium  ml-10 border border-gray-600 px-1.5 py-0.5 rounded-md hover:bg-gray-700 hover:text-white hover:font-sm"
                    onClick={() => startEditing(item)}
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
