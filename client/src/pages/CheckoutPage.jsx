import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
    const [checkoutItems, setCheckoutItems] = useState([]);
    const { fetchApi, loading } = useApi();
    const navigate = useNavigate();

    const [customerInfo, setCustomerInfo] = useState({
        firstName: "",
        lastName: "",
        shippingAddress: "",
        phone: "",
    });

    const [voucher, setVoucher] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod"); // Default: Thanh toán khi nhận hàng
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        const storedItems = localStorage.getItem("checkoutItems");
        if (storedItems) {
            setCheckoutItems(JSON.parse(storedItems));
        }
    }, []);

    const subtotal = checkoutItems.reduce(
        (acc, item) =>
            acc + item.quantity * item.product.variant.price.rootPrice,
        0
    );

    const totalPrice = subtotal - discount;

    const handlePayment = async () => {
        if (
            !customerInfo.firstName ||
            !customerInfo.lastName ||
            !customerInfo.shippingAddress ||
            !customerInfo.phone
        ) {
            alert("Vui lòng nhập đầy đủ thông tin khách hàng!");
            return;
        }

        const orderData = {
            items: checkoutItems.map((item) => ({
                productId: item.product.productId,
                attribute: item.product.attribute?.code,
                variant: item.product.variant?.code,
                quantity: item.quantity,
            })),
            ...customerInfo,
            voucher,
            paymentMethod,
        };

        try {
            const response = await fetchApi("/orders", "post", orderData);
            if (response) {
                window.location.href = response.url;
            } else {
                alert("Thanh toán thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            alert("Có lỗi xảy ra khi thanh toán.");
        }
    };

    return (
        <div className="container mx-auto max-w-5xl px-6 py-10 mt-20">
            <h1 className="text-3xl font-bold text-center text-gray-900">
                💳 Thanh Toán
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Danh sách sản phẩm */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">🛒 Sản Phẩm</h2>
                    {checkoutItems.map((item) => (
                        <div
                            key={item.product.productId}
                            className="flex items-center border-b py-4"
                        >
                            <img
                                src={item.product.image.url}
                                alt="Sản phẩm"
                                className="w-16 h-16 rounded-lg"
                            />
                            <div className="flex-1 px-4">
                                <h3 className="text-lg font-semibold">
                                    {item.product.image.title}
                                </h3>
                                <p className="text-gray-600">
                                    {item.quantity} x{" "}
                                    {item.product.variant.price.rootPrice.toLocaleString()}
                                    ₫
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form thanh toán */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        📌 Thông Tin Khách Hàng
                    </h2>
                    <input
                        type="text"
                        placeholder="Họ"
                        className="w-full p-2 mb-3 border rounded-lg"
                        value={customerInfo.lastName}
                        onChange={(e) =>
                            setCustomerInfo({
                                ...customerInfo,
                                lastName: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Tên"
                        className="w-full p-2 mb-3 border rounded-lg"
                        value={customerInfo.firstName}
                        onChange={(e) =>
                            setCustomerInfo({
                                ...customerInfo,
                                firstName: e.target.value,
                            })
                        }
                    />
                    <input
                        type="text"
                        placeholder="Địa chỉ giao hàng"
                        className="w-full p-2 mb-3 border rounded-lg"
                        value={customerInfo.shippingAddress}
                        onChange={(e) =>
                            setCustomerInfo({
                                ...customerInfo,
                                shippingAddress: e.target.value,
                            })
                        }
                    />
                    <input
                        type="tel"
                        placeholder="Số điện thoại"
                        className="w-full p-2 mb-3 border rounded-lg"
                        value={customerInfo.phone}
                        onChange={(e) =>
                            setCustomerInfo({
                                ...customerInfo,
                                phone: e.target.value,
                            })
                        }
                    />

                    {/* Nhập voucher */}
                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            🎟️ Nhập Mã Giảm Giá
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                className="flex-1 p-2 border rounded-l-lg"
                                placeholder="Nhập mã voucher"
                                value={voucher}
                                onChange={(e) => setVoucher(e.target.value)}
                            />
                            <button
                                className="px-4 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
                                onClick={() =>
                                    alert("Chức năng này chưa hoạt động!")
                                }
                            >
                                Áp dụng
                            </button>
                        </div>
                    </div>

                    {/* Chọn phương thức thanh toán */}
                    <div className="mt-4">
                        <label className="block text-gray-700 font-medium mb-2">
                            💰 Chọn Phương Thức Thanh Toán
                        </label>
                        <select
                            className="w-full p-2 border rounded-lg"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="cod">
                                Thanh toán khi nhận hàng (COD)
                            </option>
                            <option value="bank">Chuyển khoản ngân hàng</option>
                            <option value="gateway">
                                Thanh toán qua cổng điện tử
                            </option>
                        </select>
                    </div>

                    {/* Hiển thị tổng tiền */}
                    <div className="mt-6 text-center">
                        <p className="text-lg font-semibold text-gray-700">
                            Tạm tính: {subtotal.toLocaleString()}₫
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                            Giảm giá: -{discount.toLocaleString()}₫
                        </p>
                        <p className="text-xl font-bold mt-2">
                            Tổng tiền: {totalPrice.toLocaleString()}₫
                        </p>
                        <button
                            className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full"
                            disabled={loading}
                            onClick={handlePayment}
                        >
                            {loading
                                ? "⏳ Đang xử lý..."
                                : "✅ Xác nhận & Thanh Toán"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
