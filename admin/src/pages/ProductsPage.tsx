// src/components/ProductsPage.tsx
import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import ProductFilterModal from '@/components/products/ProductFilterModal';
import AddNewProductModal from '@/components/products/AddNewProductModal';
import UpdateProductModal from '@/components/products/UpdateProductModal';
import { CreateProductDto } from '@/lib/enum';
import { toast } from 'sonner';

export default function ProductsPage() {
    const { loading, error, data, fetchApi } = useApi();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null); // ID sản phẩm cần xóa
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

    // Xây dựng query dựa trên trang và các filter
    const buildQuery = (page: number, filters: { [key: string]: string }) => {
        let query = `/products?page=${page}`;
        if (filters.categoryId) {
            query += `&search[category.id:in]=${filters.categoryId}`;
        }
        if (filters.productName) {
            query += `&search[product.name:like]=${filters.productName}`;
        }
        if (filters.storeId) {
            query += `&search[store.id:in]=${filters.storeId}`;
        }
        if (filters.sort) {
            query += `&sort=${filters.sort}`;
        }
        return query;
    };

    const loadProducts = (page: number, filters: { [key: string]: string }) => {
        const query = buildQuery(page, filters);
        return fetchApi(query)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    };

    useEffect(() => {
        loadProducts(currentPage, filters);
    }, [currentPage, filters, fetchApi]);

    if (loading) return <p className="text-center mt-10">Loading products...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

    const products = data?.data || [];
    const meta = data?.meta;
    const perPage = meta?.perPage || 10;
    const emptyRows = perPage - products.length;

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

    const handleSaveProduct = (newProduct: CreateProductDto) => {
        const token = localStorage.getItem('accessToken');
        fetchApi('/products', 'post', newProduct, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                toast.success('Tạo sản phẩm thành công');
                setShowAddModal(false);
                loadProducts(currentPage, filters);
            })
            .catch((err) => {
                console.error('Error saving product:', err);
                toast.error('Lỗi khi tạo sản phẩm');
            });
    };

    const handleUpdateProduct = (updatedProduct: CreateProductDto) => {
        const token = localStorage.getItem('accessToken');
        fetchApi(`/products/${selectedProduct.id}`, 'put', updatedProduct, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                toast.success('Cập nhật sản phẩm thành công');
                setShowUpdateModal(false);
                setSelectedProduct(null);
                loadProducts(currentPage, filters);
            })
            .catch((err) => {
                console.error('Error updating product:', err);
                toast.error('Lỗi khi cập nhật sản phẩm');
            });
    };

    const handleEditProduct = (product: any) => {
        setSelectedProduct(product);
        setShowUpdateModal(true);
    };

    const handleDeleteProduct = (id: string) => {
        setShowDeleteConfirm(id);
    };

    const confirmDelete = () => {
        if (showDeleteConfirm) {
            const token = localStorage.getItem('accessToken');
            fetchApi(`/products/${showDeleteConfirm}`, 'delete', undefined, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(() => {
                    toast.success('Xóa sản phẩm thành công');
                    setShowDeleteConfirm(null);
                    loadProducts(currentPage, filters);
                })
                .catch((err) => {
                    console.error('Error deleting product:', err);
                    toast.error('Lỗi xóa sản phẩm');
                    setShowDeleteConfirm(null);
                });
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Danh sách sản phẩm</h1>
                <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setShowFilterModal(true)}>
                        Filter
                    </Button>
                    <Button variant="default" onClick={() => setShowAddModal(true)}>
                        Thêm mới sản phẩm
                    </Button>
                </div>
            </div>

            {products.length > 0 ? (
                <div>
                    <table className="min-w-full table-fixed border border-gray-300 shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="w-1/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    STT
                                </th>
                                <th className="w-3/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Tên sản phẩm
                                </th>
                                <th className="w-3/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Mô tả ngắn
                                </th>
                                <th className="w-3/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Hình ảnh
                                </th>
                                <th className="w-2/12 px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product: any, index: number) => (
                                <tr key={product.id} className="h-16 hover:bg-gray-50">
                                    <td className="h-16 px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        {meta
                                            ? meta.perPage * (meta.currentPage - 1) + index + 1
                                            : index + 1}
                                    </td>
                                    <td className="h-16 px-4 py-2 border border-gray-300 text-sm text-gray-700 overflow-hidden truncate">
                                        {product.name}
                                    </td>
                                    <td className="h-16 px-4 py-2 border border-gray-300 text-sm text-gray-700 overflow-hidden truncate">
                                        {product.shortDescription || 'N/A'}
                                    </td>
                                    <td className="h-16 px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        {product.featuredImages && product.featuredImages.length > 0 ? (
                                            <img
                                                src={product.featuredImages[0].url}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover"
                                            />
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="h-16 px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                        <div className="flex justify-center space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleDeleteProduct(product.id)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {emptyRows > 0 &&
                                Array.from({ length: emptyRows }).map((_, idx) => (
                                    <tr key={`empty-${idx}`} className="h-16">
                                        <td className="h-16 px-4 py-2 border border-gray-300" colSpan={5}></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center py-4">Chưa có sản phẩm.</p>
            )}

            <div className="mt-4 flex items-center justify-center space-x-4">
                <Button variant="outline" onClick={handlePrevPage} disabled={!meta?.hasPrevPage}>
                    Prev
                </Button>
                <div>{renderPageNumbers()}</div>
                <Button variant="outline" onClick={handleNextPage} disabled={!meta?.hasNextPage}>
                    Next
                </Button>
            </div>

            <ProductFilterModal
                show={showFilterModal}
                initialFilters={filters}
                onClose={() => setShowFilterModal(false)}
                onApply={(appliedFilters) => {
                    setFilters(appliedFilters);
                    setCurrentPage(1);
                }}
            />

            {showAddModal && (
                <AddNewProductModal
                    open={showAddModal}
                    onOpenChange={setShowAddModal}
                    onSave={handleSaveProduct}
                />
            )}

            {showUpdateModal && selectedProduct && (
                <UpdateProductModal
                    open={showUpdateModal}
                    onOpenChange={(open) => {
                        setShowUpdateModal(open);
                        if (!open) setSelectedProduct(null);
                    }}
                    onUpdate={handleUpdateProduct}
                    product={selectedProduct}
                />
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowDeleteConfirm(null)} />
                    <div className="relative bg-white p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">Xác nhận xóa sản phẩm</h3>
                        <p className="text-gray-700 mb-6">
                            Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
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