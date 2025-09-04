import { Button } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBoolean } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { useGetUnits } from "src/actions/unit";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { UseGridTableList } from "src/components/data-grid-table/data-grid-table";
import { Iconify } from "src/components/iconify";
import { UNIT_COLUMNS } from "src/const/unit";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { IUnitItem } from "src/types/unit";
import { UnitNewEditForm } from "../unit-new-edit-form";

export function UnitListView() {
    const openCrudForm = useBoolean();
    const confirmDialog = useBoolean();
    const confirmDelRowDialog = useBoolean();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchText, setSearchText] = useState('');
    const { units, pagination, unitsLoading } = useGetUnits({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText,
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

    const [tableData, setTableData] = useState<IUnitItem[]>(units);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
    const [tableRowSelected, setTableRowSelected] = useState<IUnitItem | null>(null);
    const [rowIdSelected, setRowIdSelected] = useState(0);

    useEffect(() => {
        if (units.length) {
            setTableData(units);
        }
    }, [units]);

    const dataFiltered = tableData;

    const renderCRUDForm = () => (
        <UnitNewEditForm
            open={openCrudForm.value}
            onClose={openCrudForm.onFalse}
            selectedId={rowIdSelected || undefined}
            page={page}
            rowsPerPage={rowsPerPage}
            currentUnit={tableRowSelected || undefined}
        />
    );

    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Đơn vị tính"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Cấu hình' },
                        { name: 'Đơn vị tính' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => {
                                openCrudForm.onTrue();
                                setTableRowSelected(null);
                            }}
                        >
                            Tạo đơn vị tính
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <UseGridTableList
                    dataFiltered={dataFiltered}
                    loading={unitsLoading}
                    columns={UNIT_COLUMNS({ openCrudForm, confirmDelRowDialog, setTableRowSelected, setRowIdSelected, page, rowsPerPage })}
                    rowSelectionModel={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
                    paginationCount={pagination?.totalRecord ?? 0}
                    page={page}
                    handleChangePage={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    searchText={searchText}
                    onSearchChange={setSearchText}
                />
                {renderCRUDForm()}
            </DashboardContent>
        </>
    );
}