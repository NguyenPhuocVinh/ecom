// src/components/products/UpdateProductModal.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useApi } from '@/hooks/useApi';
import { AttributeDto, Category, CreateProductDto, Store, VariantDto } from '@/lib/enum';

interface UpdateProductModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (updatedProduct: CreateProductDto) => void;
    product: CreateProductDto;
}

const attributeOptions = [
    { type: 'size', label: 'Kích thước', values: ['S', 'M', 'L', 'XL', 'XXL'] },
    { type: 'color', label: 'Màu sắc', values: ['Red', 'Blue', 'Green', 'Black', 'White'] },
];

export default function UpdateProductModal({ open, onOpenChange, onUpdate, product }: UpdateProductModalProps) {
    const { fetchApi } = useApi();
    const [formData, setFormData] = useState<CreateProductDto>({
        name: '',
        categoryId: '',
        longDescription: '',
        shortDescription: '',
        featuredImages: [],
        stores: [],
        attributes: [],
    });
    const [stores, setStores] = useState<string[]>([]);
    const [attributes, setAttributes] = useState<AttributeDto[]>([]);
    const [availableStores, setAvailableStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('UpdateProductModal opened with product:', product);
        if (open) {
            try {
                setFormData({
                    name: product.name || '',
                    categoryId: product.categoryId || '',
                    longDescription: product.longDescription || '',
                    shortDescription: product.shortDescription || '',
                    featuredImages: Array.isArray(product.featuredImages) ? product.featuredImages : [],
                    stores: Array.isArray(product.stores) ? product.stores : [],
                    attributes: Array.isArray(product.attributes) ? product.attributes : [],
                });
                setStores(Array.isArray(product.stores) ? product.stores : []);
                setAttributes(Array.isArray(product.attributes) ? product.attributes : []);
                setError(null);

                fetchApi('/categories')
                    .then((res: any) => {
                        console.log('Categories fetched:', res.data);
                        setCategories(Array.isArray(res.data) ? res.data : []);
                    })
                    .catch((err) => console.error('Error fetching categories:', err));

                fetchApi('/stores')
                    .then((res: any) => {
                        console.log('Stores fetched:', res.data);
                        setAvailableStores(Array.isArray(res.data) ? res.data : []);
                    })
                    .catch((err) => console.error('Error fetching stores:', err));
            } catch (err) {
                console.error('Error initializing form data:', err);
                setError('Không thể tải dữ liệu sản phẩm');
            }
        }
    }, [open, product, fetchApi]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStoreChange = (storeId: string) => (checked: boolean) => {
        setStores((prev) => (checked ? [...prev, storeId] : prev.filter((id) => id !== storeId)));
    };

    const handleImageUpload = async (
        files: File[],
        target: 'product' | 'attribute' | 'variant',
        attrIndex?: number,
        variantIndex?: number
    ) => {
        const uploadData = new FormData();
        files.forEach((file) => uploadData.append('image', file));
        uploadData.append('title', 'My Upload Title');

        const token = localStorage.getItem('accessToken');

        try {
            const response = (await fetchApi('/medias/upload-multiple', 'post', uploadData, {
                headers: { Authorization: `Bearer ${token}` },
            })) as any;

            const imageIds = Array.isArray(response) ? response.map((media: any) => media.id) : [];

            if (target === 'product') {
                setFormData((prev) => ({
                    ...prev,
                    featuredImages: [...(prev.featuredImages || []), ...imageIds],
                }));
            } else if (target === 'attribute' && attrIndex !== undefined) {
                setAttributes((prev) => {
                    const newAttributes = [...prev];
                    newAttributes[attrIndex] = {
                        ...newAttributes[attrIndex],
                        featuredImages: [...(newAttributes[attrIndex].featuredImages || []), ...imageIds],
                    };
                    return newAttributes;
                });
            } else if (target === 'variant' && attrIndex !== undefined && variantIndex !== undefined) {
                setAttributes((prev) => {
                    const newAttributes = [...prev];
                    newAttributes[attrIndex].variants[variantIndex] = {
                        ...newAttributes[attrIndex].variants[variantIndex],
                        featuredImages: [
                            ...(newAttributes[attrIndex].variants[variantIndex].featuredImages || []),
                            ...imageIds,
                        ],
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
        setAttributes((prev) => [
            ...prev,
            { code: `${prev.length + 1}`, key: '', value: '', variants: [] },
        ]);
    };

    const removeAttribute = (index: number) => {
        setAttributes((prev) =>
            prev.filter((_, i) => i !== index).map((attr, idx) => ({ ...attr, code: `${idx + 1}` }))
        );
    };

    const handleAttributeTypeSelection = (index: number, type: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[index] = { ...newAttributes[index], key: type, value: '' };
            return newAttributes;
        });
    };

    const handleAttributeValueSelection = (index: number, value: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[index] = { ...newAttributes[index], value };
            return newAttributes;
        });
    };

    const addVariant = (attrIndex: number) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            const variantCount = newAttributes[attrIndex].variants.length;
            newAttributes[attrIndex].variants = [
                ...newAttributes[attrIndex].variants,
                { code: `${variantCount + 1}`, key: '', value: '', price: 0, quantity: 0 },
            ];
            return newAttributes;
        });
    };

    const removeVariant = (attrIndex: number, variantIndex: number) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[attrIndex].variants = newAttributes[attrIndex].variants
                .filter((_, i) => i !== variantIndex)
                .map((variant, idx) => ({ ...variant, code: `${idx + 1}` }));
            return newAttributes;
        });
    };

    const handleVariantTypeSelection = (attrIndex: number, variantIndex: number, type: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[attrIndex].variants[variantIndex] = {
                ...newAttributes[attrIndex].variants[variantIndex],
                key: type,
                value: '',
            };
            return newAttributes;
        });
    };

    const handleVariantValueSelection = (attrIndex: number, variantIndex: number, value: string) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[attrIndex].variants[variantIndex] = {
                ...newAttributes[attrIndex].variants[variantIndex],
                value,
            };
            return newAttributes;
        });
    };

    const handleVariantChange = (
        attrIndex: number,
        variantIndex: number,
        field: keyof VariantDto,
        value: string | number
    ) => {
        setAttributes((prev) => {
            const newAttributes = [...prev];
            newAttributes[attrIndex].variants[variantIndex] = {
                ...newAttributes[attrIndex].variants[variantIndex],
                [field]: value,
            };
            return newAttributes;
        });
    };

    const handleUpdate = () => {
        const updatedProduct: CreateProductDto = { ...formData, stores, attributes };
        console.log('Updating product:', updatedProduct);
        onUpdate(updatedProduct);
        onOpenChange(false);
    };

    if (!open) return null;

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black opacity-50" onClick={() => onOpenChange(false)} />
                <div className="relative bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Lỗi</h2>
                    <p className="text-red-500">{error}</p>
                    <Button className="mt-4" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                </div>
            </div>
        );
    }

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
                <h2 className="text-xl font-bold mb-6">Cập nhật sản phẩm</h2>
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên sản phẩm</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Danh mục</Label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId || ''}
                            onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.id || Math.random()} value={cat.id}>
                                    {cat.name || 'Không tên'}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shortDescription">Mô tả ngắn</Label>
                        <Input
                            id="shortDescription"
                            name="shortDescription"
                            value={formData.shortDescription || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="longDescription">Mô tả chi tiết</Label>
                        <textarea
                            id="longDescription"
                            name="longDescription"
                            value={formData.longDescription || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Hình ảnh sản phẩm</Label>
                        <Input
                            type="file"
                            multiple
                            onChange={(e) => e.target.files && handleImageUpload(Array.from(e.target.files), 'product')}
                            className="mt-1"
                        />
                        {(formData.featuredImages ?? []).length > 0 ? (
                            (formData.featuredImages || []).map((id, index) => (
                                <div key={index} className="mt-1">
                                    Image ID: {id}
                                </div>
                            ))
                        ) : (
                            <div className="mt-1">Chưa có hình ảnh</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Cửa hàng</Label>
                        <div className="space-y-2 mt-2">
                            {availableStores.length > 0 ? (
                                availableStores.map((store) => (
                                    <div key={store.id || Math.random()} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`store-${store.id}`}
                                            checked={stores.includes(store.id.toString())}
                                            onCheckedChange={handleStoreChange(store.id.toString())}
                                        />
                                        <Label htmlFor={`store-${store.id}`}>{store.name || 'Không tên'}</Label>
                                    </div>
                                ))
                            ) : (
                                <div>Chưa có cửa hàng</div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Thuộc tính</Label>
                        {attributes.length > 0 ? (
                            attributes.map((attr, attrIndex) => {
                                const selectedAttrOptions = attributeOptions.find((opt) => opt.type === attr.key);
                                return (
                                    <div key={attr.code || attrIndex} className="space-y-4 mt-4 border p-4 rounded">
                                        <div className="space-y-2">
                                            <Label>Loại thuộc tính</Label>
                                            <select
                                                value={attr.key || ''}
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
                                                    value={attr.value || ''}
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
                                                onChange={(e) =>
                                                    e.target.files && handleImageUpload(Array.from(e.target.files), 'attribute', attrIndex)
                                                }
                                            />
                                            {attr.featuredImages && attr.featuredImages.length > 0 ? (
                                                attr.featuredImages.map((id, index) => (
                                                    <div key={index} className="mt-1">
                                                        Image ID: {id}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="mt-1">Chưa có hình ảnh</div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Biến thể</Label>
                                            {attr.variants.length > 0 ? (
                                                attr.variants.map((variant, variantIndex) => {
                                                    const selectedVariantOptions = attributeOptions.find(
                                                        (opt) => opt.type === variant.key
                                                    );
                                                    return (
                                                        <div
                                                            key={variant.code || variantIndex}
                                                            className="space-y-2 mt-2 border p-4 rounded"
                                                        >
                                                            <div className="space-y-2">
                                                                <Label>Loại biến thể</Label>
                                                                <select
                                                                    value={variant.key || ''}
                                                                    onChange={(e) =>
                                                                        handleVariantTypeSelection(
                                                                            attrIndex,
                                                                            variantIndex,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                                                                >
                                                                    <option value="">Chọn loại biến thể</option>
                                                                    {attributeOptions
                                                                        .filter((opt) => opt.type !== attr.key)
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
                                                                        value={variant.value || ''}
                                                                        onChange={(e) =>
                                                                            handleVariantValueSelection(
                                                                                attrIndex,
                                                                                variantIndex,
                                                                                e.target.value
                                                                            )
                                                                        }
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
                                                                    value={variant.price ?? ''}
                                                                    onChange={(e) =>
                                                                        handleVariantChange(
                                                                            attrIndex,
                                                                            variantIndex,
                                                                            'price',
                                                                            parseFloat(e.target.value) || 0
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Input
                                                                    type="number"
                                                                    placeholder="Số lượng"
                                                                    value={variant.quantity ?? ''}
                                                                    onChange={(e) =>
                                                                        handleVariantChange(
                                                                            attrIndex,
                                                                            variantIndex,
                                                                            'quantity',
                                                                            parseInt(e.target.value) || 0
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Hình ảnh biến thể</Label>
                                                                <Input
                                                                    type="file"
                                                                    multiple
                                                                    onChange={(e) =>
                                                                        e.target.files &&
                                                                        handleImageUpload(
                                                                            Array.from(e.target.files),
                                                                            'variant',
                                                                            attrIndex,
                                                                            variantIndex
                                                                        )
                                                                    }
                                                                />
                                                                {variant.featuredImages && variant.featuredImages.length > 0 ? (
                                                                    variant.featuredImages.map((id, index) => (
                                                                        <div key={index} className="mt-1">
                                                                            Image ID: {id}
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="mt-1">Chưa có hình ảnh</div>
                                                                )}
                                                            </div>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => removeVariant(attrIndex, variantIndex)}
                                                            >
                                                                Xóa biến thể
                                                            </Button>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div>Chưa có biến thể</div>
                                            )}
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
                            })
                        ) : (
                            <div>Chưa có thuộc tính</div>
                        )}
                        <Button variant="outline" onClick={addAttribute} className="mt-4">
                            Thêm thuộc tính
                        </Button>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Hủy
                    </Button>
                    <Button variant="default" onClick={handleUpdate}>
                        Cập nhật
                    </Button>
                </div>
            </div>
        </div>
    );
}