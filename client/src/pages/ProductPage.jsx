import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Thêm useSearchParams
import { useApi } from "../hooks/useApi";
import ProductList from "../components/products/ProductList";
import Pagination from "../components/Pagination";
import ProductFilter from "../components/products/ProductFilter";
import Breadcrumb from "../components/common/Breadcrumb";
import SortDropdown from "../components/common/SortDropdown";
import StoreDescription from "../components/common/StoreDescription";

const ProductPage = () => {
    const { fetchApi } = useApi();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sortField, setSortField] = useState("viewCount");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Lấy danh mục từ URL (ép kiểu về số)
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get("search[category.id:eq]");
    const activeCategory = selectedCategory ? selectedCategory : null;

    // Lấy danh sách categories
    useEffect(() => {
        fetchApi("/categories")
            .then((data) => setCategories(data.data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    // Lấy danh sách sản phẩm theo category, sort và pagination
    useEffect(() => {
        let apiUrl = `/products?page=${currentPage}&sort[${sortField}]=${sortOrder}`;

        if (activeCategory) {
            apiUrl += `&search[category.id:eq]=${activeCategory}`;
        }

        fetchApi(apiUrl)
            .then((data) => {
                setProducts(data.data);
                setTotalPages(data.totalPages);
            })
            .catch((err) => console.error("Error fetching products:", err));
    }, [activeCategory, sortField, sortOrder, currentPage]);

    // Tìm tên danh mục đang chọn
    const selectedCategoryName =
        categories.find((cat) => cat.id === activeCategory)?.name ||
        "All Products";

    // Hàm thay đổi danh mục (cập nhật URL)
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
        <div className="container mx-auto max-w-screen-2xl px-6 py-12 mt-12">
            {/* Banner */}
            <section
                className="relative bg-cover bg-center bg-no-repeat h-96 flex items-center justify-center text-white text-center"
                style={{
                    backgroundImage: "url('/images/get all items banner.png')",
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <h1 className="relative text-5xl font-bold">
                    {selectedCategoryName}
                </h1>
            </section>

            {/* Breadcrumb */}
            <div className="mt-12">
                <Breadcrumb
                    links={[
                        { label: "Home", path: "/" },
                        { label: "Products", path: "/products" },
                        ...(activeCategory
                            ? [{ label: selectedCategoryName }]
                            : []),
                    ]}
                    className="font-bold" // Nếu component hỗ trợ truyền class
                />
            </div>

            {/* Bộ lọc và Sắp xếp
            <div className="flex justify-between items-center mt-6 mb-6">
                <ProductFilter
                    categories={categories}
                    selectedCategory={activeCategory}
                    setSelectedCategory={handleCategoryChange}
                />
                <SortDropdown
                    sortField={sortField}
                    setSortField={setSortField}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
            </div> */}

            {/* Danh sách sản phẩm */}
            <ProductList products={products} />

            {/* Phân trang */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Mô tả cửa hàng */}
            <StoreDescription />
        </div>
    );
};

export default ProductPage;
