import { pdf, DocumentProps } from "@react-pdf/renderer";
import { ReactElement } from "react";

export async function generatePdfBlob(
    component: ReactElement<DocumentProps>
) {
    return await pdf(component).toBlob();
}


export const imageToBase64 = async (url: string) => {
    const res = await fetch(url);
    const blob = await res.blob();

    return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
};
