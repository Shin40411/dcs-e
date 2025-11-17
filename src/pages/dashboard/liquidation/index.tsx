import { CONFIG } from 'src/global-config';
import { ContractLiquidation } from 'src/sections/contract/contract-liquidation';
// ----------------------------------------------------------------------

const metadata = { title: `Hợp đồng | Biên bản thanh lý hợp đồng - ${CONFIG.appName}` };

export default function page() {
    return (
        <>
            <title>{metadata.title}</title>

            <ContractLiquidation />
        </>
    );
}
