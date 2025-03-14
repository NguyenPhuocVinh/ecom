import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { useCart } from "../../hooks/useCart";

const ProductOptionsPopup = ({ productId, onClose }) => {
    const { fetchApi } = useApi();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchApi(`/products/${productId}`)
            .then((data) => setProduct(data.data))
            .catch((error) => console.error("Lỗi lấy sản phẩm:", error));
    }, [productId]);

    const handleVariantChange = (variantCode) => {
        if (!product || !product.attributes) return;

        let foundAttribute = null;
        let foundVariant = null;

        // Tìm attribute và variant tương ứng
        for (const attr of product.attributes) {
            foundVariant = attr.variants.find((v) => v.code === variantCode);
            if (foundVariant) {
                foundAttribute = attr;
                break;
            }
        }

        if (foundAttribute && foundVariant) {
            setSelectedAttribute(foundAttribute);
            setSelectedVariant(foundVariant);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant || !selectedAttribute) {
            alert("Vui lòng chọn biến thể trước khi thêm vào giỏ hàng!");
            return;
        }

        // 🔥 Lấy ảnh ưu tiên theo thứ tự: Variant → Attribute → Product
        const selectedImage =
            selectedVariant.featuredImages[0] ||
            selectedAttribute.featuredImages[0] ||
            product.featuredImages[0];

        await addToCart(
            {
                productId: product.id,
                attribute: selectedAttribute,
                variant: selectedVariant,
                image: selectedImage,
            },
            quantity
        );

        onClose();
    };

    if (!product) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={onClose}
        >
            <div
                className="bg-white p-6 rounded-lg w-96"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold mb-4">{product.name}</h2>

                {/* Chọn biến thể */}
                <div className="mb-4">
                    <label className="font-semibold">Chọn biến thể:</label>
                    <select
                        onChange={(e) => handleVariantChange(e.target.value)}
                        className="w-full border p-2 rounded mt-2"
                    >
                        <option value="">-- Chọn --</option>
                        {product.attributes?.map((attr) =>
                            attr.variants.map((variant) => (
                                <option key={variant.code} value={variant.code}>
                                    {attr.value} ({variant.name || variant.code}
                                    )
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {/* Chọn số lượng */}
                <div className="mb-4">
                    <label className="font-semibold">Số lượng:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1"
                        className="w-full border p-2 rounded mt-2"
                    />
                </div>

                {/* Nút hành động */}
                <div className="flex justify-between">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleAddToCart}
                        className="bg-black text-white px-4 py-2 rounded"
                    >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductOptionsPopup;
