import { CONFIG } from 'src/global-config';

import { OverviewBankingView } from 'src/sections/overview/banking/view';

// ----------------------------------------------------------------------

const metadata = { title: `Tài khoản ngân hàng - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <OverviewBankingView />
    </>
  );
}
