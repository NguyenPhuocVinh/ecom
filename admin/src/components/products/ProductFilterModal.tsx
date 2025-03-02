import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';
import { Category, SortOption, Store } from '@/lib/enum';

interface ProductFilterModalProps {
    show: boolean;
    initialFilters: { [key: string]: string };
    onClose: () => void;
    onApply: (filters: { [key: string]: string }) => void;
}



const sortOptions: SortOption[] = [
    { value: '', label: 'Mặc định' },
    { value: 'sort[createdAt]=ASC', label: 'Ngày tạo: Cũ → Mới' },
    { value: 'sort[createdAt]=DESC', label: 'Ngày tạo: Mới → Cũ' },
    { value: 'sort[updatedAt]=ASC', label: 'Ngày cập nhật: Cũ → Mới' },
    { value: 'sort[updatedAt]=DESC', label: 'Ngày cập nhật: Mới → Cũ' },
    { value: 'sort[name]=ASC', label: 'Tên: A → Z' },
    { value: 'sort[name]=DESC', label: 'Tên: Z → A' },
];

export default function ProductFilterModal({
    show,
    initialFilters,
    onClose,
    onApply,
}: ProductFilterModalProps) {
    const [localFilters, setLocalFilters] = useState(initialFilters);
    const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);
    const [storeOptions, setStoreOptions] = useState<Store[]>([]);
    const { fetchApi } = useApi();

    // Load danh mục từ API /categories
    useEffect(() => {
        fetchApi<{ data: Category[] }>('/categories')
            .then((res) => {
                setCategoryOptions(res.data || []);
            })
            .catch((err) => console.error('Error fetching categories', err));
    }, [fetchApi]);

    // Load cửa hàng từ API /stores
    useEffect(() => {
        fetchApi<{ data: Store[] }>('/stores')
            .then((res) => {
                setStoreOptions(res.data || []);
            })
            .catch((err) => console.error('Error fetching stores', err));
    }, [fetchApi]);

    if (!show) return null;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setLocalFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleReset = () => {
        setLocalFilters({});
        onApply({});
        onClose();
    };

    console.log(storeOptions);


    return (
        <div className="fixed inset-0 z-50 flex">
            {/* Overlay mờ bên trái */}
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}
            />
            {/* Filter Panel bên phải, full chiều cao */}
            <div className="relative ml-auto bg-white w-80 h-full p-6 overflow-y-auto shadow-xl">
                {/* Nút đóng (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4">Bộ lọc sản phẩm</h2>
                <div className="space-y-4">
                    {/* Lọc theo tên sản phẩm */}
                    <div>
                        <label
                            htmlFor="productName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tên sản phẩm
                        </label>
                        <input
                            id="productName"
                            name="productName"
                            type="text"
                            value={localFilters.productName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                        />
                    </div>
                    {/* Lọc theo danh mục */}
                    <div>
                        <label
                            htmlFor="categoryId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Danh mục
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={localFilters.categoryId || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                        >
                            <option value="">Chọn danh mục</option>
                            {categoryOptions.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Lọc theo cửa hàng */}
                    <div>
                        <label
                            htmlFor="storeId"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Cửa hàng
                        </label>
                        <select
                            id="storeId"
                            name="storeId"
                            value={localFilters.storeId || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                        >
                            <option value="">Chọn cửa hàng</option>
                            {storeOptions.map((store) => (
                                <option key={store.id} value={store.id}>
                                    {store.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Sắp xếp */}
                    <div>
                        <label
                            htmlFor="sort"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Sắp xếp
                        </label>
                        <select
                            id="sort"
                            name="sort"
                            value={localFilters.sort || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button variant="default" onClick={handleApply}>
                        Áp dụng
                    </Button>
                </div>
            </div>
        </div>
    );
}
