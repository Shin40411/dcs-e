import { Button } from "@mui/material"
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs"
import { Iconify } from "src/components/iconify"
import { DashboardContent } from "src/layouts/dashboard"
import { paths } from "src/routes/paths"

export function SuppliersListView() {
    return (
        <>
            <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CustomBreadcrumbs
                    heading="Nhà cung cấp"
                    links={[
                        { name: 'Tổng quan', href: paths.dashboard.root },
                        { name: 'Cấu hình' },
                        { name: 'Nhà cung cấp' },
                    ]}
                    action={
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => {

                            }}
                        >
                            Tạo nhà cung cấp
                        </Button>
                    }
                    sx={{ mb: { xs: 3, md: 5 } }}
                />
            </DashboardContent>
        </>
    );
}