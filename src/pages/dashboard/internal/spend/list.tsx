import { CONFIG } from 'src/global-config';
import { SpendMainView } from 'src/sections/internal-management/spend/view/spend-main-view';
// ----------------------------------------------------------------------

const metadata = { title: `Phiếu chi nội bộ - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <SpendMainView />
        </>
    );
}
