"use client";

import { useReportWebVitals } from "next/navigation";

export function WebVitals() {
  useReportWebVitals((metric) => {
    const body = JSON.stringify({
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      navigationType: metric.navigationType,
    });

    // Send reports using sendBeacon if available, falling back to fetch
    const url = "/api/vitals";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, body);
    } else {
      fetch(url, { body, method: "POST", keepalive: true, headers: { "Content-Type": "application/json" } })
        .catch((err) => console.error("Failed to report web vitals:", err));
    }
  });

  return null;
}
