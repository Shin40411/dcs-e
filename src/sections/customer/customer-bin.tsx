import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetDeletedCustomers } from "src/actions/customer";
import { TableRecycleBin } from "src/components/table";
import { CONFIG } from "src/global-config";
import { endpoints } from "src/lib/axios";
import { ICustomerItem } from "src/types/customer";
import { mutate } from "swr";

type Props = DrawerProps & {
    open: boolean;
    onClose: () => void;
};

export function CustomerBin({ open, onClose, ...other }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);

    const { customers, pagination, customersLoading, customersEmpty } = useGetDeletedCustomers({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        enabled: open,
    });

    const [tableData, setTableData] = useState<ICustomerItem[]>(customers);

    useEffect(() => {
        if (!open) {
            mutate(
                endpoints.customer.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=0`),
                undefined,
                false
            );
        }
    }, [open, page, rowsPerPage]);


    useEffect(() => {
        setTableData(customers);
    }, [customers]);

    if (customersLoading || !tableData) {
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
                columnName="Tên khách hàng"
                isEmpty={customersEmpty}
            />
        </Drawer>
    );
}