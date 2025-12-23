import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, LinearProgress, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { UseBooleanReturn } from "minimal-shared/hooks";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { usefetchReceipt, useGetBatchCollect, useGetHistoryCollect, useGetNeedCollect } from "src/actions/followContract";
import { EmptyContent } from "src/components/empty-content";
import { Iconify } from "src/components/iconify";
import { Label } from "src/components/label";
import { endpoints, fetcher } from "src/lib/axios";
import { paths } from "src/routes/paths";
import { IContractItem } from "src/types/contract";
import { IBatchCollectItem, IFollowContractItem, IHistoryCollect } from "src/types/followContract";
import { fCurrency, fCurrencyNoUnit } from "src/utils/format-number";
import { fDate } from "src/utils/format-time-vi";
import { CloseIcon } from "yet-another-react-lightbox";

type props = {
    openForm: UseBooleanReturn;
    selectedContract: IContractItem;
    onExposeRefetch: (fns: {
        refetchNeedCollect: () => void;
        refetchBatchCollect: () => void;
        refetchHistoryCollect: () => void;
    }) => void;
}

export function ContractFollow({ openForm, selectedContract }: props) {
    const {
        result,
        resultLoading,
        resultError,
        mutation: refetchNeedCollect
    } = useGetNeedCollect(
        selectedContract.contractNo,
        openForm.value
    );

    const {
        result: batchResult,
        resultLoading: batchLoading,
        resultError: batchError,
        mutation: refetchBatchCollect
    } = useGetBatchCollect(
        selectedContract.contractNo,
        openForm.value
    );

    const {
        result: historyCollectResult,
        resultLoading: historyCollectLoading,
        resultError: historyCollectError,
        mutation: refetchHistoryCollect
    } = useGetHistoryCollect(
        selectedContract.contractNo,
        openForm.value
    );

    const [needCollectData, setNeedCollectData] = useState<IFollowContractItem>();
    const [batchData, setBatchData] = useState<IBatchCollectItem[]>();
    const [historyCollect, setHistoryCollect] = useState<IHistoryCollect[]>();

    const headerTitle = "Theo dõi phải thu";

    useEffect(() => {
        setNeedCollectData(result);
        setBatchData(batchResult);
        setHistoryCollect(historyCollectResult);
    }, [result, batchResult, historyCollectResult]);

    // useEffect(() => {
    //     onExposeRefetch?.({
    //         refetchNeedCollect,
    //         refetchBatchCollect,
    //         refetchHistoryCollect,
    //     });
    // }, [
    //     refetchNeedCollect,
    //     refetchBatchCollect,
    //     refetchHistoryCollect,
    // ]);

    useEffect(() => {
        refetchNeedCollect();
        refetchBatchCollect();
        refetchHistoryCollect();
    }, [openForm]);

    const {
        contractAmounts,
        contractNo,
        needCollect,
        onTimeAmount,
        overTimeAmount,
        percent,
        status,
        totalCollected
    } = needCollectData ?? {};

    const onPreViewReceipt = async (receiptNumber: string) => {
        try {
            const params = `?receiptNo=${receiptNumber}`;
            const url = endpoints.followContract.getReceipt(params);
            const dataFetched = await fetcher(url);

            if (!dataFetched) return;

            const receiptDt = dataFetched.data;

            const search = new URLSearchParams({
                companyName: receiptDt.companyName || "",
                customerName: receiptDt.customerName || "",
                date: fDate(receiptDt.date) || "",
                receiptNoToWatch: receiptDt.receiptNo || "",
                amount: String(receiptDt.amount || 0),
                payer: receiptDt.payer || "",
                contractNo: receiptDt.contractNo || "",
                reason: receiptDt.reason || "",
                address: receiptDt.address || "",
                createdBy: receiptDt.createdBy || "",
            });

            const queryString = search.toString();
            window.open(`${paths.receipt}?${queryString}`, "_blank");
        } catch (err) {
            console.error("Failed to fetch receipt:", err);
            toast.error("Lỗi! Không thể xem phiếu thu");
        }
    };

    return (
        <Dialog
            open={openForm.value}
            onClose={openForm.onFalse}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 0,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: "row",
                    gap: 2,
                    justifyContent: "space-between",
                    borderBottom: '1px solid #e0e0e0',
                    pr: 1,
                }}>
                <Box display="flex" alignItems="center" gap={1}>
                    <Iconify icon="ph:file-x-bold" width={24} />
                    <Typography fontWeight={700} textTransform="uppercase">{headerTitle}</Typography>
                </Box>
                <TextField
                    disabled
                    id="contractNo-Contract"
                    sx={{ width: 400 }}
                    value={contractNo}
                    InputProps={{
                        sx: {
                            height: 36,
                            '& input': {
                                py: 0.5,
                            },
                        },
                    }}
                />
                <Label
                    variant="filled"
                    sx={{
                        height: '-webkit-fill-available',
                        bgcolor: status === "Đã hoàn thành" ?
                            'green' : status === "Đang thực hiện" ?
                                '#B0FFD5' : 'red',
                        color: status === "Đã hoàn thành" ? '#fff'
                            : status === "Đang thực hiện" ? '#000000' : '#fff'
                    }}
                    startIcon={<Iconify icon={
                        status === "Đã hoàn thành" ?
                            "ei:check" : status === "Đang thực hiện" ?
                                "ic:sharp-add-task" : "material-symbols:error-outline"} />}
                >
                    {status}
                </Label>
                <IconButton onClick={openForm.onFalse}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ bgcolor: "#fafafa", pt: 3, pb: 4 }}>
                {resultLoading || batchLoading || historyCollectLoading ?
                    <ContractDetailSkeleton />
                    :
                    <>
                        <Stack direction="row" spacing={2} justifyContent="space-between" my={2}>
                            <SummaryBox label="Tổng giá trị hợp đồng" value={fCurrencyNoUnit(contractAmounts) || '0'} color="#11312E" />
                            <SummaryBox label="Đã thu" value={fCurrencyNoUnit(totalCollected) || '0'} color="#0095FF" />
                            <SummaryBox2
                                label="Còn lại"
                                value={fCurrencyNoUnit(needCollect) || '0'}
                                color="#11312E"
                                label1="Trong hạn"
                                value1={fCurrencyNoUnit(onTimeAmount) || '0'}
                                color1="#11312E"
                                label2="Trễ hạn"
                                value2={fCurrencyNoUnit(overTimeAmount) || '0'}
                                color2="#11312E"
                            />
                        </Stack>

                        <Box mb={3}>
                            <Typography variant="body2" fontWeight={600} mb={1}>
                                Tỷ lệ đã thu tiền
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={Math.min(Math.max(percent ?? 0, 0), 100)}
                                sx={{
                                    height: 12,
                                    borderRadius: 2,
                                    "& .MuiLinearProgress-bar": { bgcolor: "#0095FF" },
                                }}
                            />
                            <Typography variant="body2" mt={0.5} color="text.secondary">
                                {percent || 0} %
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                bgcolor: "white",
                                borderRadius: 2,
                                boxShadow: 1,
                                overflow: "hidden",
                            }}
                        >
                            <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                                <Typography fontWeight={600}>Đợt phải thu</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ bgcolor: "#D9EFFF" }}>Đợt thanh toán</TableCell>
                                            <TableCell sx={{ textAlign: "right", bgcolor: "#D9EFFF" }} >Giá trị phải thu</TableCell>
                                            <TableCell sx={{ textAlign: "right", bgcolor: "#D9EFFF" }} >Đã thu</TableCell>
                                            <TableCell sx={{ textAlign: "right", bgcolor: "#D9EFFF" }} >Còn lại</TableCell>
                                            <TableCell sx={{ bgcolor: "#D9EFFF", textAlign: "center" }} >Trạng thái / Ngày phải thu</TableCell>
                                            <TableCell sx={{ textAlign: "center", bgcolor: "#D9EFFF" }} >Thời gian trễ (ngày)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(() => {
                                            const rows = batchData || [];

                                            if (rows.length === 0) {
                                                return (
                                                    <TableRow>
                                                        <TableCell colSpan={6}>
                                                            <EmptyContent />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }

                                            return rows.map((b, index) => {
                                                const soTreHan =
                                                    b.status === "Chưa đến hạn"
                                                        ? b.upComingDate === 0
                                                            ? `${b.upComingDate}`
                                                            : `+ ${b.upComingDate}`
                                                        : b.lateDate === 0
                                                            ? `${b.lateDate}`
                                                            : `- ${b.lateDate}`;

                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>Đợt {b.batch}</TableCell>
                                                        <TableCell sx={{ textAlign: "right" }}>{fCurrencyNoUnit(b.needCollect)}</TableCell>
                                                        <TableCell sx={{ textAlign: "right" }}>{fCurrencyNoUnit(b.collected)}</TableCell>
                                                        <TableCell sx={{ textAlign: "right" }}>{fCurrencyNoUnit(b.remainning)}</TableCell>
                                                        <TableCell sx={{ display: "flex", justifyContent: "center" }}>
                                                            <Stack width="fit-content" flexDirection="column" justifyContent="center" alignItems="center">
                                                                <Box>
                                                                    <Iconify
                                                                        icon={
                                                                            b.status === "Đã hoàn thành"
                                                                                ? "ei:check"
                                                                                : b.status === "Chưa đến hạn"
                                                                                    ? "mdi:alert-outline"
                                                                                    : "icon-park-outline:dot"
                                                                        }
                                                                        color={
                                                                            b.status === "Đã hoàn thành"
                                                                                ? "green"
                                                                                : b.status === "Chưa đến hạn"
                                                                                    ? "orange"
                                                                                    : "red"
                                                                        }
                                                                    />
                                                                </Box>
                                                                <Box>
                                                                    <Typography variant="body2">{fDate(b.receivableDate)}</Typography>
                                                                </Box>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: "center" }}>{soTreHan}</TableCell>
                                                    </TableRow>
                                                );
                                            });
                                        })()}
                                        {batchData && batchData.length > 0 && (() => {
                                            const totalNeedCollect = batchData.reduce((sum, b) => sum + (b.needCollect || 0), 0);
                                            const totalCollected = batchData.reduce((sum, b) => sum + (b.collected || 0), 0);
                                            const totalRemaining = batchData.reduce((sum, b) => sum + (b.remainning || 0), 0);

                                            return (
                                                <TableRow sx={{ bgcolor: "#D9EFFF", fontWeight: 600 }}>
                                                    <TableCell>
                                                        <span>👉</span> <span style={{ fontWeight: 700 }}>Tổng cộng:</span>
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>{fCurrencyNoUnit(totalNeedCollect)}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>{fCurrencyNoUnit(totalCollected)}</TableCell>
                                                    <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>{fCurrencyNoUnit(totalRemaining)}</TableCell>
                                                    <TableCell />
                                                    <TableCell />
                                                </TableRow>
                                            );
                                        })()}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        <Box
                            sx={{
                                bgcolor: "white",
                                borderRadius: 2,
                                boxShadow: 1,
                                mt: 3,
                                overflow: "hidden",
                            }}
                        >
                            <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
                                <Typography fontWeight={600}>Lịch sử thu tiền</Typography>
                            </Box>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead sx={{ bgcolor: "#f4f6f8" }}>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell>Ngày thanh toán (thu tiền)</TableCell>
                                            <TableCell>Khách hàng / Người nộp</TableCell>
                                            <TableCell sx={{ textAlign: 'right' }}>Số tiền phải thu</TableCell>
                                            <TableCell sx={{ textAlign: 'right' }}>Số tiền đã thu</TableCell>
                                            <TableCell sx={{ textAlign: 'right' }}>Số phiếu thu</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(() => {
                                            const validRows = historyCollect?.filter(h => h.receiptNo) || [];

                                            if (validRows.length === 0) {
                                                return (
                                                    <TableRow>
                                                        <TableCell colSpan={6}>
                                                            <EmptyContent />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }

                                            let stt = 0;

                                            return validRows.map((h, index) => {
                                                stt++;
                                                return (
                                                    <TableRow key={index}>
                                                        <TableCell>{stt}</TableCell>
                                                        <TableCell>{fDate(h.date)}</TableCell>
                                                        <TableCell>{h.payer}</TableCell>
                                                        <TableCell sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                                            <Typography variant="body2" textAlign="right">
                                                                {`Đợt ${h.batch}/${h.totalBatch}`}
                                                            </Typography>
                                                            <Typography variant="body2" textAlign="right">{fCurrencyNoUnit(h.needCollect)}</Typography>
                                                        </TableCell>
                                                        <TableCell sx={{ textAlign: 'right' }}>{fCurrencyNoUnit(h.totalCollect)}</TableCell>
                                                        <TableCell>
                                                            <Stack flexDirection="row" alignItems="center" justifyContent="flex-end">
                                                                <Typography variant="body2">{h.receiptNo}</Typography>
                                                                <Box component="span" mx={1}>|</Box>
                                                                <Button
                                                                    variant="text"
                                                                    sx={{ px: 0, minWidth: 10 }}
                                                                    onClick={() => onPreViewReceipt(h.receiptNo)}
                                                                >
                                                                    👁️
                                                                </Button>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            });
                                        })()}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ p: 2, pr: '303px', borderTop: "1px solid #eee", textAlign: "right" }}>
                                {historyCollect && historyCollect.length > 0 && (() => {
                                    const totalCollected = historyCollect.reduce((sum, b) => sum + (b.totalCollect || 0), 0);
                                    return (
                                        <Typography variant="body2">
                                            👉 Tổng cộng đã thu: <b>{fCurrency(totalCollected)}</b>
                                        </Typography>
                                    )
                                })()}
                            </Box>
                        </Box>
                    </>
                }
            </DialogContent>
            <DialogActions />
        </Dialog>
    );
}

