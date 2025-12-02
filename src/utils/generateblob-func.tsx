import { pdf, DocumentProps } from "@react-pdf/renderer";
import { ReactElement } from "react";

export async function generatePdfBlob(
    component: ReactElement<DocumentProps>
) {
    return await pdf(component).toBlob();
}
