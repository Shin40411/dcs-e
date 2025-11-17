import { Button } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { useState } from "react";
import { IQuotationItem } from "src/types/quotation";
import { CONFIG } from "src/global-config";
import { IDateValue } from "src/types/common";
import { RoleBasedGuard } from "src/auth/guard";
import { useCheckPermission } from "src/auth/hooks/use-check-permission";
import { QuotationCardList } from "../supplier/quotation-card-list";
import { QuotationForm } from "../supplier/quotation-form";
import { QuotationDetails } from "../supplier/quotation-details";

export function OrderSupplierMainView() {
    const [openForm, setOpenForm] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState<IQuotationItem | null>(null);
    const [copiedQuotation, setCopiedQuotation] = useState<IQuotationItem | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [fromDate, setFromDate] = useState<IDateValue>();
    const [toDate, setToDate] = useState<IDateValue>();

    const { permission } = useCheckPermission(['BAOGIA.VIEW']);

    const handleViewDetails = (quotation: IQuotationItem) => {
        setSelectedQuotation(quotation);
        setOpenDetail(true);
    };

    const handleEditing = (quotation: IQuotationItem) => {
        setSelectedQuotation(quotation);
        setCopiedQuotation(null)
        setOpenForm(true);
    }

    const handleCopying = (obj: IQuotationItem) => {
        setCopiedQuotation(obj);
        setSelectedQuotation(null);
        setOpenForm(true);
    }

    return (
        <RoleBasedGuard
            hasContent
            currentRole={permission?.name || ''}
            allowedRoles={['BAOGIA.VIEW']}
            sx={{ py: 10 }}
        >
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Đặt hàng"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Nghiệp vụ nhà cung cấp' },
                        { name: 'Đặt hàng' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => {
                                setSelectedQuotation(null);
                                setCopiedQuotation(null)
                                setOpenForm(true)
                            }}
                        >
                            Tạo phiếu đặt hàng
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <QuotationCardList
                    onViewDetails={handleViewDetails}
                    onEditing={handleEditing}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                />
                <QuotationForm
                    selectedQuotation={selectedQuotation}
                    openForm={openForm}
                    onClose={() => {
                        setOpenForm(false);
                        setSelectedQuotation(null);
                        setCopiedQuotation(null);
                    }}
                    CopiedQuotation={copiedQuotation}
                />
                {selectedQuotation && (
                    <QuotationDetails
                        selectedQuotation={selectedQuotation}
                        openDetail={openDetail}
                        openForm={handleCopying}
                        onClose={() => setOpenDetail(false)}
                    />
                )}
            </DashboardContent>
        </RoleBasedGuard>
    );
}