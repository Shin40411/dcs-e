import type { Theme, SxProps } from '@mui/material/styles';
import type { UseSetStateReturn } from 'minimal-shared/hooks';
import type { IProductItem, IProductTableFilters, ProductItem, ProductTableFilters } from 'src/types/product';
import type {
  GridColDef,
  GridSlotProps,
  GridRowSelectionModel,
  GridActionsCellItemProps,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useEffect, useCallback } from 'react';
import { useBoolean, useSetState } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import {
  DataGrid,
  gridClasses,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { PRODUCT_STOCK_OPTIONS } from 'src/_mock';
import { useGetProducts } from 'src/actions/product';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { EmptyContent } from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { ProductTableToolbar } from '../product-table-toolbar';
import { ProductTableFiltersResult } from '../product-table-filters-result';
import {
  RenderCellStock,
  RenderCellPrice,
  RenderCellProduct,
  RenderCellCreatedAt,
  RenderCellPurchasePrice,
  RenderCellDescription,
  RenderCellVAT,
  RenderCellStatus,
} from '../product-table-row';
import { viVN } from '@mui/x-data-grid/locales';
import { ProductNewEditForm } from '../product-new-edit-form';
import { TablePagination } from '@mui/material';

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'Draft' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function ProductListView() {
  const openCrudForm = useBoolean();
  const confirmDialog = useBoolean();
  const confirmDelRowDialog = useBoolean();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { products, pagination, productsLoading } = useGetProducts({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [tableData, setTableData] = useState<ProductItem[]>(products);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);
  const [tableRowSelected, setTableRowSelected] = useState<ProductItem | null>(null);
  const [rowIdSelected, setRowIdSelected] = useState('');

  const filters = useSetState<ProductTableFilters>({ Search: '', Filter: '' });
  const { state: currentFilters } = filters;

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);

  const canReset = currentFilters.Search.length > 0 || currentFilters.Filter.length > 0;

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters: currentFilters,
  });

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Xóa thành công 1 sản phẩm!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success(`Xóa thành công ${deleteRows.length} sản phẩm!`);

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  // const CustomToolbarCallback = useCallback(
  //   () => (
  //     <CustomToolbar
  //       filters={filters}
  //       canReset={canReset}
  //       selectedRowIds={selectedRowIds}
  //       setFilterButtonEl={setFilterButtonEl}
  //       filteredResults={dataFiltered.length}
  //       onOpenConfirmDeleteRows={confirmDialog.onTrue}
  //     />
  //   ),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [currentFilters, selectedRowIds]
  // );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Tên sản phẩm',
      flex: 1,
      minWidth: 260,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} />
      ),
    },
    {
      field: 'code',
      headerName: 'Mã sản phẩm',
      width: 160,
      renderCell: (params) => <Box>{params.row.code}</Box>
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1,
      minWidth: 300,
      renderCell: (params) => <RenderCellDescription params={params} />
    },
    {
      field: 'purchasePrice',
      headerName: 'Giá nhập',
      width: 140,
      renderCell: (params) => <RenderCellPurchasePrice params={params} />
    },
    {
      field: 'price',
      headerName: 'Giá bán',
      width: 140,
      renderCell: (params) => <RenderCellPrice params={params} />
    },
    {
      field: 'unit',
      headerName: 'Đơn vị',
      width: 100,
      renderCell: (params) => <Box>{params.row.unit}</Box>
    },
    {
      field: 'stock',
      headerName: 'Tồn kho',
      width: 120,
      renderCell: (params) => <RenderCellStock params={params} />,
    },
    {
      field: 'warranty',
      headerName: 'Bảo hành (tháng)',
      width: 160,
      renderCell: (params) => <Box>{params.row.warranty}</Box>
    },
    {
      field: 'createdDate',
      headerName: 'Ngày tạo',
      width: 180,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'manufacturer',
      headerName: 'Hãng SX',
      width: 140,
      renderCell: (params) => <Box>{params.row.manufacturer}</Box>
    },
    {
      field: 'vat',
      headerName: 'VAT (%)',
      width: 100,
      renderCell: (params) => <RenderCellVAT params={params} />,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 120,
      type: 'singleSelect',
      editable: true,
      renderCell: (params) => <RenderCellStatus params={params} />,
    },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="Chi tiết"
          onClick={() => { }}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Chỉnh sửa"
          onClick={() => { setRowIdSelected(params.row.id); openCrudForm.onTrue(); }}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Xóa"
          onClick={() => { confirmDelRowDialog.onTrue(); setRowIdSelected(params.row.id) }}
          sx={{ color: 'error.main' }}
        />
      ]
    }
  ];
  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  const renderConfirmDialog = () => (
    <ConfirmDialog
      open={confirmDialog.value}
      onClose={confirmDialog.onFalse}
      title="Xác nhận xóa hàng loạt sản phẩm"
      content={
        <>
          Bạn có chắc chắn muốn xóa <strong> {selectedRowIds.length} </strong> sản phẩm?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRows();
            confirmDialog.onFalse();
          }}
        >
          Xác nhận
        </Button>
      }
    />
  );

  const renderConfirmDeleteRow = () => (
    <ConfirmDialog
      open={confirmDelRowDialog.value}
      onClose={confirmDelRowDialog.onFalse}
      title="Xác nhận xóa sản phẩm"
      content={
        <>
          Bạn có chắc chắn muốn xóa sản phẩm này?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRow(rowIdSelected);
            confirmDelRowDialog.onFalse();
          }}
        >
          Xác nhận
        </Button>
      }
    />
  );

  const renderCRUDForm = () => (
    <ProductNewEditForm
      open={openCrudForm.value}
      onClose={openCrudForm.onFalse}
      selectedId={rowIdSelected || undefined}
      page={page}
      rowsPerPage={rowsPerPage}
    />
  );

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Sản phẩm"
          links={[
            { name: 'Tổng quan', href: paths.dashboard.root },
            { name: 'Danh mục', href: paths.dashboard.product.root },
            { name: 'Sản phẩm' },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={() => {
                openCrudForm.onTrue();
                setRowIdSelected('');
              }}
            >
              Tạo sản phẩm
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            minHeight: 640,
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: '1px' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            hideFooterPagination
            loading={productsLoading}
            getRowHeight={() => 'auto'}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="Không có kết quả" />,
            }}
            slotProps={{
              toolbar: { setFilterButtonEl },
              panel: { anchorEl: filterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{
              [`& .${gridClasses.cell}`]: {
                alignItems: 'center',
                display: 'inline-flex',
              },
            }}
          />
          <TablePagination
            component="div"
            count={pagination?.totalRecord ?? 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            labelRowsPerPage="Số dòng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} trên ${count !== -1 ? count : `nhiều hơn ${to}`}`
            }
          />
        </Card>
      </DashboardContent>

      {renderConfirmDialog()}
      {renderConfirmDeleteRow()}
      {renderCRUDForm()}
    </>
  );
}

