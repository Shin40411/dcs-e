import { NumericFormat } from 'react-number-format';
import { TextField, InputAdornment, Box, SxProps, Theme } from '@mui/material';
import { MouseEvent, useRef, useState } from 'react';

type Props = {
    label: string;
    value: number | undefined;
    onChange: (...event: any[]) => void;
    error: boolean;
    helperText?: string;
    required?: boolean;
    sx: SxProps<Theme> | undefined;
    disabled?: boolean;
};

export function VnCurrencyInput({ value, label, onChange, error, helperText, required, sx, disabled }: Props) {
    return (
        <>
            <NumericFormat
                customInput={TextField}
                value={value}
                onValueChange={(values) => {
                    onChange(values.floatValue);
                }}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                label={
                    required ? (
                        <>
                            {label} <Box component="span">*</Box>
                        </>
                    ) : (
                        label
                    )
                }
                sx={[
                    { width: '100%' },
                    ...(Array.isArray(sx) ? sx : [sx]),
                ]}
                error={error}
                helperText={helperText}
                disabled={disabled}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Box component="span" sx={{ color: 'text.disabled' }}>
                                đ
                            </Box>
                        </InputAdornment>
                    ),
                }}
            />
        </>
    );
}

export function ResizableCurrencyInput({ value, label, onChange, error, helperText, required, sx, disabled }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(150);

    const startResize = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = containerRef.current?.offsetWidth ?? width;

        const doDrag = (moveEvent: globalThis.MouseEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            setWidth(Math.max(70, newWidth));
        };

        const stopDrag = () => {
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
        };

        document.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", stopDrag);
    };

    return (
        <Box
            ref={containerRef}
            sx={{
                position: "relative",
                width,
                display: "inline-block",
            }}
        >
            <NumericFormat
                customInput={TextField}
                value={value}
                onValueChange={(values) => onChange(values.floatValue)}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                label={required ? <>{label} <Box component="span">*</Box></> : label}
                error={error}
                helperText={helperText}
                disabled={disabled}
                sx={{
                    width: "100%",
                    ...(Array.isArray(sx) ? sx : [sx]),
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Box component="span" sx={{ color: "text.disabled", mr: 1 }}>
                                đ
                            </Box>
                        </InputAdornment>
                    ),
                }}
            />

            <Box
                onMouseDown={startResize}
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 16,
                    height: "100%",
                    cursor: "col-resize",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.08)",
                    justifyContent: "center",
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    userSelect: "none",
                }}
            >
                <Box sx={{ fontSize: 14, color: "text.disabled", lineHeight: 1 }}>⋮⋮</Box>
            </Box>
        </Box>

    );
}
