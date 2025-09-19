import { IQuotationProduct } from "src/types/quotation";
import { QuotationFormValues } from "../schema/quotation-schema";

export function mapProductsToItems(products: IQuotationProduct[]): QuotationFormValues["items"] {
    return products.map((p) => ({
        product: { id: p.productID, name: p.productName },
        unit: String(p.unitProductID ?? ""),
        qty: p.quantity,
        price: p.price,
        vat: p.vat,
    }));
}