// ----------------------------------------------------------------------

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  }
}

type CustomToolbarProps = GridSlotProps['toolbar'] & {
  canReset: boolean;
  filteredResults: number;
  selectedRowIds: GridRowSelectionModel;
  filters: UseSetStateReturn<IProductTableFilters>;

  onOpenConfirmDeleteRows: () => void;
};

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}: CustomToolbarProps) {
  return (
    <>
      <GridToolbarContainer>
        <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        />

        <GridToolbarQuickFilter />

        <Box
          sx={{
            gap: 1,
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              Xóa ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          <GridToolbarExport />
        </Box>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type GridActionsLinkItemProps = Pick<GridActionsCellItemProps, 'icon' | 'label' | 'showInMenu'> & {
  href: string;
  sx?: SxProps<Theme>;
  ref?: React.RefObject<HTMLLIElement | null>;
};

export function GridActionsLinkItem({ ref, href, label, icon, sx }: GridActionsLinkItemProps) {
  return (
    <MenuItem ref={ref} sx={sx}>
      <Link
        component={RouterLink}
        href={href}
        underline="none"
        color="inherit"
        sx={{ width: 1, display: 'flex', alignItems: 'center' }}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        {label}
      </Link>
    </MenuItem>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ProductItem[];
  filters: ProductTableFilters;
};

function applyFilter({ inputData, filters }: ApplyFilterProps) {
  const { Search, Filter } = filters;

  if (Search) {
    inputData = inputData.filter((product) => Search.includes(product.name));
  }

  if (Filter) {
    inputData = inputData.filter((product) => Filter.includes(product.code));
  }

  return inputData;
}
