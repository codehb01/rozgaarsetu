"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import L from "leaflet";
import { useRef } from "react";

type Worker = {
  id: string;
  name?: string | null;
  distanceKm?: number | null;
  workerProfile?: {
    latitude?: number | null;
    longitude?: number | null;
    lat?: number | null;
    lng?: number | null;
    name?: string | null;
    category?: string | null;
    jobCategory?: string | null;
    skill?: string | null;
    skills?: string[] | null;
  } | null;
  category?: string | null;
  skill?: string | null;
  lat?: number | null;
  lng?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  location?: {
    lat?: number | null;
    lng?: number | null;
  } | null;
};

function pickLatLng(w: Worker): { lat: number; lng: number } | null {
  if (!w) return null;
  const candidates = [
    { lat: w.lat, lng: w.lng },
    { lat: w.latitude, lng: w.longitude },
    { lat: w.location?.lat, lng: w.location?.lng },
    { lat: w.workerProfile?.latitude, lng: w.workerProfile?.longitude },
    { lat: w.workerProfile?.lat, lng: w.workerProfile?.lng },
  ];
  for (const c of candidates) {
    if (c && typeof c.lat === "number" && typeof c.lng === "number")
      return { lat: c.lat, lng: c.lng };
  }
  return null;
}

// Ensure leaflet CSS is present on the client
function useLeafletCss() {
  useEffect(() => {
    const id = "leaflet-css";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.crossOrigin = "";
    document.head.appendChild(link);
    return () => {
      // keep it for other pages; don't remove
    };
  }, []);
}

// We'll use a map ref and whenCreated to manage view changes

