import { toast } from "sonner";
import axiosInstance from "src/lib/axios";
import { mutate } from "swr";

export async function deleteOne({
    apiEndpoint,
    listEndpoint,
}: {
    apiEndpoint: string;
    listEndpoint: string;
}) {
    try {
        const { data } = await axiosInstance.delete(`${apiEndpoint}`);
        if (data.statusCode !== 200) {
            throw new Error(data.message || "Đã có lỗi xảy ra");
        }

        // await mutate(listEndpoint);

        await mutate(
            (k) => typeof k === "string" && k.startsWith(listEndpoint),
            undefined,
            { revalidate: true }
        );

        return true;
    } catch (err: any) {
        if (err.message) {
            toast.error(err.message);
        }
        console.error("Delete error:", err);
        return false;
    }
}