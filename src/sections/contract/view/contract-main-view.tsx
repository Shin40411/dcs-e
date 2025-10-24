import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { IContractItem } from "src/types/contract";
import { ContractCardList } from "../contract-card-list";
import { IDateValue } from "src/types/common";
import { CONFIG } from "src/global-config";
import { Iconify } from "src/components/iconify";
import { ContractForm } from "../contract-form";
import { ContractDetails } from "../contract-details";
import { useLocation, useNavigate } from "react-router";

export function ContractMainView() {
    const location = useLocation();
    const [openForm, setOpenForm] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedContract, setSelectedContract] = useState<IContractItem | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [fromDate, setFromDate] = useState<IDateValue>();
    const [toDate, setToDate] = useState<IDateValue>();
    const [productDetails, setProductDetails] = useState([]);
    const [inVoiceCustomerId, setInVoiceCustomerId] = useState<number | null>(null);
    const navigate = useNavigate();

    const handleViewDetails = (contract: IContractItem) => {
        setSelectedContract(contract);
        setOpenDetail(true);
    };

    const handleEditing = (contract: IContractItem) => {
        setSelectedContract(contract);
        setOpenForm(true);
    }

    const handleCopying = (obj: IContractItem) => {
        setSelectedContract(null);
        setOpenForm(true);
    }

    useEffect(() => {
        if (location.state?.openForm) {
            setOpenForm(true);
            if (location.state.details) {
                const quotation = location.state.details;
                const products = quotation.items?.[0]?.products ?? [];
                setProductDetails(products);
            }
            if (location.state.customer) {
                setInVoiceCustomerId(location.state.customer);
            }
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate]);

    return (
        <>
            <DashboardContent
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
                <CustomBreadcrumbs
                    heading="Hợp đồng"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Nghiệp vụ khách hàng' },
                        { name: 'Hợp đồng' },
                    ]}
                    action={
                        <Button variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => { setOpenForm(true); setSelectedContract(null) }}
                        >
                            Tạo hợp đồng
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
                <ContractCardList
                    onViewDetails={handleViewDetails}
                    onEditing={handleEditing}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    setFromDate={setFromDate}
                    setToDate={setToDate}
                />

                <ContractForm
                    open={openForm}
                    onClose={() => {
                        setOpenForm(false);
                        setSelectedContract(null);
                        setProductDetails([]);
                    }}
                    selectedContract={selectedContract}
                    detailsFromQuotation={productDetails}
                    customerIdFromQuotation={inVoiceCustomerId}
                />
                {selectedContract && (
                    <ContractDetails
                        selectedContract={selectedContract}
                        openForm={handleCopying}
                        openDetail={openDetail}
                        onClose={() => setOpenDetail(false)}
                    />
                )}
            </DashboardContent>
        </>
    );
}