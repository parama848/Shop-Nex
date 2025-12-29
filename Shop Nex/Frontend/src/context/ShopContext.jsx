// src/context/ShopContext.jsx
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 10;

  // Use env var or fallback to localhost
  const rawBackendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendUrl = rawBackendUrl ?? "http://localhost:4000";

  // Axios instance with baseURL
  const api = axios.create({
    baseURL: backendUrl,
    headers: { "Content-Type": "application/json" },
    timeout: 10_000,
  });

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  // safe clone (structuredClone fallback)
  const deepClone = (obj) => {
    try {
      return structuredClone(obj);
    } catch {
      return JSON.parse(JSON.stringify(obj));
    }
  };

  // Add to cart (frontend + backend sync if logged in)
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Product Size");
      return;
    }

    const cartData = deepClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);

    // persist to backend if logged in
    if (token) {
      try {
        await api.post(
          "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Cart add error:", error?.response ?? error.message);
        toast.error("Failed to sync cart with server");
      }
    }
  };

  // cart count
  const getCartCount = () => {
    let totalCount = 0;
    for (const productId in cartItems) {
      const sizesObj = cartItems[productId];
      for (const size in sizesObj) {
        const qty = Number(sizesObj[size]) || 0;
        if (qty > 0) totalCount += qty;
      }
    }
    return totalCount;
  };

  // update quantity (frontend + backend)
  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = deepClone(cartItems);

    // ensure structure exists
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    if (token) {
      try {
        await api.post(
          "/api/cart/update",
          { itemId, size, quantity },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Cart update error:", error?.response ?? error.message);
        toast.error("Failed to update cart on server");
      }
    }
  };

  // cart amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const productId in cartItems) {
      const itemInfo = products.find((p) => p._id === productId);
      for (const size in cartItems[productId]) {
        const qty = Number(cartItems[productId][size]) || 0;
        if (qty > 0 && itemInfo?.price) {
          totalAmount += itemInfo.price * qty;
        }
      }
    }
    return totalAmount;
  };

  // get products from backend and normalize shape
  const getProductsData = async () => {
    try {
      const response = await api.get("/api/product/list");
      const data = response.data ?? {};
      const productArray = Array.isArray(data.products) ? data.products : [];

      // normalize image to array (so frontend can use image[0])
      const normalized = productArray.map((p) => ({
        ...p,
        image:
          Array.isArray(p.image) && p.image.length > 0
            ? p.image
            : p.image
            ? [p.image]
            : ["/fallback.png"],
      }));

      setProducts(normalized);
    } catch (error) {
      console.error("Failed to load products:", error?.response ?? error.message);
      toast.error("Failed to load products");
      setProducts([]);
    }
  };

  // get user cart from backend (expects token)
  const getUserCart = async (tkn) => {
    if (!tkn) return;
    try {
      const response = await api.post("/api/cart/get", {}, { headers: { token: tkn } });
      const data = response.data ?? {};
      setCartItems(data.cartData ?? {});
    } catch (error) {
      console.error("Failed to load user cart:", error?.response ?? error.message);
      // don't toast aggressively here on page load
    }
  };

  // initial load of products
  useEffect(() => {
    getProductsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]); // reload if backendUrl changes

  // sync token from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setToken(stored);
    }
  }, []);

  // whenever token changes to a truthy value, fetch cart from backend
  useEffect(() => {
    if (token) {
      getUserCart(token);
      // store token to localStorage so it persists across reloads
      localStorage.setItem("token", token);
    } else {
      // if token becomes empty (logout), clear localStorage and local cart
      localStorage.removeItem("token");
      setCartItems({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    token,
    setToken,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
