import { Box, BoxProps, Dialog, DialogProps, IconButton } from "@mui/material";
import { useBoolean } from "minimal-shared/hooks";
import { Iconify } from "src/components/iconify";
import { CONFIG } from "src/global-config";
import { IBankAccountItem } from "src/types/bankAccount";
import { fCurrency } from "src/utils/format-number";

type Props = DialogProps & {
    bankAccountItem: IBankAccountItem;
    onClose: () => void;
}

export function BankingDetails({ bankAccountItem, open, onClose, ...other }: Props) {
    const showCurrency = useBoolean();
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth {...other}>
            <Box
                sx={[
                    (theme) => ({
                        ...theme.mixins.bgGradient({
                            images: [`url(${CONFIG.assetsDir}/assets/background/background-4.jpg)`],
                        }),
                        borderRadius: 2,
                    }),
                ]}
            >
                <BankAccountItem
                    item={bankAccountItem}
                    key={bankAccountItem.id}
                    showCurrency={showCurrency.value}
                    onToggleCurrency={showCurrency.onToggle}
                    sx={{ color: 'common.white' }}
                />
            </Box>
        </Dialog>
    );
}

type BankAccountItemProps = BoxProps & {
    item: IBankAccountItem;
    showCurrency: boolean;
    onToggleCurrency: () => void;
};

function BankAccountItem({ item, showCurrency, onToggleCurrency, sx, ...other }: BankAccountItemProps) {
    return (
        <>
            <Box
                sx={[
                    { p: 3, width: 1 },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                {...other}
            >
                <div>
                    <Box sx={{ mb: 1.5, typography: 'subtitle2', opacity: 0.48 }}>Số dư hiện tại</Box>

                    <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
                        <Box component="span" sx={{ typography: 'h4' }}>
                            {!showCurrency ? '********' : fCurrency(item.balance)}
                        </Box>

                        <IconButton color="inherit" onClick={onToggleCurrency} sx={{ opacity: 0.48 }}>
                            <Iconify icon={showCurrency ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                        </IconButton>
                    </Box>
                </div>

                <Box
                    sx={{
                        my: 3,
                        gap: 1,
                        display: 'flex',
                        alignItems: 'center',
                        typography: 'subtitle1',
                        justifyContent: 'flex-end',
                    }}
                >
                    {item.bankName === 'visa' ? (
                        <Box
                            sx={{
                                py: 0.15,
                                px: 0.25,
                                borderRadius: 0.5,
                                display: 'inline-flex',
                                bgcolor: 'common.white',
                            }}
                        >
                            <Iconify width={32} height="auto" icon="payments:visa" />
                        </Box>
                    ) : (
                        <Box>
                            <Iconify width={32} height="auto" icon="fluent-emoji-flat:credit-card" />
                        </Box>
                    )}
                    {item.bankNo}
                </Box>

                <Box sx={{ gap: 5, display: 'flex', typography: 'subtitle1' }}>
                    <div>
                        <Box sx={{ mb: 1, opacity: 0.48, typography: 'caption' }}>Tên tài khoản</Box>
                        <Box component="span">{item.name}</Box>
                    </div>
                    <div>
                        <Box sx={{ mb: 1, opacity: 0.48, typography: 'caption' }}>Trạng thái</Box>
                        <Box component="span">{item.status ? 'Đang hoạt động' : 'Không hoạt động'}</Box>
                    </div>
                </Box>
            </Box>
        </>
    );
}