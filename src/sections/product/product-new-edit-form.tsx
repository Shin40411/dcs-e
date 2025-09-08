import type { ProductDto, ProductItem } from 'src/types/product';

import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import {
  _tags,
} from 'src/_mock';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem } from '@mui/material';
import { useGetCategories } from 'src/actions/category';
import { useDebounce } from 'minimal-shared/hooks';
import { useGetUnits } from 'src/actions/unit';
import { createOrUpdateProduct, useGetProduct } from 'src/actions/product';
import { mutate } from 'swr';
import { endpoints } from 'src/lib/axios';
import { uploadImage } from 'src/actions/upload';
import { ICategoryItem } from 'src/types/category';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export type NewProductSchemaType = zod.infer<typeof NewProductSchema>;

export const NewProductSchema = zod.object({
  name: zod.string().min(1, { message: 'Tên sản phẩm là trường bắt buộc' }),
  code: zod.string().min(1, { message: 'Mã sản phẩm là trường bắt buộc' }),
  description: zod
    .string()
    .min(20, { message: 'Mô tả sản phẩm phải có ít nhất 20 ký tự' }),
  purchasePrice: zod
    .number({ coerce: true })
    .min(1, { message: 'Giá nhập là trường bắt buộc và phải lớn hơn 0' }),
  price: zod
    .number({ coerce: true })
    .min(1, { message: 'Giá bán là trường bắt buộc và phải lớn hơn 0' }),
  unitId: zod.number().min(1, { message: 'Đơn vị tính là trường bắt buộc' }),
  categoryId: zod.number().min(1, { message: 'Nhóm sản phẩm là trường bắt buộc' }),
  stock: zod
    .number({ coerce: true })
    .min(0, { message: 'Số lượng tồn kho không được nhỏ hơn 0' }),
  warranty: zod
    .number({ coerce: true })
    .min(0, { message: 'Thời gian bảo hành không được nhỏ hơn 0' }),
  manufacturer: zod
    .string()
    .min(1, { message: 'Nhà sản xuất là trường bắt buộc' }),
  vat: zod
    .number({ coerce: true })
    .min(0, { message: 'VAT không được nhỏ hơn 0%' })
    .max(100, { message: 'VAT không được lớn hơn 100%' }),
  image: zod
    .any()
    .refine((file) => file instanceof File || typeof file === 'string', {
      message: 'Ảnh sản phẩm không hợp lệ',
    }).nullable().optional(),
  Folder: zod.string().min(1, { message: 'Thư mục tải lên là trường bắt buộc' }),
});

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  selectedId?: string;
  page: number;
  rowsPerPage: number;
};

