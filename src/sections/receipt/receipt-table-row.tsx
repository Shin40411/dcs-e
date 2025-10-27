import { Box, ListItemText, Typography } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import { Label } from "src/components/label";
import { fCurrencyNoUnit } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";

type ParamsProps = {
    params: GridCellParams;
};

export function RenderCellReceipt({ params }: ParamsProps) {
    return (
        <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <ListItemText
                primary={params.row.receiptNo}
                secondary={params.row.contractNo}
                slotProps={{
                    primary: { noWrap: true },
                    secondary: { sx: { color: 'text.disabled' } },
                }}
            />
        </Box>
    );
}

export function RenderCellCreateDate({ params }: ParamsProps) {
    return fDate(params.row.date);
}

export function RenderCellAmount({ params }: ParamsProps) {
    return fCurrencyNoUnit(params.row.amount);
}

export function RenderNote({ params }: ParamsProps) {
    return (
        <Box
            sx={{
                py: 2,
                gap: 2,
                width: 1,
                display: 'flex',
                alignItems: 'center',
            }}>
            <Typography
                component="div"
                variant="body2"
                sx={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'normal',
                }}
            >
                {params.row.note || ''}
            </Typography>
        </Box>
    );
}

export function RenderCellContractType({ params }: ParamsProps) {
    return (
        <Label variant="soft" color={params.row.contractType === 'Customer' ? 'info' : 'primary'}>
            {params.row.contractType === 'Customer' ? 'Khách hàng' : 'Nhà cung cấp'}
        </Label>
    );
}

export function RenderCellCompanyName({ params }: ParamsProps) {
    return (<Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
        <ListItemText
            primary={params.row.companyName}
            secondary={params.row.customerName}
            slotProps={{
                primary: { noWrap: true },
                secondary: { sx: { color: 'text.disabled' } },
            }}
        />
    </Box>);
}

export function RenderPayer({ params }: ParamsProps) {
    return params.row.payer;
}

export function RenderReason({ params }: ParamsProps) {
    return params.row.reason;
}

export function RenderAddress({ params }: ParamsProps) {
    return params.row.address;
}

