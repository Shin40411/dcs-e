import { CONFIG } from 'src/global-config';
import { ReceiptMainView } from 'src/sections/internal-management/receipt/view/receipt-main-view';
// ----------------------------------------------------------------------

const metadata = { title: `Phiếu thu nội bộ - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ReceiptMainView />
        </>
    );
}
