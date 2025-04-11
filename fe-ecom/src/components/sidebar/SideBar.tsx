import { ChevronRight, X } from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Sidebar Menu */}
            <div
                className={`fixed top-8 left-0 h-full w-64 bg-black text-white z-[80] transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } shadow-lg border-r border-gray-800`}
            >
                <div className="flex justify-start p-4">
                    <X
                        className="text-white cursor-pointer hover:text-gray-300 transition-colors"
                        size={24}
                        onClick={onClose}
                    />
                </div>
                <nav className="flex flex-col items-end space-y-6 px-6 py-4 text-base uppercase">
                    <a href="/" className="relative group hover:text-gray-300 transition-colors duration-200 px-2 py-1 pr-8">
                        Trang chủ
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gray-300 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    <a href="#" className="relative group hover:text-gray-300 transition-colors duration-200 px-2 py-1 pr-8">
                        Về chúng tôi
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gray-300 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    <a href="#" className="relative group hover:text-gray-300 transition-colors duration-200 px-2 py-1 pr-8">
                        Dịch vụ
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gray-300 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    <a href="#" className="relative group px-2 py-1">
                        <span className="group-hover:text-gray-300 transition-colors duration-200 pr-10">Sản phẩm</span>
                        <ChevronRight className="text-white absolute right-2 top-1/2 transform -translate-y-1/2" size={14} />
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gray-300 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    <a href="#" className="relative group hover:text-gray-300 transition-colors duration-200 px-2 py-1 pr-8">
                        Bộ sưu tập
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gray-300 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    <a href="#" className="relative group hover:text-gray-300 transition-colors duration-200 px-2 py-1 pr-8">
                        Dự án
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gray-300 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    <a href="#" className="relative group hover:text-gray-300 transition-colors duration-200 px-2 py-1 pr-8">
                        Tin tức & sự kiện
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gray-300 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                    <a href="#" className="relative group hover:text-gray-300 transition-colors duration-200 px-2 py-1 pr-8">
                        Khuyến mãi
                        <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gray-300 transition-all duration-200 group-hover:w-full"></span>
                    </a>
                </nav>
            </div>

            {/* Overlay with blur effect */}
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-md z-[75]"
                    onClick={onClose}
                />
            )}
        </>
    );
}