import { Box, Button, Checkbox, Divider, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow } from "@mui/material";
import { Iconify } from "../iconify";
import { ChangeEvent, useState } from "react";
import { EmptyContent } from "../empty-content";

type Props = {
    handleRestore: (ids: string[]) => void;
    handleDelete: (ids: string[]) => void;
    tableData: any[];
    page?: number;
    rowsPerPage?: number;
    totalRecord?: number;
    setPage?: (page: number) => void;
    setRowsPerPage?: (rowsPerPage: number) => void;
    columnName: string;
    isEmpty: boolean;
}

export function TableRecycleBin({
    handleRestore,
    handleDelete,
    tableData,
    page = 0,
    rowsPerPage = 10,
    totalRecord = 0,
    setPage = () => { },
    setRowsPerPage = () => { },
    columnName,
    isEmpty
}: Props) {
    const [selected, setSelected] = useState<string[]>([]);

    const isAllSelected = tableData.length > 0 && selected.length === tableData.length;
    const isIndeterminate = selected.length > 0 && selected.length < tableData.length;

    const handleSelectRow = (id: string) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = tableData.map((item) => item.id);
            setSelected(allIds);
        } else {
            setSelected([]);
        }
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Stack
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "90vh",
            }}
        >
            <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-start"
                alignContent="center"
                sx={{ py: 2, px: 3 }}
            >
                <Button color="primary" variant="contained"
                    startIcon={
                        <Iconify icon="mdi:restore" sx={{ width: 24, height: 24 }} />
                    }
                    disabled={selected.length === 0}
                    onClick={() => handleRestore(selected)}
                >
                    Khôi phục
                </Button>
                {/* <Button color="error" variant="contained"
                    startIcon={
                        <Iconify icon="material-symbols-light:delete-sweep-sharp" sx={{ width: 24, height: 24 }} />
                    }
                    disabled={selected.length === 0}
                    onClick={() => handleDelete(selected)}
                >
                    Xóa vĩnh viễn
                </Button> */}
            </Stack>
            <Box
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    pb: 2,
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={isIndeterminate}
                                    checked={isAllSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                            </TableCell>
                            <TableCell width={10}>#</TableCell>
                            <TableCell>{columnName}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isEmpty ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <EmptyContent />
                                </TableCell>
                            </TableRow>
                        ) : (
                            tableData.map((item, idx) => {
                                const isSelected = selected.includes(item.id);
                                return (
                                    <TableRow key={item.id} selected={isSelected}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(item.id)}
                                            />
                                        </TableCell>
                                        <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                                        <TableCell>{item.companyName ? item.companyName : item.name}</TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </Box>
            <Divider />
            <TablePagination
                component="div"
                count={totalRecord}
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
        </Stack>
    );
}