import { CONFIG } from 'src/global-config';
import { EmployeeTypeListView } from 'src/sections/employeeType/view/employee-type-list-view';

// ----------------------------------------------------------------------

const metadata = { title: `Chức vụ - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <EmployeeTypeListView />
        </>
    );
}
