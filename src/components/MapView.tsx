import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

interface MapViewProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  animateMarker?: boolean;
}

export function MapView({
  className,
  center = [-6.2088, 106.8456], // Jakarta
  zoom = 15,
  markerPosition,
  animateMarker = false,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Custom primary-color marker
    const pulseIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="width:16px;height:16px;background:hsl(152,68%,40%);border-radius:50%;box-shadow:0 0 0 6px hsla(152,68%,40%,0.25), 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    const pos = markerPosition || center;
    const marker = L.marker(pos, { icon: pulseIcon }).addTo(map);
    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Animate marker if requested
    if (animateMarker) {
      let offset = 0;
      const interval = setInterval(() => {
        offset += 0.0002;
        marker.setLatLng([pos[0] + Math.sin(offset * 10) * 0.001, pos[1] + offset]);
      }, 100);
      return () => {
        clearInterval(interval);
        map.remove();
        mapInstanceRef.current = null;
      };
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} className={cn("w-full h-full z-0", className)} />;
}
