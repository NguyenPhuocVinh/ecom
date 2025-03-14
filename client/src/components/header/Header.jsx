import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useApi } from "../../hooks/useApi";
import { useCart } from "../../hooks/useCart";

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { fetchApi } = useApi();
    const [categories, setCategories] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const parentRef = useRef(null);
    const navigate = useNavigate();
    const { cart } = useCart();
    const [cartCount, setCartCount] = useState(0);

    // Xử lý khi cuộn trang
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Fetch categories khi dropdown mở
    useEffect(() => {
        if (openDropdown && categories.length === 0) {
            fetchApi("/categories")
                .then((data) => {
                    setCategories(
                        data.data.filter((category) => !category.parent)
                    );
                })
                .catch((err) =>
                    console.error("Error fetching categories:", err)
                );
        }
    }, [openDropdown]);

    useEffect(() => {
        const updateCartCount = () => {
            const localCart = JSON.parse(localStorage.getItem("cart")) || [];
            setCartCount(
                localCart.reduce((sum, item) => sum + item.quantity, 0)
            ); // Tính tổng số lượng sản phẩm
        };

        updateCartCount(); // Cập nhật ngay khi component mount
        window.addEventListener("cartUpdated", updateCartCount);

        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    // Xử lý dropdown hover
    const handleMouseEnter = () => setOpenDropdown(true);
    const handleMouseLeave = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.relatedTarget) &&
            parentRef.current &&
            !parentRef.current.contains(event.relatedTarget)
        ) {
            setOpenDropdown(false);
        }
    };

    // Toggle menu trên mobile
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    // Xử lý điều hướng với query params
    const handleCategoryClick = (categoryId) => {
        navigate(`/products?search[category.id:eq]=${categoryId}`);
        setOpenDropdown(false);
    };

    return (
        <header
            className={`fixed left-0 w-full z-50 transition-all duration-300 
        ${isScrolled ? "bg-white shadow-md" : "bg-transparent"}
    `}
            style={{ top: "32px" }} // Đẩy xuống dưới TopHeader
        >
            <div className="container mx-auto px-6 md:px-20 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="text-2xl font-extrabold">
                    <Link to="/">FashionStore</Link>
                </div>

                {/* Nút mở menu trên mobile */}
                <button
                    className="md:hidden text-2xl"
                    onClick={toggleMobileMenu}
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Navigation (Desktop) */}
                <nav className="hidden md:flex space-x-8 items-center font-semibold">
                    {/* Dropdown Categories */}
                    <div
                        className="relative"
                        ref={parentRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <span className="cursor-pointer hover:text-gray-600">
                            Products
                        </span>
                        {openDropdown && (
                            <div
                                className="absolute left-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200"
                                ref={dropdownRef}
                            >
                                {categories.map((parentCategory) => (
                                    <div
                                        key={parentCategory.id}
                                        className="relative"
                                    >
                                        <button
                                            onClick={() =>
                                                handleCategoryClick(
                                                    parentCategory.id
                                                )
                                            }
                                            className="block w-full text-left px-4 py-2 font-semibold text-gray-900 hover:bg-gray-100 transition"
                                        >
                                            {parentCategory.name}
                                        </button>
                                        {parentCategory.children.length > 0 && (
                                            <div className="bg-gray-50 border-l border-gray-200 ml-4">
                                                {parentCategory.children.map(
                                                    (child) => (
                                                        <button
                                                            key={child.id}
                                                            onClick={() =>
                                                                handleCategoryClick(
                                                                    child.id
                                                                )
                                                            }
                                                            className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-200 transition"
                                                        >
                                                            {child.name}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/new-arrivals" className="hover:text-gray-600">
                        New Arrivals
                    </Link>
                    <Link to="/about" className="hover:text-gray-600">
                        About
                    </Link>
                    <Link to="/contact" className="hover:text-gray-600">
                        Contact
                    </Link>
                </nav>

                {/* Icons */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link
                        to="/carts"
                        className="hover:text-gray-600 flex items-center gap-2"
                    >
                        <FaShoppingCart className="text-xl" />
                        <span className="hidden md:inline font-semibold">
                            ({cartCount})
                        </span>
                    </Link>
                    <Link
                        to="/login"
                        className="hover:text-gray-600 flex items-center"
                    >
                        <FaUser className="text-xl" />
                    </Link>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <nav className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg">
                    <ul className="flex flex-col space-y-4 p-6 font-semibold">
                        <li>
                            <Link
                                to="/products"
                                className="hover:text-gray-600"
                                onClick={toggleMobileMenu}
                            >
                                Products
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/new-arrivals"
                                className="hover:text-gray-600"
                                onClick={toggleMobileMenu}
                            >
                                New Arrivals
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/about"
                                className="hover:text-gray-600"
                                onClick={toggleMobileMenu}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                className="hover:text-gray-600"
                                onClick={toggleMobileMenu}
                            >
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cart"
                                className="hover:text-gray-600 flex items-center gap-2"
                                onClick={toggleMobileMenu}
                            >
                                <FaShoppingCart className="text-xl" />
                                <span className="hidden md:inline font-semibold">
                                    ({cartCount})
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/login"
                                className="hover:text-gray-600 flex items-center"
                                onClick={toggleMobileMenu}
                            >
                                <FaUser className="text-xl" />
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
}

export default Header;
