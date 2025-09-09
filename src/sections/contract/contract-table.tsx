import { Button, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { IContract } from "src/types/contract";

type ContractTableProps = {
    contracts: IContract[];
    onView: (c: IContract) => void;
};

export function ContractTable({ contracts, onView }: ContractTableProps) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Mã hợp đồng</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell>Ngày ký</TableCell>
                    <TableCell>Ngày hết hạn</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Tổng giá trị</TableCell>
                    <TableCell>Hành động</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {contracts.map((c) => (
                    <TableRow key={c.id}>
                        <TableCell>{c.id}</TableCell>
                        <TableCell>{c.customer}</TableCell>
                        <TableCell>{c.signedDate}</TableCell>
                        <TableCell>{c.expireDate}</TableCell>
                        <TableCell>
                            <Typography color={c.status === 'Hiệu lực' ? 'success.main' : 'error.main'}>
                                {c.status}
                            </Typography>
                        </TableCell>
                        <TableCell>{c.total}</TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={1}>
                                <Button size="small" onClick={() => onView(c)}>
                                    Xem
                                </Button>
                                <Button size="small" variant="outlined">
                                    Xuất PDF
                                </Button>
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    );
}