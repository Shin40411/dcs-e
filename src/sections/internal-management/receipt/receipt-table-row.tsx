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
                slotProps={{
                    primary: { noWrap: true },
                }}
            />
        </Box>
    );
}

export function RenderCellBankNo({ params }: ParamsProps) {
    return params.row.bankNo;
}

export function RenderCellCreateDate({ params }: ParamsProps) {
    return fDate(params.row.receiptDate);
}

export function RenderCellAmount({ params }: ParamsProps) {
    return fCurrencyNoUnit(params.row.cost);
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

export function RenderCellName({ params }: ParamsProps) {
    return (
        <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <ListItemText
                primary={
                    <Typography
                        component="div"
                        variant="body2"
                        fontWeight={700}
                        sx={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                        }}
                    >
                        {params.row.targetType === "Salary" ? params.row.employeeName : params.row.name}
                    </Typography>
                }
            />
        </Box>
    );
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

