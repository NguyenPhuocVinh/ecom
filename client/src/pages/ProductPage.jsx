import { useState, useEffect } from "react";
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
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortField, setSortField] = useState("viewCount");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchApi("/categories")
            .then((data) => setCategories(data.data))
            .catch((err) => console.error("Error fetching categories:", err));

        fetchApi(
            `/products?page=${currentPage}&sort[${sortField}]=${sortOrder}`
        )
            .then((data) => {
                setProducts(data.data);
                setTotalPages(data.totalPages);
            })
            .catch((err) => console.error("Error fetching products:", err));
    }, [fetchApi, selectedCategory, sortField, sortOrder, currentPage]);

    return (
        <div className="container mx-auto max-w-screen-2xl px-6 py-12">
            {/* Breadcrumb */}
            <div className="mt-12">
                <Breadcrumb
                    links={[
                        { label: "Home", path: "/" },
                        { label: "All Products" },
                    ]}
                />
            </div>

            {/* Banner */}
            <section
                className="relative bg-cover bg-center bg-no-repeat h-96 flex items-center justify-center text-white text-center"
                style={{
                    backgroundImage: "url('/images/get all items banner.png')",
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <h1 className="relative text-5xl font-bold">
                    Shop Our Collection
                </h1>
            </section>

            {/* Bộ lọc và Sắp xếp */}
            <div className="flex justify-between items-center mt-6 mb-6">
                <ProductFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />
                <SortDropdown
                    sortField={sortField}
                    setSortField={setSortField}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                />
            </div>

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
