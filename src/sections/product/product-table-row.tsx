import type { GridCellParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import LinearProgress from '@mui/material/LinearProgress';

import { fCurrency } from 'src/utils/format-number';
import { fTime } from "src/utils/format-time";
import { fDate } from "src/utils/format-time-vi";
import { Label } from 'src/components/label';
import parse from 'html-react-parser';
import { Typography } from '@mui/material';
// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams;
};

export function RenderCellPrice({ params }: ParamsProps) {
  return fCurrency(params.row.price);
}

export function RenderCellPurchasePrice({ params }: ParamsProps) {
  const isHighlight = params.row.purchasePrice > params.row.price;

  return (
    <Box
      component="span"
      sx={{
        fontWeight: isHighlight ? 'bold' : 'normal',
        color: isHighlight ? 'error.main' : 'text.primary',
      }}
    >
      {fCurrency(params.row.purchasePrice)}
    </Box>
  );
}

export function RenderCellPublish({ params }: ParamsProps) {
  return (
    <Label variant="soft" color={params.row.publish === 'published' ? 'info' : 'default'}>
      {params.row.publish}
    </Label>
  );
}

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <Box sx={{ gap: 0.5, display: 'flex', flexDirection: 'column' }}>
      <span>{fDate(params.row.createdDate)}</span>
      <Box component="span" sx={{ typography: 'caption', color: 'text.secondary' }}>
        {fTime(params.row.createdDate)}
      </Box>
    </Box>
  );
}

export function RenderCellStock({ params }: ParamsProps) {
  return (
    <Box sx={{ width: 1, typography: 'caption', color: 'text.secondary' }}>
      <LinearProgress
        value={params.row.stock}
        variant="determinate"
        color={
          (params.row.stock === 0 && 'error') ||
          (params.row.stock <= 5 && 'warning') ||
          'success'
        }
        sx={{ mb: 1, height: 6, width: 80 }}
      />
      {params.row.stock}
    </Box>
  );
}

export function RenderCellProduct({ params }: ParamsProps) {
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
      <Avatar
        alt={params.row.name}
        src={params.row.image}
        variant="rounded"
        sx={{ width: 64, height: 64 }}
      />

      <ListItemText
        primary={
          params.row.name
        }
        secondary={params.row.category}
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
      <Typography
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
        {parse(params.row.description || '')}
      </Typography>
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
    <Label variant="soft" color={params.row.status === 1 ? 'info' : 'default'}>
      {params.row.status === 1 ? 'Đang hoạt động' : 'Không hoạt động'}
    </Label>
  );
}
