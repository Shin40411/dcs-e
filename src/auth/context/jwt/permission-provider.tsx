import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { IPermissionByUser } from "src/types/permission";
import { PERMISSION_DEPART } from "./constant";

type PermissionContextType = {
    permissions: IPermissionByUser[] | null;
    clearPermissions: () => void;
};

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
    const [permissions, setPermissions] = useState<IPermissionByUser[] | null>(null);

    const checkUserPermission = useCallback(async () => {
        const userPer = sessionStorage.getItem(PERMISSION_DEPART);
        const permissionDepartment = userPer ? JSON.parse(userPer) : null;
        setPermissions(permissionDepartment);
    }, []);

    const clearPermissions = () => {
        sessionStorage.removeItem(PERMISSION_DEPART);
        setPermissions(null);
    };

    useEffect(() => {
        checkUserPermission();
    }, []);

    return (
        <PermissionContext.Provider value={{ permissions, clearPermissions }}>
            {children}
        </PermissionContext.Provider>
    );
}

export function usePermission() {
    const ctx = useContext(PermissionContext);
    if (!ctx) throw new Error("usePermission must be used inside PermissionProvider");
    return ctx;
}