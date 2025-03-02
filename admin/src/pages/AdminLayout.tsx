import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [activeTab, setActiveTab] = useState('Sản phẩm');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                handleLogout={() => { }}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Content */}
            <main
                className={`flex-1 p-6 overflow-y-auto transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'
                    }`}
            >
                {children}
            </main>
        </div>
    );
}
