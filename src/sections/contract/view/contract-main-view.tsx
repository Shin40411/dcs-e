import { Button } from "@mui/material";
import { useState } from "react";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { IContract, IContractItem } from "src/types/contract";
import { ContractTable } from "../contract-table";
import { ContractForm } from "../contract-form";
import { ContractDetail } from "../contract-detail";
import { IQuotationItem } from "src/types/quotation";

export function ContractMainView() {
    const [contracts, setContracts] = useState<IContract[]>([
        {
            id: 'HD001',
            customer: 'Công ty A',
            signedDate: '2025-09-01',
            expireDate: '2026-09-01',
            status: 'Hiệu lực',
            total: '500,000,000',
        },
        {
            id: 'HD002',
            customer: 'Công ty B',
            signedDate: '2025-07-15',
            expireDate: '2025-12-15',
            status: 'Hết hạn',
            total: '120,000,000',
        },
    ]);

    // const quotations: IQuotationItem[] = [
    //     {
    //         id: 'Q-001',
    //         customer: 'Công ty ABC',
    //         date: '2025-09-05',
    //         status: true,
    //         total: 25000000,
    //         staff: 'Nguyễn Văn A',
    //         item: [
    //             { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
    //             { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
    //             { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
    //         ],
    //     },
    //     {
    //         id: 'Q-002',
    //         customer: 'Công ty XYZ',
    //         date: '2025-09-02',
    //         status: true,
    //         total: 15500000,
    //         staff: 'Trần Thị B',
    //         item: [
    //             { name: 'Laptop Dell XPS 13', qty: 2, price: 18000000 },
    //             { name: 'Chuột không dây Logitech', qty: 5, price: 350000 },
    //             { name: 'Bàn phím cơ Keychron K2', qty: 3, price: 2200000 },
    //         ],
    //     },
    // ];


    const [openForm, setOpenForm] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [selectedContract, setSelectedContract] = useState<IContract | null>(
        null
    );
    const [selectedItems, setSelectedItems] = useState<IContractItem[]>([]);

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
                        <Button variant="contained" onClick={() => setOpenForm(true)}>
                            Tạo hợp đồng
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />

                <ContractTable
                    contracts={contracts}
                    onView={(c) => {
                        setSelectedContract(c);
                        setOpenDetail(true);
                    }}
                />
            </DashboardContent>

            {/* Form tạo hợp đồng */}
            {/* <ContractForm
                open={openForm}
                onClose={() => setOpenForm(false)}
                quotations={quotations}
                onSave={(newContract) => {
                    setContracts((prev) => [...prev, newContract]);
                    setOpenForm(false);
                }}
            /> */}

            {/* Chi tiết hợp đồng */}
            <ContractDetail
                open={openDetail}
                onClose={() => setOpenDetail(false)}
                contract={selectedContract}
                items={selectedItems}
                onExportPdf={(c, items) => {
                    console.log('Xuất PDF', c, items);
                }}
            />
        </>
    );
}