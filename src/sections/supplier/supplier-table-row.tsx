import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import { Label } from 'src/components/label';
import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time-vi';
import { fTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type ParamsProps = {
    params: GridCellParams;
};

export function RenderCellSupplierName({ params }: ParamsProps) {
    return (
        <ListItemText
            primary={params.row.name}
            slotProps={{
                primary: { noWrap: true },
                secondary: { sx: { color: 'text.disabled' } },
            }}
        />
    );
}

export function RenderCellPhone({ params }: ParamsProps) {
    return params.row.phone;
}

export function RenderCellTaxCode({ params }: ParamsProps) {
    return params.row.taxCode;
}

export function RenderCellEmail({ params }: ParamsProps) {
    return params.row.email;
}

export function RenderCellCompanyName({ params }: ParamsProps) {
    return (
        <ListItemText
            primary={params.row.companyName}
            slotProps={{
                primary: { noWrap: true },
                secondary: { sx: { color: 'text.disabled' } },
            }}
        />
    )
}

export function RenderCellBankAccount({ params }: ParamsProps) {
    return params.row.bankAccount;
}

export function RenderCellBankName({ params }: ParamsProps) {
    return params.row.bankName;
}

export function RenderCellAddress({ params }: ParamsProps) {
    return params.row.address;
}

export function RenderCellCreateDate({ params }: ParamsProps) {
    return (
        <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
            <span>{fDate(params.row.createDate)}</span>
            <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
                {fTime(params.row.createDate)}
            </Box>
        </Box>
    );
}

export function RenderCellCreateBy({ params }: ParamsProps) {
    return params.row.createBy;
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

export function RenderCellModifyBy({ params }: ParamsProps) {
    return params.row.modifyBy;
}

export function RenderCellStatus({ params }: ParamsProps) {
    return (
        <Label variant="soft" color={params.row.status ? 'info' : 'default'}>
            {params.row.status ? 'Đang hoạt động' : 'Không hoạt động'}
        </Label>
    );
}

export function RenderCellBalance({ params }: ParamsProps) {
    return fCurrency(params.row.balance);
}
