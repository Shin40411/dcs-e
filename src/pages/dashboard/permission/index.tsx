import { CONFIG } from 'src/global-config';
import { PermissionView } from 'src/sections/permission/view';

// ----------------------------------------------------------------------

const metadata = { title: `Phân quyền - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <PermissionView />
    </>
  );
}
