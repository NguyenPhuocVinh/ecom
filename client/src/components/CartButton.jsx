import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import ProductOptionsPopup from "./products/ProductOptionsPopup";

const CartButton = ({ product }) => {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            <button
                className="w-full bg-black text-white font-semibold py-2 rounded-full transition-all hover:bg-gray-800 mt-2 flex items-center justify-center"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowPopup(true);
                }}
            >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Thêm vào giỏ hàng
            </button>
            {showPopup && (
                <ProductOptionsPopup
                    productId={product.id}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
};

export default CartButton;
