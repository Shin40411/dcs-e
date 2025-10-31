import { CONFIG } from 'src/global-config';
import { ContractWarehousePdf } from 'src/sections/contract/contract-warehouse-pdf';
// ----------------------------------------------------------------------

const metadata = { title: `Hợp đồng | Phiếu xuất kho - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ContractWarehousePdf />
        </>
    );
}
