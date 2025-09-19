import { Button } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { useState } from "react";
import { QuotationCardList } from "../quotation-card-list";
import { QuotationForm } from "../quotation-form";
import { QuotationDetails } from "../quotation-details";
import { IQuotationItem } from "src/types/quotation";
import { CONFIG } from "src/global-config";
import { IDateValue } from "src/types/common";

export function QuotationMainView() {
    const [openForm, setOpenForm] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState<IQuotationItem | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [fromDate, setFromDate] = useState<IDateValue>();
    const [toDate, setToDate] = useState<IDateValue>();

    const handleViewDetails = (quotation: IQuotationItem) => {
        setSelectedQuotation(quotation);
        setOpenDetail(true);
    };

    const handleEditing = (quotation: IQuotationItem) => {
        setSelectedQuotation(quotation);
        setOpenForm(true);
    }

    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Báo giá"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Nghiệp vụ khách hàng' },
                        { name: 'Báo giá' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => {
                                setSelectedQuotation(null);
                                setOpenForm(true)
                            }}
                        >
                            Tạo báo giá
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
                    onClose={() => setOpenForm(false)}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    fromDate={fromDate || null}
                    toDate={toDate || null}
                />
                {selectedQuotation && (
                    <QuotationDetails
                        selectedQuotation={selectedQuotation}
                        openDetail={openDetail}
                        onClose={() => setOpenDetail(false)}
                    />
                )}
            </DashboardContent>
        </>
    );
}