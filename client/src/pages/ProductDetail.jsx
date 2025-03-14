import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import Breadcrumb from "../components/common/Breadcrumb";

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { fetchApi } = useApi();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetchApi(`/products/${productId}`)
            .then((data) => setProduct(data.data))
            .catch((err) =>
                console.error("Error fetching product details:", err)
            );
    }, [productId]);

    if (!product) return <p className="text-center py-20">Loading...</p>;

    return (
        <div className="container mx-auto max-w-screen-lg px-6 py-12">
            <Breadcrumb
                links={[{ label: "Home", path: "/" }, { label: product.name }]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Hình ảnh sản phẩm */}
                <div>
                    <img
                        src={product.featuredImages?.[0]?.secure_url}
                        alt={product.name}
                        className="w-full h-auto rounded-lg"
                    />
                </div>

                {/* Thông tin sản phẩm */}
                <div>
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-gray-500 mt-2">
                        {product.shortDescription}
                    </p>
                    <p className="text-xl font-semibold mt-4">
                        {product.price?.rootPrice?.toLocaleString()} VND
                    </p>

                    {/* Chọn size */}
                    <div className="mt-6">
                        <h3 className="font-semibold">Size</h3>
                        <div className="flex gap-3 mt-2">
                            {product.attributes?.map((attr) => (
                                <button
                                    key={attr.id}
                                    className="border px-4 py-2 rounded hover:bg-gray-100"
                                >
                                    {attr.value}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Số lượng trong kho */}
                    <p className="mt-4 text-gray-600">
                        Số lượng có sẵn:{" "}
                        {
                            product.attributes?.[0]?.variants?.[0]
                                ?.inventories?.[0]?.quantity
                        }
                    </p>

                    {/* Nút mua hàng */}
                    <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
