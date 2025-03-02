import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Package,
    List,
    Users,
    Store,
    ShoppingCart,
    CreditCard,
    Image,
    FileText,
    LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminSidebarProps {
    isOpen: boolean;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    handleLogout: () => void;
    toggleSidebar: () => void;
}

const menuItems = [
    { name: 'Sản phẩm', icon: Package, route: 'products' },
    { name: 'Danh mục sản phẩm', icon: List, route: 'categories' },
    { name: 'Người dùng', icon: Users, route: 'users' },
    { name: 'Cửa hàng', icon: Store, route: 'stores' },
    { name: 'Đơn hàng', icon: ShoppingCart, route: 'orders' },
    { name: 'Thanh toán', icon: CreditCard, route: 'payments' },
    { name: 'Media', icon: Image, route: 'media' },
    { name: 'Bài viết', icon: FileText, route: 'posts' },
];

export default function AdminSidebar({
    isOpen,
    activeTab,
    setActiveTab,
    handleLogout,
    toggleSidebar,
}: AdminSidebarProps) {
    const navigate = useNavigate();

    const handleClick = (item: typeof menuItems[number]) => {
        setActiveTab(item.name);
        if (item.route) {
            navigate(`/admin/${item.route}`); // Dẫn sang route tuyệt đối
        }
        // Trên mobile, đóng sidebar sau khi chuyển trang
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    return (
        <>
            <aside
                className={cn(
                    'bg-white shadow-lg transition-all duration-300 ease-in-out h-screen fixed top-0 left-0 z-40',
                    isOpen ? 'w-64 translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{isOpen ? 'Admin Panel' : ''}</h2>
                    <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                        ✖
                    </Button>
                </div>
                <nav className="flex-1 p-2 space-y-1">
                    {menuItems.map((item) => (
                        <Button
                            key={item.name}
                            onClick={() => handleClick(item)}
                            variant="ghost"
                            className={cn(
                                'w-full flex items-center px-4 text-left transition h-12',
                                'hover:bg-gray-200 hover:text-black',
                                activeTab === item.name
                                    ? 'bg-gray-100 text-gray-900 font-semibold'
                                    : 'text-gray-700'
                            )}
                        >
                            <item.icon className="w-6 h-6 shrink-0 mr-3" />
                            <span className={cn('flex-1 truncate', !isOpen && 'hidden')}>
                                {item.name}
                            </span>
                        </Button>
                    ))}
                    {/* Đăng xuất */}
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full flex items-center h-12 px-4 text-left text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                    >
                        <LogOut className="w-6 h-6 shrink-0 mr-3" />
                        <span className={cn('flex-1 truncate', !isOpen && 'hidden')}>
                            Đăng xuất
                        </span>
                    </Button>
                </nav>
            </aside>

            {/* Overlay khi mở sidebar trên mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-30 md:hidden z-30"
                    onClick={toggleSidebar}
                />
            )}
        </>
    );
}
