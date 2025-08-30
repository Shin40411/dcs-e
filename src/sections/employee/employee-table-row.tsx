import type { GridCellParams } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { Label } from 'src/components/label';
import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time-vi';

// ----------------------------------------------------------------------

type ParamsProps = {
    params: GridCellParams;
};

export function RenderCellEmployee({ params }: ParamsProps) {
    return (
        <Box sx={{ py: 2, gap: 2, width: 1, display: 'flex', alignItems: 'center' }}>
            <Avatar
                alt={params.row.name}
                src={params.row.image}
                sx={{ width: 48, height: 48 }}
            />
            <ListItemText
                primary={params.row.name}
                secondary={params.row.email}
                slotProps={{
                    primary: { noWrap: true },
                    secondary: { sx: { color: 'text.disabled' } },
                }}
            />
        </Box>
    );
}

export function RenderCellStatus({ params }: ParamsProps) {
    return (
        <Label variant="soft" color={params.row.status ? 'info' : 'default'}>
            {params.row.status ? 'Đang hoạt động' : 'Không hoạt động'}
        </Label>
    );
}

export function RenderCellCreateDate({ params }: ParamsProps) {
    return fDate(params.row.createDate);
}

export function RenderCellCreateBy({ params }: ParamsProps) {
    return params.row.createBy;
}

export function RenderCellLastLogin({ params }: ParamsProps) {
    return params.row.lastLogin ? fDate(params.row.lastLogin) : '-';
}

export function RenderCellGender({ params }: ParamsProps) {
    return params.row.gender === 'male' ? 'Nam' : params.row.gender === 'female' ? 'Nữ' : 'Khác';
}

export function RenderCellRightID({ params }: ParamsProps) {
    return params.row.rightID;
}

export function RenderCellID({ params }: ParamsProps) {
    return params.row.id;
}

export function RenderCellDepartment({ params }: ParamsProps) {
    return params.row.department;
}

export function RenderCellBirthday({ params }: ParamsProps) {
    return fDate(params.row.birthday);
}

export function RenderCellAddress({ params }: ParamsProps) {
    return params.row.address;
}

export function RenderCellPhone({ params }: ParamsProps) {
    return params.row.phone;
}

export function RenderCellBankAccount({ params }: ParamsProps) {
    return params.row.bankAccount;
}

export function RenderCellBankName({ params }: ParamsProps) {
    return params.row.bankName;
}

export function RenderCellBalance({ params }: ParamsProps) {
    return fCurrency(params.row.balance);
}

export function RenderCellEmployeeType({ params }: ParamsProps) {
    return params.row.employeeType;
}
