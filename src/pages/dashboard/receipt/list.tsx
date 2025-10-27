import { CONFIG } from 'src/global-config';
import { ReceiptMainView } from 'src/sections/receipt/view/receipt-main-view';
// ----------------------------------------------------------------------

const metadata = { title: `Phiếu thu - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ReceiptMainView />
        </>
    );
}
