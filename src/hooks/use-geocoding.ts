import { useState, useEffect, useRef } from "react";

export interface GeocodingResult {
  name: string;
  addr: string;
  latlng: [number, number];
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

export function useGeocoding(query: string, debounceMs = 400) {
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const params = new URLSearchParams({
          q: query,
          format: "json",
          addressdetails: "1",
          limit: "5",
          countrycodes: "id",
        });

        const res = await fetch(`${NOMINATIM_URL}?${params}`, {
          signal: controller.signal,
          headers: { "Accept-Language": "en" },
        });

        if (!res.ok) throw new Error("Geocoding failed");

        const data = await res.json();
        const mapped: GeocodingResult[] = data.map((item: any) => ({
          name: item.display_name.split(",")[0],
          addr: item.display_name.split(",").slice(1, 3).join(",").trim(),
          latlng: [parseFloat(item.lat), parseFloat(item.lon)] as [number, number],
        }));

        setResults(mapped);
      } catch (err: any) {
        if (err.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query, debounceMs]);

  return { results, loading };
}
