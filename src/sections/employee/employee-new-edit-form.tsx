import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useBoolean, useDebounce } from "minimal-shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGetDepartments } from "src/actions/department";
import { createOrUpdateEmployee, useGetUserTypes } from "src/actions/employee";
import { useGetEmployeeTypes } from "src/actions/employeeType";
import { uploadImage } from "src/actions/upload";
import { Field, Form } from "src/components/hook-form";
import { CONFIG } from "src/global-config";
import { IEmployeeDto, IEmployeeItem, IUserDto } from "src/types/employee";
import { mutate } from "swr"
import { CreateEmployeeSchema, CreateEmployeeSchemaType, EditEmployeeSchema, EditEmployeeSchemaType } from "./schema/employee-schema";
import { renderSkeletonV2 } from "src/components/skeleton/skeleton-product-employee";
import { Iconify } from "src/components/iconify";
import { useGetCallVietQrData } from "src/actions/bankAccount";
import { BankQrItem } from "src/types/bankAccount";
import { Image } from "src/components/image";
import dayjs from "dayjs";

type Props = {
    currentEmployee?: IEmployeeItem;
    open: boolean;
    onClose: () => void;
    selectedId?: number;
    refecth: () => void;
};

export function EmployeeNewEditForm({ currentEmployee, open, onClose, selectedId, refecth }: Props) {
    const [departmentkeyword, setDepartmentKeyword] = useState('');
    const [employeeTypekeyword, setEmployeeTypeKeyword] = useState('');
    const debouncedDepartmentKw = useDebounce(departmentkeyword, 300);
    const debouncedEmployeeTypeKw = useDebounce(employeeTypekeyword, 300);
    const [qrBankKeyword, setQrBankKeyword] = useState('');
    const debouncedqrBankKw = useDebounce(qrBankKeyword, 300);
    const now = dayjs();
    const tenYearsAgo = dayjs().subtract(10, "year").format("YYYY-MM-DD");
    const [tab, setTab] = useState(0);

    const showPassword = useBoolean();

    const TabLabel = ({ label, hasError }: { label: string; hasError: boolean }) => (
        <Typography variant="body2" sx={{ color: hasError ? 'warning.main' : 'text.primary' }}>
            {label}
        </Typography>
    );

    const handleChangeTab = (_: any, newValue: number) => {
        setTab(newValue);
    };

    const { departments, departmentsLoading } = useGetDepartments({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedDepartmentKw,
        enabled: open
    });

    const { employeeTypes, employeeTypesLoading } = useGetEmployeeTypes({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedEmployeeTypeKw,
        enabled: open
    });

    const { userTypes } = useGetUserTypes({
        pageNumber: 1,
        pageSize: 999,
        enabled: open
    });

    const { vietQrItem, vietQrItemLoading, vietQrItemEmpty } = useGetCallVietQrData({
        pageNumber: 1,
        pageSize: 20,
        key: debouncedqrBankKw,
        enabled: open || !!currentEmployee
    });

    const defaultEditValues: EditEmployeeSchemaType = {
        name: "",
        phone: "",
        email: "",
        gender: "Male",
        bankAccount: "0",
        bankName: "",
        birthday: tenYearsAgo,
        balance: 0,
        address: "",
        image: undefined,
        departmentId: 0,
        employeeTypeId: 0,
        Folder: 'HoaDon',
    }

    const defaultCreateValues: CreateEmployeeSchemaType = {
        ...defaultEditValues,
        username: "",
        password: "",
        userTypeId: 0
    };

    const [selectedQrBank, setSelectedQrBank] = useState<BankQrItem | null>(null);

    const genderEnum = (gender: string): "Male" | "Female" | "Other" => {
        if (gender === "Male" || gender === "Female" || gender === "Other") return gender;
        return "Male";
    };

    const methods = useForm<EditEmployeeSchemaType | CreateEmployeeSchemaType>({
        resolver: zodResolver(!!currentEmployee ? EditEmployeeSchema : CreateEmployeeSchema),
        defaultValues: !!currentEmployee
            ? {
                ...defaultEditValues,
                ...currentEmployee,
                gender: genderEnum(currentEmployee.gender),
            }
            : defaultCreateValues,
    });

    useEffect(() => {
        const genderEnum = (gender: string | undefined): "Male" | "Female" | "Other" => {
            if (gender === "Male" || gender === "Female" || gender === "Other") return gender;
            return "Male";
        };

        if (currentEmployee) {
            methods.reset({
                ...defaultEditValues,
                name: currentEmployee.name ?? "",
                phone: currentEmployee.phone ?? "",
                email: currentEmployee.email ?? "",
                gender: genderEnum(currentEmployee.gender),
                bankAccount: currentEmployee.bankAccount ?? "",
                bankName: currentEmployee.bankName ?? "",
                birthday: currentEmployee.birthday ?? null,
                balance: currentEmployee.balance ?? 0,
                address: currentEmployee.address ?? "",
                image: currentEmployee.image ?? undefined,
                departmentId: currentEmployee.departmentId ?? 0,
                employeeTypeId: currentEmployee.employeeTypeId ?? 0,
            });
        } else {
            methods.reset(defaultCreateValues);
        }
    }, [currentEmployee, methods]);

    const bankFromVietQr = methods.watch('bankName');

    useEffect(() => {
        if (!vietQrItem.length) return;

        const found = vietQrItem.find((b) => b.shortName === bankFromVietQr);
        setSelectedQrBank(found ?? null);
    }, [bankFromVietQr, vietQrItem.length]);

    const {
        reset,
        watch,
        setValue,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const { formState: { errors } } = methods;

    const employeeInfoFields = ["name", "phone", "email", "gender", "departmentId", "employeeTypeId", "birthday", "balance"];
    const accountFields = ["username", "password"];
    const hasEmployeeInfoError = employeeInfoFields.some(
        (field) => errors[field as keyof typeof errors]
    );

    const hasAccountError = accountFields.some(
        (field) => errors[field as keyof typeof errors]
    );

    const handleRemoveFile = useCallback(() => {
        setValue('image', null, { shouldValidate: true });
    }, [setValue]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            let imagePayload: string | null = null;

            if (typeof data.image === "string") {
                imagePayload = data.image;
            } else if (data.image instanceof File) {
                try {
                    const res = await uploadImage(data.image, "EmployeeImage");
                    imagePayload = `${CONFIG.serverUrl}/${res.data.filePath}`;
                } catch (error) {
                    console.error("Error uploading image:", error);
                    toast.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
                    return;
                }
            }

            const payloadData: IEmployeeDto = {
                name: data.name,
                typeId: data.employeeTypeId ?? 0,
                gender: data.gender,
                email: data.email,
                rightId: 2,
                departmentId: data.departmentId ?? 0,
                image: imagePayload,
                birthday: data.birthday,
                address: data.address ?? "",
                phone: data.phone.replace(/\s+/g, ""),
                bankAccount: data.bankAccount ?? "",
                bankName: data.bankName ?? "",
                balance: data.balance ?? 0,
                employeeTypeId: data.employeeTypeId ?? 0,
            };

            if (!currentEmployee) {
                const createPayload: IUserDto = {
                    userName: (data as CreateEmployeeSchemaType).username,
                    fullName: data.name,
                    password: (data as CreateEmployeeSchemaType).password,
                    userTypeId: (data as CreateEmployeeSchemaType).userTypeId,
                    employee: payloadData,
                };

                await createOrUpdateEmployee(payloadData, createPayload);
            } else {
                await createOrUpdateEmployee(payloadData, {} as IUserDto, selectedId);
            }
            toast.success(currentEmployee ? 'Dữ liệu nhân viên đã được thay đổi!' : 'Tạo mới dữ liệu nhân viên thành công!');
            onClose();
            reset();
        } catch (error: any) {
            console.error(error);
            if (error.message) {
                toast.error(error.message);
            } else {
                toast.error("Đã có lỗi xảy ra!");
            }
        } finally {
            refecth();
        }
    });

    const renderDetails = () => (
        <Box>
            <Tabs
                value={tab}
                onChange={handleChangeTab}
                textColor="primary"
                indicatorColor="primary"
                sx={{ mb: 3 }}
            >
                <Tab label={<TabLabel label="Thông tin nhân viên" hasError={hasEmployeeInfoError} />} />
                {!currentEmployee && (
                    <Tab label={<TabLabel label="Tài khoản đăng nhập" hasError={hasAccountError} />} />
                )}
            </Tabs>
            {tab === 0 && (
                <Stack spacing={3} pt={1}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        <Stack spacing={2} sx={{ flex: 1 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Field.Text
                                    name="name"
                                    label="Họ và tên"
                                    helperText="Nhập họ và tên khách hàng"
                                    required
                                />
                                <Field.PhoneField
                                    name="phone"
                                    label="Số điện thoại"
                                    helperText="Nhập số điện thoại"
                                    required
                                />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Field.Text
                                    name="email"
                                    label="Email"
                                    helperText="Nhập địa chỉ email"
                                    required
                                />
                                <Field.Select
                                    label="Giới tính"
                                    name="gender"
                                    helperText="Chọn giới tính nhân viên"
                                >
                                    <MenuItem value="Male">Nam</MenuItem>
                                    <MenuItem value="Female">Nữ</MenuItem>
                                    <MenuItem value="Other">Khác</MenuItem>
                                </Field.Select>
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Field.Autocomplete
                                    name="departmentId"
                                    label="Chọn phòng ban"
                                    options={departments}
                                    helperText="Chọn phòng ban nhân viên"
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

                                <Field.Autocomplete
                                    name="employeeTypeId"
                                    label="Chọn chức vụ"
                                    options={employeeTypes}
                                    helperText="Chọn chức vụ nhân viên"
                                    loading={employeeTypesLoading}
                                    getOptionLabel={(opt) => opt?.name ?? ''}
                                    isOptionEqualToValue={(opt, val) => opt?.id === val?.id}
                                    onInputChange={(_, value) => setEmployeeTypeKeyword(value)}
                                    value={employeeTypes.find((c) => c.id === watch('employeeTypeId')) ?? null}
                                    onChange={(_, newValue) =>
                                        setValue('employeeTypeId', newValue?.id ?? 0, { shouldValidate: true })
                                    }
                                    fullWidth
                                    noOptionsText="Không có dữ liệu"
                                    required
                                />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Field.Text
                                    name="bankAccount"
                                    label="Số tài khoản ngân hàng"
                                    helperText="Nhập số tài khoản"
                                />
                                <Field.DatePicker name="birthday" label="Ngày sinh" maxDate={now} />
                            </Stack>

                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                <Field.Autocomplete
                                    name="bankName"
                                    label={`Chọn ngân hàng`}
                                    options={vietQrItem}
                                    loading={vietQrItemLoading}
                                    getOptionLabel={(opt) => opt?.shortName || ''}
                                    isOptionEqualToValue={(opt, val) => opt?.shortName === val?.shortName}
                                    onInputChange={(_, value) => setQrBankKeyword(value)}
                                    value={selectedQrBank}
                                    fullWidth
                                    onChange={(_, newValue) => {
                                        methods.setValue('bankName', newValue?.shortName ?? '', { shouldValidate: true });
                                        setQrBankKeyword(newValue?.shortName ?? '');
                                    }}
                                    noOptionsText="Không có dữ liệu"
                                    renderOption={(props, option) => (
                                        <MenuItem {...props} key={option.shortName} sx={{ display: 'flex', flex: '1 1' }}>
                                            <Box width={100} mr={5}>
                                                <Image
                                                    src={option.logo} alt={option.name}
                                                    sx={{ objectFit: 'cover' }}
                                                />
                                            </Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {option.shortName ? option.shortName : ""}
                                            </Typography>
                                        </MenuItem>
                                    )}
                                />
                                <Field.VNCurrencyInput
                                    name="balance"
                                    label="Nhập số dư"
                                    sx={{ width: 200 }}
                                />
                            </Stack>

                            <Field.Text
                                name="address"
                                label="Địa chỉ"
                                helperText="Nhập địa chỉ"
                                fullWidth
                            />
                        </Stack>

                        <Stack spacing={3} sx={{ flex: 1 }}>
                            <Stack spacing={1.5}>
                                <Typography variant="subtitle2">Ảnh nhân viên</Typography>
                                <Field.Upload
                                    name="image"
                                    thumbnail
                                    maxSize={3145728}
                                    onDelete={handleRemoveFile}
                                />
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            )}

            {!currentEmployee && tab === 1 && (
                <Stack spacing={3} pt={1}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="username"
                            label="Tên đăng nhập"
                            helperText="Nhập tên đăng nhập"
                            required
                        />
                        <Field.Select
                            label="Vai trò"
                            name="userTypeId"
                            helperText="Chọn vai trò tài khoản"
                            required
                        >
                            {userTypes.map((u) => {
                                return (
                                    <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                                );
                            })}
                        </Field.Select>
                    </Stack>
                    <Field.Text
                        name="password"
                        label="Mật khẩu"
                        type={showPassword.value ? 'text' : 'password'}
                        helperText="Nhập mật khẩu"
                        required
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={showPassword.onToggle} edge="end">
                                            <Iconify
                                                icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                                            />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Stack>
            )}
        </Box>
    );

    const renderActions = () => (
        <Box sx={{ width: '100%' }}>
            <Stack direction="row" spacing={2} width="100%" minHeight={40}>
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                        onClose();
                        reset();
                        setSelectedQrBank(null);
                        setQrBankKeyword('');
                    }}
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
                    {!currentEmployee ? 'Tạo mới' : 'Lưu thay đổi'}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open}
            onClose={() => {
                onClose();
                reset();
                setSelectedQrBank(null);
                setQrBankKeyword('');
            }}
            fullWidth
            maxWidth={"lg"}
            scroll={'paper'}>
            <DialogTitle>
                {currentEmployee ? 'Chỉnh sửa dữ liệu nhân viên' : 'Tạo dữ liệu nhân viên'}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <CardContent sx={{ pt: 0, px: 0 }}>
                        <Stack spacing={{ xs: 3, md: 5 }}>
                            {(employeeTypesLoading || departmentsLoading) ? renderSkeletonV2() : renderDetails()}
                        </Stack>
                    </CardContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }} />
                    <CardActions>
                        {renderActions()}
                    </CardActions>
                </Form>
            </DialogContent>
        </Dialog >
    )
}