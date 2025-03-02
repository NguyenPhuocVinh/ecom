// src/components/UpdateCategoryModal.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useApi } from '@/hooks/useApi';
import { Category, ParentCategory } from '@/lib/enum';

interface UpdateCategoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (newCategory: {
        name: string;
        shortDescription?: string;
        longDescription?: string;
        cover?: string;
        parentId?: string;
    }) => void;
    initialFilters?: {
        name: string;
        shortDescription?: string;
        longDescription?: string;
        cover?: string; // ID của ảnh
        parentId?: string;
    };
    availableParents: ParentCategory[];
    category: Category;
}

export default function UpdateCategoryModal({
    open,
    onOpenChange,
    onSave,
    initialFilters = { name: '', shortDescription: '', longDescription: '', cover: '', parentId: '' },
    availableParents,
    category,
}: UpdateCategoryModalProps) {
    const [formData, setFormData] = useState(initialFilters);
    const [coverId, setCoverId] = useState<string>(initialFilters.cover || ''); // Lưu ID
    const [coverUrl, setCoverUrl] = useState<string>(category.cover?.url || ''); // Lưu URL để hiển thị
    const [selectedParentId, setSelectedParentId] = useState<string>(initialFilters.parentId || '');
    const { fetchApi } = useApi();

    useEffect(() => {
        if (open) {
            setFormData(initialFilters);
            setCoverId(initialFilters.cover || '');
            setCoverUrl(category.cover?.url || ''); // Lấy URL từ category
            setSelectedParentId(initialFilters.parentId || '');
        }
    }, [open, initialFilters, category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            try {
                const token = localStorage.getItem('accessToken');
                const formDataUpload = new FormData();
                formDataUpload.append('image', file);
                formDataUpload.append('title', file.name);
                const mediaResponse = await fetchApi<{ id: string; url: string }>(
                    '/medias/upload-single',
                    'post',
                    formDataUpload,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (mediaResponse && mediaResponse.id && mediaResponse.url) {
                    setCoverId(mediaResponse.id); // Lưu ID
                    setCoverUrl(mediaResponse.url); // Lưu URL để hiển thị
                } else {
                    console.warn('Upload returned no ID or URL');
                }
            } catch (err) {
                console.error('Error uploading image:', err);
            }
        }
    };

    const handleSave = () => {
        const categoryData = {
            name: formData.name,
            shortDescription: formData.shortDescription,
            longDescription: formData.longDescription,
            cover: coverId || undefined, // Gửi ID lên server
            parentId: selectedParentId || undefined,
        };
        onSave(categoryData);
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div
                className="absolute inset-0 bg-black opacity-50"
                onClick={() => onOpenChange(false)}
            />
            <div className="relative ml-auto bg-white w-2/5 h-full p-6 overflow-y-auto shadow-xl">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4">Chỉnh sửa danh mục</h2>
                <div className="flex space-x-4">
                    <div className="w-3/5 space-y-4">
                        <div>
                            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Tên danh mục
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            />
                        </div>
                        <div>
                            <Label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                                Mô tả ngắn
                            </Label>
                            <textarea
                                id="shortDescription"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            />
                        </div>
                        <div>
                            <Label htmlFor="longDescription" className="block text-sm font-medium text-gray-700">
                                Mô tả chi tiết
                            </Label>
                            <textarea
                                id="longDescription"
                                name="longDescription"
                                value={formData.longDescription}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            />
                        </div>
                        <div>
                            <Label htmlFor="imageFile" className="block text-sm font-medium text-gray-700">
                                Chọn ảnh
                            </Label>
                            <input
                                id="imageFile"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="mt-1 block w-full text-black"
                            />
                            {coverUrl && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-600">Ảnh hiện tại:</p>
                                    <img
                                        src={coverUrl}
                                        alt="Ảnh đã chọn"
                                        className="w-32 h-32 object-cover mt-1 rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-2/5 space-y-4">
                        <div>
                            <Label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
                                Danh mục cha
                            </Label>
                            <select
                                id="parentId"
                                name="parentId"
                                value={selectedParentId}
                                onChange={(e) => setSelectedParentId(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                            >
                                <option value="">-- Không chọn danh mục cha --</option>
                                {availableParents.map((parent) => (
                                    <option key={parent.id} value={parent.id}>
                                        {parent.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button variant="default" onClick={handleSave}>
                        Lưu
                    </Button>
                </div>
            </div>
        </div>
    );
}