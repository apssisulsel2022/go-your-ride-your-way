

## Plan: Enhanced On-Demand Ride Feature

### Summary
Rebuild the ride booking and tracking flow into a polished, stateful experience with map-integrated location picking, nearby driver markers, fare estimation, bottom-sheet panels, error/timeout handling, and simulated real-time updates.

### What Already Exists
- `RideBooking.tsx` — basic 2-step form (location text inputs + vehicle selection), no map
- `RideTracking.tsx` — auto-advancing stage timer with map, driver card, rating
- `MapView.tsx` — Leaflet map with geolocation, route polyline, marker animation

### Changes

**1. Redesign RideBooking.tsx — Map-First with Bottom Sheet**
- Full-screen map background (like Index.tsx) with the bottom sheet overlay
- Replace text-only location step with a map-based picker:
  - Tap map to set pickup/dropoff (or use text search in bottom sheet)
  - Show pickup (green) and dropoff (amber) markers on the map
  - Draw route polyline once both are set, with distance/duration estimate
- Add "nearby drivers" — 4-5 fake driver markers scattered around the user's position on the map using a car icon
- Bottom sheet states flow through these steps:
  1. **Location picking** — pickup/dropoff inputs, suggestions, "Use my location" button
  2. **Fare estimation** — route summary, vehicle list with prices/ETAs, payment method selector
  3. **Confirm** — final confirmation card with selected vehicle, fare, and "Book Ride" button

**2. Enhance MapView.tsx — New Props**
- Add `nearbyDrivers?: [number, number][]` prop to render small car markers
- Add `onMapClick?: (latlng: [number, number]) => void` callback for location picking
- Add `interactive?: boolean` prop to enable click-to-place-marker mode
- Create a car-shaped driver icon (rotated div or SVG)

**3. Rebuild RideTracking.tsx — Full State Machine**
- Replace simple auto-timer with a proper state machine approach:
  - **Searching** — pulsing animation, "Finding your driver..." with spinner, cancel button, 15s simulated timeout with retry option
  - **Driver Found** — driver info card slides up (name, photo initials, vehicle, plate, rating), ETA countdown
  - **Driver Arriving** — driver marker animates toward pickup on map, "Your driver is arriving" status, call/message buttons
  - **On Trip** — driver marker animates along route, live ETA display, trip info (distance traveled, fare running), SOS button prominent
  - **Completed** — arrival celebration, star rating (interactive — track selected stars), fare summary card, tip option, "Done" button
- Add **error states**:
  - "No driver found" after timeout — show retry button + "Try different vehicle" option
  - Cancel confirmation dialog before canceling an active ride
- Simulated real-time: use `setInterval` to update driver position along route and decrement ETA

**4. New Component: RideBottomSheet.tsx**
- Reusable draggable-style bottom sheet panel (using existing rounded-t-3xl pattern)
- Contains the ride panel content based on current step
- Handles the visual transitions between steps with `AnimatePresence`

**5. Pass Ride Context Between Pages**
- Use URL search params or a simple React context/zustand store to pass:
  - Pickup/dropoff locations and names
  - Selected vehicle type
  - Payment method
- From RideBooking → RideTracking so the tracking page shows real route data

### Technical Details

- **Files created**: `src/components/ride/RideBottomSheet.tsx`, `src/context/RideContext.tsx`
- **Files modified**: `src/pages/RideBooking.tsx` (major rewrite), `src/pages/RideTracking.tsx` (major rewrite), `src/components/MapView.tsx` (new props), `src/App.tsx` (wrap with RideProvider)
- **No new dependencies** — uses existing leaflet, framer-motion, lucide-react
- Driver markers use Leaflet `divIcon` with a rotated car SVG
- Fake nearby drivers generated as random offsets from user position
- State transitions use `useState` + `useEffect` timers (simulated backend)

