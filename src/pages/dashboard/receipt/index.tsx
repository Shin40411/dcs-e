import { CONFIG } from 'src/global-config';
import { ContractReceiptPdf } from 'src/sections/contract/contract-receipt-pdf';
// ----------------------------------------------------------------------

const metadata = { title: `Phiếu thu - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ContractReceiptPdf />
        </>
    );
}
