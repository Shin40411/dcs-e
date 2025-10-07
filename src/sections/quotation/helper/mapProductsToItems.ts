import { IQuotationProduct } from "src/types/quotation";
import { QuotationFormValues } from "../schema/quotation-schema";

export function mapProductsToItems(products: IQuotationProduct[]): QuotationFormValues["items"] {
    return products.map((p) => ({
        product: String(p.productID),
        unit: String(p.unitProductID),
        unitName: p.unit,
        qty: p.quantity,
        price: p.price,
        vat: p.vat,
    }));
}
