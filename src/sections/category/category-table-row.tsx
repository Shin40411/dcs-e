import { Box, Link, ListItemText } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import { Label } from "src/components/label";
import { fTime } from "src/utils/format-time";
import { fDate } from "src/utils/format-time-vi";

type ParamsProps = {
    params: GridCellParams;
};

export function RenderCellCategory({ params }: ParamsProps) {
    return (
        <Box
            sx={{
                py: 2,
                gap: 2,
                width: 1,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <ListItemText
                primary={
                    params.row.name
                }
                slotProps={{
                    primary: { noWrap: true },
                    secondary: { sx: { color: 'text.disabled' } },
                }}
            />
        </Box>
    );
}

export function RenderCellDescription({ params }: ParamsProps) {
    return (
        <Box
            sx={{
                py: 2,
                gap: 2,
                width: 1,
                display: 'flex',
                alignItems: 'center',
            }}>
            <ListItemText
                primary={
                    params.row.description
                }
                slotProps={{
                    primary: { noWrap: true },
                    secondary: { sx: { color: 'text.disabled' } },
                }}
            />
        </Box>
    );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span>{fDate(params.row.createdAt)}</span>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                {fTime(params.row.createdAt)}
            </Box>
        </Box>
    );
}

export function RenderCellVAT({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{params.row.vat}</span>
        </Box>
    );
}

export function RenderCellStatus({ params }: ParamsProps) {
    return (
        <Label variant="soft" color={params.row.status === true ? 'info' : 'default'}>
            {params.row.status === true ? 'Đang hoạt động' : 'Không hoạt động'}
        </Label>
    );
}

