import { Avatar, Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { IEmployeeItem } from "src/types/employee";
import { fCurrency, fCurrencyNoUnit } from "src/utils/format-number";

type IEmployeeStatisticItem = IEmployeeItem & {
    totalAmounts: number;
    percentOfTotal: number;
    quantityContract: number;
};

const saler: IEmployeeStatisticItem[] = [
    {
        id: 10,
        name: 'Trần Quốc Bảo',
        status: true,
        createDate: '2002-05-15T23:57:04',
        createBy: '',
        lastLogin: null,
        gender: '',
        email: 'tqbao.office@gmail.com',
        rightID: 0,
        departmentId: 0,
        department: '',
        image: '',
        birthday: '2002-05-15T23:57:04',
        address: '',
        phone: '0386040060',
        bankAccount: '',
        bankName: '',
        balance: 0,
        employeeTypeId: 0,
        employeeType: '',
        totalAmounts: 691635000,
        percentOfTotal: 90.06,
        quantityContract: 11,
    },
    {
        id: 2,
        name: 'Duyên Duyên',
        status: true,
        createDate: '1987-09-03T00:06:30',
        createBy: '',
        lastLogin: null,
        gender: '',
        email: 'ncnnghia@gmail.com',
        rightID: 0,
        departmentId: 0,
        department: '',
        image: '',
        birthday: '1987-09-03T00:06:30',
        address: '',
        phone: '0932090207',
        bankAccount: '',
        bankName: '',
        balance: 0,
        employeeTypeId: 0,
        employeeType: '',
        totalAmounts: 54500000,
        percentOfTotal: 7.1,
        quantityContract: 5,
    },
    {
        id: 19,
        name: 'Sữa Ông Thọ',
        status: true,
        createDate: '1995-10-13T00:00:00',
        createBy: '',
        lastLogin: null,
        gender: '',
        email: 'vana@example.com',
        rightID: 0,
        departmentId: 0,
        department: '',
        image: '',
        birthday: '1995-10-13T00:00:00',
        address: '',
        phone: '0909123456',
        bankAccount: '',
        bankName: '',
        balance: 0,
        employeeTypeId: 0,
        employeeType: '',
        totalAmounts: 21800000,
        percentOfTotal: 2.84,
        quantityContract: 2,
    },
];

export function DashBoardTopSaler() {
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
                        Top Saler
                    </Typography>
                }
                sx={{ pb: 0, px: 2, pt: 2 }}
            />
            <Divider sx={{ mt: 1 }} />
            <CardContent sx={{ px: 2, pt: 1, pb: 2 }}>
                <Stack spacing={1.5}>
                    {saler.map((c, i) => (
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
                                        {c.name}
                                    </Typography>
                                    <Typography fontSize="0.8rem" color="text.secondary" noWrap>
                                        {c.email}
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
                                    {fCurrencyNoUnit(c.totalAmounts)}
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
                                <Typography fontSize="1rem" fontWeight={700} color="rgba(17, 49, 46, 0.7)">
                                    {c.quantityContract}
                                </Typography>
                                <Typography fontSize="0.75rem" color="text.secondary">
                                    {c.percentOfTotal}%
                                </Typography>
                            </Stack>
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}