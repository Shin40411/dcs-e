import { usePermission } from "../context/jwt/permission-provider";

const SUPER_PERMISSIONS = [
    "TOANQUYEN.VIEW",
];
export function useCheckPermission(targetPermNames: string[]) {
    const { permissions } = usePermission();

    const foundSuper = permissions?.find((p) => SUPER_PERMISSIONS.includes(p.name));
    const found = permissions?.find((p) => targetPermNames.includes(p.name));

    return {
        permission: foundSuper ? foundSuper : found ? found : null,
    };
}
