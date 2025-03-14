import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartButton from "../CartButton";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    return (
        <div
            className="rounded-2xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl relative flex flex-col justify-between bg-white cursor-pointer"
            onClick={() => navigate(`/products/${product.id}`)}
        >
            <div className="relative w-full h-56 flex items-center justify-center bg-gray-100">
                <img
                    src={
                        product.featuredImages[0]?.url ||
                        "/images/placeholder.webp"
                    }
                    alt={product.name}
                    className="h-48 object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <button
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            <div className="p-5 text-center flex flex-col justify-between h-[250px]">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-all line-clamp-2 h-[55px]">
                        {product.name}
                    </h3>
                    <p className="text-red-500 font-bold text-lg h-[30px] flex items-center justify-center">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(
                            product.attributes[0]?.variants[0]?.price
                                ?.rootPrice || 0
                        )}
                    </p>
                </div>

                {/* Sử dụng component CartButton */}
                <CartButton product={product} />
            </div>
        </div>
    );
};

export default ProductCard;
