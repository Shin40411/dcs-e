import { DataGrid, gridClasses, GridColDef, GridRowSelectionModel, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton } from "@mui/x-data-grid";
import { EmptyContent } from "../empty-content";
import { Box, Button, Card, Stack, TablePagination, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, memo, ReactNode, SetStateAction, useState } from "react";
import type { GridToolbarProps } from "@mui/x-data-grid";
import { Iconify } from "../iconify";
import { UseBooleanReturn } from "minimal-shared/hooks";

type GridProps = {
    dataFiltered: any[];
    columns: GridColDef[];
    loading: boolean;
    rowSelectionModel: (selectionModel: GridRowSelectionModel) => void;
    paginationCount: number;
    page: number;
    handleChangePage: (event: unknown, newPage: number) => void;
    rowsPerPage: number;
    handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
    searchText?: string;
    onSearchChange?: (value: string) => void;
    disableDefaultFilter?: boolean;
    additionDefaultFilter?: ReactNode;
    additionDefaultFilterSub?: ReactNode;
    openBin?: UseBooleanReturn;
    additionalFilter?: ReactNode;
};

export function UseGridTableList({
    dataFiltered,
    columns,
    loading,
    rowSelectionModel,
    paginationCount,
    page,
    handleChangePage,
    rowsPerPage,
    handleChangeRowsPerPage,
    searchText = '',
    onSearchChange = () => { },
    disableDefaultFilter = false,
    additionDefaultFilter,
    additionDefaultFilterSub,
    openBin,
    additionalFilter
}: GridProps) {
    return (
        <Card
            elevation={0}
            sx={(theme) => ({
                minHeight: 640,
                flexGrow: { md: 1 },
                display: { md: 'flex' },
                height: { xs: 800, md: '1px' },
                flexDirection: { md: 'column' },
                "&&": {
                    borderRadius: 0,
                    border: `1px solid ${theme.palette.divider}`,
                },
            })}
        >
            <DataGrid
                disableRowSelectionOnClick
                disableColumnMenu
                rows={dataFiltered}
                columns={columns}
                hideFooterPagination
                loading={loading}
                getRowHeight={() => 'auto'}
                onRowSelectionModelChange={rowSelectionModel}
                localeText={{
                    toolbarColumns: 'Quản lý cột',
                    toolbarFilters: 'Bộ lọc',
                    toolbarDensity: 'Mật độ hiển thị',
                    toolbarDensityCompact: 'Chặt',
                    toolbarDensityStandard: 'Tiêu chuẩn',
                    toolbarDensityComfortable: 'Rộng',
                    toolbarExport: 'Xuất dữ liệu',

                    filterPanelAddFilter: 'Thêm điều kiện lọc',
                    filterPanelRemoveAll: 'Xóa tất cả',
                    filterPanelDeleteIconLabel: 'Xóa',
                    filterPanelColumns: 'Cột',
                    filterPanelOperator: 'So sánh',
                    filterPanelOperatorAnd: 'Và',
                    filterPanelOperatorOr: 'Hoặc',
                    filterPanelInputLabel: 'Giá trị',
                    filterPanelInputPlaceholder: 'Nhập giá trị...',
                    filterOperatorContains: 'Chứa',
                    filterOperatorEquals: 'Bằng',
                    filterOperatorStartsWith: 'Bắt đầu với',
                    filterOperatorEndsWith: 'Kết thúc với',
                    filterOperatorIs: 'Là',
                    filterOperatorNot: 'Không là',
                    filterOperatorAfter: 'Sau',
                    filterOperatorOnOrAfter: 'Vào hoặc sau',
                    filterOperatorBefore: 'Trước',
                    filterOperatorOnOrBefore: 'Vào hoặc trước',
                    filterOperatorIsEmpty: 'Rỗng',
                    filterOperatorIsNotEmpty: 'Không rỗng',
                    filterOperatorDoesNotContain: 'Không chứa',
                    filterOperatorDoesNotEqual: 'Không bằng',
                    filterOperatorIsAnyOf: 'Một trong',

                    columnMenuFilter: 'Lọc',
                    columnMenuHideColumn: 'Ẩn cột',
                    columnMenuUnsort: 'Bỏ sắp xếp',
                    columnMenuSortAsc: 'Sắp xếp tăng dần',
                    columnMenuSortDesc: 'Sắp xếp giảm dần',

                    columnsManagementSearchTitle: 'Tìm kiếm cột',
                    columnsManagementShowHideAllText: 'Ẩn/Hiện tất cả',
                    columnsManagementReset: 'Đặt lại',
                    columnsManagementNoColumns: 'Không có cột tương ứng',

                    noRowsLabel: 'Không có dữ liệu',
                    noResultsOverlayLabel: 'Không tìm thấy kết quả',
                }}
                slots={{
                    toolbar: CustomToolbarMemo,
                    noRowsOverlay: () => <EmptyContent />,
                    noResultsOverlay: () => <EmptyContent title="Không có kết quả" />,
                }}
                slotProps={{
                    toolbar: {
                        searchText,
                        onSearchChange,
                        disableDefaultFilter,
                        additionDefaultFilter,
                        additionDefaultFilterSub,
                        openBin,
                        additionalFilter,
                    },
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
                count={paginationCount}
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
    );
}

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        setFilterButtonEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
        disableDefaultFilter?: boolean;
        additionDefaultFilter?: ReactNode;
        additionDefaultFilterSub?: ReactNode;
        searchText?: string;
        onSearchChange?: (value: string) => void;
        openBin?: UseBooleanReturn;
        additionalFilter?: ReactNode;
    }
}

type CustomToolbarProps = GridToolbarProps & {
    searchText?: string;
    disableDefaultFilter?: boolean;
    additionDefaultFilter?: ReactNode;
    additionDefaultFilterSub?: ReactNode;
    onSearchChange?: (value: string) => void;
    openBin?: UseBooleanReturn;
    additionalFilter?: ReactNode;
};

function CustomToolbarComponent(props: CustomToolbarProps) {
    const {
        searchText = '',
        disableDefaultFilter = false,
        additionDefaultFilter,
        additionDefaultFilterSub,
        onSearchChange = () => { },
        openBin,
        additionalFilter,
        ...rest
    } = props;

    return (
        <>
            {!disableDefaultFilter &&
                <GridToolbarContainer {...rest}>
                    {additionDefaultFilter &&
                        <>
                            {additionDefaultFilter}
                            <Box sx={{ flexGrow: 1 }} />
                        </>
                    }
                    <GridToolbarColumnsButton />
                    <GridToolbarFilterButton />
                    <GridToolbarDensitySelector />

                    {openBin && (
                        <Button
                            variant="text"
                            color="error"
                            startIcon={<Iconify icon="mdi:delete" sx={{ width: 24, height: 24 }} />}
                            onClick={() => openBin?.onTrue?.()}
                        >
                            Thùng rác
                        </Button>
                    )}

                    {!additionDefaultFilterSub &&
                        <Box sx={{ flexGrow: 1 }} />
                    }

                    {additionDefaultFilterSub &&
                        additionDefaultFilterSub}

                    <TextField
                        size="small"
                        variant="outlined"
                        value={searchText}
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        placeholder="Tìm kiếm..."
                        InputProps={{
                            startAdornment: (
                                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20, mr: 1 }} />
                            ),
                        }}
                        sx={{
                            '& .MuiInputBase-input': {
                                p: '8.5px 14px !important',
                            },
                        }}
                    />

                </GridToolbarContainer>
            }
            {additionalFilter && additionalFilter}
        </>
    );
}

const CustomToolbarMemo = memo(CustomToolbarComponent);