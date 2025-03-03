import { Heart, ShoppingCart } from "lucide-react";

const ProductCard = ({ product }) => {
    return (
        <div className="rounded-2xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl relative flex flex-col justify-between bg-white">
            <div className="relative w-full h-64 overflow-hidden">
                <img
                    src={
                        product.featuredImages[0]?.url ||
                        "/images/placeholder.webp"
                    }
                    alt={product.name}
                    className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                />
                {/* Icon trái tim (Yêu thích) */}
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all">
                    <Heart className="w-5 h-5" />
                </button>
            </div>
            <div className="p-5 text-center flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-all">
                    {product.name}
                </h3>
                <p className="text-red-500 font-bold text-lg">
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(
                        product.attributes[0]?.variants[0]?.price?.rootPrice ||
                            0
                    )}
                </p>
                {/* Nút giỏ hàng */}
                <div className="flex justify-center">
                    <button className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full hover:border-black transition-all">
                        <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-black transition-all" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
