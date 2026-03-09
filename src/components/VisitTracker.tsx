"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Include search params so UTM/fbclid are captured, but use
    // window.location to avoid needing a Suspense boundary
    const search = window.location.search.slice(1); // strip leading "?"
    const key = pathname + (search ? `?${search}` : "");

    if (lastTracked.current === key) return;
    lastTracked.current = key;

    const payload = JSON.stringify({
      path:     pathname,
      search,
      referrer: document.referrer,
    });

    // sendBeacon is fire-and-forget (survives page unload)
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