const SummaryBox = ({
    label,
    value,
    color,
}: {
    label: string;
    value: string;
    color: string;
}) => (
    <Box
        sx={{
            flex: 0.5,
            p: 2,
            borderRadius: 2,
            bgcolor: "#D9EFFF",
            boxShadow: 1,
            textAlign: "center",
        }}
    >
        <Stack flexDirection="row" spacing={1} mb={1}>
            <Iconify icon="material-symbols:note-add-outline-sharp" />
            <Typography variant="body2" color="#151D48" fontWeight={700}>
                {label}
            </Typography>
        </Stack>
        <Stack flexDirection="row" justifyContent="space-between">
            <Typography variant="caption">VNĐ</Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color }}>
                {value}
            </Typography>
        </Stack>
    </Box>
);

const SummaryBox2 = ({
    label,
    value,
    color,
    label1,
    value1,
    color1,
    label2,
    value2,
    color2
}: {
    label: string;
    value: string;
    color: string;
    label1: string;
    value1: string;
    color1: string;
    label2: string;
    value2: string;
    color2: string;
}) => (
    <Box
        sx={{
            flex: 1,
            px: 2,
            borderRadius: 2,
            bgcolor: "#ff000024",
            boxShadow: 1,
            textAlign: "center",
        }}
    >
        <Stack height="100%" flexDirection="row" justifyContent="space-around" alignItems="center">
            <Box>
                <Stack flexDirection="row" justifyContent="flex-start" spacing={1} mb={1}>
                    <Iconify icon="material-symbols:note-add-outline-sharp" />
                    <Typography variant="body2" fontWeight={700} color="#151D48">
                        {label}
                    </Typography>
                </Stack>
                <Stack width="100% " flexDirection="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="caption">VNĐ</Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ color }}>
                        {value}
                    </Typography>
                </Stack>
            </Box>
            <Divider
                flexItem
                orientation="vertical"
                sx={{ borderWidth: 10, borderColor: '#7813133b' }}
            />
            <Box>
                <Stack flexDirection="row" justifyContent="center" spacing={1} mb={1}>
                    <Typography variant="body2" fontWeight={700} color="#151D48">
                        {label1}
                    </Typography>
                </Stack>
                <Stack width="100% " flexDirection="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="h6" fontWeight={700} sx={{ color1 }}>
                        {value1}
                    </Typography>
                </Stack>
            </Box>
            <Box>
                <Stack flexDirection="row" justifyContent="center" spacing={1} mb={1}>
                    <Typography variant="body2" fontWeight={700} color="#151D48">
                        {label2}
                    </Typography>
                </Stack>
                <Stack width="100% " flexDirection="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="h6" fontWeight={700} sx={{ color2 }}>
                        {value2}
                    </Typography>
                </Stack>
            </Box>
        </Stack>
    </Box>
);

