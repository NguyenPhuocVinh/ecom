// src/components/stores/UpdateStoreModal.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ROLE_STORE, Store, updateStoreDto } from '@/lib/enum';



interface UpdateStoreModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (newStore: updateStoreDto) => void;
    initialFilters: {
        name: string;
        address: string;
        phone: string;
        transferPermission: string;
        orderPermission: string;
        reportPermission: string;
        destroyPermission: string;
        addUserPermission: string;
        removeUserPermission: string;
    };
    store: Store;
}

export default function UpdateStoreModal({
    open,
    onOpenChange,
    onSave,
    initialFilters,
    store,
}: UpdateStoreModalProps) {
    const [formData, setFormData] = useState(initialFilters);
    const [permissions, setPermissions] = useState({
        transferPermission: initialFilters.transferPermission ? initialFilters.transferPermission.split(',') : [],
        orderPermission: initialFilters.orderPermission ? initialFilters.orderPermission.split(',') : [],
        reportPermission: initialFilters.reportPermission ? initialFilters.reportPermission.split(',') : [],
        destroyPermission: initialFilters.destroyPermission ? initialFilters.destroyPermission.split(',') : [],
        addUserPermission: initialFilters.addUserPermission ? initialFilters.addUserPermission.split(',') : [],
        removeUserPermission: initialFilters.removeUserPermission ? initialFilters.removeUserPermission.split(',') : [],
    });

    useEffect(() => {
        if (open) {
            setFormData(initialFilters);
            setPermissions({
                transferPermission: initialFilters.transferPermission ? initialFilters.transferPermission.split(',') : [],
                orderPermission: initialFilters.orderPermission ? initialFilters.orderPermission.split(',') : [],
                reportPermission: initialFilters.reportPermission ? initialFilters.reportPermission.split(',') : [],
                destroyPermission: initialFilters.destroyPermission ? initialFilters.destroyPermission.split(',') : [],
                addUserPermission: initialFilters.addUserPermission ? initialFilters.addUserPermission.split(',') : [],
                removeUserPermission: initialFilters.removeUserPermission ? initialFilters.removeUserPermission.split(',') : [],
            });
        }
    }, [open, initialFilters]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (permission: keyof typeof permissions, role: ROLE_STORE) => (checked: boolean) => {
        setPermissions((prev) => {
            const currentRoles = prev[permission];
            if (checked) {
                return { ...prev, [permission]: [...currentRoles, role] };
            } else {
                return { ...prev, [permission]: currentRoles.filter((r) => r !== role) };
            }
        });
    };

    const handleSave = () => {
        const updatedStore = {
            ...formData,
            transferPermission: permissions.transferPermission.join(','),
            orderPermission: permissions.orderPermission.join(','),
            reportPermission: permissions.reportPermission.join(','),
            destroyPermission: permissions.destroyPermission.join(','),
            addUserPermission: permissions.addUserPermission.join(','),
            removeUserPermission: permissions.removeUserPermission.join(','),
        };
        onSave(updatedStore);
        onOpenChange(false);
    };

    if (!open) return null;

    const renderPermissionCheckboxes = (permission: keyof typeof permissions, label: string) => (
        <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">{label}</Label>
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`${permission}-owner`}
                        checked={permissions[permission].includes(ROLE_STORE.OWNER)}
                        onCheckedChange={handlePermissionChange(permission, ROLE_STORE.OWNER)}
                    />
                    <Label htmlFor={`${permission}-owner`} className="text-sm text-gray-700">
                        Chủ sở hữu (Owner)
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`${permission}-manager`}
                        checked={permissions[permission].includes(ROLE_STORE.MANAGER)}
                        onCheckedChange={handlePermissionChange(permission, ROLE_STORE.MANAGER)}
                    />
                    <Label htmlFor={`${permission}-manager`} className="text-sm text-gray-700">
                        Quản lý (Manager)
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={`${permission}-assistant_manager`}
                        checked={permissions[permission].includes(ROLE_STORE.ASSISTANT_MANAGER)}
                        onCheckedChange={handlePermissionChange(permission, ROLE_STORE.ASSISTANT_MANAGER)}
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
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => onOpenChange(false)} />
            <div className="relative ml-auto bg-white w-2/5 h-full p-6 overflow-y-auto shadow-xl">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-6">Chỉnh sửa cửa hàng</h2>
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Tên cửa hàng
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
                        <Label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Địa chỉ
                        </Label>
                        <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                            Số điện thoại
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1 bg-white text-black"
                        />
                    </div>

                    {renderPermissionCheckboxes('transferPermission', 'Quyền chuyển hàng')}
                    {renderPermissionCheckboxes('orderPermission', 'Quyền đặt hàng')}
                    {renderPermissionCheckboxes('reportPermission', 'Quyền báo cáo')}
                    {renderPermissionCheckboxes('destroyPermission', 'Quyền hủy')}
                    {renderPermissionCheckboxes('addUserPermission', 'Quyền thêm người dùng')}
                    {renderPermissionCheckboxes('removeUserPermission', 'Quyền xóa người dùng')}
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