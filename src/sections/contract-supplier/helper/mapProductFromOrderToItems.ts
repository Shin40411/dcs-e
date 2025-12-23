import { ContractFormValues } from "../schema/contract-schema";
import { IContractSupplyDetailFromOrder } from "src/types/contractSupplier";

export function mapProductFromOrderToItems(products: IContractSupplyDetailFromOrder[]): ContractFormValues["products"] {
    return products.map((p) => ({
        id: Number(p.id),
        product: String(p.productID),
        unit: String(p.unitProductID ?? ""),
        unitName: p.unit,
        qty: p.quantity,
        price: p.price,
        vat: p.vat,
    }));
}