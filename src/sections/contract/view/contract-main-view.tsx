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
import { useBoolean } from "minimal-shared/hooks";
import { RoleBasedGuard } from "src/auth/guard";
import { useCheckPermission } from "src/auth/hooks/use-check-permission";
import { CUSTOMER_SERVICE_TAB_DATA } from "src/components/tabs/components/service-nav-tabs-data";
import ServiceNavTabs from "src/components/tabs/service-nav-tabs";

export function ContractMainView() {
    const location = useLocation();
    const [openForm, setOpenForm] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedContract, setSelectedContract] = useState<IContractItem | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [productDetails, setProductDetails] = useState([]);
    const [inVoiceCustomerId, setInVoiceCustomerId] = useState<number | null>(null);
    const isCreatingSupplierContract = useBoolean();
    const [copiedContract, setCopiedContract] = useState<IContractItem | null>(null);
    const navigate = useNavigate();

    const { permission } = useCheckPermission(['HOPDONG.VIEW']);

    const handleViewDetails = (contract: IContractItem) => {
        setSelectedContract(contract);
        setOpenDetail(true);
    };

    const handleEditing = (contract: IContractItem) => {
        setSelectedContract(contract);
        setCopiedContract(null);
        setOpenForm(true);
    }

    const handleCopying = (obj: IContractItem) => {
        setCopiedContract(obj);
        setSelectedContract(null);
        setOpenForm(true);
    }

    const handleCreateSupplierContract = () => {
        // setSelectedContract(null);
        isCreatingSupplierContract.onTrue();
        setOpenForm(true);
    }

    // useEffect(() => {
    //     console.log('isCreatingSupplierContract:', isCreatingSupplierContract.value);
    // }, [isCreatingSupplierContract.value]);

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
        <RoleBasedGuard
            hasContent
            currentRole={permission?.name || ''}
            allowedRoles={['HOPDONG.VIEW']}
            sx={{ py: 10 }}
        >
            <DashboardContent
                sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
            >
                <CustomBreadcrumbs
                    heading="Nghiệp vụ khách hàng"
                    links={[
                        { name: 'Nghiệp vụ khách hàng' },
                        { name: 'Hợp đồng' },
                    ]}
                    action={
                        <Button variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            sx={(theme) => ({ bgcolor: theme.palette.primary.main })}
                            onClick={() => { setOpenForm(true); setSelectedContract(null); setCopiedContract(null); }}
                        >
                            Tạo hợp đồng
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <ServiceNavTabs tabs={CUSTOMER_SERVICE_TAB_DATA} activePath={location.pathname} />
                <ContractCardList
                    onViewDetails={handleViewDetails}
                    onEditing={handleEditing}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                />

                <ContractForm
                    open={openForm}
                    onClose={() => {
                        setOpenForm(false);
                        setSelectedContract(null);
                        setProductDetails([]);
                        isCreatingSupplierContract.onFalse();
                        setCopiedContract(null);
                    }}
                    selectedContract={selectedContract}
                    detailsFromQuotation={productDetails}
                    customerIdFromQuotation={inVoiceCustomerId}
                    creatingSupplierContract={isCreatingSupplierContract.value}
                    CopiedContract={copiedContract}
                />
                {selectedContract && (
                    <ContractDetails
                        selectedContract={selectedContract}
                        copyContract={handleCopying}
                        openDetail={openDetail}
                        onClose={() => setOpenDetail(false)}
                        createSupplierContract={handleCreateSupplierContract}
                    />
                )}


            </DashboardContent>
        </RoleBasedGuard>
    );
}