import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";


const Orders = () => {
  const { backendUrl, token, currency, products } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================================
     LOAD USER ORDERS
  ================================= */
  const loadOrderData = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${backendUrl}/api/order/userorders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const allOrdersItem = [];

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            allOrdersItem.push({
              ...item,
              status: order.status || "Processing",
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });

        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error("Load orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);


  /* ================================
     UI
  ================================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
          <p className="text-sm text-gray-600">Loading, please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 px-4 sm:px-8">
      <div className="text-2xl mb-6">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {/* EMPTY STATE */}
      {orderData.length === 0 && (
        <p className="text-gray-500 text-center mt-10">
          You have not placed any orders yet.
        </p>
      )}

      {/* ORDERS LIST */}
      <div>
        {orderData.map((item, index) => {
          // FIND IMAGE FALLBACK FOR OLD ORDERS
          const productData = products.find((p) => p._id === item.productId);
          const imageSrc =
            item.image?.[0] || productData?.image?.[0] || "/placeholder.png";

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* PRODUCT INFO */}
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20 object-cover rounded"
                  src={imageSrc}
                  alt={item.name}
                />

                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>

                  <div className="flex items-center gap-3 mt-1 text-base">
                    <p>
                      {currency}
                      {item.price}
                    </p>
                    <p>Qty: {item.quantity}</p>
                  </div>

                  <p className="mt-1 text-sm">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(item.date).toDateString()}
                    </span>
                  </p>

                  <p className="mt-1 text-sm">
                    Payment:{" "}
                    <span className="text-gray-400">{item.paymentMethod}</span>
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div className="md:w-1/2 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.status === "Delivered"
                        ? "bg-green-500"
                        : item.status === "Cancelled"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <p className="text-sm md:text-base">{item.status}</p>
                </div>

                <button
                  onClick={loadOrderData}
                  className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-black hover:text-white transition"
                >
                  Refresh
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
