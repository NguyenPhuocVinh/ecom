const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center mt-8 gap-2">
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    onClick={() => onPageChange(index + 1)}
                    className={`px-4 py-2 rounded ${
                        currentPage === index + 1
                            ? "bg-black text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300"
                    }`}
                >
                    {index + 1}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
