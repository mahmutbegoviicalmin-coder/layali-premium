"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "layali-announcement-dismissed";

interface AnnouncementBarContextValue {
  isVisible: boolean;
  dismiss: () => void;
}

const AnnouncementBarContext =
  createContext<AnnouncementBarContextValue | null>(null);

export function AnnouncementBarProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    setIsVisible(!dismissed);
    setReady(true);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    setIsVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      isVisible: ready ? isVisible : false,
      dismiss,
    }),
    [isVisible, dismiss, ready]
  );

  return (
    <AnnouncementBarContext.Provider value={value}>
      {children}
    </AnnouncementBarContext.Provider>
  );
}

export function useAnnouncementBar() {
  const ctx = useContext(AnnouncementBarContext);
  if (!ctx) {
    throw new Error(
      "useAnnouncementBar mora biti unutar AnnouncementBarProvider."
    );
  }
  return ctx;
}
