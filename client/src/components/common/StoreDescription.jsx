import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const StoreDescription = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    const description = `
        Chào mừng bạn đến với cửa hàng của chúng tôi! Chúng tôi là điểm đến lý tưởng dành cho những tín đồ mua sắm trực tuyến,
        nơi bạn có thể tìm thấy hàng ngàn sản phẩm chất lượng cao, phù hợp với mọi nhu cầu của mình. Từ thời trang, phụ kiện, 
        đồ gia dụng cho đến các sản phẩm công nghệ hiện đại, chúng tôi mang đến cho bạn sự lựa chọn đa dạng với mức giá cạnh tranh nhất.

        Chúng tôi luôn đặt chất lượng sản phẩm và trải nghiệm khách hàng lên hàng đầu. Mỗi sản phẩm trong cửa hàng đều được 
        lựa chọn cẩn thận từ các thương hiệu uy tín, đảm bảo tính thẩm mỹ, độ bền và sự an toàn khi sử dụng. Đội ngũ của chúng tôi 
        luôn cập nhật những xu hướng mới nhất để mang đến cho khách hàng những sản phẩm thời thượng, tiện ích và hiện đại nhất.

        Không chỉ dừng lại ở chất lượng sản phẩm, chúng tôi còn cung cấp nhiều chương trình ưu đãi hấp dẫn như giảm giá định kỳ, 
        quà tặng đi kèm và chính sách đổi trả linh hoạt. Chúng tôi cam kết mang đến cho bạn trải nghiệm mua sắm trực tuyến thuận tiện nhất,
        với hệ thống giao hàng nhanh chóng và hỗ trợ khách hàng tận tâm 24/7.

        Ngoài ra, khi mua sắm tại cửa hàng của chúng tôi, bạn còn được tận hưởng nhiều chương trình thành viên độc quyền, tích lũy điểm thưởng,
        và nhận các ưu đãi đặc biệt dành riêng cho khách hàng thân thiết. Hãy trở thành một phần của cộng đồng mua sắm thông minh ngay hôm nay!

        Hãy cùng khám phá bộ sưu tập mới nhất của chúng tôi ngay bây giờ và tận hưởng những trải nghiệm mua sắm tuyệt vời nhất!
    `;

    return (
        <section className=" p-8 my-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                🏬 Về Cửa Hàng Chúng Tôi
            </h2>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Ảnh minh họa lớn hơn */}
                <div className="flex gap-6 w-full md:w-1/2">
                    <img
                        src="/images/store-1.webp"
                        alt="Cửa hàng"
                        className="w-1/2 h-48 object-cover rounded-lg shadow-lg"
                    />
                    <img
                        src="/images/store-2.webp"
                        alt="Sản phẩm nổi bật"
                        className="w-1/2 h-48 object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* Nội dung mô tả */}
                <div className="w-full md:w-1/2">
                    <p className="text-gray-700 leading-relaxed text-lg">
                        {isExpanded
                            ? description
                            : `${description.substring(0, 350)}...`}
                    </p>

                    {/* Nút mở rộng / thu gọn */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-4 text-blue-600 flex items-center gap-2 font-medium text-lg"
                    >
                        {isExpanded ? "🔼 Thu gọn" : "🔽 Xem thêm"}
                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default StoreDescription;
