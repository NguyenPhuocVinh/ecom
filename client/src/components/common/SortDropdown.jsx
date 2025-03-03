import { ArrowDownAZ } from "lucide-react";
import { useState } from "react";

const sortOptions = [
    { label: "Featured", field: "viewCount", order: "DESC" }, // Mặc định
    { label: "Price (Low to High)", field: "price", order: "ASC" },
    { label: "Price (High to Low)", field: "price", order: "DESC" },
    { label: "Name (A-Z)", field: "name", order: "ASC" },
    { label: "Name (Z-A)", field: "name", order: "DESC" },
    { label: "Newest (Oldest First)", field: "createdAt", order: "ASC" },
    { label: "Newest (Newest First)", field: "createdAt", order: "DESC" },
];

const SortDropdown = ({ sortField, setSortField, sortOrder, setSortOrder }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSortChange = (field, order) => {
        setSortField(field);
        setSortOrder(order);
        setIsOpen(false);
    };

    const selectedOption = sortOptions.find(
        (option) => option.field === sortField && option.order === sortOrder
    );

    return (
        <div className="relative w-52">
            {/* Nút dropdown */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center w-full border px-4 py-2 bg-white shadow-md hover:shadow-lg transition-all"
            >
                <div className="text-gray-700 font-medium">
                    {selectedOption?.label}
                </div>
                <ArrowDownAZ className="ml-auto text-gray-500" />
            </button>

            {/* Danh sách dropdown */}
            {isOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-white shadow-xl border py-2 z-20 transition-all">
                    {sortOptions.map((option) => (
                        <li
                            key={`${option.field}:${option.order}`}
                            onClick={() =>
                                handleSortChange(option.field, option.order)
                            }
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-all"
                        >
                            <span className="text-gray-800">
                                {option.label}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SortDropdown;
