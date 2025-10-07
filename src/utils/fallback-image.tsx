import { useEffect, useState } from "react";
import { CONFIG } from "src/global-config";
import Avatar, { AvatarProps } from '@mui/material/Avatar';

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
