import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetDeletedEmployeeTypes } from "src/actions/employeeType";
import { TableRecycleBin } from "src/components/table";
import { CONFIG } from "src/global-config";
import { endpoints } from "src/lib/axios";
import { IEmployeeTypeItem } from "src/types/employeeType";
import { mutate } from "swr";

type Props = DrawerProps & {
    open: boolean;
    onClose: () => void;
};

export function EmployeeTypeBin({ open, onClose, ...other }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);

    const { employeeTypes, pagination, employeeTypesLoading, employeeTypesEmpty } = useGetDeletedEmployeeTypes({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        enabled: open,
    });

    const [tableData, setTableData] = useState<IEmployeeTypeItem[]>(employeeTypes);

    useEffect(() => {
        if (!open) {
            mutate(
                endpoints.employeeType.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=0`),
                undefined,
                false
            );
        }
    }, [open, page, rowsPerPage]);


    useEffect(() => {
        setTableData(employeeTypes);
    }, [employeeTypes]);

    if (employeeTypesLoading || !tableData) {
        return (
            <Drawer
                open={open}
                onClose={onClose}
                anchor="right"
                slotProps={{
                    backdrop: { invisible: true },
                    paper: { sx: { width: 700 } },
                }}
                {...other}
            >
                <Box sx={{ p: 3 }}>
                    <Typography>Đang tải dữ liệu...</Typography>
                </Box>
            </Drawer>
        );
    }

    const handleRestore = (ids: string[]) => {
        console.log("Khôi phục:", ids);
        // call API restore(ids)
    };

    const handleDelete = (ids: string[]) => {
        console.log("Xóa vĩnh viễn:", ids);
        // call API delete(ids)
    };


    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor="right"
            slotProps={{
                backdrop: { invisible: true },
                paper: { sx: { width: 700 } },
            }}
            {...other}
        >
            <Stack spacing={3} sx={{ p: 3, bgcolor: 'background.neutral' }}>
                <Typography variant="h6" gutterBottom>
                    Thùng rác
                </Typography>
            </Stack>
            <TableRecycleBin
                handleRestore={handleRestore}
                handleDelete={handleDelete}
                tableData={tableData}
                page={page}
                rowsPerPage={rowsPerPage}
                totalRecord={pagination.totalRecord}
                setPage={setPage}
                setRowsPerPage={setRowsPerPage}
                columnName="Tên chức vụ"
                isEmpty={employeeTypesEmpty}
            />
        </Drawer>
    );
}