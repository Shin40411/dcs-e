import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import { DashboardContent } from 'src/layouts/dashboard';
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { CONFIG } from 'src/global-config';
import { createOrUpdateCompanyInfo, useGetCompanyInfo } from 'src/actions/companyInfo';
import { ICompanyInfoDTO, ICompanyInfoItem } from 'src/types/companyInfo';
import { Button, CardHeader, Grid, ListItemText, Skeleton, Stack, Typography } from '@mui/material';
import { useLocation } from 'react-router';
import { RoleBasedGuard } from 'src/auth/guard';
import { useCheckPermission } from 'src/auth/hooks/use-check-permission';
import { z as zod } from 'zod';
import { Field, Form, schemaHelper } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Iconify } from 'src/components/iconify';
import { uploadImage } from 'src/actions/upload';
import { fData } from 'src/utils/format-number';

// ----------------------------------------------------------------------
export const UpdateCompanySchema = zod.object({
  photoURL: schemaHelper.file({ message: 'Vui lòng chọn logo công ty!' }),
  displayName: zod.string().min(1, { message: 'Vui lòng nhập tên công ty!' }),
  taxCode: zod.string().min(1, { message: 'Vui lòng nhập mã số thuế!' }),
  email: zod
    .string()
    .min(1, { message: 'Vui lòng nhập email!' })
    .email({ message: 'Địa chỉ email không hợp lệ!' }),
  address: zod.string().min(1, { message: 'Vui lòng nhập địa chỉ văn phòng!' }),
  website: zod.string().optional(),
});
export type UpdateCompanySchemaType = zod.infer<typeof UpdateCompanySchema>;

