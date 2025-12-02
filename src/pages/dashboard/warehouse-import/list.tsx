import { CONFIG } from "src/global-config";
import { WarehouseImportMainView } from "src/sections/ware-house-import/view/warehouse-import-main-view";

const metadata = { title: `Phiếu nhập kho - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <WarehouseImportMainView />
        </>
    );
}
