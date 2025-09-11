import { Box, Menu, MenuItem } from "@mui/material";
import { GridActionsCellItem, GridColDef } from "@mui/x-data-grid"
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useState } from "react";
import { Iconify } from "src/components/iconify";
import { RenderCellCreatedAt, RenderCellDescription, RenderCellPrice, RenderCellProduct, RenderCellPurchasePrice, RenderCellStatus, RenderCellStock, RenderCellVAT } from "src/sections/product/product-table-row";

type ColumnProps = {
  openDetailsForm?: UseBooleanReturn;
  openCrudForm: UseBooleanReturn;
  confirmDelRowDialog: UseBooleanReturn;
  setRowIdSelected: (id: any) => void;
}

export const PRODUCT_COLUMNS: ({
  openDetailsForm,
  openCrudForm,
  confirmDelRowDialog,
  setRowIdSelected
}: ColumnProps) => GridColDef[] = ({
  openDetailsForm,
  openCrudForm,
  confirmDelRowDialog,
  setRowIdSelected
}) => [
      {
        field: 'name',
        headerName: 'Tên sản phẩm',
        flex: 1,
        minWidth: 300,
        renderCell: (params) => {
          const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

          const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
          };

          const handleClose = () => setAnchorEl(null);

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
              <Box sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleOpen}>
                <RenderCellProduct params={params} />
              </Box>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem
                  onClick={() => {
                    openDetailsForm?.onTrue();
                    setRowIdSelected(params.row.id);
                    handleClose();
                  }}
                >
                  <Iconify icon="solar:eye-bold" />
                  <Box component="span" sx={{ ml: 1 }}>
                    Chi tiết
                  </Box>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    openCrudForm.onTrue();
                    setRowIdSelected(params.row.id);
                    handleClose();
                  }}
                >
                  <Iconify icon="solar:pen-bold" />
                  <Box component="span" sx={{ ml: 1 }}>
                    Chỉnh sửa
                  </Box>
                </MenuItem>
                <MenuItem
                  sx={{ color: 'error.main' }}
                  onClick={() => {
                    confirmDelRowDialog.onTrue();
                    setRowIdSelected(params.row.id);
                    handleClose();
                  }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  <Box component="span" sx={{ ml: 1 }}>
                    Xóa
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          );
        },
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
        sortable: false,
        width: 100,
        renderCell: (params) => <RenderCellVAT params={params} />,
      },
      {
        field: 'status',
        headerName: 'Trạng thái',
        width: 120,
        type: 'singleSelect',
        sortable: false,
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
        hideable: false,
        filterable: false,
        editable: false,
        getActions: (params) => [
          <GridActionsCellItem
            showInMenu
            icon={<Iconify icon="solar:eye-bold" />}
            label="Chi tiết"
            onClick={() => { setRowIdSelected(params.row.id); openDetailsForm?.onTrue(); }}
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