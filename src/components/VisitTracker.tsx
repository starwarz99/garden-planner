"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  let id = sessionStorage.getItem("_vsid");
  if (!id) {
    id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("_vsid", id);
  }
  return id;
}

export function VisitTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    const search = window.location.search.slice(1);
    const key = pathname + (search ? `?${search}` : "");

    if (lastTracked.current === key) return;
    lastTracked.current = key;

    const payload = JSON.stringify({
      path:      pathname,
      search,
      referrer:  document.referrer,
      sessionId: getSessionId(),
    });

    if (typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
