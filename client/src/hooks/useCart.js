import { useState, useEffect } from "react";
import { useApi } from "./useApi";

export const useCart = () => {
    const { fetchApi } = useApi();
    const [cart, setCart] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            setIsAuthenticated(true);
            fetchApi("/carts")
                .then((data) => setCart(data.data || []))
                .catch((err) => console.error("Lỗi khi lấy giỏ hàng:", err));
        } else {
            const localCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCart(localCart);
        }
    }, []);

    useEffect(() => {
        const updateCart = () => {
            if (!isAuthenticated) {
                const localCart =
                    JSON.parse(localStorage.getItem("cart")) || [];
                setCart(localCart);
            }
        };

        window.addEventListener("cartUpdated", updateCart);
        return () => {
            window.removeEventListener("cartUpdated", updateCart);
        };
    }, [isAuthenticated]);

    const saveCart = (updatedCart) => {
        setCart(updatedCart);
        if (!isAuthenticated) {
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };

    // Thêm sản phẩm vào giỏ hàng
    const addToCart = async (product, quantity = 1) => {
        console.log("🚀 ~ addToCart ~ product:", product);
        const newItem = {
            product: {
                productId: product.productId,
                attribute: product.attribute || "",
                variant: product.variant || "",
                image: product.image, // ✅ Lưu ảnh sản phẩm
            },
            quantity,
        };

        if (isAuthenticated) {
            try {
                const response = await fetchApi("/carts", "post", newItem);
                setCart(response.data.data);
            } catch (error) {
                console.error("Lỗi khi thêm vào giỏ hàng:", error);
            }
        } else {
            const existingItemIndex = cart.findIndex(
                (item) =>
                    item.product.productId === newItem.product.productId &&
                    item.product.attribute === newItem.product.attribute &&
                    item.product.variant === newItem.product.variant
            );

            let updatedCart = [...cart];

            if (existingItemIndex !== -1) {
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity:
                        updatedCart[existingItemIndex].quantity + quantity,
                };
            } else {
                updatedCart.push(newItem);
            }

            saveCart(updatedCart);
        }
    };
    const updateCartQuantity = async (productId, quantity) => {
        if (isAuthenticated) {
            try {
                const response = await fetchApi(
                    `/carts/${productId}`,
                    "patch",
                    {
                        quantity,
                    }
                );
                setCart(response.data.data);
            } catch (error) {
                console.error("Lỗi khi cập nhật số lượng giỏ hàng:", error);
            }
        } else {
            const updatedCart = cart.map((item) =>
                item.product.productId === productId
                    ? { ...item, quantity }
                    : item
            );
            saveCart(updatedCart); // Lưu vào localStorage + phát sự kiện "cartUpdated"
        }
    };

    return { cart, addToCart, updateCartQuantity };
};
