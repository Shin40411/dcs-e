import { useEffect, useState } from "react";

export const useIsMobile = (maxWidth = 768) => {
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth <= maxWidth : false
    );

    useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth <= maxWidth);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [maxWidth]);

    return isMobile;
};
