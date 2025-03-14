import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useApi } from "../hooks/useApi";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";

function Home() {
    const { fetchApi } = useApi();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchApi("/categories?search[category.parent:isnull]=true")
            .then((data) => {
                const filteredCategories = data.data.filter(
                    (category) => category.parent === null
                );
                setCategories(filteredCategories);
            })
            .catch((err) => console.error("Error fetching categories:", err));

        fetchApi("/products?sort[viewCount]=DESC&limit=8")
            .then((data) => setProducts(data.data))
            .catch((err) => console.error("Error fetching products:", err));
    }, [fetchApi]);

    return (
        <div className="overflow-hidden">
            {" "}
            {/* Ngăn chặn thanh trượt ngang */}
            <div className="flex flex-col">
                {/* Hero Section */}
                <section
                    className="relative w-full h-[calc(100vh-112px)] flex items-center justify-center text-center bg-cover bg-no-repeat px-6 mt-[76px] -z-10"
                    style={{
                        backgroundImage: "url('/images/hero-section.webp')",
                        backgroundPosition: "center top 30%",
                    }}
                >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>

                    <div className="relative z-10 container mx-auto max-w-screen-xl text-white p-10">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                            Discover the Latest Fashion Trends
                        </h1>
                        <p className="mt-4 text-lg max-w-lg mx-auto opacity-90">
                            Shop the newest arrivals and upgrade your wardrobe
                            today.
                        </p>
                        <a
                            href="/products"
                            className="mt-6 inline-block bg-white text-black px-6 py-3 rounded-full text-lg 
                hover:bg-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Shop Now
                        </a>
                    </div>
                </section>
            </div>
            {/* Slider Section */}
            <section className="max-w-full py-12 overflow-hidden">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation
                    className="max-w-full h-[500px] md:h-[650px] lg:h-[750px] shadow-lg"
                >
                    {[
                        "https://res.cloudinary.com/ds3gsxqhm/image/upload/v1741066437/ecom/c8t9j8zordcqrhyvianc.webp",
                        "https://res.cloudinary.com/ds3gsxqhm/image/upload/v1741066437/ecom/c8t9j8zordcqrhyvianc.webp",
                        "https://res.cloudinary.com/ds3gsxqhm/image/upload/v1741066437/ecom/c8t9j8zordcqrhyvianc.webp",
                    ].map((img, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={`${img}`}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover transition duration-500 hover:scale-105"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
            {/* Featured Categories */}
            <section className="container mx-auto max-w-screen-2xl px-6 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Featured Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {categories.map((category, index) => (
                        <a
                            key={index}
                            href={`/categories/${category.slug}`}
                            className="group relative block rounded-lg overflow-hidden shadow-md"
                        >
                            <div className="relative w-full h-[200px] overflow-hidden">
                                <img
                                    src={category.cover.url}
                                    alt={category.name}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                                <h3 className="text-white text-2xl font-semibold">
                                    {category.name}
                                </h3>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
            {/* Best Sellers */}
            <section className="bg-gray-100 py-16 rounded-2xl shadow-lg">
                <h2 className="text-4xl font-bold text-center mb-8 uppercase text-gray-800">
                    Best Sellers
                </h2>
                <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl"
                        >
                            {/* Hình ảnh sản phẩm - Đã chỉnh về kích thước đồng nhất */}
                            <div className="relative w-full h-56 flex items-center justify-center bg-gray-200">
                                <img
                                    src={
                                        product.featuredImages[0]?.url ||
                                        "/images/placeholder.webp"
                                    }
                                    alt={product.name}
                                    className="h-48 object-contain transition-transform duration-500 group-hover:scale-105"
                                />
                                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-gray-800 hover:text-white transition-all">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div className="p-5 text-center bg-white flex flex-col justify-between h-[220px]">
                                {/* Tiêu đề & Giá */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-all line-clamp-2 min-h-[55px]">
                                        {product.name}
                                    </h3>
                                    <p className="text-red-500 font-bold text-lg min-h-[30px]">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(
                                            product.attributes[0]?.variants[0]
                                                ?.price?.rootPrice || 0
                                        )}
                                    </p>
                                </div>

                                {/* Nút thêm vào giỏ hàng */}
                                <button className="w-full bg-black text-white font-semibold py-2 rounded-full transition-all hover:bg-gray-800">
                                    <ShoppingCart className="inline-block w-5 h-5 mr-2" />
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nút Xem Thêm */}
                <div className="text-center mt-8">
                    <a
                        href="/products"
                        className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold 
            hover:bg-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                        Xem Thêm
                    </a>
                </div>
            </section>
        </div>
    );
}

export default Home;
