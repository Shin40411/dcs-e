import { CONFIG } from 'src/global-config';
import { CategoryListView } from 'src/sections/category/view/category-list-view';

import { ProductListView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

const metadata = { title: `Nhóm sản phẩm - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <CategoryListView />
        </>
    );
}
