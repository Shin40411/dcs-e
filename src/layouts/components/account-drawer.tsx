import type { IconButtonProps } from '@mui/material/IconButton';

import MenuItem from '@mui/material/MenuItem';

import { usePathname, useRouter } from 'src/routes/hooks';

import { _mock } from 'src/_mock';


import { useMockedUser } from 'src/auth/hooks';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';
import { useState } from 'react';
import { Button, IconButton, Menu } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { paths } from 'src/routes/paths';
import { useGetProfileInfo } from 'src/actions/account';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const router = useRouter();
  const location = usePathname();

  const { profileInfoData: user } = useGetProfileInfo();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AccountButton
        onClick={handleOpen}
        photoURL={user?.image || `${CONFIG.assetsDir}/assets/images/home/nophoto.jpg`}
        displayName={user?.name || ""}
        sx={sx}
        {...other}
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem selected={location === paths.dashboard.user.account}>
          <Button
            startIcon={<Iconify icon="material-symbols:info-outline-rounded" />}
            onClick={() => {
              router.push(paths.dashboard.user.account);
              handleClose();
            }}
          >
            Thông tin tài khoản
          </Button>
        </MenuItem>
        <MenuItem selected={location === `${paths.dashboard.user.account}/change-password`}>
          <Button
            startIcon={<Iconify icon="fluent:key-reset-20-regular" />}
            onClick={() => {
              router.push(`${paths.dashboard.user.account}/change-password`);
              handleClose();
            }}
          >
            Đổi mật khẩu
          </Button>
        </MenuItem>
        <MenuItem>
          <SignOutButton onClose={handleClose} />
        </MenuItem>
      </Menu>
    </>
  );
}
