import { Search, CircleUser, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Header() {
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleToggleSearch = () => {
        setIsOpenSearch(!isOpenSearch);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleMouseLeave = () => {
        if (!searchValue) {
            setIsOpenSearch(false);
            setSearchValue("");
        }
    };

    const handleSearchClick = () => {
        if (searchValue) {
            window.location.href = `/search?q=${encodeURIComponent(searchValue)}`;
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                if (searchValue) {
                    setIsOpenSearch(false);
                    setSearchValue("");
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchValue]);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-[background-color,border-color] duration-300 transition-[color] duration-200 transition-[padding] duration-500 ${isScrolled
                ? "bg-white text-black py-4"
                : "bg-transparent text-white border-b border-white py-4"
                }`}
        >
            <div className="container mx-auto px-40 flex items-center justify-between">
                {/* Left Section: Logo */}
                <div className="flex items-start flex-col space-y-1">
                    <img
                        src="/logo-D2D1741150000.webp"
                        alt="logo header"
                        className={`transition-[width,height] duration-500 ${isScrolled ? "w-55 h-10" : "w-60 h-12"
                            }`}
                    />
                </div>

                {/* Center: Navigation */}
                <nav
                    className={`flex uppercase font-medium transition-[font-size,margin] duration-500 transition-[color] duration-200 transition-[background-color,border-color] duration-300 ${isScrolled ? "space-x-12 text-base" : "space-x-14 text-lg"}`}
                >
                    <a href="#" className="relative group transition-[color] duration-200">
                        Giới thiệu
                        <span className={`absolute top-[-8px] left-[-8px] w-3 h-3 border-t-2 border-l-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500`}></span>
                        <span className={`absolute bottom-[-8px] right-[-8px] w-3 h-3 border-b-2 border-r-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500`}></span>
                    </a>
                    <a href="#" className="relative group transition-[color] duration-200">
                        Sản phẩm
                        <span className={`absolute top-[-8px] left-[-8px] w-3 h-3 border-t-2 border-l-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500`}></span>
                        <span className={`absolute bottom-[-8px] right-[-8px] w-3 h-3 border-b-2 border-r-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500`}></span>
                    </a>
                    <a href="#" className="relative group transition-[color] duration-200">
                        Tin tức
                        <span className={`absolute top-[-8px] left-[-8px] w-3 h-3 border-t-2 border-l-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500`}></span>
                        <span className={`absolute bottom-[-8px] right-[-8px] w-3 h-3 border-b-2 border-r-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500`}></span>
                    </a>
                    <a href="#" className="relative group transition-[color] duration-200">
                        Dự án
                        <span className={`absolute top-[-8px] left-[-8px] w-3 h-3 border-t-2 border-l-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500`}></span>
                        <span className={`absolute bottom-[-8px] right-[-8px] w-3 h-3 border-b-2 border-r-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500`}></span>
                    </a>
                    <a href="#" className="relative group transition-[color] duration-200">
                        Liên hệ
                        <span className={`absolute top-[-8px] left-[-8px] w-3 h-3 border-t-2 border-l-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-all duration-500`}></span>
                        <span className={`absolute bottom-[-8px] right-[-8px] w-3 h-3 border-b-2 border-r-2 ${isScrolled ? "border-gray-700" : "border-gray-300"} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:translate-y-1 transition-all duration-500`}></span>
                    </a>
                </nav>


                {/* Right Section: Search + User + Cart */}
                <div className="flex items-center space-x-4">
                    <div className="relative flex items-center" ref={searchRef}>
                        <Search
                            className={`hover:text-gray-300 cursor-pointer transition-[color] duration-200 transition-[width,height] duration-500 ${isScrolled ? "text-black" : "text-white"
                                }`}
                            size={isScrolled ? 20 : 24}
                            onClick={handleToggleSearch}
                        />
                        <div
                            className={`absolute right-0 top-8 w-64 bg-white border border-gray-200 rounded-md shadow-md transition-all duration-300 ease-in-out ${isOpenSearch ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
                                }`}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Bạn cần tìm gì?"
                                    value={searchValue}
                                    onChange={handleInputChange}
                                    className="w-full h-10 pl-4 pr-10 text-sm text-black border-none focus:outline-none rounded-md placeholder-gray-500 focus:placeholder-gray-400"
                                />
                                <div className="absolute bottom-0 left-0 w-[calc(100%-40px)] h-0.5 bg-black focus-within:bg-gray-700 transition-colors"></div>
                                <Search
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    size={18}
                                    onClick={handleSearchClick}
                                />
                            </div>
                        </div>
                    </div>
                    <CircleUser
                        className={`hover:text-gray-300 cursor-pointer transition-[color] duration-200 transition-[width,height] duration-500 ${isScrolled ? "text-black" : "text-white"
                            }`}
                        size={isScrolled ? 20 : 24}
                    />
                    <div className="relative">
                        <ShoppingCart
                            className={`hover:text-gray-300 cursor-pointer transition-[color] duration-200 transition-[width,height] duration-500 ${isScrolled ? "text-black" : "text-white"
                                }`}
                            size={isScrolled ? 20 : 24}
                        />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                            3
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}