function ContractDetailSkeleton() {
    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
                {[1, 2, 3, 4].map((i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                        <Card sx={{ p: 2 }}>
                            <Skeleton variant="text" width="70%" height={24} />
                            <Skeleton variant="text" width="50%" height={32} />
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Skeleton variant="text" width={200} height={24} />
                <Skeleton
                    variant="rectangular"
                    height={20}
                    sx={{ mt: 1, borderRadius: 2 }}
                    animation="wave"
                />
            </Box>

            <Card sx={{ mt: 4, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    <Skeleton width={180} />
                </Typography>

                <Grid container spacing={1}>
                    {[...Array(6)].map((_, i) => (
                        <Grid key={i}>
                            <Skeleton variant="text" width="80%" height={20} />
                        </Grid>
                    ))}
                </Grid>
                <Divider sx={{ my: 1 }} />

                {[1, 2, 3].map((row) => (
                    <Grid container spacing={1} key={row} sx={{ my: 0.5 }}>
                        {[...Array(6)].map((_, i) => (
                            <Grid key={i}>
                                <Skeleton variant="text" width="80%" height={20} animation="wave" />
                            </Grid>
                        ))}
                    </Grid>
                ))}

                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Skeleton variant="text" width={200} height={24} />
                </Box>
            </Card>

            <Card sx={{ mt: 4, p: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    <Skeleton width={160} />
                </Typography>

                <Grid container spacing={1}>
                    {[...Array(5)].map((_, i) => (
                        <Grid key={i}>
                            <Skeleton variant="text" width="70%" height={20} />
                        </Grid>
                    ))}
                </Grid>
                <Divider sx={{ my: 1 }} />

                {[1, 2].map((row) => (
                    <Grid container spacing={1} key={row} sx={{ my: 0.5 }}>
                        {[...Array(5)].map((_, i) => (
                            <Grid key={i}>
                                <Skeleton variant="text" width="70%" height={20} animation="wave" />
                            </Grid>
                        ))}
                    </Grid>
                ))}

                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Skeleton variant="text" width={180} height={24} />
                </Box>
            </Card>
        </Box>
    );
}