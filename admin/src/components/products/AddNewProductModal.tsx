// src/components/products/AddNewProductModal.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useApi } from '@/hooks/useApi';
import { AttributeDto, CreateProductDto, Store, VariantDto } from '@/lib/enum';

interface AddNewProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (newProduct: CreateProductDto) => void;
}

interface Category {
    id: string;
    name: string;
}

// Predefined options for attributes and variants
const attributeOptions = [
    { type: 'size', label: 'Kích thước', values: ['S', 'M', 'L', 'XL', 'XXL'] },
    { type: 'color', label: 'Màu sắc', values: ['Red', 'Blue', 'Green', 'Black', 'White'] },
];

export default function AddNewProductModal({ open, onOpenChange, onSave }: AddNewProductModalProps) {
    const { fetchApi } = useApi();
    const [formData, setFormData] = useState<CreateProductDto>({
        name: '',
        categoryId: '',
        longDescription: '',
        shortDescription: '',
        featuredImages: [],
        stores: [],
        attributes: []
    });
    const [stores, setStores] = useState<string[]>([]);
    const [attributes, setAttributes] = useState<AttributeDto[]>([]);
    const [availableStores, setAvailableStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (open) {
            fetchApi('/categories')
                .then((res: any) => setCategories(res.data || []))
                .catch((err) => console.error('Error fetching categories:', err));

            fetchApi('/stores')
                .then((res: any) => setAvailableStores(res.data || []))
                .catch((err) => console.error('Error fetching stores:', err));
        }
    }, [open, fetchApi]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStoreChange = (storeId: string) => (checked: boolean) => {
        setStores((prev) =>
            checked ? [...prev, storeId] : prev.filter((id) => id !== storeId)
        );
    };

    const handleImageUpload = async (files: File[], target: 'product' | 'attribute' | 'variant', attrIndex?: number, variantIndex?: number) => {
        const formData = new FormData();
        files.forEach(file => formData.append('image', file));
        formData.append('title', "My Upload Title");

        const token = localStorage.getItem('accessToken');

        try {
            const response = await fetchApi('/medias/upload-multiple', 'post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }) as any;

            const imageIds = response.map((media: any) => media.id);

            if (target === 'product') {
                const fileName = files[0].name.split('.').slice(0, -1).join('.'); // Remove extension
                setFormData(prev => ({
                    ...prev,
                    name: prev.name || fileName, // Only set if name is empty and only for product
                    featuredImages: [...(prev.featuredImages || []), ...imageIds]
                }));
            } else if (target === 'attribute' && attrIndex !== undefined) {
                setAttributes(prev => {
                    const newAttributes = [...prev];
                    newAttributes[attrIndex] = {
                        ...newAttributes[attrIndex],
                        featuredImages: [...(newAttributes[attrIndex].featuredImages || []), ...imageIds]
                    };
                    return newAttributes;
                });
            } else if (target === 'variant' && attrIndex !== undefined && variantIndex !== undefined) {
                setAttributes(prev => {
                    const newAttributes = [...prev];
                    newAttributes[attrIndex].variants[variantIndex] = {
                        ...newAttributes[attrIndex].variants[variantIndex],
                        featuredImages: [...(newAttributes[attrIndex].variants[variantIndex].featuredImages || []), ...imageIds]
                    };
                    return newAttributes;
                });
            }

            return imageIds;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    const addAttribute = () => {
        setAttributes((prev) => [...prev, {
            code: `${prev.length + 1}`,
            key: '',
            value: '',
            variants: []
        }]);
    };

    const removeAttribute = (index: number) => {
        setAttributes((prev) => {
            const newAttributes = prev.filter((_, i) => i !== index);
            return newAttributes.map((attr, idx) => ({
                ...attr,
                code: `${idx + 1}`
            }));
        });
    };

    const handleAttributeTypeSelection = (index: number, type: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[index] = {
                ...newAttributes[index],
                key: type,
                value: ''
            };
            return newAttributes;
        });
    };

    const handleAttributeValueSelection = (index: number, value: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[index] = {
                ...newAttributes[index],
                value
            };
            return newAttributes;
        });
    };

    const addVariant = (attrIndex: number) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            const variantCount = newAttributes[attrIndex].variants.length;
            newAttributes[attrIndex].variants = [
                ...newAttributes[attrIndex].variants,
                {
                    code: `${variantCount + 1}`,
                    key: '',
                    value: '',
                    price: 0,
                    quantity: 0
                }
            ];
            return newAttributes;
        });
    };

    const removeVariant = (attrIndex: number, variantIndex: number) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[attrIndex].variants = newAttributes[attrIndex].variants
                .filter((_, i) => i !== variantIndex)
                .map((variant, idx) => ({
                    ...variant,
                    code: `${idx + 1}`
                }));
            return newAttributes;
        });
    };

    const handleVariantTypeSelection = (attrIndex: number, variantIndex: number, type: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[attrIndex].variants[variantIndex] = {
                ...newAttributes[attrIndex].variants[variantIndex],
                key: type,
                value: ''
            };
            return newAttributes;
        });
    };

    const handleVariantValueSelection = (attrIndex: number, variantIndex: number, value: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[attrIndex].variants[variantIndex] = {
                ...newAttributes[attrIndex].variants[variantIndex],
                value
            };
            return newAttributes;
        });
    };

    const handleVariantChange = (attrIndex: number, variantIndex: number, field: keyof VariantDto, value: string | number) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[attrIndex].variants[variantIndex] = {
                ...newAttributes[attrIndex].variants[variantIndex],
                [field]: value
            };
            return newAttributes;
        });
    };

    const handleSave = () => {
        const newProduct: CreateProductDto = {
            ...formData,
            stores,
            attributes,
        };
        onSave(newProduct);
        onOpenChange(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => onOpenChange(false)} />
            <div className="relative ml-auto bg-white w-2/5 h-full p-6 overflow-y-auto shadow-xl">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-6">Thêm mới sản phẩm</h2>
                <div className="space-y-6">
                    {/* Basic Product Info */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên sản phẩm</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Danh mục</Label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">Mô tả ngắn</Label>
                        <Input id="shortDescription" name="shortDescription" value={formData.shortDescription} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Mô tả chi tiết</Label>
                        <textarea
                            id="longDescription"
                            name="longDescription"
                            value={formData.longDescription}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                        />
                    </div>

                    {/* Product Images */}
                    <div className="space-y-2">
                        <Label>Hình ảnh sản phẩm</Label>
                        <Input
                            type="file"
                            multiple
                            onChange={(e) => e.target.files && handleImageUpload(Array.from(e.target.files), 'product')}
                            className="mt-1"
                        />
                        {formData.featuredImages?.map((id, index) => (
                            <div key={index} className="mt-1">Image ID: {id}</div>
                        ))}
                    </div>

                    {/* Stores */}
                    <div className="space-y-2">
                        <Label>Cửa hàng</Label>
                        <div className="space-y-2 mt-2">
                            {availableStores.map((store) => (
                                <div key={store.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`store-${store.id}`}
                                        checked={stores.includes(store.id.toString())}
                                        onCheckedChange={handleStoreChange(store.id.toString())}
                                    />
                                    <Label htmlFor={`store-${store.id}`}>{store.name}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attributes and Variants */}
                    <div className="space-y-4">
                        <Label>Thuộc tính</Label>
                        {attributes.map((attr, attrIndex) => {
                            const selectedAttrOptions = attributeOptions.find(opt => opt.type === attr.key);
                            return (
                                <div key={attrIndex} className="space-y-4 mt-4 border p-4 rounded">
                                    <div className="space-y-2">
                                        <Label>Loại thuộc tính</Label>
                                        <select
                                            value={attr.key}
                                            onChange={(e) => handleAttributeTypeSelection(attrIndex, e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                                        >
                                            <option value="">Chọn loại thuộc tính</option>
                                            {attributeOptions.map((option) => (
                                                <option key={option.type} value={option.type}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {attr.key && (
                                        <div className="space-y-2">
                                            <Label>Giá trị thuộc tính</Label>
                                            <select
                                                value={attr.value}
                                                onChange={(e) => handleAttributeValueSelection(attrIndex, e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                                            >
                                                <option value="">Chọn giá trị</option>
                                                {selectedAttrOptions?.values.map((value) => (
                                                    <option key={value} value={value}>
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label>Hình ảnh thuộc tính</Label>
                                        <Input
                                            type="file"
                                            multiple
                                            onChange={(e) => e.target.files && handleImageUpload(Array.from(e.target.files), 'attribute', attrIndex)}
                                        />
                                        {attr.featuredImages?.map((id, index) => (
                                            <div key={index} className="mt-1">Image ID: {id}</div>
                                        ))}
                                    </div>

                                    {/* Variants */}
                                    <div className="space-y-2">
                                        <Label>Biến thể</Label>
                                        {attr.variants.map((variant, variantIndex) => {
                                            const selectedVariantOptions = attributeOptions.find(opt => opt.type === variant.key);
                                            return (
                                                <div key={variantIndex} className="space-y-2 mt-2 border p-4 rounded">
                                                    <div className="space-y-2">
                                                        <Label>Loại biến thể</Label>
                                                        <select
                                                            value={variant.key}
                                                            onChange={(e) => handleVariantTypeSelection(attrIndex, variantIndex, e.target.value)}
                                                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                                                        >
                                                            <option value="">Chọn loại biến thể</option>
                                                            {attributeOptions
                                                                .filter(opt => opt.type !== attr.key)
                                                                .map((option) => (
                                                                    <option key={option.type} value={option.type}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                        </select>
                                                    </div>
                                                    {variant.key && (
                                                        <div className="space-y-2">
                                                            <Label>Giá trị biến thể</Label>
                                                            <select
                                                                value={variant.value}
                                                                onChange={(e) => handleVariantValueSelection(attrIndex, variantIndex, e.target.value)}
                                                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                                                            >
                                                                <option value="">Chọn giá trị</option>
                                                                {selectedVariantOptions?.values.map((value) => (
                                                                    <option key={value} value={value}>
                                                                        {value}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                    <div className="space-y-2">
                                                        <Input
                                                            type="number"
                                                            placeholder="Giá"
                                                            value={variant.price}
                                                            onChange={(e) => handleVariantChange(attrIndex, variantIndex, 'price', parseFloat(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Input
                                                            type="number"
                                                            placeholder="Số lượng"
                                                            value={variant.quantity || ''}
                                                            onChange={(e) => handleVariantChange(attrIndex, variantIndex, 'quantity', parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Hình ảnh biến thể</Label>
                                                        <Input
                                                            type="file"
                                                            multiple
                                                            onChange={(e) => e.target.files && handleImageUpload(Array.from(e.target.files), 'variant', attrIndex, variantIndex)}
                                                        />
                                                        {variant.featuredImages?.map((id, index) => (
                                                            <div key={index} className="mt-1">Image ID: {id}</div>
                                                        ))}
                                                    </div>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={() => removeVariant(attrIndex, variantIndex)}
                                                    >
                                                        Xóa biến thể
                                                    </Button>
                                                </div>
                                            );
                                        })}
                                        <Button
                                            variant="outline"
                                            onClick={() => addVariant(attrIndex)}
                                            className="mt-2"
                                        >
                                            Thêm biến thể
                                        </Button>
                                    </div>

                                    <Button
                                        variant="destructive"
                                        onClick={() => removeAttribute(attrIndex)}
                                    >
                                        Xóa thuộc tính
                                    </Button>
                                </div>
                            );
                        })}
                        <Button
                            variant="outline"
                            onClick={addAttribute}
                            className="mt-4"
                        >
                            Thêm thuộc tính
                        </Button>
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