// src/components/CategoryDetailModal.tsx
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Category } from '@/lib/enum';


interface CategoryDetailModalProps {
    categoryId: string | null;
    onClose: () => void;
}

export default function CategoryDetailModal({ categoryId, onClose }: CategoryDetailModalProps) {
    const { loading, error, fetchApi } = useApi();
    const [category, setCategory] = useState<Category | null>(null);

    useEffect(() => {
        if (categoryId) {
            fetchApi<{ data: Category }>(`/categories/${categoryId}`)
                .then((res) => setCategory(res.data))
                .catch((err) => console.error(err));
        }
    }, [categoryId, fetchApi]);

    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Overlay mờ */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            {/* Panel chi tiết bên phải, responsive */}
            <div className="relative ml-auto bg-white w-full md:w-2/5 h-full p-8 overflow-y-auto shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold"
                >
                    &times;
                </button>
                {loading && <p className="text-center text-lg">Đang tải thông tin danh mục...</p>}
                {error && <p className="text-center text-red-500">Lỗi: {error}</p>}
                {!loading && !error && category && (
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-800 border-b pb-2">
                            {category.name}
                        </h2>
                        {category.cover ? (
                            <img
                                src={category.cover.url}
                                alt={category.cover.alt || category.name}
                                className="w-full h-72 object-cover rounded-lg shadow-md"
                            />
                        ) : (
                            <div className="w-full h-72 bg-gray-200 flex items-center justify-center rounded-lg">
                                <span className="text-gray-500">Không có hình ảnh</span>
                            </div>
                        )}
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-700">Mô tả ngắn</h3>
                            <p className="mt-1 text-gray-600">
                                {category.shortDescription || 'Không có mô tả ngắn'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-700">Mô tả chi tiết</h3>
                            <p className="mt-1 text-gray-600">
                                {category.longDescription || 'Không có mô tả chi tiết'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold text-gray-700">Danh mục cha</h3>
                            <p className="mt-1 text-gray-600">
                                {category.parent ? category.parent.name : 'Không có danh mục cha'}
                            </p>
                        </div>
                        {category.createdBy && (
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-700">Người tạo</h3>
                                <p className="mt-1 text-gray-600">
                                    {category.createdBy.firstName} {category.createdBy.lastName}{' '}
                                    <span className="italic">({category.createdBy.email})</span>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

