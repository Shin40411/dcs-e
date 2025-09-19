import {
    Box,
    Typography
} from "@mui/material";

export function DetailItem({ label, value }: { label: string; value?: string | number }) {
    return (
        <Box sx={{ flex: 1 }}>
            {
                label
                &&
                <Typography variant="subtitle2" color="text.secondary">
                    {label}
                </Typography>
            }
            <Typography variant="body2">{value || "—"}</Typography>
        </Box>
    );
}