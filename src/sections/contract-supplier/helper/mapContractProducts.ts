import { editProductContractSup } from "src/actions/contractSupplier";
import { IContractSupplyDto, IContractSupplyProductDto, IProductContractSupEdit } from "src/types/contractSupplier";

export const editAllContractDetails = async (products: IContractSupplyProductDto[], id: number) => {
    if (!products) return;

    const payloads: IProductContractSupEdit[] = products.map((detail) => ({
        contractId: id ?? 0,
        productId: Number(detail.productID),
        quantity: detail.quantity,
        price: detail.price,
        unit: detail.unit,
    }));

    await editProductContractSup(payloads);
};