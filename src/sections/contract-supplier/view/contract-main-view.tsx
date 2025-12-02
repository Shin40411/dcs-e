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
import { IContractSupplyItem } from "src/types/contractSupplier";
import { useGetSupplierContracts } from "src/actions/contractSupplier";
import { useCheckPermission } from "src/auth/hooks/use-check-permission";
import { RoleBasedGuard } from "src/auth/guard";
import ServiceNavTabs from "src/components/tabs/service-nav-tabs";
import { SUPPLIER_SERVICE_TAB_DATA } from "src/components/tabs/components/service-nav-tabs-data";
import { FilterValues } from "src/types/filter-values";

export function ContractMainView() {
    const location = useLocation();
    const [openForm, setOpenForm] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedContract, setSelectedContract] = useState<IContractSupplyItem | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [productDetails, setProductDetails] = useState([]);
    const [inVoiceCustomerId, setInVoiceCustomerId] = useState<number | null>(null);
    const [copiedContract, setCopiedContract] = useState<IContractSupplyItem | null>(null);
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState("");

    const { permission } = useCheckPermission(['HOPDONG.VIEW']);

    const [filters, setFilters] = useState<FilterValues>({
        fromDate: null,
        toDate: null,
    });
    const { contracts, contractsLoading, pagination, contractsEmpty, mutation } = useGetSupplierContracts({
        pageNumber: page + 1,
        pageSize: rowsPerPage,
        key: searchText.trim(),
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        Filter: filters.customer,
        Month: filters.month,
        Status: filters.status
    });

    const handleViewDetails = (contract: IContractSupplyItem) => {
        setSelectedContract(contract);
        setOpenDetail(true);
    };

    const handleEditing = (contract: IContractSupplyItem) => {
        setSelectedContract(contract);
        setOpenForm(true);
    }

    const handleCopying = (obj: IContractSupplyItem) => {
        setCopiedContract(obj);
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
                    heading="Nghiệp vụ nhà cung cấp"
                    links={[
                        { name: 'Nghiệp vụ nhà cung cấp' },
                        { name: 'Hợp đồng' },
                    ]}
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <ServiceNavTabs tabs={SUPPLIER_SERVICE_TAB_DATA} activePath={location.pathname} />
                <ContractCardList
                    onViewDetails={handleViewDetails}
                    onEditing={handleEditing}
                    page={page}
                    setPage={setPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                    contracts={contracts}
                    contractsEmpty={contractsEmpty}
                    contractsLoading={contractsLoading}
                    pagination={pagination}
                    setFilters={setFilters}
                    setSearchText={setSearchText}
                />

                <ContractForm
                    open={openForm}
                    onClose={() => {
                        setCopiedContract(null);
                        setOpenForm(false);
                        setSelectedContract(null);
                        setProductDetails([]);
                    }}
                    selectedContract={selectedContract}
                    detailsFromQuotation={productDetails}
                    mutation={mutation}
                    CopiedContract={copiedContract}
                />
                {selectedContract && (
                    <ContractDetails
                        selectedContract={selectedContract}
                        copyContract={handleCopying}
                        openDetail={openDetail}
                        onClose={() => setOpenDetail(false)}
                    />
                )}


            </DashboardContent>
        </RoleBasedGuard>
    );
}