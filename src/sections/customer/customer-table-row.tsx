import { Box, Icon, ListItemText } from "@mui/material";
import { GridCellParams } from "@mui/x-data-grid";
import { ex } from "node_modules/@fullcalendar/core/internal-common";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { fDate, fTime } from "src/utils/format-time";

type ParamsProps = {
    params: GridCellParams;
};

export function RenderCellPhone({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.phone}</span>
        </Box>
    );
}

export function RenderCellName({ params }: ParamsProps) {
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
            <Iconify icon={'streamline-cyber-color:businessman'} sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: 'background.neutral' }} />
            <ListItemText
                primary={
                    params.row.name
                }
                secondary={params.row.email}
                slotProps={{
                    primary: { noWrap: true },
                    secondary: { sx: { color: 'text.disabled' } },
                }}
            />
        </Box>
    );
}

export function RenderCellTaxCode({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.taxCode}</span>
        </Box>
    );
}

export function RenderCellCompanyName({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.companyName}</span>
        </Box>
    );
}

export function RenderCellBankAccount({ params }: ParamsProps) {
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
                    params.row.bankAccount
                }
                secondary={params.row.bankName}
                slotProps={{
                    primary: { noWrap: true },
                    secondary: { sx: { color: 'text.disabled' } },
                }}
            />
        </Box>
    );
}

export function RenderCellAddress({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.address}</span>
        </Box>
    );
}

export function RenderCellIsPartner({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.isPartner ? 'Đối tác' : 'Khách hàng'}</span>
        </Box>
    );
}

export function RenderCellRewardPoint({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.rewardPoint}</span>
        </Box>
    );
}

export function RenderCellBalance({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 15 }}>{params.row.balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
        </Box>
    );
}

export function RenderCellCreateDate({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span>{fDate(params.row.createDate)}</span>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                {fTime(params.row.createdDate)}
            </Box>
        </Box>
    );
}

export function RenderCellModifyDate({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span>{fDate(params.row.modifyDate)}</span>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                {fTime(params.row.modifyDate)}
            </Box>
        </Box>
    );
}

export function RenderCellStatus({ params }: ParamsProps) {
    return (
        <Label variant="soft" color={params.row.status === 1 ? 'info' : 'default'}>
            {params.row.status === 1 ? 'Đang hoạt động' : 'Không hoạt động'}
        </Label>
    );
}