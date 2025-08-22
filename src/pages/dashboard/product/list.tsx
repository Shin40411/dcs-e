import { CONFIG } from 'src/global-config';

import { ProductListView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Sản phẩm - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <ProductListView />
    </>
  );
}
