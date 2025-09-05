import { CONFIG } from "src/global-config";
import { QuotationMainView } from "src/sections/quotation/view/quotation-main-view";

const metadata = { title: `Báo giá - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <title>{metadata.title}</title>

            <QuotationMainView />
        </>
    );
}
