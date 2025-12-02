import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetDeletedEmployees } from "src/actions/employee";
import { EntityRestoreType, restoreAll } from "src/actions/restore";
import { TableRecycleBin } from "src/components/table";
import { CONFIG } from "src/global-config";
import { endpoints } from "src/lib/axios";
import { IEmployeeItem } from "src/types/employee";
import { mutate } from "swr";

type Props = DrawerProps & {
    open: boolean;
    onClose: () => void;
    listMutation: () => void;
};

export function EmployeeBin({ open, onClose, listMutation, ...other }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const typeRestore = EntityRestoreType;

    const { employees, pagination, employeesLoading, employeesEmpty, mutation } = useGetDeletedEmployees({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        enabled: open,
    });

    const [tableData, setTableData] = useState<IEmployeeItem[]>(employees);

    useEffect(() => {
        if (!open) {
            mutate(
                endpoints.employees.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=0`),
                undefined,
                false
            );
        }
    }, [open, page, rowsPerPage]);


    useEffect(() => {
        setTableData(employees);
    }, [employees]);

    if (employeesLoading || !tableData) {
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

    const handleRestore = async (ids: string[]) => {
        if (!ids || ids.length === 0) {
            toast.error("Vui lòng chọn ít nhất một mục để khôi phục.");
            return;
        }

        try {
            toast.loading("Đang khôi phục dữ liệu...", { id: "restore" });

            const res = await restoreAll(ids, typeRestore.Employees);
            console.log(res);

            if (res?.statusCode === 200) {
                toast.success(res.message || "Khôi phục thành công!", { id: "restore" });
            } else {
                toast.error(res?.message || "Không thể khôi phục dữ liệu.", { id: "restore" });
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error?.message || "Có lỗi xảy ra khi khôi phục.", { id: "restore" });
        } finally {
            mutation();
            listMutation();
        }
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
                columnName="Tên nhân viên"
                isEmpty={employeesEmpty}
            />
        </Drawer>
    );
}