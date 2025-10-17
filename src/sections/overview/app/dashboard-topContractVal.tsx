import { Avatar, Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { IContractItem } from "src/types/contract";
import { fCurrency, fCurrencyNoUnit } from "src/utils/format-number";


const contracts: IContractItem[] = [
    {
        id: 1,
        contractNo: '',
        customerID: 0,
        customerName: 'Công ty TNHH MT ...',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerTaxCode: '',
        companyName: '',
        customerBank: '',
        customerBankNo: '',
        signatureDate: '',
        deliveryAddress: '',
        deliveryTime: '',
        downPayment: 0,
        nextPayment: 0,
        lastPayment: 0,
        total: 567_852_000,
        copiesNo: 0,
        keptNo: 0,
        status: 0,
        createDate: '11/09/2025',
        createdBy: '',
        modifyDate: '',
        modifiedBy: '',
        note: '',
        seller: 'Nguyễn Văn An',
        discount: 0,
    },
    {
        id: 2,
        contractNo: '',
        customerID: 0,
        customerName: 'Công ty TNHH ...',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerTaxCode: '',
        companyName: '',
        customerBank: '',
        customerBankNo: '',
        signatureDate: '',
        deliveryAddress: '',
        deliveryTime: '',
        downPayment: 0,
        nextPayment: 0,
        lastPayment: 0,
        total: 367_852_000,
        copiesNo: 0,
        keptNo: 0,
        status: 1,
        createDate: '11/09/2025',
        createdBy: '',
        modifyDate: '',
        modifiedBy: '',
        note: '',
        seller: 'Nguyễn Văn An',
        discount: 0,
    },
    {
        id: 3,
        contractNo: '',
        customerID: 0,
        customerName: 'Công ty ABC',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        customerTaxCode: '',
        companyName: '',
        customerBank: '',
        customerBankNo: '',
        signatureDate: '',
        deliveryAddress: '',
        deliveryTime: '',
        downPayment: 0,
        nextPayment: 0,
        lastPayment: 0,
        total: 167_852_000,
        copiesNo: 0,
        keptNo: 0,
        status: 0,
        createDate: '11/09/2025',
        createdBy: '',
        modifyDate: '',
        modifiedBy: '',
        note: '',
        seller: 'Nguyễn Văn An',
        discount: 0,
    },
];
export function DashBoardTopContractVal() {
    const getStatusLabel = (status: number) =>
        status === 1 ? 'Đã hoàn thành' : 'Đang thực hiện';

    const getStatusColor = (status: number) =>
        status === 1 ? 'rgba(76, 175, 80, 1)' : 'rgba(17, 49, 46, 0.7)';

    return (
        <Card
            sx={{
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                height: '100%'
            }}
        >
            <CardHeader
                title={
                    <Typography fontWeight={700} fontSize={18} color="rgba(5, 0, 78, 1)">
                        Top giá trị hợp đồng
                    </Typography>
                }
                sx={{ pb: 0, px: 2, pt: 2 }}
            />
            <Divider sx={{ mt: 1 }} />
            <CardContent sx={{ px: 2, pt: 1, pb: 2 }}>
                <Stack spacing={1.5}>
                    {contracts.map((c, i) => (
                        <Stack
                            key={c.id}
                            direction="row"
                            alignItems="center"
                            sx={{
                                border: '0.5px solid #ddd',
                                boxShadow: 0.5,
                                borderRadius: 1.5,
                                px: 1.5,
                                py: 1,
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                                sx={{ flex: '1 1 40%' }}
                            >
                                <Iconify
                                    icon={`noto:${i === 0 ? '1st' : i === 1 ? '2nd' : '3rd'}-place-medal`}
                                    width={32}
                                    height={32}
                                />
                                <Box>
                                    <Typography fontWeight={600} fontSize="0.95rem" noWrap>
                                        {c.customerName}
                                    </Typography>
                                    <Typography fontSize="0.8rem" color="text.secondary" noWrap>
                                        {c.seller}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-end"
                                sx={{ flex: '1 1 30%' }}
                            >
                                <Typography fontWeight={700} color="rgba(238, 0, 51, 1)" textAlign="right">
                                    {fCurrencyNoUnit(c.total)}
                                </Typography>
                                <Typography
                                    fontSize="0.75rem"
                                    color="text.secondary"
                                    textAlign="right"
                                    sx={{ width: '100%' }}
                                >
                                    VNĐ
                                </Typography>
                            </Stack>


                            <Stack
                                direction="column"
                                alignItems="flex-end"
                                justifyContent="center"
                                textAlign="right"
                                sx={{ flex: '1 1 30%' }}
                            >
                                <Typography fontSize="0.8rem" color={getStatusColor(c.status)}>
                                    {getStatusLabel(c.status)}
                                </Typography>
                                <Typography fontSize="0.75rem" color="text.secondary">
                                    {String(c.createDate)}
                                </Typography>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}