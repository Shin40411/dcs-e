import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/components/chart';

import { useState, useCallback, useMemo } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber, fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/components/chart';
import { Stack } from '@mui/material';
import { ContractStatistic } from 'src/actions/statistics';
import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  subheader?: string;
};

export function AppAreaInstalled({ title, subheader }: Props) {
  const theme = useTheme();
  const settings = useSettingsContext();

  const [selectedType, setSelectedType] = useState<'KH' | 'NCC'>('KH');
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  const { result, resultLoading } = ContractStatistic(selectedYear, selectedType);

  const chartData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6',
      'T7', 'T8', 'T9', 'T10', 'T11', 'T12',];

    const dataSeries = [
      {
        name: selectedType === 'KH' ? 'Khách hàng' : 'Nhà cung cấp',
        data: months.map(
          (m) => result?.[0]?.months.find((x) => x.month === m)?.total ?? 0
        ),
      },
    ];

    return {
      categories: monthLabels,
      series: dataSeries,
    };
  }, [result, selectedType]);

  const chartOptions = useChart({
    chart: { stacked: false },
    colors: [theme.palette.primary.main],
    stroke: { width: 0 },
    xaxis: { categories: chartData.categories },
    tooltip: { y: { formatter: (value: number) => fNumber(value) } },
    plotOptions: { bar: { columnWidth: '40%' } },
  });

  const handleChangeType = useCallback((newValue: string) => {
    setSelectedType(newValue === 'Khách hàng' ? 'KH' : 'NCC');
  }, []);

  const handleChangeYear = useCallback((newValue: string) => {
    setSelectedYear(Number(newValue));
  }, []);

  const totalWidth = settings.state.navLayout === 'vertical' ? 750 : 850;

  return (
    <Card>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Stack direction="row" gap={2}>
            <ChartSelect
              options={['Khách hàng', 'Nhà cung cấp']}
              value={selectedType === 'KH' ? 'Khách hàng' : 'Nhà cung cấp'}
              onChange={handleChangeType}
            />
            <ChartSelect
              options={['2022', '2023', '2024', '2025']}
              value={String(selectedYear)}
              onChange={handleChangeYear}
            />
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        labels={[selectedType === 'KH' ? 'Khách hàng' : 'Nhà cung cấp']}
        values={[fShortenNumber(result?.[0]?.total ?? 0)]}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        key={`${selectedType}-${selectedYear}`}
        type="bar"
        series={chartData.series}
        options={chartOptions}
        loading={resultLoading}
        sx={{
          py: 2.5,
          height: 320,
          width: totalWidth
        }}
      />

    </Card>
  );
}
