import { Box, Card, CardProps, MenuItem, MenuList, Stack, Tooltip, Typography } from "@mui/material";
import { UseBooleanReturn, usePopover } from "minimal-shared/hooks";
import { CustomPopover } from "src/components/custom-popover";
import { Iconify } from "src/components/iconify";
import { IContractItem } from "src/types/contract";
import { ContractPreview } from "./contract-preview";
import { fCurrency } from "src/utils/format-number";
import { useSettingsContext } from "src/components/settings";

type Props = CardProps & {
    openDeleteDialog: UseBooleanReturn;
    setId: (value: any) => void;
    contract: IContractItem;
    onViewDetails: () => void;
    onEditing: () => void;
};

// const statusMap: { [key: number]: string } = {
//     0: "Bỏ qua",
//     1: "Nháp",
//     2: "Đang thực hiện",
//     3: "Đã thanh toán",
// }

export function ContractItem({ openDeleteDialog, setId, contract, onViewDetails, onEditing, sx, ...other }: Props) {
    const menuActions = usePopover();
    const settings = useSettingsContext();

    const renderMenuActions = () => (
        <CustomPopover
            open={menuActions.open}
            anchorEl={menuActions.anchorEl}
            onClose={menuActions.onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            slotProps={{
                arrow: { placement: "left-top" },
            }}
        >
            <MenuList>
                <MenuItem
                    onClick={() => {
                        onViewDetails();
                        menuActions.onClose();
                    }}
                    sx={{ display: { xs: 'none', sm: 'none', md: 'inline-flex' } }}
                >
                    <Iconify icon="solar:eye-bold" />
                    Xem hợp đồng
                </MenuItem>

                <MenuItem onClick={() => {
                    onEditing();
                    menuActions.onClose();
                }
                }>
                    <Iconify icon="solar:pen-bold" />
                    Chỉnh sửa
                </MenuItem>

                {/* <MenuItem
                    onClick={() => {
                        menuActions.onClose();
                        openDeleteDialog.onTrue();
                        setId(contract.id);
                    }}
                    sx={{ color: "error.main" }}
                >
                    <Iconify icon="solar:trash-bin-trash-bold" />
                    Xóa
                </MenuItem> */}
            </MenuList>
        </CustomPopover>
    );

    const totalDirection = settings.state.navLayout === 'vertical' ? 'column' : 'row';

    return (
        <>
            <Card
                onClick={menuActions.onOpen}
                sx={{
                    position: "relative",
                    cursor: 'pointer',
                    borderRadius: 1,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    aspectRatio: { md: "210/297", sm: "210/200", xs: "210/200" },
                    bgcolor: "#fdfdfd",
                    boxShadow: 3,
                    transition: "0.2s",
                    maxHeight: { lg: 240, md: 250, sm: 170 },
                    "&:hover": { boxShadow: 6, transform: "scale(1.02)" },
                    ...sx,
                }}
                {...other}
            >
                <ContractPreview contract={contract} />
                <Stack direction={{ md: totalDirection, sm: "column" }} justifyContent={'space-around'} alignContent={"center"} py={1} spacing={1}>
                    <Stack width="50%" direction={"row"} alignContent={"center"} justifyContent={"space-between"}>
                        <Box
                            sx={{
                                pl: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Iconify icon="ri:contract-fill" sx={{ width: { md: 14, sm: 15, xs: 13 } }} />
                            <Tooltip title={`Hợp đồng số: ${contract.contractNo}`}>
                                <Typography
                                    variant="body2"
                                    fontSize={{ lg: 10, md: 10, sm: 9.5, xs: 9 }}
                                    fontWeight={700}
                                    sx={{
                                        maxWidth: { xl: 100, lg: 100, md: 100, sm: 95 },
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                    }}
                                >
                                    {contract.contractNo}
                                </Typography>
                            </Tooltip>

                        </Box>

                    </Stack>
                    <Stack width="50%" direction={"row"} alignContent={"center"}>
                        <Box
                            sx={{
                                pl: 2.5,
                                pr: { md: 0, sm: 2.5 },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <Iconify icon="stash:badge-dollar-solid" sx={{ width: { md: 16, sm: 15, xs: 14 } }} />
                            <Tooltip title={`Tổng cộng ${fCurrency(contract.total)}`}>
                                <Typography
                                    variant="body2"
                                    fontSize={{ lg: 10, md: 10, sm: 9.5, xs: 9 }}
                                    fontWeight={700}
                                    sx={{
                                        maxWidth: { xl: 160, lg: 100, md: 100 },
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "block",
                                    }}
                                >
                                    {fCurrency(contract.total)}
                                </Typography>
                            </Tooltip>
                        </Box>
                    </Stack>
                </Stack>
            </Card >

            {renderMenuActions()}
        </>
    );
}
