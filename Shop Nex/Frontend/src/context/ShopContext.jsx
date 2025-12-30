import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 10;

  /* ================================
     BACKEND URL
  ================================= */
  const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendUrl = rawBackendUrl ?? "http://localhost:4000";

  /* ================================
     AXIOS INSTANCE
  ================================= */
  const api = axios.create({
    baseURL: backendUrl,
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
  });

  // 🔐 Attach JWT automatically
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  /* ================================
     STATE
  ================================= */
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  /* ================================
     UTIL
  ================================= */
  const deepClone = (obj) => {
    try {
      return structuredClone(obj);
    } catch {
      return JSON.parse(JSON.stringify(obj));
    }
  };

  /* ================================
     ADD TO CART
  ================================= */
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please select product size");
      return;
    }

    const cartData = deepClone(cartItems);

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    setCartItems(cartData);

    if (token) {
      try {
        await api.post("/api/cart/add", { itemId, size });
      } catch (error) {
        console.error("Cart add error:", error?.response ?? error.message);
        toast.error("Failed to sync cart with server");
      }
    }
  };

  /* ================================
     UPDATE QUANTITY
  ================================= */
  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = deepClone(cartItems);

    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (token) {
      try {
        await api.post("/api/cart/update", {
          itemId,
          size,
          quantity,
        });
      } catch (error) {
        console.error("Cart update error:", error?.response ?? error.message);
        toast.error("Failed to update cart on server");
      }
    }
  };

  /* ================================
     CART COUNT
  ================================= */
  const getCartCount = () => {
    let total = 0;
    for (const id in cartItems) {
      for (const size in cartItems[id]) {
        total += Number(cartItems[id][size]) || 0;
      }
    }
    return total;
  };

  /* ================================
     CART AMOUNT
  ================================= */
  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (!product) continue;

      for (const size in cartItems[id]) {
        const qty = Number(cartItems[id][size]) || 0;
        total += qty * (product.price ?? 0);
      }
    }
    return total;
  };

  /* ================================
     LOAD PRODUCTS
  ================================= */
  const getProductsData = async () => {
    try {
      const res = await api.get("/api/product/list");
      const list = res.data?.products ?? [];

      const normalized = list.map((p) => ({
        ...p,
        image: Array.isArray(p.image)
          ? p.image
          : p.image
          ? [p.image]
          : ["/fallback.png"],
      }));

      setProducts(normalized);
    } catch (error) {
      console.error("Load products error:", error?.response ?? error.message);
      toast.error("Failed to load products");
    }
  };

  /* ================================
     LOAD USER CART
  ================================= */
  const getUserCart = async () => {
    try {
      const res = await api.post("/api/cart/get");
      setCartItems(res.data?.cartData ?? {});
    } catch (error) {
      console.error("Load cart error:", error?.response ?? error.message);
    }
  };

  /* ================================
     EFFECTS
  ================================= */
  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      getUserCart();
    } else {
      localStorage.removeItem("token");
      setCartItems({});
    }
  }, [token]);

  /* ================================
     CONTEXT VALUE
  ================================= */
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    updateQuantity,
    getCartCount,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
