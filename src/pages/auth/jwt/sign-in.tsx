import { CONFIG } from 'src/global-config';

import { JwtSignInView } from 'src/auth/view/jwt';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { Navigate } from 'react-router';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

const metadata = { title: `Đăng nhập - ${CONFIG.appName}` };

export default function Page() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <Navigate to={paths.comingSoon} replace />;
  }

  return (
    <>
      <title>{metadata.title}</title>

      <JwtSignInView />
    </>
  );
}
