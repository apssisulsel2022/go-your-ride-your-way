

## Driver App — Platform Constraint

Lovable projects are built on **React + Vite + Tailwind**. Flutter is not supported in this environment — there is no Flutter SDK, Dart compiler, or native build toolchain available.

### What I Can Build Instead

A **Driver App as a web-based PWA** (Progressive Web App) within this same project, using the existing React stack. It would be installable on phones, work offline, and cover all the requested features:

```text
/driver/login       → OTP-style login screen
/driver/home        → Map view + online/offline toggle
/driver/trip        → Active trip screen with navigation
/driver/earnings    → Earnings dashboard
```

### Feature Mapping

| Requested Feature | Web PWA Approach |
|---|---|
| Login (OTP) | Phone input + 6-digit OTP screen (simulated) |
| Online/Offline toggle | Prominent switch on map screen |
| Incoming ride request | Full-screen overlay with Accept/Reject buttons |
| Navigation to pickup/dropoff | Leaflet map with route polyline + turn-by-turn hints |
| Trip management | State machine: navigating → picked up → dropping off → completed |
| Earnings dashboard | Summary cards + daily/weekly chart |
| Send location every 3-5s | `navigator.geolocation.watchPosition` (simulated in demo) |
| Receive ride requests | Simulated with timers (real-time would need Supabase) |

### Architecture

- New routes under `/driver/*` with a separate `DriverLayout` (no bottom nav from passenger app)
- Driver state context (`DriverContext`) for status, current trip, earnings
- Reuse existing `MapView` component for the map
- All mock/client-side — no backend needed for the demo
- Large, high-contrast UI buttons optimized for driving context

### Files

- **Create**: `src/pages/driver/DriverLogin.tsx`, `src/pages/driver/DriverHome.tsx`, `src/pages/driver/DriverTrip.tsx`, `src/pages/driver/DriverEarnings.tsx`
- **Create**: `src/context/DriverContext.tsx`, `src/components/driver/DriverLayout.tsx`
- **Modify**: `src/App.tsx` (add driver routes)

### Note

If you specifically need a native Flutter app, that would need to be built outside Lovable using Flutter tooling. This plan builds the equivalent as a web app within your current project.

