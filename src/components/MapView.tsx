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
  pickupPosition?: [number, number];
  destinationPosition?: [number, number];
  showRoute?: boolean;
}

const DEFAULT_CENTER: [number, number] = [-6.2088, 106.8456];

const pulseIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="width:16px;height:16px;background:hsl(152,68%,40%);border-radius:50%;box-shadow:0 0 0 6px hsla(152,68%,40%,0.25), 0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const pickupIcon = L.divIcon({
  className: "pickup-marker",
  html: `<div style="width:14px;height:14px;background:hsl(152,68%,40%);border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const destinationIcon = L.divIcon({
  className: "destination-marker",
  html: `<div style="width:14px;height:14px;background:hsl(38,92%,50%);border:3px solid white;border-radius:3px;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// Generate a realistic curved route between two points
function generateRoutePoints(start: [number, number], end: [number, number], steps = 30): [number, number][] {
  const points: [number, number][] = [];
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  // Add a curve offset perpendicular to the line
  const dLat = end[0] - start[0];
  const dLng = end[1] - start[1];
  const curveLat = midLat + dLng * 0.15;
  const curveLng = midLng - dLat * 0.15;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Quadratic bezier
    const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * curveLat + t * t * end[0];
    const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * curveLng + t * t * end[1];
    points.push([lat, lng]);
  }
  return points;
}

export function MapView({
  className,
  center,
  zoom = 15,
  markerPosition,
  animateMarker = false,
  useGeolocation = false,
  showLocateButton = true,
  pickupPosition,
  destinationPosition,
  showRoute = false,
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

    // Draw route if pickup and destination provided
    if (showRoute && pickupPosition && destinationPosition) {
      L.marker(pickupPosition, { icon: pickupIcon }).addTo(map);
      L.marker(destinationPosition, { icon: destinationIcon }).addTo(map);

      const routePoints = generateRoutePoints(pickupPosition, destinationPosition);

      // Route shadow
      L.polyline(routePoints, {
        color: "rgba(0,0,0,0.1)",
        weight: 8,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      // Main route line
      L.polyline(routePoints, {
        color: "hsl(152,68%,40%)",
        weight: 4,
        lineCap: "round",
        lineJoin: "round",
        dashArray: "8, 12",
      }).addTo(map);

      // Fit map to show full route with padding
      const bounds = L.latLngBounds([pickupPosition, destinationPosition]);
      map.fitBounds(bounds, { padding: [50, 50] });

      // Place driver marker at pickup initially
      marker.setLatLng(pickupPosition);
    }

    let animInterval: ReturnType<typeof setInterval> | null = null;

    if (animateMarker && showRoute && pickupPosition && destinationPosition) {
      // Animate along the route
      const routePoints = generateRoutePoints(pickupPosition, destinationPosition);
      let step = 0;
      animInterval = setInterval(() => {
        step++;
        if (step < routePoints.length) {
          marker.setLatLng(routePoints[step]);
        } else {
          step = 0; // loop
        }
      }, 200);
    } else if (useGeolocation && "geolocation" in navigator) {
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
