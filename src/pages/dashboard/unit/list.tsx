import { CONFIG } from 'src/global-config';
import { UnitListView } from 'src/sections/unit/view/unit-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Đơn vị tính - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <UnitListView />
        </>
    );
}
