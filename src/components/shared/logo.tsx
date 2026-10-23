import Image from "next/image";
import { resolveAssetUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
  alt?: string;
}

export function Logo({
  className,
  size = 24,
  priority = false,
  alt = "ابراج",
}: LogoProps) {
  return (
    <Image
      src={resolveAssetUrl("/logo.png")}
      alt={alt}
      width={size}
      height={size}
      className={cn("w-full h-full object-contain", className)}
      priority={priority}
    />
  );
}
