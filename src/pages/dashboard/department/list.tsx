import { CONFIG } from 'src/global-config';
import { DepartmentListView } from 'src/sections/department/view/department-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Phòng ban - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <DepartmentListView />
        </>
    );
}
