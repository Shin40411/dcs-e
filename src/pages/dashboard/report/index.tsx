import { CONFIG } from 'src/global-config';
import { ContractReport } from 'src/sections/contract/contract-report';
// ----------------------------------------------------------------------

const metadata = { title: `Hợp đồng | Biên bản nghiệm thu/ Bàn giao - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ContractReport />
        </>
    );
}
