import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CardActions, CardContent, Dialog, DialogContent, DialogTitle, MenuItem, Stack, Typography } from "@mui/material";
import { useDebounce } from "minimal-shared/hooks";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useGetDepartments } from "src/actions/department";
import { createOrUpdateEmployee } from "src/actions/employee";
import { useGetEmployeeTypes } from "src/actions/employeeType";
import { uploadImage } from "src/actions/upload";
import { Field, Form } from "src/components/hook-form";
import { CONFIG } from "src/global-config";
import { endpoints } from "src/lib/axios";
import { IDateValue } from "src/types/common";
import { IEmployeeDto, IEmployeeItem } from "src/types/employee";
import { mutate } from "swr";
import { z as zod } from 'zod';

type Props = {
    currentEmployee?: IEmployeeItem;
    open: boolean;
    onClose: () => void;
    selectedId?: number;
    page: number;
    rowsPerPage: number;
};

export const NewEmployeeSchema = zod.object({
    name: zod.string().min(1, "Họ và tên là bắt buộc"),
    phone: zod.string().min(1, "Số điện thoại không được để trống").min(10, "Số điện thoại không hợp lệ"),
    email: zod.string().min(1, "Email không được để trống").email("Email không hợp lệ"),
    gender: zod.enum(["Male", "Female", "Other"]),
    bankAccount: zod.string().optional(),
    bankName: zod.string().optional(),
    birthday: zod.custom<IDateValue>(),
    balance: zod.number().nonnegative().default(0),
    address: zod.string().optional(),
    image: zod.any().optional(),
    departmentId: zod.number().min(1, { message: 'Phòng ban là trường bắt buộc' }),
    employeeTypeId: zod.number().min(1, { message: 'Chức vụ là trường bắt buộc' }),
    Folder: zod.string().min(1, { message: 'Thư mục tải lên là trường bắt buộc' }),
});

export type NewEmployeeSchemaType = Zod.infer<typeof NewEmployeeSchema>;

