// src/components/stores/StoreDetailModal.tsx
import { ROLE_STORE, Store } from '@/lib/enum';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';



interface StoreDetailModalProps {
    store: Store;
    onClose: () => void;
}

export default function StoreDetailModal({ store, onClose }: StoreDetailModalProps) {
    const permissions = {
        transferPermission: store.transferPermission ? store.transferPermission.split(',') : [],
        orderPermission: store.orderPermission ? store.orderPermission.split(',') : [],
        reportPermission: store.reportPermission ? store.reportPermission.split(',') : [],
        destroyPermission: store.destroyPermission ? store.destroyPermission.split(',') : [],
        addUserPermission: store.addUserPermission ? store.addUserPermission.split(',') : [],
        removeUserPermission: store.removeUserPermission ? store.removeUserPermission.split(',') : [],
    };

    const renderPermissionCheckboxes = (permission: keyof typeof permissions, label: string) => (
        <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">{label}</Label>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`${permission}-owner`}
                        checked={permissions[permission].includes(ROLE_STORE.OWNER)}
                        disabled
                        className="border-gray-300"
                    />
                    <Label htmlFor={`${permission}-owner`} className="text-sm text-gray-700">
                        Chủ sở hữu (Owner)
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`${permission}-manager`}
                        checked={permissions[permission].includes(ROLE_STORE.MANAGER)}
                        disabled
                        className="border-gray-300"
                    />
                    <Label htmlFor={`${permission}-manager`} className="text-sm text-gray-700">
                        Quản lý (Manager)
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`${permission}-assistant_manager`}
                        checked={permissions[permission].includes(ROLE_STORE.ASSISTANT_MANAGER)}
                        disabled
                        className="border-gray-300"
                    />
                    <Label htmlFor={`${permission}-assistant_manager`} className="text-sm text-gray-700">
                        Trợ lý quản lý (Assistant Manager)
                    </Label>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
            <div className="relative ml-auto bg-white w-2/5 h-full p-6 overflow-y-auto shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-6">Chi tiết cửa hàng</h2>
                <div className="space-y-6">
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">Tên cửa hàng</Label>
                        <p className="mt-1 text-black">{store.name}</p>
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">Địa chỉ</Label>
                        <p className="mt-1 text-black">{store.address}</p>
                    </div>
                    <div>
                        <Label className="block text-sm font-medium text-gray-700">Số điện thoại</Label>
                        <p className="mt-1 text-black">{store.phone}</p>
                    </div>

                    {renderPermissionCheckboxes('transferPermission', 'Quyền chuyển hàng')}
                    {renderPermissionCheckboxes('orderPermission', 'Quyền đặt hàng')}
                    {renderPermissionCheckboxes('reportPermission', 'Quyền báo cáo')}
                    {renderPermissionCheckboxes('destroyPermission', 'Quyền hủy')}
                    {renderPermissionCheckboxes('addUserPermission', 'Quyền thêm người dùng')}
                    {renderPermissionCheckboxes('removeUserPermission', 'Quyền xóa người dùng')}
                </div>
            </div>
        </div>
    );
}