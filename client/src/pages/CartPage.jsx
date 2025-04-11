import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const { cart, removeFromCart, updateCartQuantity } = useCart();
    const [selectedItems, setSelectedItems] = useState([]);
    const navigate = useNavigate();

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

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert("Vui lòng chọn sản phẩm để thanh toán!");
            return;
        }
        localStorage.setItem(
            "checkoutItems",
            JSON.stringify(
                cart.filter((item) =>
                    selectedItems.includes(item.product.productId)
                )
            )
        );
        navigate("/checkout");
    };

    return (
        <div className="container mx-auto max-w-5xl px-6 py-10 mt-20">
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
                            className="flex items-center border-b py-4"
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
                            <img
                                src={item.product.image.url}
                                alt={item.product.name} // ✅ Đảm bảo hiển thị đúng tên sản phẩm
                                className="w-20 h-20 rounded-lg"
                            />
                            <div className="flex-1 px-6">
                                <h2 className="text-lg font-semibold">
                                    {item.product.name}
                                </h2>{" "}
                                {/* ✅ Fix lỗi hiển thị tên */}
                                <p className="text-gray-600">
                                    Giá:{" "}
                                    {item.product.variant.price.rootPrice.toLocaleString()}
                                    ₫
                                </p>
                                <p className="text-gray-500">
                                    Phân loại: {item.product.variant.name}
                                </p>
                                {item.product.attribute && (
                                    <p className="text-gray-500">
                                        Thuộc tính:{" "}
                                        {item.product.attribute.name}
                                    </p>
                                )}
                                <div className="flex items-center mt-2">
                                    <button
                                        className="px-2 py-1 border rounded-l bg-gray-200 hover:bg-gray-300"
                                        onClick={() =>
                                            updateCartQuantity(
                                                item.product.productId,
                                                item.quantity - 1
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        ➖
                                    </button>
                                    <span className="px-3">
                                        {item.quantity}
                                    </span>
                                    <button
                                        className="px-2 py-1 border rounded-r bg-gray-200 hover:bg-gray-300"
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
                            <button
                                className="text-red-600 hover:text-red-800"
                                onClick={() =>
                                    removeFromCart(item.product.productId)
                                }
                            >
                                ❌ Xóa
                            </button>
                        </div>
                    ))}

                    <div className="mt-6 text-center">
                        <p className="text-lg font-semibold">
                            Tổng tiền: {totalPrice.toLocaleString()}₫
                        </p>
                        <button
                            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            onClick={handleCheckout}
                        >
                            ✅ Thanh Toán
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
