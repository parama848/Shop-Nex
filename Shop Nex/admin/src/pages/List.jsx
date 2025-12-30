import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token, setToken }) => {
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
        if (response.data.message === "Not Authorized Login Again" || response.data.message === "invalid signature") {
          setToken("");
        }
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
        backendUrl + "/api/product/update",
        { id: editingProduct, ...editForm },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingProduct(null);
        setEditForm({ name: "", price: "", category: "" });
        await fetchList();
      } else {
        toast.error(response.data.message);
        if (response.data.message === "Not Authorized Login Again" || response.data.message === "invalid signature") {
          setToken("");
        }
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
      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] item-center py-2 px-2 border bg-gray-100 text-sm font-medium">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {list.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-2 px-2 border text-sm"
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
                  className="border px-2 py-1 rounded w-full"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <input
                  className="hidden md:block border px-2 py-1 rounded w-full"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
                <input
                  className="hidden md:block border px-2 py-1 rounded w-full"
                  type="number"
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
                    className="text-green-600 font-medium hover:text-green-800"
                    onClick={updateProduct}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-500 font-medium hover:text-gray-700"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-blue-600 font-medium hover:text-blue-800 mr-2"
                    onClick={() => startEditing(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 font-medium hover:text-red-800"
                    onClick={() => removeProduct(item._id)}
                  >
                    X
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
