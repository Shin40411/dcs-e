import { CONFIG } from 'src/global-config';
import { TransferMainView } from 'src/sections/internal-management/transfer/view/transfer-main-view';
// ----------------------------------------------------------------------

const metadata = { title: `Chuyển khoản nội bộ - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <TransferMainView />
        </>
    );
}
