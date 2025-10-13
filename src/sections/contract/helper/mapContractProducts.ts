import { editProductContract } from "src/actions/contract";
import { IContractDto, IProductContractEdit } from "src/types/contract";

export const editAllContractDetails = async (bodyPayload: IContractDto, id: number) => {
    if (!bodyPayload.products) return;

    const payloads: IProductContractEdit[] = bodyPayload.products.map((detail) => ({
        contractId: id ?? 0,
        productId: Number(detail.productID),
        quantity: detail.quantity,
        price: detail.price,
        unit: detail.unit,
    }));

    await editProductContract(payloads);
};