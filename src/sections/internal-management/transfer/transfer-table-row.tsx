import { Box, ListItemText, Typography } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import { fCurrency, fCurrencyNoUnit } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";

type ParamsProps = {
    params: GridCellParams;
};

export function RenderCellTransferNo({ params }: ParamsProps) {
    return (
        <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <ListItemText
                primary={params.row.transferNo}
                slotProps={{
                    primary: { noWrap: true },
                }}
            />
        </Box>
    );
}

export function RenderCellSendNo({ params }: ParamsProps) {
    return (
        <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <ListItemText
                primary={params.row.sendedBankNo}
                secondary={params.row.sendedBankName}
                slotProps={{
                    primary: { noWrap: true },
                }}
            />
        </Box>
    );
}

export function RenderCellReceiveNo({ params }: ParamsProps) {
    return (
        <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <ListItemText
                primary={params.row.receivedBankNo}
                secondary={params.row.receivedBankName}
                slotProps={{
                    primary: { noWrap: true },
                }}
            />
        </Box>
    );
}

export function RenderCellAmount({ params }: ParamsProps) {
    return <Typography variant="body1" fontWeight={700}>{fCurrency(params.row.cost)}</Typography>;
}

export function RenderCellFee({ params }: ParamsProps) {
    return fCurrencyNoUnit(params.row.charge);
}

export function RenderCellCreateDate({ params }: ParamsProps) {
    return fDate(params.row.createdDate);
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