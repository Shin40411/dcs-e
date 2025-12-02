import type { RouteObject } from 'react-router';

import { Outlet } from 'react-router';
import { lazy, Suspense } from 'react';

import { MainLayout } from 'src/layouts/main';
import { SimpleLayout } from 'src/layouts/simple';

import { SplashScreen } from 'src/components/loading-screen';
import { paths } from '../paths';
import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const ComingSoonPage = lazy(() => import('src/pages/coming-soon'));
const MaintenancePage = lazy(() => import('src/pages/maintenance'));
// Error
const Page500 = lazy(() => import('src/pages/error/500'));
const Page403 = lazy(() => import('src/pages/error/403'));
const Page404 = lazy(() => import('src/pages/error/404'));
// Blank
const BlankPage = lazy(() => import('src/pages/blank'));
//Receipt
const ReceiptPreviewPage = lazy(() => import('src/pages/dashboard/receipt/index'));
//Spend
const SpendPreviewPage = lazy(() => import('src/pages/dashboard/spend/index'));
//Report
const ReportPreviewPage = lazy(() => import('src/pages/dashboard/report/index'));
//Liquidation
const LiquidationPreviewPage = lazy(() => import('src/pages/dashboard/liquidation/index'));
//Export
const ExportWarehousePreviewPage = lazy(() => import('src/pages/dashboard/warehouse-export/index'));
//Import
const ImportWarehousePreviewPage = lazy(() => import('src/pages/dashboard/warehouse-import/index'));
// ----------------------------------------------------------------------

export const mainRoutes: RouteObject[] = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      {
        element: (
          <MainLayout>
            <Outlet />
          </MainLayout>
        ),
        children: [
          { path: 'blank', element: <BlankPage /> },
        ],
      },
      {
        path: 'coming-soon',
        element: (
          <SimpleLayout slotProps={{ content: { compact: true } }}>
            <ComingSoonPage />
          </SimpleLayout>
        ),
      },
      {
        path: 'maintenance',
        element: (
          <SimpleLayout slotProps={{ content: { compact: true } }}>
            <MaintenancePage />
          </SimpleLayout>
        ),
      },
      {
        path: paths.receipt,
        element: (
          <AuthGuard>
            <ReceiptPreviewPage />
          </AuthGuard>
        )
      },
      {
        path: paths.spend,
        element: (
          <AuthGuard>
            <SpendPreviewPage />
          </AuthGuard>
        )
      },
      {
        path: paths.report,
        element: (
          <AuthGuard>
            <ReportPreviewPage />
          </AuthGuard>
        )
      },
      {
        path: paths.liquidation,
        element: (
          <AuthGuard>
            <LiquidationPreviewPage />
          </AuthGuard>
        )
      },
      {
        path: paths.warehouseExport,
        element: (
          <AuthGuard>
            <ExportWarehousePreviewPage />
          </AuthGuard>
        )
      },
      {
        path: paths.warehouseImport,
        element: (
          <AuthGuard>
            <ImportWarehousePreviewPage />
          </AuthGuard>
        )
      },
      {
        path: 'error',
        children: [
          { path: '500', element: <Page500 /> },
          { path: '404', element: <Page404 /> },
          { path: '403', element: <Page403 /> },
        ],
      },
    ],
  },
];
