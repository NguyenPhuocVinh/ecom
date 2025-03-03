const ProductFilter = ({
    categories,
    selectedCategory,
    setSelectedCategory,
}) => {
    return (
        <div className="flex gap-4 flex-wrap mb-6">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full border ${
                        selectedCategory === category.id
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
