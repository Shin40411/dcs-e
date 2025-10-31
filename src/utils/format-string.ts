export function capitalizeFirstLetter(str?: string) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str: string) {
    if (!str) return '';
    return str
        .toLocaleLowerCase('vi')
        .replace(/\p{L}+/gu, (word) =>
            word.charAt(0).toLocaleUpperCase('vi') + word.slice(1)
        );
}

export function formatPhoneNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');

    if (digits.length !== 10) return phone;

    return `${digits.slice(0, 4)} ${digits.slice(4)}`;
}
