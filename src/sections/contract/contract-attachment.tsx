import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import { Iconify } from "src/components/iconify";
import { CloseIcon } from "yet-another-react-lightbox";
interface FileItem {
    id: number;
    name: string;
    type: string;
}

interface FileDialogProps {
    open: boolean;
    onClose: () => void;
}

export default function ContractAttachMent({ open, onClose }: FileDialogProps) {
    const files: FileItem[] = [
        { id: 1, name: 'Phieu thu HD001.pdf', type: 'pdf' },
        { id: 2, name: 'Phieu chi HD001.pdf', type: 'pdf' },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e0e0e0',
                }}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography fontWeight={600}>📎 File chứng từ</Typography>
                </Box>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 2 }}>
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
                            <TableRow key={file.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Iconify icon={'material-symbols:picture-as-pdf-rounded'} color="#E53935" width={20} />
                                        <Typography variant="body2">{file.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <IconButton size="small" color="primary">
                                        <Iconify icon={'material-symbols:visibility-rounded'} width={20} />
                                    </IconButton>
                                    <IconButton size="small" color="info">
                                        <Iconify icon={'material-symbols:cloud-download-rounded'} width={20} />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <Iconify icon={'material-symbols:delete-outline-rounded'} width={20} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Box mt={2} mb={2} display="flex" justifyContent="flex-start">
                    <Button
                        variant="outlined"
                        startIcon={<Iconify icon={'material-symbols:picture-as-pdf-rounded'} width={20} />}
                        size="small"
                    >
                        Tải tệp lên
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}