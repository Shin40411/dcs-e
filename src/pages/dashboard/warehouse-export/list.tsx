import { CONFIG } from "src/global-config";
import { WarehouseExportMainView } from "src/sections/warehouse-export/view/warehouse-export-main-view";

const metadata = { title: `Phiếu xuất kho - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <WarehouseExportMainView />
        </>
    );
}
