import type { Theme, SxProps } from '@mui/material/styles';

import { m } from 'framer-motion';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';


export type RoleBasedGuardProp = {
  sx?: SxProps<Theme>;
  currentRole: string;
  hasContent?: boolean;
  allowedRoles: string | string[];
  children: React.ReactNode;
};

const SUPER_PERMISSIONS = [
  "TOANQUYEN.VIEW",
];

export function RoleBasedGuard({
  sx,
  children,
  hasContent,
  currentRole,
  allowedRoles,
}: RoleBasedGuardProp) {
  let isInAllowedRole = false;

  if (SUPER_PERMISSIONS.includes(currentRole)) {
    isInAllowedRole = true;
  } else {
    isInAllowedRole = allowedRoles.includes(currentRole);
  }

  // if (currentRole && allowedRoles && !isInAllowedRole) {
  if (!isInAllowedRole) {
    return hasContent ? (
      <Container
        component={MotionContainer}
        sx={[{ textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]}
      >
        <m.div variants={varBounce('in')}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Không có quyền truy cập
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <Typography sx={{ color: 'text.secondary' }}>
            Tài khoản của bạn không có quyền để truy cập trang này!
          </Typography>
        </m.div>

        <m.div variants={varBounce('in')}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}
