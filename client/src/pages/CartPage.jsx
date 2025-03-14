import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useApi } from "../hooks/useApi";

const CartPage = () => {
    const { cart, removeFromCart, updateCartQuantity } = useCart();
    const { fetchApi, loading } = useApi();
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectItem = (productId) => {
        setSelectedItems((prevSelected) =>
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const totalPrice = cart
        .filter((item) => selectedItems.includes(item.product.productId))
        .reduce(
            (acc, item) =>
                acc + item.quantity * item.product.variant.price.rootPrice,
            0
        );

    const handleCheckout = async () => {
        if (selectedItems.length === 0) return;

        const orderData = {
            items: cart
                .filter((item) =>
                    selectedItems.includes(item.product.productId)
                )
                .map((item) => ({
                    productId: item.product.productId,
                    attribute: item.product.attribute?.code,
                    variant: item.product.variant?.code,
                    quantity: item.quantity,
                })),
            firstName: "Guest",
            lastName: "User",
            shippingAddress: "Hà Nội, Việt Nam",
            phone: "0123456789",
            storeId: "1",
        };

        try {
            const response = await fetchApi("/orders", "post", orderData);
            if (response) {
                window.location.href = response.url;
            } else {
                alert("Thanh toán thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            alert(error || "Có lỗi xảy ra khi thanh toán.");
        }
    };

    return (
        <div className="container mx-auto max-w-4xl px-6 py-10 mt-20">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                🛒 Giỏ Hàng Của Bạn
            </h1>

            {cart.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm ngay!
                </p>
            ) : (
                <div className="bg-white shadow-lg rounded-lg p-6">
                    {cart.map((item) => (
                        <div
                            key={item.product.productId}
                            className="flex items-center border-b last:border-none py-4 px-4 hover:bg-gray-100 transition duration-300 rounded-lg"
                        >
                            <input
                                type="checkbox"
                                className="w-5 h-5 mr-3 accent-green-500"
                                checked={selectedItems.includes(
                                    item.product.productId
                                )}
                                onChange={() =>
                                    handleSelectItem(item.product.productId)
                                }
                            />

                            <div className="w-24 h-24 flex-shrink-0">
                                <img
                                    src={
                                        item.product.image.url ||
                                        "/placeholder.png"
                                    }
                                    alt={item.product.image.alt || "Sản phẩm"}
                                    className="w-full h-full object-cover rounded-lg border shadow-sm"
                                />
                            </div>

                            <div className="flex-1 px-6">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {item.product.image.title ||
                                        "Sản phẩm không có tên"}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-semibold capitalize">
                                        {item.product.attribute?.key}:
                                    </span>{" "}
                                    {item.product.attribute?.value ||
                                        "Không có"}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-semibold">Giá:</span>{" "}
                                    {item.product?.variant.price.rootPrice.toLocaleString()}
                                    ₫
                                </p>

                                <div className="flex items-center mt-2">
                                    <button
                                        className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-lg hover:bg-gray-200 transition"
                                        onClick={() =>
                                            updateCartQuantity(
                                                item.product.productId,
                                                Math.max(1, item.quantity - 1)
                                            )
                                        }
                                    >
                                        ➖
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateCartQuantity(
                                                item.product.productId,
                                                Math.max(
                                                    1,
                                                    parseInt(
                                                        e.target.value,
                                                        10
                                                    ) || 1
                                                )
                                            )
                                        }
                                        className="w-12 text-center mx-2 border rounded-lg"
                                    />
                                    <button
                                        className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded-lg hover:bg-gray-200 transition"
                                        onClick={() =>
                                            updateCartQuantity(
                                                item.product.productId,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        ➕
                                    </button>
                                </div>
                            </div>

                            <div className="pl-4">
                                <button
                                    className="text-red-600 hover:text-red-800 transition font-semibold px-3 py-2 rounded-lg border border-red-500 hover:bg-red-100"
                                    onClick={() =>
                                        removeFromCart(item.product.productId)
                                    }
                                >
                                    ❌ Xóa
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
                        <p className="text-lg font-semibold">
                            🛍 Tổng sản phẩm đã chọn: {selectedItems.length}
                        </p>
                        <p className="text-xl font-bold text-green-600">
                            💰 Tổng tiền: {totalPrice.toLocaleString()}₫
                        </p>
                        <button
                            className={`mt-4 px-6 py-3 rounded-lg text-white font-bold transition ${
                                selectedItems.length === 0 || loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                            disabled={selectedItems.length === 0 || loading}
                            onClick={handleCheckout}
                        >
                            {loading ? "⏳ Đang xử lý..." : "✅ Thanh Toán"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
