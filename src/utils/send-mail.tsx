import { pdf } from "@react-pdf/renderer";
import axiosInstance, { endpoints } from "src/lib/axios";
import { ContractPdfDocument as ContractSupplier } from "src/sections/contract-supplier/contract-pdf";
import { ContractPdfDocument as ContractCustomer } from "src/sections/contract/contract-pdf";
import { IContractData, IContractItem } from "src/types/contract";
import { IContractSupplyForDetail, IContractSupplyItem, ResponseContractSupplier } from "src/types/contractSupplier";

export async function sendEmailContract({
    email,
    contract,
    currentContract
}: {
    email: string;
    contract?: IContractItem;
    currentContract?: IContractData;
}) {
    try {
        const blob = await pdf(<ContractCustomer contract={contract} currentContract={currentContract} />).toBlob();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('file', new File([blob], 'hopdong.pdf', { type: 'application/pdf' }));

        const { data } = await axiosInstance.post(endpoints.contract.sendMail, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function sendEmailSupplierContract({
    email,
    contract,
    currentContract
}: {
    email: string;
    contract?: IContractSupplyItem;
    currentContract?: ResponseContractSupplier<IContractSupplyForDetail>;
}) {
    try {
        const blob = await pdf(<ContractSupplier contract={contract} currentContract={currentContract} />).toBlob();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('file', new File([blob], 'hopdong.pdf', { type: 'application/pdf' }));

        const { data } = await axiosInstance.post(endpoints.contract.sendMail, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
