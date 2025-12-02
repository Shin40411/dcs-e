import { Box, ListItemText, Typography } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";

type ParamsProps = {
    params: GridCellParams;
};

export function RenderCellWarehouseImport({ params }: ParamsProps) {
    return (
        <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <ListItemText
                primary={params.row.warehouseImportNo}
                slotProps={{
                    primary: { noWrap: true },
                }}
            />
        </Box>
    );
}

export function RenderCellContractImport({ params }: ParamsProps) {
    return (
        <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <ListItemText
                primary={params.row.conntractSupNo}
                slotProps={{
                    primary: { noWrap: true },
                }}
            />
        </Box>
    );
}

export function RenderCellCompanyName({ params }: ParamsProps) {
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
                        {params.row.companyName || ''}
                    </Typography>
                }
            />
        </Box>
    );
}

export function RenderReceiverName({ params }: ParamsProps) {
    return params.row.receiverName;
}

export function RenderReceiverPhone({ params }: ParamsProps) {
    return params.row.receiverPhone;
}

export function RenderReciverAddress({ params }: ParamsProps) {
    return params.row.reciverAddress;
}

export function RenderCreatedBy({ params }: ParamsProps) {
    return params.row.createdBy;
}

export function RenderReason({ params }: ParamsProps) {
    return params.row.note;
}