import { Box, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

interface Props {
    text?: string;
    size?: "tiny" | "small" | "normal";
    color?: string;
}


const pulse = keyframes`
0% { transform: scale(1); opacity: 1; }
50% { transform: scale(1.05); opacity: 0.95; }
100% { transform: scale(1); opacity: 1; }
`;


const StickerRoot = styled(Box, {
    shouldForwardProp: (prop) => prop !== "size",
})<{
    size: "tiny" | "small" | "normal";
}>(({ theme, size }) => {
    const sizes = {
        tiny: {
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 6,
            transform: "skewX(-12deg)",
        },
        small: {
            fontSize: 11,
            padding: "4px 8px",
            borderRadius: 8,
            transform: "skewX(-12deg)",
        },
        normal: {
            fontSize: 13,
            padding: "6px 10px",
            borderRadius: 10,
            transform: "skewX(-10deg)",
        },
    } as const;


    const s = sizes[size] ?? sizes.small;


    return {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        userSelect: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        transformOrigin: "center",
        animation: `${pulse} 2.6s ease-in-out infinite`,
        color: theme.palette.common.white,
        background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
        border: `1px solid rgba(255,255,255,0.12)`,
        ...s,
    };
});

export default function NewSticker({
    text = "Mới",
    size = "small",
    color = "#438b12f5",
}: Props) {
    return (
        <StickerRoot
            size={size}
            sx={{
                position: "relative",
                overflow: "hidden",
                clipPath: "polygon(0% 10%, 8% 0%, 92% 0%, 100% 10%, 100% 90%, 92% 100%, 8% 100%, 0% 90%)",
                backgroundImage: `linear-gradient(135deg, ${color}, ${color} 40%, rgba(255,255,255,0.35))`,
                padding: (theme) => {
                    const map: Record<string, string> = { tiny: "2px 6px", small: "4px 8px", normal: "6px 10px" };
                    return map[size];
                },
            }}
        >
            <Typography
                component="span"
                sx={{
                    fontWeight: 700,
                    letterSpacing: 0.4,
                    textTransform: "uppercase",
                    transform: "skewX(12deg)",
                    fontSize: size === "tiny" ? 10 : size === "small" ? 11 : 13,
                    lineHeight: 1,
                    color: "#fff",
                    textShadow: "0 1px 0 rgba(0,0,0,0.18)",
                }}
            >
                {text}
            </Typography>
        </StickerRoot>
    );
}
