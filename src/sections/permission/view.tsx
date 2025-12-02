import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { RoleBasedGuard } from 'src/auth/guard';
import { useAuthContext } from 'src/auth/hooks';
import { ActOfPer } from 'src/types/permission';
import { updateDepartmentPermission, useGetDepartmentPermission, useGetPermission } from 'src/actions/permission';
import { Accordion, AccordionDetails, AccordionSummary, Checkbox, Grid, Skeleton } from '@mui/material';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import { useGetDepartments } from 'src/actions/department';
import { toast } from 'sonner';
import { LoadingScreen } from 'src/components/loading-screen';
import { useCheckPermission } from 'src/auth/hooks/use-check-permission';

// ----------------------------------------------------------------------
const actions = [
  { key: ActOfPer.VIEW, label: "Xem" },
  { key: ActOfPer.CREATE, label: "Tạo" },
  { key: ActOfPer.EDIT, label: "Sửa" },
  { key: ActOfPer.DELETE, label: "Xóa" },
  { key: ActOfPer.SEND, label: "Gửi" },
];

export function PermissionView() {
  const { user } = useAuthContext();
  const { departments } = useGetDepartments({
    pageNumber: 1,
    pageSize: 999,
  });
  const { permissions: data, permissionsLoading, mutation: refetchPermissions } = useGetPermission({ pageNumber: 1, pageSize: 999 });
  const { departmentPermission, departmentPermissionLoading, mutation: refetchDepartmentPms } = useGetDepartmentPermission({ pageNumber: 1, pageSize: 999 });
  const [moduleToggles, setModuleToggles] = useState<Record<string, Record<ActOfPer, boolean>>>({});

  const [updateLoadingState, setUpdateLoadingState] = useState(false);

  const { permission } = useCheckPermission(['PHANQUYEN.VIEW']);

  const handleModuleToggle = (module: string, action: ActOfPer) => {
    setModuleToggles((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module]?.[action],
      },
    }));
  };

  const handlePermissionCheck = async (departmentId: number, permissionId: number) => {
    try {
      setUpdateLoadingState(true);
      console.log(departmentId, permissionId);
      const arrPush = [{ departmentId, permissionId }];
      if (!arrPush || arrPush.length === 0) { toast.warning('Không tìm thấy dữ liệu để cập nhật!'); return; }
      await updateDepartmentPermission(arrPush);
      toast.success('Cập nhật quyền thành công');
    } catch (error) {
      toast.error('Đã có lỗi xảy ra');
    } finally {
      refetchPermissions();
      refetchDepartmentPms();
      if (!departmentPermissionLoading) {
        setUpdateLoadingState(false);
      }
    }
  };

  return (
    <RoleBasedGuard
      hasContent
      currentRole={permission?.name || ''}
      allowedRoles={['PHANQUYEN.VIEW']}
      sx={{ py: 10 }}
    >
      {updateLoadingState &&
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.3)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
          }}
        >
          <LoadingScreen />
        </Box>
      }
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Phân quyền"
          links={[
            { name: 'Cài đặt' },
            { name: 'Phân quyền' }]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        {permissionsLoading ?
          <Box p={2}>
            {[1, 2, 3, 4, 5].map((_, moduleIndex) => (
              <Box key={moduleIndex} p={2}>
                <Card sx={{ p: 2 }}>
                  <Accordion key={moduleIndex} expanded>
                    <AccordionSummary>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        flexDirection="row"
                        width="100%"
                      >
                        <Grid size={2}>
                          <Skeleton
                            variant="text"
                            width="60%"
                            height={24}
                            sx={{ borderRadius: 1 }}
                          />
                        </Grid>

                        <Grid size={10}>
                          <Grid container>
                            {actions.map((action, i) => (
                              <Grid size={12 / actions.length} key={i}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  flexDirection="column"
                                  gap={0.5}
                                >
                                  <Skeleton variant="text" width={40} height={14} />
                                  <Skeleton
                                    variant="circular"
                                    width={28}
                                    height={16}
                                    sx={{ borderRadius: 10 }}
                                  />
                                </Box>
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                  </Accordion>
                </Card>
              </Box>
            ))}
          </Box>
          :
          <Box p={2}>
            {data.map((moduleItem, moduleIndex) => (
              <Box key={moduleItem.module} p={2}>
                <Card>
                  <Accordion key={moduleItem.module}>
                    <AccordionSummary expandIcon={<GridExpandMoreIcon />} sx={{ bgcolor: 'action.hover', py: 1 }}>
                      <Grid container flex={1} alignItems="center">
                        <Grid
                          size={2}
                          sx={{
                            pr: 1,
                          }}
                        >
                          <Typography fontWeight="bold">{moduleItem.module}</Typography>
                        </Grid>

                        {moduleItem.permissions.map((moduleAction, index) => {
                          if (moduleAction.action === ActOfPer.PRINT) {
                            return null;
                          }
                          return (
                            <Grid
                              key={moduleAction.id}
                              size={2}
                              sx={{
                                pl:
                                  index !== actions.length - 1 ? 0 : 1,
                              }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                gap={0.5}
                                height="100%"
                              >
                                <Typography variant="body2" fontSize={15} fontWeight={400}>
                                  {moduleAction.name}
                                </Typography>
                                {/* <Switch
                                  size="small"
                                  checked={!!moduleToggles[moduleItem.module]?.[moduleAction.action]}
                                  onChange={() => handleModuleToggle(moduleItem.module, moduleAction.action)}
                                /> */}
                              </Box>
                            </Grid>
                          )
                        })}
                      </Grid>
                    </AccordionSummary>

                    <AccordionDetails sx={{ padding: 0 }}>
                      {departments.map((perm, permIndex) => (
                        <Grid
                          container
                          alignItems="center"
                          key={perm.id}
                          sx={{
                            px: 2,
                            py: 0.5,
                            borderBottom:
                              permIndex !== departments.length - 1
                                ? "1px solid"
                                : "none",
                            borderColor: "divider",
                          }}
                        >
                          <Grid
                            size={2}
                            sx={{
                              borderRight: "1px solid",
                              borderColor: "divider",
                              pr: 1,
                            }}
                          >
                            <Typography>{perm.name}</Typography>
                          </Grid>

                          {moduleItem.permissions.map((mdAct, index) => {
                            if (mdAct.action === ActOfPer.PRINT) {
                              return null;
                            }
                            let status = false;
                            const result = departmentPermission.find((d) => {
                              return (d.departmentId === perm.id && d.permissionId === mdAct.id);
                            });

                            if (result) {
                              status = true;
                            }

                            return (
                              <Grid
                                size={2}
                                key={mdAct.id}
                                sx={{
                                  borderRight: '1px solid',
                                  "&:last-child": {
                                    borderRight: "none",
                                  },
                                  borderColor: "divider",
                                }}
                              >
                                <Box display="flex" justifyContent="center">
                                  <Checkbox
                                    checked={status}
                                    onChange={() =>
                                      handlePermissionCheck(perm.id, mdAct.id)
                                    }
                                  />
                                </Box>
                              </Grid>
                            )
                          })}
                        </Grid>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                </Card>
              </Box>
            ))}
          </Box>
        }
      </DashboardContent>
    </RoleBasedGuard>
  );
}