export function EmployeeNewEditForm({ currentEmployee, open, onClose, selectedId, page, rowsPerPage }: Props) {
    const [departmentkeyword, setDepartmentKeyword] = useState('');
    const [employeeTypekeyword, setEmployeeTypeKeyword] = useState('');
    const debouncedDepartmentKw = useDebounce(departmentkeyword, 300);
    const debouncedEmployeeTypeKw = useDebounce(employeeTypekeyword, 300);

    const { departments, departmentsLoading } = useGetDepartments({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedDepartmentKw,
        enabled: true
    });

    const { employeeTypes, employeeTypesLoading } = useGetEmployeeTypes({
        pageNumber: 1,
        pageSize: 999,
        key: debouncedEmployeeTypeKw,
        enabled: true
    });

    const defaultValues: NewEmployeeSchemaType = {
        name: "",
        phone: "",
        email: "",
        gender: "Male",
        bankAccount: "",
        bankName: "",
        birthday: null,
        balance: 0,
        address: "",
        image: undefined,
        departmentId: 0,
        employeeTypeId: 0,
        Folder: 'HoaDon',
    };

    const methods = useForm<NewEmployeeSchemaType>({
        resolver: zodResolver(NewEmployeeSchema),
        defaultValues: currentEmployee ? {
            ...defaultValues,
            name: currentEmployee.name,
            phone: currentEmployee.phone,
            email: currentEmployee.email,
            gender:
                currentEmployee.gender === "Male"
                    ? "Male"
                    : currentEmployee.gender === "Female"
                        ? "Female"
                        : "Other",
            bankAccount: currentEmployee.bankAccount,
            bankName: currentEmployee.bankName,
            birthday: currentEmployee.birthday,
            balance: currentEmployee.balance,
            address: currentEmployee.address,
            image: currentEmployee.image,
            departmentId: currentEmployee.departmentId,
            employeeTypeId: currentEmployee.employeeTypeId
        } : defaultValues,
    });

    useEffect(() => {
        if (currentEmployee) {
            methods.reset({
                ...defaultValues,
                name: currentEmployee.name ?? '',
                phone: currentEmployee.phone ?? '',
                email: currentEmployee.email ?? '',
                gender:
                    currentEmployee.gender === "Male"
                        ? "Male"
                        : currentEmployee.gender === "Female"
                            ? "Female"
                            : "Other",
                bankAccount: currentEmployee.bankAccount ?? '',
                bankName: currentEmployee.bankName ?? '',
                birthday: currentEmployee.birthday,
                balance: currentEmployee.balance ?? 0,
                address: currentEmployee.address ?? '',
                image: currentEmployee.image,
                departmentId: currentEmployee.departmentId,
                employeeTypeId: currentEmployee.employeeTypeId
            });
        } else {
            methods.reset(defaultValues);
        }
    }, [currentEmployee, methods.reset]);

    const {
        reset,
        watch,
        setValue,
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

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
                    const res = await uploadImage(data.image, data.Folder);
                    imagePayload = `${CONFIG.serverUrl}/${res.data.filePath}`;
                } catch (error) {
                    console.error("Error uploading image:", error);
                    toast.error("Lỗi khi tải ảnh lên. Vui lòng thử lại.");
                    return;
                }
            }

            const payloadData: IEmployeeDto = {
                name: data.name,
                typeId: 1,
                gender: data.gender,
                email: data.email,
                rightId: 2,
                departmentId: data.departmentId ?? 0,
                image: imagePayload,
                birthday: data.birthday,
                address: data.address ?? "",
                phone: data.phone,
                bankAccount: data.bankAccount ?? "",
                bankName: data.bankName ?? "",
                balance: data.balance ?? 0,
                employeeTypeId: data.employeeTypeId ?? 0,
            };

            await createOrUpdateEmployee(selectedId ?? 0, payloadData);
            mutate(endpoints.employees.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=1`));
            toast.success(currentEmployee ? 'Dữ liệu nhân viên đã được thay đổi!' : 'Tạo mới dữ liệu nhân viên thành công!');
            onClose();
            reset();
        } catch (error: any) {
            console.error(error);
            toast.error('Đã có lỗi xảy ra!');
        }
    });


    const renderDetails = () => (
        <Stack spacing={3} pt={1}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Stack spacing={2} sx={{ flex: 1 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="name"
                            label="Họ và tên"
                            helperText="Nhập họ và tên khách hàng"
                            sx={{ flex: 1 }}
                        />
                        <Field.Text
                            name="phone"
                            label="Số điện thoại"
                            helperText="Nhập số điện thoại"
                            sx={{ flex: 1 }}
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="email"
                            label="Email"
                            helperText="Nhập địa chỉ email"
                        />
                        <Field.Select label='Giới tính' name="gender" helperText="Chọn giới tính nhân viên">
                            <MenuItem key={'Male'} value={'Male'} sx={{ textTransform: 'capitalize' }}>Nam</MenuItem>
                            <MenuItem key={'Female'} value={'Female'} sx={{ textTransform: 'capitalize' }}>Nữ</MenuItem>
                            <MenuItem key={'Other'} value={'Other'} sx={{ textTransform: 'capitalize' }}>Khác</MenuItem>
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
                            fullWidth
                            onChange={(_, newValue) => {
                                setValue('departmentId', newValue?.id ?? 0, { shouldValidate: true });
                            }}
                            noOptionsText="Không có dữ liệu"
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
                            fullWidth
                            onChange={(_, newValue) => {
                                setValue('employeeTypeId', newValue?.id ?? 0, { shouldValidate: true });
                            }}
                            noOptionsText="Không có dữ liệu"
                        />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="bankAccount"
                            label="Số tài khoản ngân hàng"
                            helperText="Nhập số tài khoản"
                        />
                        <Field.DatePicker name="birthday" label="Ngày sinh" />
                    </Stack>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <Field.Text
                            name="bankName"
                            label="Tên ngân hàng"
                            helperText="Nhập tên ngân hàng"
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
                        {!currentEmployee && (
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
                    {!currentEmployee ? 'Tạo mới' : 'Lưu thay đổi'}
                </Button>
            </Stack>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={"lg"} scroll={'paper'}>
            <DialogTitle>
                {currentEmployee ? 'Chỉnh sửa dữ liệu nhân viên' : 'Tạo dữ liệu nhân viên'}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Form methods={methods} onSubmit={onSubmit}>
                    <CardContent sx={{ pt: 0, px: 0 }}>
                        <Stack spacing={{ xs: 3, md: 5 }}>
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
    )
}