import { CONFIG } from "src/global-config";
import { OrderSupplierMainView } from "src/sections/quotation/view/order-supplier-main-view";

const metadata = { title: `Đặt hàng - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <OrderSupplierMainView />
        </>
    );
}
