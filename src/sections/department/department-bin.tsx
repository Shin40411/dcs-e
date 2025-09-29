import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetDeletedDepartments } from "src/actions/department";
import { TableRecycleBin } from "src/components/table";
import { CONFIG } from "src/global-config";
import { endpoints } from "src/lib/axios";
import { IDepartmentItem } from "src/types/department";
import { mutate } from "swr";

type Props = DrawerProps & {
    open: boolean;
    onClose: () => void;
};

export function DepartmentBin({ open, onClose, ...other }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);

    const { departments, pagination, departmentsLoading, departmentsEmpty } = useGetDeletedDepartments({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        enabled: open,
    });

    const [tableData, setTableData] = useState<IDepartmentItem[]>(departments);

    useEffect(() => {
        if (!open) {
            mutate(
                endpoints.department.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=0`),
                undefined,
                false
            );
        }
    }, [open, page, rowsPerPage]);


    useEffect(() => {
        setTableData(departments);
    }, [departments]);

    if (departmentsLoading || !tableData) {
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
                columnName="Tên phòng ban"
                isEmpty={departmentsEmpty}
            />
        </Drawer>
    );
}