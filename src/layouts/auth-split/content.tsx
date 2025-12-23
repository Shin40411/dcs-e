import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

import { mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';

import { layoutClasses } from '../core/classes';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type AuthSplitContentProps = BoxProps & { layoutQuery?: Breakpoint };

export function AuthSplitContent({
  sx,
  children,
  className,
  layoutQuery = 'md',
  ...other
}: AuthSplitContentProps) {
  return (
    <Box
      className={mergeClasses([layoutClasses.content, className])}
      sx={[
        (theme) => ({
          backgroundImage: `url(${CONFIG.assetsDir}/assets/background/dcs_bg_green.png)`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          display: 'flex',
          flex: '1 1 auto',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: theme.spacing(3, 2, 10, 2),
          [theme.breakpoints.up(layoutQuery)]: {
            justifyContent: 'center',
            p: theme.spacing(10, 2, 10, 2),
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'var(--layout-auth-content-width)',
          padding: 4,
          boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
          bgcolor: '#DCFCE7',
          borderRadius: 0.5
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
