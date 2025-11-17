import Grid from '@mui/material/Grid';

import { DashboardContent } from 'src/layouts/dashboard';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { SyntheticEvent, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { DashBoardContract } from '../dashboard-contract';
import { DashBoardFinance } from '../dashboard-finance';
import { DashBoardProduct } from '../dashboard-product';
import { DashBoardBestSeller } from '../dashboard-bestSeller';
import { DashBoardTopSaler } from '../dashboard-topSaler';
import { DashBoardTopContractVal } from '../dashboard-topContractVal';
import { RoleBasedGuard } from 'src/auth/guard';
import { useCheckPermission } from 'src/auth/hooks/use-check-permission';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const [value, setValue] = useState('WEEK');
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const { permission } = useCheckPermission(['THONGKE.VIEW']);

  return (
    <RoleBasedGuard
      hasContent
      currentRole={permission?.name || ''}
      allowedRoles={['THONGKE.VIEW']}
      sx={{ py: 10 }}
    >
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Thống kê"
          links={[
            { name: 'Tổng quan', href: paths.dashboard.root },
            { name: 'Thống kê' },
          ]}
          sx={{ mb: 3 }}
          action={
            <Tabs
              value={value}
              onChange={handleChangeTab}
              textColor="secondary"
            >
              <Tab value="WEEK" label="Tuần" />
              <Tab value="MONTH" label="Tháng" />
              <Tab value="QUARTER" label="Quý" />
              <Tab value="YEAR" label="Năm" />
            </Tabs>
          }
        />
        <Grid container spacing={3} flexDirection="column" height="100%">
          <Grid container spacing={2} alignItems="stretch">
            <Grid size={{ xs: 12, md: 6, lg: 6, xl: 4 }}>
              <DashBoardContract filter={value} />
            </Grid>
            <Grid size={{ xs: 12, md: 6, lg: 6, xl: 4 }}>
              <DashBoardFinance filter={value} />
            </Grid>
            <Grid size={{ xs: 12, md: 12, lg: 12, xl: 4 }}>
              <DashBoardProduct filter={value} />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="stretch">
            <Grid size={{ xs: 12, md: 12, lg: 12, xl: 6 }}>
              <DashBoardBestSeller filter={value} />
            </Grid>
            <Grid size={{ xs: 12, md: 12, lg: 12, xl: 6 }} container direction={{ xs: "column", sm: "row", md: "row" }} spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                <DashBoardTopContractVal filter={value} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                <DashBoardTopSaler filter={value} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DashboardContent>
    </RoleBasedGuard>
  );
}
