import { useEffect, useState } from "react";
import { CONFIG } from "src/global-config";
import Avatar, { AvatarProps } from '@mui/material/Avatar';
import { Box, BoxProps } from "@mui/material";

export function FallbackAvatar({ src, alt, ...props }: AvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    if (!src) {
      setImgSrc(`${CONFIG.assetsDir}/assets/images/home/NonProduct.jpg`);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
    img.onerror = () =>
      setImgSrc(`${CONFIG.assetsDir}/assets/images/home/NonProduct.jpg`);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return <Avatar alt={alt} src={imgSrc} {...props} />;
}

type FallbackImageProps = BoxProps & {
  src?: string;
  alt?: string;
  fallbackSrc?: string;
  maxWidth?: number | string;
  height?: number | string;
}

export function FallbackImage({
  src,
  alt,
  fallbackSrc,
  maxWidth = 400,
  height = "auto",
  sx,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>("");

  useEffect(() => {
    const defaultFallback =
      fallbackSrc || `${CONFIG.assetsDir}/assets/images/home/nophoto.jpg`;

    if (!src) {
      setImgSrc(defaultFallback);
      return;
    }

    const img = new Image();
    img.src = src;

    img.onload = () => setImgSrc(src);
    img.onerror = () => setImgSrc(defaultFallback);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return (
    <Box
      component="img"
      src={imgSrc}
      alt={alt}
      sx={{
        width: "100%",
        maxWidth,
        height,
        objectFit: "cover",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        ...sx,
      }}
      {...props}
    />
  );
}