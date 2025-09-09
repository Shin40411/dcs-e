
import { DashboardContent } from 'src/layouts/dashboard';
import { _bankingContacts, _bankingCreditCard, _bankingRecentTransitions } from 'src/_mock';

import { Iconify } from 'src/components/iconify/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { Button } from '@mui/material';
import { UseGridTableList } from 'src/components/data-grid-table/data-grid-table';
import { useEffect, useState } from 'react';
import { IBankAccountItem } from 'src/types/bankAccount';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { useGetBankAccounts } from 'src/actions/bankAccount';
import { useBoolean } from 'minimal-shared/hooks';
import { BANKACCOUNT_COLUMNS } from 'src/const/bankAccount';
import { BankingDetails } from '../banking-details';
import { BankingNewEditForm } from '../banking-new-edit-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { endpoints } from 'src/lib/axios';
import { deleteOne } from 'src/actions/delete';
import { toast } from 'sonner';

// ----------------------------------------------------------------------

export function OverviewBankingView() {
  const openDetailsForm = useBoolean();
  const openCrudForm = useBoolean();
  const confirmDialog = useBoolean();
  const confirmDelRowDialog = useBoolean();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchText, setSearchText] = useState('');

  const { bankAccounts, pagination, bankAccountsLoading } = useGetBankAccounts({
    pageNumber: page + 1,
    pageSize: rowsPerPage,
    key: searchText,
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [tableData, setTableData] = useState<IBankAccountItem[]>(bankAccounts);
  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);
  const [tableRowSelected, setTableRowSelected] = useState<IBankAccountItem | null>(null);
  const [rowIdSelected, setRowIdSelected] = useState(0);

  useEffect(() => {
    if (bankAccounts.length) {
      setTableData(bankAccounts);
    }
  }, [bankAccounts]);

  const dataFiltered = tableData;

  const handleDeleteRow = async (id: number) => {
    const success = await deleteOne({
      apiEndpoint: endpoints.bankAccount.delete(id),
      listEndpoint: endpoints.bankAccount.list(`?pageNumber=${page + 1}&pageSize=${rowsPerPage}&Status=1`),
    });
    if (success) {
      toast.success('Xóa thành công 1 tài khoản ngân hàng!');
    } else {
      toast.error("Xóa thất bại, vui lòng kiểm tra lại!");
    }
  }

  const renderDetails = () => (
    <BankingDetails
      open={openDetailsForm.value}
      bankAccountItem={tableRowSelected ?? ({} as IBankAccountItem)}
      onClose={openDetailsForm.onFalse}
    />
  );

  const renderCRUDForm = () => (
    <BankingNewEditForm
      open={openCrudForm.value}
      onClose={openCrudForm.onFalse}
      selectedId={rowIdSelected || undefined}
      page={page}
      rowsPerPage={rowsPerPage}
      currentBankingAccount={tableRowSelected || undefined}
    />
  );

  const renderConfirmDeleteRow = () => (
    <ConfirmDialog
      open={confirmDelRowDialog.value}
      onClose={confirmDelRowDialog.onFalse}
      title="Xác nhận xóa tài khoản ngân hàng"
      content={
        <>
          Bạn có chắc chắn muốn xóa tài khoản ngân hàng này?
        </>
      }
      action={
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            handleDeleteRow(rowIdSelected);
            confirmDelRowDialog.onFalse();
          }}
        >
          Xác nhận
        </Button>
      }
    />
  );

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Tài khoản ngân hàng"
        links={[
          { name: 'Tổng quan', href: paths.dashboard.root },
          { name: 'Danh mục' },
          { name: 'Tài khoản ngân hàng' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => {
              setTableRowSelected(null),
                openCrudForm.onTrue();
            }}
          >
            Tạo tài khoản ngân hàng
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <UseGridTableList
        dataFiltered={dataFiltered}
        loading={bankAccountsLoading}
        columns={BANKACCOUNT_COLUMNS({ openDetailsForm, openCrudForm, confirmDelRowDialog, setTableRowSelected, setRowIdSelected, page, rowsPerPage })}
        rowSelectionModel={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
        paginationCount={pagination?.totalRecord ?? 0}
        page={page}
        handleChangePage={handleChangePage}
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        searchText={searchText}
        onSearchChange={setSearchText}
      />
      {renderDetails()}
      {renderCRUDForm()}
      {renderConfirmDeleteRow()}
    </DashboardContent>
  );
}
