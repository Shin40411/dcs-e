import { CONFIG } from 'src/global-config';
import { SuppliersListView } from 'src/sections/supplier/view/supplier-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Nhà cung cấp - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <SuppliersListView />
        </>
    );
}