export function ProductNewEditForm({ open, onClose, selectedId, page, rowsPerPage }: Props) {
  const [categorykeyword, setCategoryKeyword] = useState('');
  const [unitkeyword, setUnitKeyword] = useState('');
  const debouncedCategoryKw = useDebounce(categorykeyword, 300);
  const debouncedUnitKw = useDebounce(unitkeyword, 300);
  const { product: currentProduct, productLoading } = useGetProduct(selectedId, {
    enabled: !!selectedId,
  });

  const { categories, categoriesLoading } = useGetCategories({
    pageNumber: 1,
    pageSize: 999,
    key: debouncedCategoryKw,
    enabled: true
  });

  const { units, unitsLoading } = useGetUnits({
    pageNumber: 1,
    pageSize: 999,
    key: debouncedUnitKw,
    enabled: true
  });

  const [selectedCategory, setSelectedCategory] = useState<ICategoryItem | null>(null);
  const defaultValues: NewProductSchemaType = {
    name: '',
    code: '',
    description: '',
    purchasePrice: 0,
    price: 0,
    unitId: 0,
    categoryId: 0,
    stock: 0,
    warranty: 0,
    manufacturer: '',
    vat: 0,
    image: null,
    Folder: 'HoaDon',
  };

  const methods = useForm<NewProductSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewProductSchema),
    defaultValues: currentProduct
      ? {
        ...defaultValues,
        name: currentProduct.name,
        code: currentProduct.code,
        description: currentProduct.description,
        purchasePrice: currentProduct.purchasePrice,
        price: currentProduct.price,
        unitId: currentProduct.unitId,
        categoryId: currentProduct.categoryId,
        stock: currentProduct.stock,
        warranty: currentProduct.warranty,
        manufacturer: currentProduct.manufacturer,
        vat: currentProduct.vat,
        image: currentProduct.image,
      }
      : defaultValues,
  });

  useEffect(() => {
    if (currentProduct) {
      methods.reset({
        ...defaultValues,
        name: currentProduct.name,
        code: currentProduct.code,
        description: currentProduct.description,
        purchasePrice: currentProduct.purchasePrice,
        price: currentProduct.price,
        unitId: currentProduct.unitId,
        categoryId: currentProduct.categoryId,
        stock: currentProduct.stock,
        warranty: currentProduct.warranty,
        manufacturer: currentProduct.manufacturer,
        vat: currentProduct.vat,
        image: currentProduct.image,
      });
    } else {
      methods.reset(defaultValues);
    }
  }, [currentProduct]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const cat = categories.find((c) => c.id === methods.getValues('categoryId')) || null;
      setSelectedCategory(cat);
    } else {
      setSelectedCategory(null);
    }
  }, [categories, methods.watch('categoryId')]);

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      let imagePayload: string | null = null;

      if (typeof data.image === "string") {
        imagePayload = data.image;
      } else if (data.image instanceof File) {
        try {
          const res = await uploadImage(data.image, data.Folder);
          imagePayload = `${CONFIG.serverUrl}/${res.data.filePath}`;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
          return;
        }
      }

      const bodyPayload: ProductDto = {
        name: data.name,
        code: data.code,
        description: data.description,
        purchasePrice: data.purchasePrice,
        price: data.price,
        unitId: data.unitId,
        categoryId: data.categoryId,
        stock: data.stock,
        warranty: data.warranty,
        manufacturer: data.manufacturer,
        vat: data.vat,
        image: imagePayload,
      };

      await createOrUpdateProduct(
        currentProduct ? currentProduct.id : null,
        bodyPayload
      );

      mutate(
        endpoints.product.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}`)
      );

      if (selectedId)
        mutate(
          endpoints.product.details(selectedId)
        );

      toast.success(
        currentProduct
          ? "Dữ liệu sản phẩm đã được thay đổi!"
          : "Tạo dữ liệu sản phẩm thành công!"
      );

      onClose();
      reset(defaultValues);
    } catch (error) {
      console.error(error);
    }
  });


  const handleRemoveFile = useCallback(() => {
    setValue('image', null, { shouldValidate: true });
  }, [setValue]);

  const renderDetails = () => (
    <Stack spacing={3} sx={{ p: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Field.Text name="name" label="Tên sản phẩm" />
            <Field.Text name="code" label="Mã sản phẩm" />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Field.Autocomplete
              name="categoryId"
              label="Chọn nhóm sản phẩm"
              options={categories}
              loading={categoriesLoading}
              getOptionLabel={(opt) => opt?.name ?? ''}
              isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
              onInputChange={(_, value) => setCategoryKeyword(value)}
              value={selectedCategory}
              fullWidth
              onChange={(_, newValue) => {
                setSelectedCategory(newValue ?? null);
                setValue('categoryId', newValue?.id ?? 0, { shouldValidate: true });
              }}
              noOptionsText="Không có dữ liệu"
            />
            <Field.Autocomplete
              name="unitId"
              label="Chọn đơn vị tính"
              options={units}
              loading={unitsLoading}
              getOptionLabel={(opt) => opt?.name ?? ''}
              isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
              onInputChange={(_, value) => setUnitKeyword(value)}
              value={units.find((c) => c.id === watch('unitId')) ?? null}
              fullWidth
              onChange={(_, newValue) => {
                setValue('unitId', newValue?.id ?? 0, { shouldValidate: true });
              }}
              noOptionsText="Không có dữ liệu"
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Field.VNCurrencyInput
              name="purchasePrice"
            />
            <Field.VNCurrencyInput
              name="price"
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Mô tả sản phẩm</Typography>
            <Field.Editor name="description" sx={{ minHeight: 311, maxHeight: 480 }} />
          </Stack>
        </Stack>
        <Stack spacing={3} sx={{ flex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent={'space-between'} spacing={2}>
            <Field.Select label="VAT áp dụng" name="vat">
              <MenuItem key={'0'} value={'0'} sx={{ textTransform: 'capitalize' }}>0%</MenuItem>
              <MenuItem key={'5'} value={'5'} sx={{ textTransform: 'capitalize' }}>5%</MenuItem>
              <MenuItem key={'8'} value={'8'} sx={{ textTransform: 'capitalize' }}>8%</MenuItem>
              <MenuItem key={'10'} value={'10'} sx={{ textTransform: 'capitalize' }}>10%</MenuItem>
            </Field.Select>
            <Field.Text name='manufacturer' label='Nhà sản xuất' placeholder='Nhà sản xuất' fullWidth />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <Field.NumberInput
              name="stock"
              helperText={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify width={16} icon="solar:info-circle-bold" />
                  <span>Số lượng tồn kho (cái)</span>
                </Stack>
              }
              sx={{ width: 110 }}
            />
            <Field.NumberInput
              name="warranty"
              helperText={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Iconify width={16} icon="solar:info-circle-bold" />
                  <span>Bảo hành (tháng)</span>
                </Stack>
              }
              sx={{ width: 110 }}
            />
          </Stack>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Ảnh sản phẩm</Typography>
            {!currentProduct && (
              <Field.Select label='Thư mục tải lên' name="Folder">
                <MenuItem key={'Hopdong'} value={'Hopdong'} sx={{ textTransform: 'capitalize' }}>Hợp đồng</MenuItem>
                <MenuItem key={'HoaDon'} value={'HoaDon'} sx={{ textTransform: 'capitalize' }}>Hóa đơn</MenuItem>
                <MenuItem key={'XuatKho'} value={'XuatKho'} sx={{ textTransform: 'capitalize' }}>Xuất kho</MenuItem>
              </Field.Select>
            )}
            <Field.Upload
              // multiple
              thumbnail
              name="image"
              maxSize={3145728}
              onDelete={handleRemoveFile}
              // onRemoveAll={handleRemoveAllFiles}
              onUpload={() => console.log('ON UPLOAD')}
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );

  const renderActions = () => (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} width="100%" minHeight={40}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          fullWidth
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          variant="contained"
          sx={{ ml: 1 }}
          loading={isSubmitting}
          fullWidth
        >
          {!currentProduct ? 'Tạo mới' : 'Lưu thay đổi'}
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={"lg"} scroll={'paper'}>
      <DialogTitle>
        {currentProduct ? 'Chỉnh sửa dữ liệu sản phẩm' : 'Tạo dữ liệu sản phẩm'}
      </DialogTitle>
      <DialogContent dividers={true}>
        <Form methods={methods} onSubmit={onSubmit}>
          <CardContent sx={{ pt: 0, px: 0 }}>
            <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto' }}>
              {renderDetails()}
            </Stack>
          </CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} />
          <CardActions>
            {renderActions()}
          </CardActions>
        </Form>
      </DialogContent>
    </Dialog >
  );
}
