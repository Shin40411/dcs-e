import { Box, Typography, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, List, ListItem, ListItemText } from "@mui/material";
import { useRef } from "react";
import { Logo } from "src/components/logo";
import { IContractItem } from "src/types/contract";
import { PAPER_W, useScaleToFit } from "src/utils/scale-pdf";

export const ContractPreview = ({ contract }: { contract: IContractItem }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const scale = useScaleToFit(containerRef);

    const pageOne = () => (
        <>
            <Stack flexDirection="column" mb={2}>
                <Box textAlign="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                        CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </Typography>
                    <Typography variant="subtitle2">Độc lập – Tự do – Hạnh phúc</Typography>
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
                <Typography variant="h6" fontWeight="bold" textTransform="uppercase">
                    HỢP ĐỒNG MUA BÁN
                </Typography>
                <Typography>Số: {contract.contractNo}</Typography>
            </Box>

            <Stack px={6}>
                <Stack width="100%" direction="row" justifyContent="center">
                    <List>
                        <ListItem sx={{ py: 0, textAlign: 'justify', textIndent: '15px' }}>
                            <Typography>
                                - Căn cứ Bộ Luật Dân sự số 91/2015/QH13 ngày 24 tháng 11 năm 2015 của Nước Cộng hòa xã hội chủ nghĩa Việt Nam;
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 0, textAlign: 'justify', textIndent: '15px' }}>
                            <Typography>
                                - Căn cứ Luật Thương mại số 36/2005/QH11 ngày 14/6/2005 của Quốc Hội Nước Cộng hòa xã hội chủ nghĩa Việt Nam;
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 0, textAlign: 'justify', textIndent: '15px' }}>
                            <Typography>
                                - Căn cứ Luật Doanh Nghiệp Số 68/2014/QH13 ngày 26/11/2014 của Quốc Hội Nước Cộng hòa xã hội chủ nghĩa Việt Nam;
                            </Typography>
                        </ListItem>
                        <ListItem sx={{ py: 0, textAlign: 'justify', textIndent: '15px' }}>
                            <Typography>
                                - Căn cứ vào nhu cầu và khả năng của hai Bên.
                            </Typography>
                        </ListItem>
                    </List>
                </Stack>

                {/* Bên A */}
                <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        BÊN A (BÊN BÁN):
                    </Typography>
                    <List sx={{ pl: 2 }}>
                        {contract.companyName && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography>{contract.companyName}</Typography>
                            </ListItem>
                        )}

                        {contract.customerAddress && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography>Địa chỉ: {contract.customerAddress}</Typography>
                            </ListItem>
                        )}

                        {contract.customerPhone && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography>Điện thoại: {contract.customerPhone}</Typography>
                            </ListItem>
                        )}

                        {contract.customerEmail && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography>Email: {contract.customerEmail}</Typography>
                            </ListItem>
                        )}

                        {contract.createdBy && (
                            <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                                <Typography>
                                    Đại diện: {contract.createdBy} – Chức vụ: Giám Đốc
                                </Typography>
                            </ListItem>
                        )}
                    </List>
                </Box>

                {/* Bên B */}
                <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        BÊN B (BÊN MUA):
                    </Typography>
                    <List sx={{ pl: 2 }}>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography>{contract.customerName}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography>Địa chỉ: {contract.deliveryAddress}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography>Điện thoại: {contract.customerPhone}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography>Email: {contract.customerEmail}</Typography>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item', listStyleType: '"- "', py: 0 }}>
                            <Typography>Đại diện: {contract.createdBy} – Chức vụ: Giám Đốc</Typography>
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
                        <Logo sx={{ height: '35px !important' }} width={70} />
                    </Box>
                    {pageOne()}

                    <Box mt={4} display="flex" justifyContent="space-between" />
                </Box>
            </Box>
        </Box>
    );
};
