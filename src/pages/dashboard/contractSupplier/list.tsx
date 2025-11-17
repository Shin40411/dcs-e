import { CONFIG } from "src/global-config";
import { ContractMainView } from "src/sections/contract-supplier/view/contract-main-view";

const metadata = { title: `Hợp đồng nhà cung cấp - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ContractMainView />
        </>
    );
}