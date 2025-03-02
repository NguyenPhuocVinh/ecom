// src/components/CategoriesPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import AddNewCategoryModal from '@/components/categories/AddNewCategoryModal';
import CategoryDetailModal from '@/components/categories/CategoryDetailModal';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/lib/enum';
import { toast } from 'sonner';
import UpdateCategoryModal from '@/components/categories/UpdateCategoryModal';

export default function CategoriesPage() {
    const { loading, error, fetchApi } = useApi();
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    const loadCategories = (page: number) => {
        return fetchApi(`/categories?page=${page}`)
            .then((res: any) => {
                console.log('Categories:', res);
                setCategories(res.data || []);
                setMeta(res.meta);
                return res;
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    };

    useEffect(() => {
        loadCategories(currentPage);
    }, [currentPage, fetchApi]);

    const availableParents = useMemo(
        () => categories.map((cat) => ({ id: cat.id, name: cat.name })),
        [categories]
    );

    if (loading) return <p className="text-center mt-10">Loading categories...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

    const perPage = meta?.perPage || 10;
    const emptyRows = perPage - categories.length;

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

    const handleDeleteCategory = (id: string) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = () => {
        if (showDeleteConfirm) {
            const token = localStorage.getItem('accessToken');
            fetchApi(`/categories/${showDeleteConfirm}`, 'delete', undefined, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(() => {
                    toast.success('Xóa danh mục thành công');
                    loadCategories(currentPage);
                    setShowDeleteConfirm(null);
                })
                .catch((err) => {
                    console.error('Error deleting category:', err);
                    toast.error('Lỗi xóa danh mục');
                    setShowDeleteConfirm(null);
                });
        }
    };

    const handleSaveCategory = (newCategory: {
        name: string;
        shortDescription?: string;
        longDescription?: string;
        cover?: string;
        parentId?: string;
    }) => {
        const token = localStorage.getItem('accessToken');
        fetchApi(selectedCategory ? `/categories/${selectedCategory.id}` : '/categories',
            selectedCategory ? 'put' : 'post',
            newCategory,
            {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res: any) => {
                console.log('Category saved:', res);
                toast.success(selectedCategory ? 'Cập nhật danh mục thành công' : 'Tạo danh mục thành công');
                loadCategories(currentPage);
                if (selectedCategory) {
                    setShowUpdateModal(false); // Đóng modal cập nhật nếu đang chỉnh sửa
                    setSelectedCategory(null);
                } else {
                    setShowAddModal(false); // Đóng modal thêm mới nếu tạo mới
                }
            })
            .catch((err) => {
                console.error('Error saving category:', err);
                toast.error('Lỗi khi lưu danh mục');
            });
    };

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setSelectedCategoryId(category.id);
        setShowUpdateModal(true);
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Danh mục sản phẩm</h1>
                <Button variant="default" onClick={() => setShowAddModal(true)}>
                    Thêm mới danh mục
                </Button>
            </div>
            {categories.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-fixed border border-gray-300 shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="w-1/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    STT
                                </th>
                                <th className="w-3/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Tên danh mục
                                </th>
                                <th className="w-4/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Mô tả ngắn
                                </th>
                                <th className="w-4/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Hình ảnh
                                </th>
                                <th className="w-3/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category: Category, index: number) => (
                                <tr key={category.id} className="h-20 hover:bg-gray-50">
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        {meta ? meta.perPage * (meta.currentPage - 1) + index + 1 : index + 1}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700 overflow-hidden truncate">
                                        <button
                                            className="text-blue-600 hover:underline"
                                            onClick={() => setSelectedCategoryId(category.id)}
                                        >
                                            {category.name}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700 overflow-hidden truncate">
                                        {category.shortDescription || ''}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        {category.cover ? (
                                            <img
                                                src={category.cover.url}
                                                alt={category.cover.alt || 'Hình ảnh'}
                                                className="w-16 h-16 object-cover mx-auto"
                                            />
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        <div className="flex justify-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleEditCategory(category)}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleDeleteCategory(category.id)}
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
                <p className="text-center py-4">Chưa có danh mục sản phẩm.</p>
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
                <AddNewCategoryModal
                    open={showAddModal}
                    onOpenChange={setShowAddModal}
                    onSave={handleSaveCategory}
                    availableParents={availableParents}
                />
            )}

            {selectedCategoryId && (
                <CategoryDetailModal
                    categoryId={selectedCategoryId}
                    onClose={() => setSelectedCategoryId(null)}
                />
            )}

            {showUpdateModal && selectedCategory && (
                <UpdateCategoryModal
                    open={showUpdateModal}
                    onOpenChange={setShowUpdateModal}
                    onSave={handleSaveCategory}
                    availableParents={availableParents}
                    category={selectedCategory}
                    initialFilters={{
                        name: selectedCategory.name,
                        shortDescription: selectedCategory.shortDescription || '',
                        longDescription: selectedCategory.longDescription || '',
                        cover: selectedCategory.cover?.id || '',
                        parentId: selectedCategory.parent?.id || '',
                    }}
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