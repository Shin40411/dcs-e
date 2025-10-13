import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';
import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';

import { svgColorClasses } from 'src/components/svg-color';

import { useMockedUser } from 'src/auth/hooks';

import { AppWidget } from '../app-widget';
import { AppAreaInstalled } from '../app-area-installed';
import { AppWidgetSummary } from '../app-widget-summary';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function OverviewAppView() {
  const { user } = useMockedUser();

  const theme = useTheme();

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Thống kê"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Thống kê' },
        ]}
        sx={{ mb: 3 }}
      />
      <Grid container spacing={3} flexDirection="column">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <AppWidget
              title="Top saler"
              total={38566}
              icon="clarity:employee-solid"
              chart={{ series: 48 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <AppWidget
              title="Top giá trị hợp đồng"
              total={55566}
              icon="clarity:contract-line"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'info.dark', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <AppWidget
              title="Top hàng bán chạy"
              total={55566}
              icon="arcticons:amazon-seller"
              chart={{
                series: 75,
                colors: [theme.vars.palette.info.light, theme.vars.palette.info.main],
              }}
              sx={{ bgcolor: 'green', [`& .${svgColorClasses.root}`]: { color: 'info.light' } }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <AppAreaInstalled
              title="Thống kê số lượng hợp đồng trong năm"
              subheader="Dữ liệu dựa theo khách hàng và nhà cung cấp"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} container direction="column" spacing={2}>
            <Grid>
              <AppWidgetSummary
                title="Tài chính"
                percent={0.2}
                total={4876}
                chart={{
                  colors: [theme.palette.info.main],
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [20, 41, 63, 33, 28, 35, 50, 46],
                }}
              />
            </Grid>

            <Grid>
              <AppWidgetSummary
                title="Hàng hóa"
                percent={-0.1}
                total={678}
                chart={{
                  colors: [theme.palette.error.main],
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  series: [18, 19, 31, 8, 16, 37, 12, 33],
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
