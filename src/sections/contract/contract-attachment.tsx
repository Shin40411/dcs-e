import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { deleteAttachmentContract, downloadAttachmentContract, uploadAttachmentContract, useGetAttachmentContract } from "src/actions/contract";
import { Iconify } from "src/components/iconify";
import { CONFIG } from "src/global-config";
import { endpoints } from "src/lib/axios";
import { IContractFileItem, IContractItem } from "src/types/contract";
import { useSWRConfig } from "swr";
import { CloseIcon } from "yet-another-react-lightbox";

interface FileDialogProps {
    selectedContract: IContractItem;
    open: boolean;
    onClose: () => void;
}

export default function ContractAttachMent({ selectedContract, open, onClose }: FileDialogProps) {
    const MAX_FILE_SIZE_MB = 10;
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const {
        contractFile,
        pagination,
        contractFileLoading,
        contractFileError,
        contractFileValidating,
        contractFileEmpty,
    } = useGetAttachmentContract({
        contractNo: selectedContract.contractNo,
        pageNumber: 1,
        pageSize: 1000,
        enabled: open,
    });

    const files =
        contractFile?.flatMap((item) =>
            item.files.map((file) => ({
                ...file,
                contractType: item.contractType,
                contractNo: item.contractNo,
            }))
        ) || [];

    const { mutate } = useSWRConfig();

    useEffect(() => {
        if (open && selectedContract?.contractNo) {
            const key = endpoints.contractAttachment.list(`?contractNo=${selectedContract.contractNo}&pageNumber=1&pageSize=1000`);
            mutate(key);
        }
    }, [open, selectedContract?.contractNo]);

    const handlePreviewFile = (fileUrl: string) => {
        try {
            if (!fileUrl) toast.error('Không thể tải file hoặc file không thuộc định dạng để xem trước.');

            const fullUrl = `${CONFIG.serverUrl}/${fileUrl.startsWith('/') ? fileUrl.slice(1) : fileUrl}`;

            window.open(fullUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            console.error('Lỗi khi xem file:', error);
        }
    };

    const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedContract) return;
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.warning('Chỉ được tải lên file ảnh, Word, Excel hoặc PDF!');
            e.target.value = '';
            return;
        }
        const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.warning(`Kích thước tệp tối đa là ${MAX_FILE_SIZE_MB}MB`);
            e.target.value = '';
            return;
        }

        try {
            setUploading(true);

            await uploadAttachmentContract({
                File: file,
                contractNo: selectedContract.contractNo,
                ContractType: 'Customer',
                FileType: 'Master',
            });

            const key = `/api/v1/contract-storages/get-file-by-contract?contractNo=${selectedContract.contractNo}&pageNumber=1&pageSize=1000`;
            mutate(key);
            toast.success('Tải file thành công');

        } catch (err) {
            console.error('Upload thất bại:', err);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownloadFile = async (fileId: number) => {
        if (!selectedContract) return;

        try {
            const data = await downloadAttachmentContract(fileId);

            const blobUrl = window.URL.createObjectURL(data);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `file_${fileId}`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Thu hồi URL tạm
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            toast.error('Lỗi khi tải file');
        }
    };


    const handleDeleteFile = async (fileId: number) => {
        if (!selectedContract) return;

        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa file này không?');
        if (!confirmDelete) return;

        try {
            await deleteAttachmentContract(fileId);

            const key = `/api/v1/contract-storages/get-file-by-contract?contractNo=${selectedContract.contractNo}&pageNumber=1&pageSize=1000`;
            mutate(key);
            toast.success('Xóa file thành công');
        } catch (error) {
            console.error('Lỗi khi xóa file:', error);
            toast.error('Xóa file thất bại');
        }
    };


    return (
        <Dialog
            PaperProps={{
                sx: {
                    borderRadius: 0,
                },
            }}
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Iconify icon="teenyicons:attach-outline" />
                    <Typography fontWeight={600} textTransform="uppercase">File chứng từ</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: '0 !important' }}>
                {contractFileLoading && (
                    <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                        <CircularProgress size={24} />
                    </Box>
                )}
                {/* 
                {contractFileError && (
                    <Box p={3} textAlign="center">
                        <Typography color="error">Không thể tải danh sách file</Typography>
                    </Box>
                )} */}

                {contractFileEmpty && !contractFileLoading && (
                    <Box p={3} textAlign="center">
                        <Typography>Không có file nào được đính kèm</Typography>
                    </Box>
                )}
                {!contractFileLoading && !contractFileEmpty && !contractFileError && (
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell width="50">#</TableCell>
                                <TableCell>Tên file</TableCell>
                                <TableCell align="center" width="120">
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {files.map((file, index) => (
                                <TableRow key={file.fileID}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Iconify
                                                icon={'material-symbols:picture-as-pdf-rounded'}
                                                color="#E53935"
                                                width={20}
                                            />
                                            <Typography variant="body2"
                                                sx={{
                                                    maxWidth: 200,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >{file.fileName}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
                                    >
                                        <IconButton size="small" color="primary" onClick={() => handlePreviewFile(file.fileUrl)}>
                                            <Iconify icon={'material-symbols:visibility-rounded'} width={20} />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="info"
                                            onClick={() => handleDownloadFile(file.fileID)}
                                        >
                                            <Iconify icon={'material-symbols:cloud-download-rounded'} width={20} />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteFile(file.fileID)}>
                                            <Iconify icon={'material-symbols:delete-outline-rounded'} width={20} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <Box mt={2} mb={2} p={2} display="flex" justifyContent="flex-start">
                    <input
                        type="file"
                        ref={fileInputRef}
                        hidden
                        onChange={handleUploadFile}
                    />
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon={'material-symbols:upload-rounded'} width={20} />}
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? 'Đang tải...' : 'Tải tệp lên'}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}