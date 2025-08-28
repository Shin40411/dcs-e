import { Box, Icon, ListItemText } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { fCurrency } from "src/utils/format-number";

type ParamsProps = {
    params: GridCellParams;
};

export function RenderBankAccountNameCell({ params }: ParamsProps) {
    return (
        <Box
            sx={{
                py: 2,
                gap: 2,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Iconify icon={'streamline-ultimate:accounting-coins-bold'} width={24} height={24} sx={{ borderRadius: '50%', bgcolor: 'background.neutral' }} />
            <ListItemText
                primary={
                    params.row.name
                }
                secondary={
                    params.row.bankNo
                }
                slotProps={{
                    primary: { noWrap: true },
                    secondary: { sx: { color: 'text.disabled' } },
                }}
            />
        </Box>
    );
}

export function RenderBankAccountCodeCell({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.id}</span>
        </Box>
    );
}

export function RenderBankNumberCell({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.bankNo}</span>
        </Box>
    );
}

export function RenderBankNameCell({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.bankName}</span>
        </Box>
    );
}

export function RenderBankBalanceCell({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{fCurrency(params.row.balance)}</span>
        </Box>
    );
}

export function RenderBankStatusCell({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <Label variant="soft" color={params.row.status ? 'info' : 'default'}>
                {params.row.status ? 'Đang hoạt động' : 'Không hoạt động'}
            </Label>
        </Box>
    );
}