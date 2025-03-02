import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'sonner';

interface DashboardProps {
    onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: DashboardProps) {
    const [activeTab, setActiveTab] = useState('Sản phẩm');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        onLogout();
        toast.success('Đã đăng xuất', {
            description: 'Bạn đã đăng xuất thành công.',
        });
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Nút mở sidebar chỉ hiển thị khi sidebar đóng */}
            {!isSidebarOpen && (
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 bg-white shadow-md"
                >
                    <Menu className="w-6 h-6" />
                </Button>
            )}

            {/* Sidebar */}
            <AdminSidebar
                isOpen={isSidebarOpen}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <main
                // Chú ý: ml-64 khi sidebar mở, ml-0 khi sidebar đóng
                className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
            >
                {/* Nơi render các trang con */}
                <Outlet />
            </main>
        </div>
    );
}
