import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { IContract } from "src/types/contract";
import { IQuotation } from "src/types/quotation";

type ContractFormProps = {
    open: boolean;
    onClose: () => void;
    quotations: IQuotation[];
    onSave: (c: IContract) => void;
};

export function ContractForm({ open, onClose, onSave, quotations }: ContractFormProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Tạo hợp đồng</DialogTitle>
            <DialogContent>
                <Stack spacing={3} mt={1}>
                    <TextField select label="Chọn báo giá" fullWidth>
                        <MenuItem value="">-- Không chọn (tạo mới) --</MenuItem>
                        {quotations.map((q) => (
                            <MenuItem key={q.id} value={q.id}>
                                {q.id} - {q.customer}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField fullWidth label="Khách hàng" />
                        <TextField fullWidth type="date" label="Ngày ký" InputLabelProps={{ shrink: true }} />
                    </Stack>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                        <TextField fullWidth type="date" label="Ngày hết hạn" InputLabelProps={{ shrink: true }} />
                        <TextField fullWidth label="Giá trị hợp đồng" />
                    </Stack>

                    <TextField fullWidth label="Điều khoản thanh toán" multiline rows={3} />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={() => onSave(/* dữ liệu contract */ {} as IContract)}>
                    Lưu hợp đồng
                </Button>
            </DialogActions>
        </Dialog>
    );
}