export default function MapPreview({
  workers,
  center,
  zoom = 12,
  height = 360,
}: {
  workers: Worker[];
  center?: { lat: number; lng: number } | null;
  zoom?: number;
  height?: number;
}) {
  useLeafletCss();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const markerMapRef = useRef<Map<string, L.Marker>>(new Map());

  const markers = useMemo(() => {
    const m: {
      lat: number;
      lng: number;
      id: string;
      name?: string | null;
      category?: string | null;
      skill?: string | null;
    }[] = [];
    for (const w of workers || []) {
      const p = pickLatLng(w);
      if (!p) continue;
      // try to infer category/skill from common places on the worker object
      const category =
        w.category ??
        w.workerProfile?.category ??
        w.workerProfile?.jobCategory ??
        null;
      let skill: string | null = null;
      if (w.skill) skill = w.skill;
      else if (w.workerProfile?.skill) skill = w.workerProfile.skill;
      else if (
        Array.isArray(w.workerProfile?.skills) &&
        w.workerProfile.skills.length > 0
      ) {
        const s = w.workerProfile.skills[0];
        skill = typeof s === "string" ? s : String(s);
      }
      m.push({
        lat: p.lat,
        lng: p.lng,
        id: w.id,
        name: w.name ?? w.workerProfile?.name ?? "Worker",
        category,
        skill,
      });
      if (m.length >= 200) break;
    }
    return m;
  }, [workers]);

  const centerPoint =
    center ??
    (markers.length > 0 ? { lat: markers[0].lat, lng: markers[0].lng } : null);

  // helper to create a colored div icon for a category
  function createIcon(color: string) {
    return L.divIcon({
      className: "marker-custom",
      html: `<span class="block w-3 h-3 rounded-full border-2 border-white" style="background:${color};display:inline-block;width:12px;height:12px;border-radius:9999px"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });
  }

  const CATEGORY_COLORS: Record<string, string> = {
    plumber: "#ef4444", // red
    electrician: "#f59e0b", // amber
    carpenter: "#10b981", // green
    cleaner: "#3b82f6", // blue
    default: "#6366f1",
  };
  useEffect(() => {
    // guard: do nothing if centerPoint not available yet
    if (!containerRef.current || !centerPoint) return;

    // initialize map if needed
    if (!mapRef.current) {
      const m = L.map(containerRef.current, {
        center: [centerPoint.lat, centerPoint.lng],
        zoom,
        scrollWheelZoom: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(m);
      mapRef.current = m;
    }

    // clear existing markers
    const existingLayer = (mapRef.current as any)._markerLayer;
    if (existingLayer) {
      try {
        mapRef.current.removeLayer(existingLayer);
      } catch (e) {
        /* ignore */
      }
    }

    const markerGroup = L.layerGroup();
    for (const mk of markers) {
      const color =
        (mk.category && CATEGORY_COLORS[String(mk.category).toLowerCase()]) ??
        CATEGORY_COLORS.default;
      const marker = L.marker([mk.lat, mk.lng], { icon: createIcon(color) });
      // popup content uses a simple HTML string with a link back to the app and a Book button
      // Use classes similar to the app's Button component for consistent design.
      // We can't render the React Button component inside Leaflet popup (HTML string), so apply equivalent Tailwind classes.
      const viewBtnClasses =
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-8 px-3 bg-white border text-neutral-900";
      const bookBtnClasses = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-8 px-3 text-white`;
      const popupHtml = `<div class="map-popup" style="min-width:170px"><div class="map-popup-name" style="font-weight:600">${escapeHtml(
        mk.name || "Worker"
      )}</div>${
        mk.skill
          ? `<div class="map-popup-skill" style="font-size:0.9rem;color:#6b7280;margin-top:4px">${escapeHtml(
              mk.skill
            )}</div>`
          : ""
      }<div style="margin-top:8px;display:flex;gap:8px"><a href="/workers/${
        mk.id
      }" class="${viewBtnClasses}" data-popup-worker-id="${
        mk.id
      }">View</a></div></div>`;
      // keep popup open while interacting with it
      marker.bindPopup(popupHtml, {
        closeButton: true,
        autoClose: false,
        closeOnClick: false,
      });
      // open popup on hover
      marker.on("mouseover", () => marker.openPopup());
      // when the popup opens, attach listeners to the popup element so leaving the popup closes it
      marker.on("popupopen", (e: any) => {
        const popupEl =
          e.popup &&
          (e.popup.getElement ? e.popup.getElement() : e.popup._container);
        // highlight the corresponding worker card
        try {
          const card = document.querySelector(`[data-worker-id="${mk.id}"]`);
          if (card) card.classList.add("worker-highlight");
        } catch (err) {}
        if (popupEl) {
          const enter = () => marker.openPopup();
          const leave = () => marker.closePopup();
          popupEl.addEventListener("mouseenter", enter);
          popupEl.addEventListener("mouseleave", leave);
          // intercept clicks on the popup link to use client navigation
          const link = popupEl.querySelector(
            "[data-popup-worker-id]"
          ) as HTMLAnchorElement | null;
          const bookBtn = popupEl.querySelector(
            "[data-popup-book-id]"
          ) as HTMLButtonElement | null;
          const onClick = (ev: MouseEvent) => {
            ev.preventDefault();
            try {
              router.push(`/worker/${mk.id}`);
            } catch (err) {
              if (typeof window !== "undefined") {
                window.location.href = `/worker/${mk.id}`;
              }
            }
          };
          const onBook = (ev: MouseEvent) => {
            ev.preventDefault();
            if (typeof window !== "undefined") {
              try {
                const hasListeners =
                  (window as { __rozgaar_book_listeners_count?: number })
                    .__rozgaar_book_listeners_count || 0 > 0;
                if (hasListeners) {
                  // dispatch open request
                  const custom = new CustomEvent("rozgaar:openBook", {
                    detail: { workerId: mk.id },
                  });
                  console.debug("[map-preview] dispatch openBook for", mk.id);
                  window.dispatchEvent(custom);
                  // wait for confirmation that the dialog opened
                  let handled = false;
                  const onOpened = (e: Event) => {
                    try {
                      const detail = (e as CustomEvent).detail || {};
                      if (detail.workerId === mk.id) handled = true;
                    } catch (err) {}
                  };
                  window.addEventListener(
                    "rozgaar:bookOpened",
                    onOpened as EventListener
                  );
                  // short timeout to fallback to navigation if not handled
                  setTimeout(() => {
                    try {
                      window.removeEventListener(
                        "rozgaar:bookOpened",
                        onOpened as EventListener
                      );
                    } catch (e) {}
                    if (!handled) {
                      console.debug(
                        "[map-preview] bookOpened not received for",
                        mk.id,
                        "falling back to navigation"
                      );
                      try {
                        router.push(`/worker/${mk.id}?action=book`);
                      } catch (err) {
                        window.location.href = `/worker/${mk.id}?action=book`;
                      }
                    }
                  }, 350);
                  return;
                }
              } catch (err) {}
            }
            // fallback to navigation
            console.debug(
              "[map-preview] no listeners, navigating to worker page for",
              mk.id
            );
            try {
              router.push(`/worker/${mk.id}?action=book`);
            } catch (err) {
              if (typeof window !== "undefined") {
                window.location.href = `/worker/${mk.id}?action=book`;
              }
            }
          };
          if (link) link.addEventListener("click", onClick);
          if (bookBtn) bookBtn.addEventListener("click", onBook);
          // ensure cleanup when popup closes
          marker.on("popupclose", () => {
            try {
              popupEl.removeEventListener("mouseenter", enter);
              popupEl.removeEventListener("mouseleave", leave);
              if (link) link.removeEventListener("click", onClick);
              if (bookBtn) bookBtn.removeEventListener("click", onBook);
            } catch (err) {}
            try {
              const card = document.querySelector(
                `[data-worker-id="${mk.id}"]`
              );
              if (card) card.classList.remove("worker-highlight");
            } catch (err) {}
          });
        }
      });
      markerGroup.addLayer(marker);
      try {
        markerMapRef.current.set(mk.id, marker);
      } catch (err) {}
    }
    markerGroup.addTo(mapRef.current as L.Map);
    // store reference so we can remove later
    (mapRef.current as any)._markerLayer = markerGroup;

    // set view to centerPoint
    try {
      (mapRef.current as any).setView(
        [centerPoint.lat, centerPoint.lng],
        zoom,
        { animate: true }
      );
    } catch (e) {}

    return () => {
      try {
        markerGroup.clearLayers();
      } catch (e) {}
    };
  }, [containerRef, markers, centerPoint, zoom]);

  if (!centerPoint) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-[360px] overflow-hidden flex items-center justify-center">
          <div className="text-center text-neutral-500 dark:text-neutral-400">
            <div className="text-lg font-medium mb-2">Map placeholder</div>
            <div className="text-sm">
              Set a location or allow browser location to view nearby workers.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
      <div
        className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
        style={{ height }}
      >
        <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      </div>
      <style>{`
        .marker-custom { display: flex; align-items: center; justify-content: center; }
        .map-popup { font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }
        .map-popup-name { font-size:0.95rem; }
        .map-popup-skill { color: #6b7280; }
        .marker-custom { display: flex; align-items: center; justify-content: center; }
        /* ensure leaflet map and popups sit below modals/dialogs */
        .leaflet-container { z-index: 0 !important; }
        .leaflet-popup { z-index: 100 !important; }
      `}</style>
    </div>
  );
}

function escapeHtml(s: string) {
  return String(s).replace(
    /[&<>"'`]/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#96;",
      }[c] as string)
  );
}
