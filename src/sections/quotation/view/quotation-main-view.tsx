import { Button } from "@mui/material";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { useState } from "react";
import { QuotationCardList } from "../quotation-card-list";
import { QuotationForm } from "../quotation-forms";
import { QuotationDetails } from "../quotation-details";
import { IQuotationItem } from "src/types/quotation";

export function QuotationMainView() {
    const [openForm, setOpenForm] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState<IQuotationItem | null>(null);

    const handleCreateQuotation = (data: any) => {
        console.log("Quotation data:", data);
    };

    const handleViewDetails = (quotation: IQuotationItem) => {
        setSelectedQuotation(quotation);
        setOpenDetail(true);
    };

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
                            onClick={() => setOpenForm(true)}
                        >
                            Tạo báo giá
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <QuotationCardList onViewDetails={handleViewDetails} />
                <QuotationForm
                    openForm={openForm}
                    onClose={() => setOpenForm(false)}
                    onSubmit={handleCreateQuotation}
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