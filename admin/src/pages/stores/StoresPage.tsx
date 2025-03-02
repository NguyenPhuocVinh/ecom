// src/components/StoresPage.tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';
import { CreateStoreDto, Store } from '@/lib/enum';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AddNewStoreModal from '@/components/stores/AddNewStoreModal';
import UpdateStoreModal from '@/components/stores/UpdateStoreModal';
import StoreDetailModal from '@/components/stores/StoreDetailModal';

export default function StoresPage() {
    const { loading, error, fetchApi } = useApi();
    const [currentPage, setCurrentPage] = useState(1);
    const [stores, setStores] = useState<Store[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const navigate = useNavigate();

    const loadStores = (page: number) => {
        return fetchApi(`/stores?page=${page}`)
            .then((res: any) => {
                console.log('Stores:', res);
                setStores(res.data || []);
                setMeta(res.meta);
                return res;
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    };

    useEffect(() => {
        loadStores(currentPage);
    }, [currentPage, fetchApi]);

    if (loading) return <p className="text-center mt-10">Loading stores...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

    const perPage = meta?.perPage || 10;
    const emptyRows = perPage - stores.length;

    const handlePrevPage = () => {
        if (meta && meta.hasPrevPage) {
            setCurrentPage(meta.currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (meta && meta.hasNextPage) {
            setCurrentPage(meta.currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        if (!meta) return null;
        const pages = [];
        for (let i = 1; i <= meta.totalPages; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === meta.currentPage ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(i)}
                    className="mx-1"
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    const handleDeleteStore = (id: number) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = () => {
        if (showDeleteConfirm) {
            const token = localStorage.getItem('accessToken');
            fetchApi(`/stores/${showDeleteConfirm}`, 'delete', undefined, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(() => {
                    toast.success('Xóa cửa hàng thành công');
                    loadStores(currentPage);
                    setShowDeleteConfirm(null);
                })
                .catch((err) => {
                    console.error('Error deleting store:', err);
                    toast.error('Lỗi xóa cửa hàng');
                    setShowDeleteConfirm(null);
                });
        }
    };

    const handleSaveStore = (newStore: CreateStoreDto) => {
        const token = localStorage.getItem('accessToken');
        fetchApi(selectedStore ? `/stores/${selectedStore.id}` : '/stores',
            selectedStore ? 'put' : 'post',
            newStore,
            {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res: any) => {
                toast.success(selectedStore ? 'Cập nhật cửa hàng thành công' : 'Tạo cửa hàng thành công');
                loadStores(currentPage);
                if (selectedStore) {
                    setShowUpdateModal(false);
                    setSelectedStore(null);
                } else {
                    setShowAddModal(false);
                }
            })
            .catch((err) => {
                console.error('Error saving store:', err);
                toast.error('Lỗi khi lưu cửa hàng');
            });
    };

    const handleEditStore = (store: Store) => {
        setSelectedStore(store);
        setShowUpdateModal(true);
    };

    const handleViewStoreDetail = (store: Store) => {
        setSelectedStore(store);
        setShowDetailModal(true);
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Danh sách cửa hàng</h1>
                <Button variant="default" onClick={() => setShowAddModal(true)}>
                    Thêm mới cửa hàng
                </Button>
            </div>
            {stores.length > 0 ? (
                <div>
                    <table className="min-w-full table-fixed border border-gray-300 shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="w-1/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    STT
                                </th>
                                <th className="w-3/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Tên cửa hàng
                                </th>
                                <th className="w-3/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Địa chỉ
                                </th>
                                <th className="w-2/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </th>
                                <th className="w-3/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store: Store, index: number) => (
                                <tr key={store.id} className="h-20 hover:bg-gray-50">
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        {meta ? meta.perPage * (meta.currentPage - 1) + index + 1 : index + 1}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700 truncate" title={store.name}>
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => handleViewStoreDetail(store)}
                                        >
                                            {store.name}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700 truncate" title={store.address}>
                                        {store.address}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        {store.phone}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        <div className="flex justify-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleEditStore(store)}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleDeleteStore(store.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {emptyRows > 0 &&
                                Array.from({ length: emptyRows }).map((_, idx) => (
                                    <tr key={`empty-${idx}`} className="h-20">
                                        <td className="px-4 py-2 border border-gray-300" colSpan={5}></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center py-4">Chưa có cửa hàng nào.</p>
            )}

            <div className="mt-4 flex flex-col md:flex-row items-center justify-center space-x-4">
                <Button variant="outline" onClick={handlePrevPage} disabled={!meta?.hasPrevPage}>
                    Prev
                </Button>
                <div className="my-2 md:my-0">{renderPageNumbers()}</div>
                <Button variant="outline" onClick={handleNextPage} disabled={!meta?.hasNextPage}>
                    Next
                </Button>
            </div>

            {showAddModal && (
                <AddNewStoreModal
                    open={showAddModal}
                    onOpenChange={setShowAddModal}
                    onSave={handleSaveStore}
                />
            )}

            {showUpdateModal && selectedStore && (
                <UpdateStoreModal
                    open={showUpdateModal}
                    onOpenChange={setShowUpdateModal}
                    onSave={handleSaveStore}
                    store={selectedStore}
                    initialFilters={{
                        name: selectedStore.name,
                        address: selectedStore.address,
                        phone: selectedStore.phone,
                        transferPermission: selectedStore.transferPermission,
                        orderPermission: selectedStore.orderPermission,
                        reportPermission: selectedStore.reportPermission,
                        destroyPermission: selectedStore.destroyPermission,
                        addUserPermission: selectedStore.addUserPermission,
                        removeUserPermission: selectedStore.removeUserPermission,
                    }}
                />
            )}

            {showDetailModal && selectedStore && (
                <StoreDetailModal
                    store={selectedStore}
                    onClose={() => setShowDetailModal(false)}
                />
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDeleteConfirm(null)} />
                    <div className="relative bg-white p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">Xác nhận xóa danh mục</h3>
                        <p className="text-gray-700 mb-6">
                            Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <Button className="hover:cursor-pointer" onClick={() => setShowDeleteConfirm(null)}>
                                Hủy
                            </Button>
                            <Button className="hover:cursor-pointer" onClick={confirmDelete}>
                                Xóa
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}