import { editProductQuotation } from "src/actions/quotation";
import { IProductQuotationEdit, IQuotationDto } from "src/types/quotation";

export const editAllQuotationDetails = async (bodyPayload: IQuotationDto, id: number) => {
    if (!bodyPayload.quotationDetails) return;

    const payloads: IProductQuotationEdit[] = bodyPayload.quotationDetails.map((detail) => ({
        quotationId: id ?? 0,
        productId: Number(detail.productID),
        quantity: detail.quantity,
        Price: detail.Price,
        Unit: detail.Unit,
    }));

    await editProductQuotation(payloads);
};