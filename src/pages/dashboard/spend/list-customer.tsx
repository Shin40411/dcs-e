import { CONFIG } from 'src/global-config';
import { SpendMainView } from 'src/sections/spend/view/spend-main-view';
// ----------------------------------------------------------------------

const metadata = { title: `Phiếu chi - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <SpendMainView contractType='Customer' />
        </>
    );
}