export function UserProfileView() {
  const location = useLocation();
  const { companyInfoData, companyInfoDataEmpty, companyInfoDataLoading, mutation } = useGetCompanyInfo();
  const [formValues, setFormValues] = useState<ICompanyInfoItem | null>(null);
  const { permission } = useCheckPermission(['TOANQUYEN.VIEW']);

  const defaultValues: UpdateCompanySchemaType = {
    displayName: "",
    address: "",
    email: "",
    photoURL: null,
    taxCode: "",
    website: ""
  };

  const currentCompany: UpdateCompanySchemaType = {
    displayName: companyInfoData?.name || "",
    address: companyInfoData?.address || "",
    email: companyInfoData?.email || "",
    photoURL: companyInfoData?.logo || `${CONFIG.assetsDir}/assets/images/home/nophoto.jpg`,
    taxCode: companyInfoData?.taxCode || "",
    website: companyInfoData?.link || ""
  };

  const methods = useForm<UpdateCompanySchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateCompanySchema),
    defaultValues,
    values: currentCompany,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (companyInfoData) {
      setFormValues(companyInfoData);
    }
  }, [companyInfoData]);

  useEffect(() => { mutation(); }, [location.pathname]);

  const onSubmit = handleSubmit(async (data) => {
    try {

      let imagePayload: string | null = null;

      if (typeof data.photoURL === "string") {
        imagePayload = data.photoURL;
      } else if (data.photoURL instanceof File) {
        try {
          const res = await uploadImage(data.photoURL, "ComanyInfo");
          imagePayload = `${CONFIG.serverUrl}/${res.data.filePath}`;
        } catch (error: any) {
          console.error("Error uploading image:", error);
          toast.error(error.message || "Lỗi khi tải ảnh lên. Vui lòng thử lại.");
          return;
        }
      }

      const payloadBody: ICompanyInfoDTO = {
        name: data.displayName,
        email: data.email,
        address: data.address,
        link: data.website || "",
        logo: imagePayload || "",
        taxCode: data.taxCode
      }
      await createOrUpdateCompanyInfo(payloadBody, !companyInfoDataEmpty);
      toast.success('Cập nhật thông tin công ty thành công!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "");
    } finally {
      mutation();
    }
  });

  const renderField = (
    label: string,
    field: string,
    icon: string
  ) => (
    <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <Iconify icon={icon} width={24} />
      <Field.Text
        label={label}
        name={field ?? ''}
      />
    </Box>
  );

  if (companyInfoDataLoading) {
    return (
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Thông tin công ty"
          links={[
            { name: 'Cài đặt' },
            { name: 'Thông tin công ty' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Box
          sx={{
            width: 1,
            mx: 'auto',
            maxWidth: 1100,
            height: '100%'
          }}
        >
          <Card sx={{ mb: 3, height: 290, position: 'relative', boxShadow: 2 }}>
            <Box
              sx={{
                height: 1,
                color: 'common.white',
              }}
            >
              <Skeleton variant="rounded" height={200} />
            </Box>
            <Box sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
              <Skeleton variant="rounded" height={40} />
            </Box>
          </Card>
          <Grid container spacing={3}>
            <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Card sx={{ boxShadow: 2 }}>
                <Box sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                  <Skeleton variant="rounded" height={40} />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DashboardContent>
    );
  }

  return (
    <RoleBasedGuard
      hasContent
      currentRole={permission?.name || ''}
      allowedRoles={['TOANQUYEN.VIEW']}
      sx={{ py: 10 }}
    >
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Thông tin công ty"
          links={[
            { name: 'Cài đặt' },
            { name: 'Thông tin công ty' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Box
          sx={{
            width: 1,
            mx: 'auto',
            maxWidth: 1100,
          }}
        >
          <Form methods={methods} onSubmit={onSubmit}>
            <Card sx={{ mb: 3, height: 290, position: 'relative', boxShadow: 2 }}>
              <Box
                sx={[
                  (theme) => ({
                    ...theme.mixins.bgGradient({
                      images: [
                        `url(${CONFIG.assetsDir}/assets/background/balloon.jpg)`,
                      ],
                    }),
                    height: 1,
                    color: 'common.white',
                  }),
                ]}
              >
                <Box
                  sx={{
                    display: 'flex',
                    left: { md: 24 },
                    bottom: { md: 24 },
                    zIndex: { md: 10 },
                    pt: { xs: 6, md: 0 },
                    position: { md: 'absolute' },
                    flexDirection: { xs: 'column', md: 'row' },
                  }}
                >
                  <Field.UploadAvatar
                    name="photoURL"
                    maxSize={3145728}
                    sx={[
                      (theme) => ({
                        mx: 'auto',
                        width: { xs: 64, md: 128 },
                        height: { xs: 64, md: 128 },
                        border: `solid 2px ${theme.vars.palette.common.white}`,
                        bgcolor: 'common.white'
                      }),
                    ]}
                  // helperText={
                  //   <Typography
                  //     variant="caption"
                  //     sx={{
                  //       mt: 3,
                  //       mx: 'auto',
                  //       display: 'block',
                  //       textAlign: 'center',
                  //       color: 'text.disabled',
                  //     }}
                  //   >
                  //     Cho phép *.jpeg, *.jpg, *.png
                  //     <br /> max size of {fData(3145728)}
                  //   </Typography>
                  // }
                  />

                  <ListItemText
                    primary={formValues?.name || 'Văn phòng công ty'}
                    slotProps={{
                      primary: { sx: { typography: 'h4' } },
                      secondary: {
                        sx: { mt: 0.5, opacity: 0.48, color: 'inherit' },
                      },
                    }}
                    sx={{ mt: 3, ml: { md: 3 }, textAlign: { xs: 'center', md: 'unset' } }}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: 1,
                  bottom: 0,
                  zIndex: 9,
                  px: { md: 3 },
                  display: 'flex',
                  position: 'absolute',
                  bgcolor: 'background.paper',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                }}
              >
                <Box
                  sx={{
                    width: 1,
                    p: 2,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    startIcon={<Iconify icon="material-symbols:save" />}
                  >
                    Lưu thông tin
                  </Button>
                </Box>
              </Box>
            </Card>

            <Grid container spacing={3}>
              <Grid size={12} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Card sx={{ boxShadow: 2 }}>
                  <Box sx={{ p: 3, gap: 2, display: 'flex', flexDirection: 'column' }}>
                    {renderField('Tên công ty', 'displayName', 'solar:case-minimalistic-bold')}
                    {renderField('Mã số thuế', 'taxCode', 'solar:document-bold')}
                    {renderField('Địa chỉ Email', 'email', 'solar:letter-bold')}
                    {renderField('Địa chỉ văn phòng', 'address', 'mingcute:location-fill')}
                    {renderField('Website', 'website', 'solar:link-bold')}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Form>
        </Box>

      </DashboardContent>
    </RoleBasedGuard>
  );
}
