export function generateQuotationNo(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `Q-${year}${month}${day}-${hours}${minutes}`;
}

export function generateOrderNo(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `O-${year}${month}${day}-${hours}${minutes}`;
}

export function generateContractNo(companyName: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    return `${year}${month}${day}${hours}${minutes}/HĐ.DCS-${companyName}`;
}

export function generateReceipt(head: string, totalRecord?: number): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}${month}${day}/${head}${totalRecord !== undefined ? totalRecord + 1 : ''}`;
}

export function generateInternalReceipt(head: string, totalRecord?: number): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${head}${totalRecord !== undefined ? totalRecord + 1 : ''}-${year}${month}${day}`;
}

export function generateWarehouseExport(head: string, contractNo: string, totalRecord?: number): string {
    return `${head}${totalRecord !== undefined ? totalRecord + 1 : ''}/${contractNo}`;
}

export function generateReportNo() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const key = 'reportSequence';
    let stt = Number(localStorage.getItem(key)) || 0;
    stt += 1;

    localStorage.setItem(key, String(stt));

    const sttFormatted = String(stt).padStart(3, '0');

    const reportNo = `${yy}${mm}${dd}${sttFormatted}/NT`;

    return reportNo;
}

export function generateLiquidationNo() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const key = 'reportSequence';
    let stt = Number(localStorage.getItem(key)) || 0;
    stt += 1;

    localStorage.setItem(key, String(stt));

    const sttFormatted = String(stt).padStart(3, '0');

    const reportNo = `${yy}${mm}${dd}${sttFormatted}/TL`;

    return reportNo;
}

export async function downloadPdf(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
}

export async function printPdf(blob: Blob) {
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.setAttribute("data-print", "1");

    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    iframe.src = url;
    document.body.appendChild(iframe);

    iframe.onload = () => {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
    };
}