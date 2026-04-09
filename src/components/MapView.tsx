import { useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapViewProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  animateMarker?: boolean;
  useGeolocation?: boolean;
  showLocateButton?: boolean;
}

const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456];

const pulseIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="width:16px;height:16px;background:hsl(152,68%,40%);border-radius:50%;box-shadow:0 0 0 6px hsla(152,68%,40%,0.25), 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export function MapView({
  className,
  center,
  zoom = 15,
  markerPosition,
  animateMarker = false,
  useGeolocation = false,
  showLocateButton = true,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const locateUser = useCallback(() => {
    if (!("geolocation" in navigator) || !mapInstanceRef.current || !markerRef.current) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        mapInstanceRef.current?.setView(latlng, zoom, { animate: true });
        markerRef.current?.setLatLng(latlng);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [zoom]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const initialCenter = center || DEFAULT_CENTER;
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(initialCenter, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const pos = markerPosition || initialCenter;
    const marker = L.marker(pos, { icon: pulseIcon }).addTo(map);
    markerRef.current = marker;
    mapInstanceRef.current = map;

    let animInterval: ReturnType<typeof setInterval> | null = null;

    if (useGeolocation && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
          map.setView(userPos, zoom);
          marker.setLatLng(userPos);
          if (animateMarker) {
            let offset = 0;
            animInterval = setInterval(() => {
              offset += 0.0002;
              marker.setLatLng([userPos[0] + Math.sin(offset * 10) * 0.001, userPos[1] + offset]);
            }, 100);
          }
        },
        () => {
          if (animateMarker) {
            let offset = 0;
            animInterval = setInterval(() => {
              offset += 0.0002;
              marker.setLatLng([pos[0] + Math.sin(offset * 10) * 0.001, pos[1] + offset]);
            }, 100);
          }
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else if (animateMarker) {
      let offset = 0;
      animInterval = setInterval(() => {
        offset += 0.0002;
        marker.setLatLng([pos[0] + Math.sin(offset * 10) * 0.001, pos[1] + offset]);
      }, 100);
    }

    return () => {
      if (animInterval) clearInterval(animInterval);
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  return (
    <div className={cn("w-full h-full z-0 relative", className)}>
      <div ref={mapRef} className="w-full h-full" />
      {showLocateButton && (
        <button
          onClick={locateUser}
          className="absolute bottom-4 right-4 z-[1000] p-3 bg-card rounded-xl border border-border shadow-lg hover:bg-secondary transition-colors active:scale-95"
          aria-label="Center map on my location"
        >
          <Locate className="h-5 w-5 text-primary" />
        </button>
      )}
    </div>
  );
}
