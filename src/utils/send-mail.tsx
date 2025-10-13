import { pdf } from "@react-pdf/renderer";
import axiosInstance, { endpoints } from "src/lib/axios";
import { ContractPdfDocument } from "src/sections/contract/contract-pdf";
import { IContractData, IContractItem } from "src/types/contract";

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
        const blob = await pdf(<ContractPdfDocument contract={contract} currentContract={currentContract} />).toBlob();

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
