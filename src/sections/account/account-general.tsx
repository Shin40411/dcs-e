import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { fData } from 'src/utils/format-number';
import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { useGetDepartments } from 'src/actions/department';
import { useDebounce } from 'minimal-shared/hooks';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { IDateValue } from 'src/types/common';
import dayjs from 'dayjs';
import { MenuItem, Skeleton } from '@mui/material';
import { Image } from 'src/components/image';
import { updateProfileInfo, useGetCallVietQrData } from 'src/actions/bankAccount';
import { BankQrItem } from 'src/types/bankAccount';
import { useGetProfileInfo } from 'src/actions/account';
import { uploadImage } from 'src/actions/upload';
import { CONFIG } from 'src/global-config';
import { IEmployeeDto } from 'src/types/employee';

// ----------------------------------------------------------------------

export type UpdateUserSchemaType = zod.infer<typeof UpdateUserSchema>;

export const UpdateUserSchema = zod.object({
  name: zod.string().min(2, "Họ và tên là trường bắt buộc").max(20, { message: 'Họ và tên tối đa 50 ký tự' }),
  email: zod.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
  gender: zod.enum(["Male", "Female", "Other"]),
  birthday: zod.custom<IDateValue>().refine((val) => {
    if (val === null || val === undefined || val === "") return false;

    const date = new Date(val);
    if (isNaN(date.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }, {
    message: "Vui lòng chọn ngày sinh hợp lệ",
  }),
  photoURL: zod.any().optional(),
  phone: zod.string().min(1, "Số điện thoại không được để trống").min(10, "Số điện thoại không hợp lệ"),
  address: zod.string().optional(),
  departmentId: zod.number().min(1, { message: 'Phòng ban là trường bắt buộc' }),
  bankAccount: zod.string()
    .min(6, "Số tài khoản không hợp lệ")
    .max(15, "Số tài khoản vượt quá giới hạn cho phép (Giới hạn 15 ký tự)")
    .regex(/^[0-9]+$/, "Số tài khoản chỉ được chứa số"),
  bankName: zod.string().optional(),
  balance: zod.number({ coerce: true })
    .nonnegative({ message: "Số dư không được âm" })
    .default(0)
    .optional(),
});

// ----------------------------------------------------------------------

export function AccountGeneral() {
  const location = useLocation();
  const [departmentkeyword, setDepartmentKeyword] = useState('');
  const debouncedDepartmentKw = useDebounce(departmentkeyword, 300);
  const [qrBankKeyword, setQrBankKeyword] = useState('');
  const debouncedqrBankKw = useDebounce(qrBankKeyword, 300);
  const now = dayjs();
  const tenYearsAgo = dayjs().subtract(10, "year").format("YYYY-MM-DD");
  // const [selectedQrBank, setSelectedQrBank] = useState<BankQrItem | null>(null);
  const genderEnum = (gender: string | undefined): "Male" | "Female" | "Other" => {
    if (gender === "Male" || gender === "Female" || gender === "Other") return gender;
    return "Male";
  };

  const { profileInfoData, profileInfoDataLoading, mutation: refetchProfileInfo } = useGetProfileInfo();

  const { vietQrItem, vietQrItemLoading } = useGetCallVietQrData({
    pageNumber: 1,
    pageSize: 20,
    key: debouncedqrBankKw,
    enabled: true
  });

  const { departments, departmentsLoading, mutation: refetchDepartment } = useGetDepartments({
    pageNumber: 1,
    pageSize: 999,
    key: debouncedDepartmentKw,
    enabled: true
  });

  const currentUser: UpdateUserSchemaType = {
    name: profileInfoData?.name || "",
    email: profileInfoData?.email || "",
    photoURL: profileInfoData?.image || "",
    birthday: tenYearsAgo,
    gender: genderEnum(profileInfoData?.gender) || "Male",
    phone: profileInfoData?.phone || "",
    bankAccount: profileInfoData?.bankAccount || "",
    bankName: profileInfoData?.bankName || "",
    address: profileInfoData?.address || "",
    departmentId: profileInfoData?.departmentId || 0,
    balance: profileInfoData?.balance || 0,
  };

  const defaultValues: UpdateUserSchemaType = {
    name: '',
    email: '',
    photoURL: null,
    birthday: tenYearsAgo,
    gender: 'Male',
    phone: '',
    bankAccount: "",
    bankName: "",
    address: '',
    departmentId: 0,
    balance: 0,
  };

  const methods = useForm<UpdateUserSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    refetchProfileInfo();
    refetchDepartment();
  }, [location.pathname]);

  // useEffect(() => {
  //   if (!vietQrItem.length) return;
  //   if (!currentUser.bankName) return;
  //   const found = vietQrItem.find((b) => b.code === currentUser.bankName);
  //   setSelectedQrBank(found || null);
  // }, [currentUser, vietQrItem]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let imagePayload: string | null = null;

      if (typeof data.photoURL === "string") {
        imagePayload = data.photoURL;
      } else if (data.photoURL instanceof File) {
        try {
          const res = await uploadImage(data.photoURL, "EmployeeImage");
          imagePayload = `${CONFIG.serverUrl}/${res.data.filePath}`;
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
          return;
        }
      }

      const payloadData: IEmployeeDto = {
        name: data.name,
        gender: data.gender,
        email: data.email,
        departmentId: data.departmentId ?? 0,
        image: imagePayload,
        birthday: data.birthday,
        address: data.address ?? "",
        phone: data.phone.replace(/\s+/g, ""),
        bankAccount: data.bankAccount ?? "",
        bankName: data.bankName ?? "",
        balance: data.balance ?? 0,
      };

      await updateProfileInfo(payloadData);
      toast.success('Thông tin tài khoản của bạn đã được cập nhật!');
    } catch (error: any) {
      toast.error(error.message || "Đã có lỗi xảy ra, vui lòng liên hệ quản trị viên");
      console.error(error);
    }
  });

  if (profileInfoDataLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Cho phép *.jpeg, *.jpg, *.png
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <Field.Text name="name" label="Tên tài khoản" required />
              <Field.Text name="email" label="Địa chỉ Email" required />
              <Field.PhoneField name="phone" label="Số điện thoại" required />
              <Field.Text name="address" label="Địa chỉ" />
              <Field.DatePicker name="birthday" label="Ngày sinh" maxDate={now} />
              <Field.Autocomplete
                name="departmentId"
                label="Phòng ban"
                options={departments}
                loading={departmentsLoading}
                getOptionLabel={(opt) => opt?.name ?? ''}
                isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                onInputChange={(_, value) => setDepartmentKeyword(value)}
                value={departments.find((c) => c.id === watch('departmentId')) ?? null}
                onChange={(_, newValue) =>
                  setValue('departmentId', newValue?.id ?? 0, { shouldValidate: true })
                }
                fullWidth
                noOptionsText="Không có dữ liệu"
                required
              />
              <Stack direction="column" spacing={3}>
                <Field.Text
                  name="bankAccount"
                  label="Số tài khoản ngân hàng"
                />
                <Field.Autocomplete
                  name="bankName"
                  label="Chọn ngân hàng"
                  options={vietQrItem}
                  loading={vietQrItemLoading}

                  getOptionLabel={(opt) => opt?.shortName || ''}
                  isOptionEqualToValue={(opt, val) => opt?.code === val}

                  value={
                    vietQrItem.find((b) => b.code === watch('bankName')) ?? null
                  }

                  onInputChange={(_, value, reason) => {
                    if (reason === 'input') {
                      setQrBankKeyword(value);
                    }

                    if (reason === 'clear') {
                      setValue('bankName', '', {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }
                  }}

                  onChange={(_, newValue) => {
                    setValue('bankName', newValue?.code ?? '', {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}

                  clearOnEscape
                  noOptionsText="Không có dữ liệu"

                  renderOption={(props, option) => (
                    <MenuItem {...props} key={option.code}>
                      <Box width={80} mr={2}>
                        <Image src={option.logo} alt={option.name} />
                      </Box>
                      <Typography fontWeight={600}>
                        {option.shortName}
                      </Typography>
                    </MenuItem>
                  )}
                />
              </Stack>
              <Stack direction="row" spacing={10} justifyContent="stretch">
                <Field.VNCurrencyInput
                  name="balance"
                  label="Nhập số dư"
                  sx={{ width: 200 }}
                />
                <Field.RadioGroup
                  name="gender"
                  label="Giới tính"
                  options={[
                    { label: 'Nam', value: 'Male' },
                    { label: 'Nữ', value: 'Female' },
                    { label: 'Khác', value: 'Other' },
                  ]}
                />
              </Stack>
            </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting} startIcon={<Iconify icon="material-symbols:save" />} >
                Lưu thay đổi
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}

function ProfileSkeleton() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 4 }}>
        <Card
          sx={{
            pt: 10,
            pb: 5,
            px: 3,
            textAlign: 'center',
          }}
        >
          <Skeleton
            variant="circular"
            width={120}
            height={120}
            sx={{ mx: 'auto' }}
          />
          <Skeleton sx={{ mt: 3, mx: 'auto' }} width="70%" height={20} />
          <Skeleton sx={{ mt: 1, mx: 'auto' }} width="50%" height={20} />
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              rowGap: 3,
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={56} />
            <Skeleton height={56} />

            <Stack direction="column" spacing={3}>
              <Skeleton height={56} />
              <Skeleton height={56} />
            </Stack>

            <Stack direction="row" spacing={10}>
              <Skeleton height={56} width={200} />
              <Skeleton height={56} width={200} />
            </Stack>
          </Box>

          <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
            <Skeleton
              variant="rectangular"
              width={160}
              height={40}
              sx={{ borderRadius: 1 }}
            />
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}