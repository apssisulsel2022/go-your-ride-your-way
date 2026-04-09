

## Plan: Full Shuttle Booking Flow

### Summary
Replace the current simple Shuttle page with a multi-step booking wizard: route search with date picker, schedule selection, interactive seat map, passenger form, payment, and QR e-ticket — all accessible as guest.

### Architecture
Single page (`Shuttle.tsx`) with a `step` state machine driving 6 steps. All data is mock/client-side. No backend needed.

```text
Step 1: Search       → Route selector (dropdown) + date picker + passenger count
Step 2: Schedules    → Schedule cards for selected route/date
Step 3: Seat Select  → Interactive bus seat grid (4-col layout: 2+aisle+2)
Step 4: Passenger    → Name, phone, email form (guest checkout)
Step 5: Payment      → Booking summary + payment method selection + confirm
Step 6: E-Ticket     → QR code + booking details + download/share
```

### Changes

**1. Rewrite `src/pages/Shuttle.tsx`** (major rewrite)
- Multi-step flow with back navigation and step indicator
- Step state: `search | schedules | seats | passenger | payment | ticket`
- Each step rendered conditionally with `AnimatePresence` transitions

**2. Step 1 — Route Search**
- Origin/destination dropdowns from a predefined city list (Jakarta, Bandung, Surabaya, Yogyakarta, Semarang)
- Shadcn date picker (Popover + Calendar) for travel date
- Passenger count selector (1-4)
- "Search" button advances to step 2

**3. Step 2 — Schedule List**
- Filter mock schedules by selected route
- Schedule cards showing: departure/arrival time, duration, operator name, price, seats available
- Tap to select, then "Continue" button

**4. Step 3 — Seat Selection**
- Interactive bus seat grid: 10 rows x 4 seats (2-aisle-2 layout)
- Seat states: available (gray), selected (primary), occupied (dark/disabled)
- Pre-mark ~30% seats as occupied randomly
- Select up to `passengerCount` seats
- Legend showing seat status colors

**5. Step 4 — Passenger Form**
- One form per passenger (based on count)
- Fields: Full name, phone number, email (first passenger only)
- Simple validation (required fields)

**6. Step 5 — Payment & Summary**
- Booking summary card: route, date, schedule, seats, passengers, total price
- Payment method selector: Cash, Bank Transfer, E-Wallet (radio group)
- "Confirm & Pay" button generates booking ID and advances

**7. Step 6 — E-Ticket**
- QR code generated using a simple SVG-based QR pattern (or a small library — check if `qrcode` is available, otherwise use a deterministic dot grid as visual placeholder)
- Ticket card: booking ID, route, date, time, seat numbers, passenger names, QR code
- "Book Another" button resets flow

**8. Data Model** (all in-component, no external state)
- `cities`: string array
- `schedules`: array with route, times, price, operator, totalSeats
- `seatLayout`: generated 40-seat grid with random occupancy
- `bookingId`: generated on confirm (`PYU-XXXXXX`)

### Technical Details
- **Files modified**: `src/pages/Shuttle.tsx` (full rewrite)
- **New dependency**: `qrcode.react` for QR code generation (install via npm)
- **Existing deps used**: framer-motion, shadcn Calendar/Popover, lucide-react
- **No login required** — entire flow is guest-accessible
- **Responsive** — uses existing `MobileLayout` wrapper with `max-w-lg`

