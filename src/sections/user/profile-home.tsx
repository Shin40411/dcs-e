import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import CardHeader from '@mui/material/CardHeader';
import { _socials } from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { ICompanyInfoItem } from 'src/types/companyInfo';
import { TextField, Typography } from '@mui/material';


// ----------------------------------------------------------------------

type Props = {
  values: ICompanyInfoItem;
  editable?: boolean;
  onChange?: (field: keyof ICompanyInfoItem, value: string) => void;
};

export function ProfileHome({
  values,
  editable = false,
  onChange,
}: Props) {

  const renderField = (
    label: string,
    field: keyof ICompanyInfoItem,
    icon: string
  ) => (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <Iconify icon={icon} width={24} />
      {editable ? (
        <TextField
          fullWidth
          size="small"
          label={label}
          value={values[field] ?? ''}
          onChange={(e) => onChange?.(field, e.target.value)}
        />
      ) : (
        <Typography variant="body2">{values[field]}</Typography>
      )}
    </Box>
  );

  return (
    <Grid container spacing={3}>
      <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Card sx={{ boxShadow: 2 }}>
          <CardHeader title="Thông tin công ty" />
          <Box sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
            {renderField('Tên công ty', 'name', 'solar:case-minimalistic-bold')}
            {renderField('Mã số thuế', 'taxCode', 'solar:document-bold')}
            {renderField('Địa chỉ Email', 'email', 'solar:letter-bold')}
            {renderField('Địa chỉ văn phòng', 'address', 'mingcute:location-fill')}
            {renderField('Website', 'link', 'solar:link-bold')}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}