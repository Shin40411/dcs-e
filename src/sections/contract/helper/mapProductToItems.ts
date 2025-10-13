import { IContractProduct } from "src/types/contract";
import { ContractFormValues } from "../schema/contract-schema";

export function mapProductsToItems(products: IContractProduct[]): ContractFormValues["products"] {
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