import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const PLACEHOLDER_IMG = "https://picsum.photos/seed/product/48/48.jpg";

export function useImageResolution(items: any[]) {
  const storageIdsToResolve = useMemo(() => {
    const ids = new Set<string>();
    const isHttpUrl = (s?: unknown) =>
      typeof s === "string" &&
      (s.startsWith("http://") || s.startsWith("https://"));

    for (const item of items || []) {
      for (const subItem of Array.isArray(item) ? item : [item]) {
        const img = (subItem as any).imageUrl as unknown;
        if (typeof img === "string" && img && !isHttpUrl(img)) ids.add(img);
      }
    }

    return Array.from(ids);
  }, [items]);

  const resolvedStorageUrls = useQuery(
    api.files.getFileUrls,
    storageIdsToResolve.length ? { storageIds: storageIdsToResolve } : "skip"
  );

  const imageIdToUrl = useMemo(() => {
    const map = new Map<string, string>();
    if (!resolvedStorageUrls) return map;
    storageIdsToResolve.forEach((id, idx) => {
      map.set(id, resolvedStorageUrls[idx]);
    });
    return map;
  }, [resolvedStorageUrls, storageIdsToResolve]);

  const resolveImageSrc = (value?: unknown) => {
    if (!value || typeof value !== "string") return PLACEHOLDER_IMG;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return imageIdToUrl.get(value) || PLACEHOLDER_IMG;
  };

  return resolveImageSrc;
}

export function resolveImageSrcDirect(
  value?: unknown,
  imageIdToUrl?: Map<string, string>
): string {
  const PLACEHOLDER_IMG = "https://picsum.photos/seed/product/48/48.jpg";
  if (!value || typeof value !== "string") return PLACEHOLDER_IMG;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return imageIdToUrl?.get(value) || PLACEHOLDER_IMG;
}
