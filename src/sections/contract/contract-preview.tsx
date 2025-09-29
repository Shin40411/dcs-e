import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useRef } from "react";
import { IContractItem } from "src/types/contract";
import { fCurrency } from "src/utils/format-number";
import { fDateTime } from "src/utils/format-time-vi";
import { PAPER_W, useScaleToFit } from "src/utils/scale-pdf";

export const ContractPreview = ({ contract }: { contract: IContractItem }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const scale = useScaleToFit(containerRef);

    const pageOne = () => (
        <>
            <Box textAlign="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </Typography>
                <Typography variant="subtitle2">Độc lập – Tự do – Hạnh phúc</Typography>
            </Box>

            <Box textAlign="center" mb={3}>
                <Typography variant="h6" fontWeight="bold" textTransform="uppercase">
                    HỢP ĐỒNG MUA BÁN
                </Typography>
                <Typography>Số: {contract.contractNo}</Typography>
            </Box>

            {/* Bên A */}
            <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                    BÊN A (BÊN BÁN):
                </Typography>
                <Typography>{contract.companyName}</Typography>
                <Typography>Địa chỉ: {contract.customerAddress}</Typography>
                <Typography>Điện thoại: {contract.customerPhone}</Typography>
                <Typography>Email: {contract.customerEmail}</Typography>
                <Typography>Đại diện: {contract.createdBy} – Chức vụ: Giám Đốc</Typography>
            </Box>

            {/* Bên B */}
            <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                    BÊN B (BÊN MUA):
                </Typography>
                <Typography>{contract.customerName}</Typography>
                <Typography>Địa chỉ: {contract.deliveryAddress}</Typography>
                <Typography>Điện thoại: {contract.customerPhone}</Typography>
                <Typography>Email: {contract.customerEmail}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                ĐIỀU I. PHẠM VI CUNG CẤP
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>STT</TableCell>
                            <TableCell>Tên vật tư</TableCell>
                            <TableCell>Đơn vị</TableCell>
                            <TableCell>Đơn giá</TableCell>
                            <TableCell>SL</TableCell>
                            <TableCell>VAT</TableCell>
                            <TableCell>Thành tiền</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>Camera XYZ</TableCell>
                            <TableCell>Cái</TableCell>
                            <TableCell>8,000,000</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>10%</TableCell>
                            <TableCell>8,800,000</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={3}>
                <Typography variant="subtitle1" fontWeight="bold">
                    ĐIỀU II. THỜI GIAN GIAO NHẬN HÀNG
                </Typography>
                <Typography>
                    Địa điểm giao hàng: {contract.deliveryAddress}
                </Typography>
                <Typography>
                    Thời gian: {fDateTime(contract.deliveryTime)}
                </Typography>
            </Box>

            <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                    ĐIỀU III. GIÁ TRỊ HỢP ĐỒNG
                </Typography>
                <Typography>
                    Tổng giá trị hợp đồng: {fCurrency(contract.total)}
                </Typography>
                <Typography>
                    Đặt cọc lần 1: {fCurrency(contract.downPayment)}
                </Typography>
                <Typography>
                    Thanh toán tiếp theo: {fCurrency(contract.nextPayment)}
                </Typography>
            </Box>
        </>
    );

    return (
        <Box ref={containerRef} sx={{
            userSelect: 'none',
            width: "100%",
            height: "100%",
            position: "relative",
            overflow: "hidden"
        }}>
            <Box
                sx={{
                    width: PAPER_W,
                    // height: PAPER_H,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    bgcolor: "rgba(64,87,109,.07)",
                    overflow: "hidden",
                    p: 5
                }}
            >
                <Box sx={{ p: 2, bgcolor: 'common.white' }}>
                    {pageOne()}

                    <Box mt={4} display="flex" justifyContent="space-between">
                        <Typography textAlign="center">ĐẠI DIỆN BÊN A</Typography>
                        <Typography textAlign="center">ĐẠI DIỆN BÊN B</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
