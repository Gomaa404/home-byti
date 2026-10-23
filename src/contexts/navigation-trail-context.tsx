"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";
import {
  generateFallbackTrail,
} from "@/lib/route-titles";

export interface TrailItem {
  title: string;
  href: string;
  badge?: string;
}

interface NavigationTrailContextType {
  trail: TrailItem[];
  resetTrail: (item: TrailItem) => void;
  pushTrail: (item: TrailItem) => void;
  updateCurrentTitle: (title: string, badge?: string) => void;
  setTrail: (items: TrailItem[]) => void;
}

const NavigationTrailContext = createContext<NavigationTrailContextType | null>(
  null
);

export function NavigationTrailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [customTrail, setCustomTrail] = useState<TrailItem[] | null>(null);
  const [titleOverrides, setTitleOverrides] = useState<
    Record<string, { title: string; badge?: string }>
  >({});

  // Reset any manual custom trail when pathname changes, so breadcrumb always tracks real route
  React.useEffect(() => {
    setCustomTrail(null);
  }, [pathname]);

  // Derive trail directly from pathname
  const trail: TrailItem[] = useMemo(() => {
    if (customTrail && customTrail.length > 0) {
      return customTrail;
    }

    const baseTrail = generateFallbackTrail(pathname || "/");
    const cleanCurrent = (pathname || "/")
      .replace(/^\/Edaret_Amlak/, "")
      .replace(/\/+$/, "") || "/";

    const override = titleOverrides[cleanCurrent];
    if (override && baseTrail.length > 0) {
      const updated = [...baseTrail];
      const lastIdx = updated.length - 1;
      updated[lastIdx] = {
        ...updated[lastIdx],
        title: override.title,
        badge: override.badge !== undefined ? override.badge : updated[lastIdx].badge,
      };
      return updated;
    }

    return baseTrail;
  }, [pathname, customTrail, titleOverrides]);

  const updateCurrentTitle = useCallback(
    (title: string, badge?: string) => {
      const cleanCurrent = (pathname || "/")
        .replace(/^\/Edaret_Amlak/, "")
        .replace(/\/+$/, "") || "/";
      setTitleOverrides((prev) => ({
        ...prev,
        [cleanCurrent]: { title, badge },
      }));
    },
    [pathname]
  );

  const resetTrail = useCallback((_item: TrailItem) => {
    // No-op: trail is derived directly from usePathname
  }, []);

  const pushTrail = useCallback((item: TrailItem) => {
    setCustomTrail((prev) => (prev ? [...prev, item] : [item]));
  }, []);

  const setTrail = useCallback((items: TrailItem[]) => {
    setCustomTrail(items);
  }, []);

  return (
    <NavigationTrailContext.Provider
      value={{
        trail,
        resetTrail,
        pushTrail,
        updateCurrentTitle,
        setTrail,
      }}
    >
      {children}
    </NavigationTrailContext.Provider>
  );
}

export function useNavigationTrail() {
  const context = useContext(NavigationTrailContext);
  if (!context) {
    throw new Error(
      "useNavigationTrail must be used within a NavigationTrailProvider"
    );
  }
  return context;
}
