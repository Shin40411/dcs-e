import { CONFIG } from 'src/global-config';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `404 Trang không tìm thấy! | Lỗi - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <NotFoundView />
    </>
  );
}
