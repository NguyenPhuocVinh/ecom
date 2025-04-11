import { ArrowRight, CircleArrowRight } from "lucide-react";

export default function Home() {
    const categories = [
        {
            title: "Thiết bị bếp",
            image: "./thietbibep-E9E1725871534.webp",
        },
        {
            title: "Thiết bị phòng tắm",
            image: "./thietbibep-E9E1725871534.webp",
        },
        {
            title: "Sản phẩm công nghệ",
            image: "./thietbibep-E9E1725871534.webp",
        },

    ];
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section
                className="relative w-full h-screen bg-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url('/slider-E651741145476.webp')` }}
            ></section>

            <section className="w-full bg-white py-16 px-[12rem]">
                {/* Tiêu đề section */}
                <div className="flex items-center space-x-4 mb-10">
                    <div className="flex-1 h-[1px] bg-gray-900 max-w-[150px]"></div>
                    <h2 className="text-xl font-semibold text-gray-800">Danh mục sản phẩm</h2>
                </div>

                {/* Danh sách categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 px-[10rem]">
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="relative group overflow-hidden shadow-md"
                        >
                            {/* Ảnh có hiệu ứng zoom */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay với gradient + nội dung */}
                            <div className="absolute inset-0 flex flex-col justify-end pb-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                                {/* Tiêu đề */}
                                <div className="w-full flex items-center justify-center mb-4">
                                    <div className="h-[2px] bg-white flex-grow"></div>
                                    <span className="text-white font-medium mx-3 whitespace-nowrap">{item.title}</span>
                                    <div className="h-[2px] bg-white flex-grow"></div>
                                </div>

                                {/* Nút xem thêm */}
                                <div className="flex justify-center group">
                                    <button className="bg-white text-gray-800 font-light py-1 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                                        Xem sản phẩm
                                        <ArrowRight
                                            className="inline-block ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                                            size={22}
                                            strokeWidth={1.2}
                                        />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Thông tin thêm về sản phẩm */}
            <section className="w-full bg-white py-16 px-[12rem]">
                {/* Tiêu đề section */}
                <div className="flex items-center space-x-4 mb-10">
                    <div className="flex-1 h-[1px] bg-gray-900 max-w-[150px]"></div>
                    <h2 className="text-xl font-semibold text-gray-800">Danh mục sản phẩm</h2>
                </div>

                {/* Danh sách categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 px-[10rem]">
                    {categories.map((item, index) => (
                        <div
                            key={index}
                            className="relative group overflow-hidden shadow-md"
                        >
                            {/* Ảnh có hiệu ứng zoom */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay với gradient + nội dung */}
                            <div className="absolute inset-0 flex flex-col justify-end pb-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                                {/* Tiêu đề */}
                                <div className="w-full flex items-center justify-center mb-4">
                                    <div className="h-[2px] bg-white flex-grow"></div>
                                    <span className="text-white font-medium mx-3 whitespace-nowrap">{item.title}</span>
                                    <div className="h-[2px] bg-white flex-grow"></div>
                                </div>

                                {/* Nút xem thêm */}
                                <div className="flex justify-center group">
                                    <button className="bg-white text-gray-800 font-light py-1 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center">
                                        Xem sản phẩm
                                        <ArrowRight
                                            className="inline-block ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                                            size={22}
                                            strokeWidth={1.2}
                                        />
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