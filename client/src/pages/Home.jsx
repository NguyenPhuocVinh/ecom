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
            <div className="min-h-screen flex flex-col">
                {/* Hero Section */}
                <section
                    className="flex-1 flex items-center justify-center text-center bg-cover bg-center bg-no-repeat px-6 relative max-w-full"
                    style={{
                        backgroundImage: "url('/images/hero-section.webp')",
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
                    {["slider1.webp", "slider2.webp", "slider3.webp"].map(
                        (img, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={`/images/${img}`}
                                    alt={`Slide ${index + 1}`}
                                    className="w-full h-full object-cover transition duration-500 hover:scale-105"
                                />
                            </SwiperSlide>
                        )
                    )}
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
            <section className="container mx-auto max-w-screen-2xl px-6 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">
                    Best Sellers
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="border rounded-2xl overflow-hidden shadow-lg group transition-all duration-300 hover:shadow-2xl relative flex flex-col justify-between"
                        >
                            <div className="relative w-full h-64 overflow-hidden">
                                <img
                                    src={
                                        product.featuredImages[0]?.url ||
                                        "/images/placeholder.webp"
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover transform transition-all duration-500 group-hover:scale-110"
                                />
                                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 text-center bg-white flex flex-col gap-3">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-all">
                                    {product.name}
                                </h3>
                                <p className="text-red-500 font-bold text-lg">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(
                                        product.attributes[0]?.variants[0]
                                            ?.price?.rootPrice || 0
                                    )}
                                </p>
                                <div className="flex justify-center">
                                    <button className="w-14 h-14 flex items-center justify-center border border-gray-300 rounded-full hover:border-black transition-all">
                                        <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-black transition-all" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;
