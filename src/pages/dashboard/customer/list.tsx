import { CONFIG } from 'src/global-config';
import { CustomerListView } from 'src/sections/customer/view/customer-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Khách hàng - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <CustomerListView />
        </>
    );
}
