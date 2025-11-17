import { CONFIG } from 'src/global-config';
import { ContractSpendPdf } from 'src/sections/contract-supplier/contract-spend-pdf';
// ----------------------------------------------------------------------

const metadata = { title: `Hợp đồng nhà cung cấp | Phiếu chi - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ContractSpendPdf />
        </>
    );
}
