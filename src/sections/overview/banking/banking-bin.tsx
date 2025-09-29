import { Box, Drawer, DrawerProps, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGetDeletedBankAccounts } from "src/actions/bankAccount";
import { TableRecycleBin } from "src/components/table";
import { CONFIG } from "src/global-config";
import { endpoints } from "src/lib/axios";
import { IBankAccountItem } from "src/types/bankAccount";
import { mutate } from "swr";

type Props = DrawerProps & {
    open: boolean;
    onClose: () => void;
};

export function BankingBin({ open, onClose, ...other }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);

    const { bankAccounts, pagination, bankAccountsLoading, bankAccountsEmpty } = useGetDeletedBankAccounts({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        enabled: open,
    });

    const [tableData, setTableData] = useState<IBankAccountItem[]>(bankAccounts);

    useEffect(() => {
        if (!open) {
            mutate(
                endpoints.bankAccount.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=0`),
                undefined,
                false
            );
        }
    }, [open, page, rowsPerPage]);


    useEffect(() => {
        setTableData(bankAccounts);
    }, [bankAccounts]);

    if (bankAccountsLoading || !tableData) {
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
                columnName="Tên tài khoản ngân hàng"
                isEmpty={bankAccountsEmpty}
            />
        </Drawer>
    );
}