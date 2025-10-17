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

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const [value, setValue] = useState('WEEK');
  const handleChangeTab = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <DashboardContent maxWidth="xl">
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
      <Grid container spacing={3} flexDirection="column">
        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, md: 4.5 }}>
            <DashBoardContract />
          </Grid>
          <Grid size={{ xs: 12, md: 4.5 }}>
            <DashBoardFinance />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <DashBoardProduct />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <DashBoardBestSeller />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} container direction="column" spacing={2}>
            <Grid>
              <DashBoardTopContractVal />
            </Grid>
            <Grid>
              <DashBoardTopSaler />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
