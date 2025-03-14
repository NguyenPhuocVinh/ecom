import { useSearchParams } from "react-router-dom";

const ProductFilter = ({ categories }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category");

    const handleCategoryChange = (categoryId) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId) {
            params.set("category", categoryId);
        } else {
            params.delete("category");
        }
        setSearchParams(params);
    };

    return (
        <div className="flex gap-4 flex-wrap mb-6">
            <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded-full border ${
                    !selectedCategory
                        ? "bg-black text-white"
                        : "bg-gray-200 text-black hover:bg-gray-300"
                } transition`}
            >
                Tất cả
            </button>

            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-full border ${
                        selectedCategory == category.id
                            ? "bg-black text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300"
                    } transition`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default ProductFilter;
