/**
 * Core application constants and configuration.
 */
export const APP_CONFIG = {
  name: "ابراج",
  subtitle: "منظومة إدارة وتشغيل العقارات",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/Edaret_Amlak",
} as const;

/**
 * Resolves a public asset path by prefixing the application basePath if required.
 * Handles subfolder deployments (e.g. cPanel /Edaret_Amlak).
 */
export function resolveAssetUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath.startsWith(APP_CONFIG.basePath)) {
    return cleanPath;
  }
  return `${APP_CONFIG.basePath}${cleanPath}`;
}
