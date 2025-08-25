import { Box, ListItemText } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";

type ParamsProps = {
    params: GridCellParams;
};

export function RenderUnitCell({ params }: ParamsProps) {
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