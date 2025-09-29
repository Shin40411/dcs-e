import { Button } from "@mui/material";
import { useState } from "react";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { IContractItem } from "src/types/contract";
import { ContractCardList } from "../contract-card-list";
import { IDateValue } from "src/types/common";
import { CONFIG } from "src/global-config";
import { Iconify } from "src/components/iconify";

export function ContractMainView() {
    const [openForm, setOpenForm] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedContract, setSelectedContract] = useState<IContractItem | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(CONFIG.pageSizesGlobal);
    const [fromDate, setFromDate] = useState<IDateValue>();
    const [toDate, setToDate] = useState<IDateValue>();

    const handleViewDetails = (contract: IContractItem) => {
        setSelectedContract(contract);
        setOpenDetail(true);
    };

    const handleEditing = (contract: IContractItem) => {
        setSelectedContract(contract);
        setOpenForm(true);
    }


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
                            onClick={() => setOpenForm(true)}
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
            </DashboardContent>
        </>
    );
}