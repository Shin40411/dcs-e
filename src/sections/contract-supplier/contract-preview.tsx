import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, List, ListItem, ListItemText } from "@mui/material";
import { useRef } from "react";
import { Logo } from "src/components/logo";
import { ICompanyInfoItem } from "src/types/companyInfo";
import { IContractSupplyItem } from "src/types/contractSupplier";
import { PAPER_W, useScaleToFit } from "src/utils/scale-pdf";

export const ContractPreview = ({ contract, companyInfo }: { contract: IContractSupplyItem; companyInfo: ICompanyInfoItem | null; }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const scale = useScaleToFit(containerRef);

    const pageOne = () => (
        <>
            <Stack flexDirection="column" mb={2}>
                <Box textAlign="center">
                    <Typography variant="subtitle1" fontWeight="bold" color="#1C252E">
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </Typography>
                    <Typography variant="subtitle2" color="#1C252E">Độc lập – Tự do – Hạnh phúc</Typography>
                </Box>
                <Box
                    sx={{
                        height: 1.3,
                        width: 180,
                        backgroundColor: 'rgba(0, 0, 0, 1)',
                        alignSelf: 'center',
                    }}
                />
            </Stack>

            <Box textAlign="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" textTransform="uppercase" color="#1C252E">
                    HỢP ĐỒNG NHÀ CUNG CẤP
                </Typography>
                <Typography color="#1C252E">Số: {contract.contractNo}</Typography>
            </Box>

            <Stack px={6}>
                <Stack width="100%" direction="row" justifyContent="center">
                    <List>
                        <ListItem sx={{ py: 0, textAlign: 'justify', textIndent: '15px' }}>
                            <Typography color="#1C252E">
                                - Căn cứ Bộ Luật Dân sự số 91/2015/QH13 ngày 24 tháng 11 năm 2015 của Nước Cộng hòa xã hội chủ nghĩa Việt Nam;
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 0, textAlign: 'justify', textIndent: '15px' }}>
                            <Typography color="#1C252E">
                                - Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14/6/2005 của Quốc Hội Nước Cộng hòa xã hội chủ nghĩa Việt Nam;
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 0, textAlign: 'justify', textIndent: '15px' }}>
                            <Typography color="#1C252E">
                                - Căn cứ Luật Doanh Nghiệp Số 68/2014/QH13 ngày 26/11/2014 của Quốc Hội Nước Cộng hòa xã hội chủ nghĩa Việt Nam;
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 0, textAlign: 'justify', textIndent: '15px' }}>
                            <Typography color="#1C252E">
                                - Căn cứ vào nhu cầu và khả năng của hai Bên.
                            </Typography>
                        </ListItem>
                    </List>
                </Stack>

                {/* Bên A */}
                <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#1C252E">
                        BÊN A (BÊN BÁN):
                    </Typography>
                    <List sx={{ pl: 2 }}>
                        {contract.companyName && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography color="#1C252E">{contract.companyName}</Typography>
                            </ListItem>
                        )}

                        {contract.deliveryAddress && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography color="#1C252E">Địa chỉ: {contract.deliveryAddress}</Typography>
                            </ListItem>
                        )}

                        {contract.supplierPhone && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography color="#1C252E">Điện thoại: {contract.supplierPhone}</Typography>
                            </ListItem>
                        )}

                        {contract.supplierEmail && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography color="#1C252E">Email: {contract.supplierEmail}</Typography>
                            </ListItem>
                        )}

                        {contract.createdBy && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography color="#1C252E">
                                    Đại diện: {contract.createdBy} – Chức vụ: Giám Đốc
                                </Typography>
                            </ListItem>
                        )}
                    </List>
                </Box>

                {/* Bên B */}
                <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#1C252E">
                        BÊN B (BÊN MUA):
                    </Typography>
                    <List sx={{ pl: 2 }}>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography color="#1C252E">{contract.supplierName}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography color="#1C252E">Địa chỉ: {contract.deliveryAddress}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography color="#1C252E">Điện thoại: {contract.supplierPhone}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography color="#1C252E">Email: {contract.supplierEmail}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography color="#1C252E">Đại diện: {contract.createdBy} – Chức vụ: Giám Đốc</Typography>
                        </ListItem>
                    </List>
                </Box>
            </Stack>
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
                    py: 5,
                    px: 15,
                }}
            >
                <Box sx={{
                    position: 'relative',
                    p: 2,
                    bgcolor: 'common.white',
                    boxShadow: '0px 0px 0px 1px rgba(64,87,109,.04),0px 2px 4px -1px rgba(64,87,109,.3),inset 0 0 0 1px rgba(0,0,0,.1)',
                    '&::before, &::after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        bgcolor: 'grey.100',
                        boxShadow: '0px 2px 4px rgba(64,87,109,.15)',
                        zIndex: -1,
                    },
                    '&::after': {
                        top: 16,
                        left: 16,
                    },
                }}>
                    <Box
                        sx={{
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 30,
                                left: 30,
                                width: '100%',
                                height: '100%',
                                bgcolor: 'grey.200',
                                boxShadow: '0px 2px 4px rgba(64,87,109,.12)',
                                zIndex: -2,
                            },
                        }}
                    />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start'
                    }}>
                        <Logo sx={{ height: '35px !important' }} src={companyInfo?.logo} width={70} />
                    </Box>
                    {pageOne()}

                    <Box mt={4} display="flex" justifyContent="space-between" />
                </Box>
            </Box>
        </Box>
    );
};
