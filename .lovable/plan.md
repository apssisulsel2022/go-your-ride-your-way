## Plan: PYU-GO App Shell — Splash, Onboarding, Redesigned Home, Wallet, Dark Mode

### Summary

Add a splash screen, onboarding flow, redesigned home with two main entry points ("Ride Now" and "Shuttle Booking"), a Wallet tab, light mode, and guest mode support.

### Changes

**1. Create Splash Screen (`src/pages/Splash.tsx`)**

- Full-screen animated splash with PYU-GO logo (green + amber)
- Auto-navigates to onboarding (first visit) or home (returning user) after ~2s
- Uses `localStorage` to track if onboarding was completed
- Framer Motion fade/scale animations

**2. Create Onboarding Screen (`src/pages/Onboarding.tsx`)**

- 3-slide swipeable onboarding carousel:
  1. "Ride Anywhere" — on-demand ride hailing
  2. "Shuttle Booking" — intercity travel, no login needed
  3. "Track in Real-Time" — live map tracking
- Each slide has an illustration (icon-based), title, and description
- Dot indicators + "Next" / "Get Started" button
- Sets `localStorage` flag on completion, navigates to home

**3. Redesign Home Screen (`src/pages/Index.tsx`)**

- Keep the map header with geolocation
- Replace current bottom sheet content with two prominent entry cards:
  - **"Ride Now"** — large card with Car icon, description, navigates to `/ride/book`
  - **"Shuttle Booking"** — large card with Bus icon, description, navigates to `/shuttle`, badge: "No login required"
- Keep vehicle type quick-select grid below
- Keep recent places section

**4. Create Wallet Page (`src/pages/Wallet.tsx`)**

- Balance display card with top-up button
- Recent transactions list (mock data)
- Payment methods section

**5. Update Bottom Navigation (`src/components/layout/BottomNav.tsx`)**

- Replace "Shuttle" tab with "Wallet" tab (Wallet icon)
- Tabs: Home, Activity, Wallet, Profile
- Shuttle is now accessed from the Home screen entry point

**6. Add Dark/Light Mode Support**

- Create `src/hooks/use-theme.tsx` — theme context with `localStorage` persistence
- Wrap app in `ThemeProvider` in `App.tsx`
- Add toggle in Profile page (sun/moon icon)
- Dark theme CSS variables already exist in `index.css` (`.dark` class)

**7. Update Routing (`src/App.tsx`)**

- Add `/splash` and `/onboarding` routes
- Change `/` to render Splash, move current home to `/home`
- Or: render Splash at `/`, redirect to `/home` after splash

**8. Guest Mode Handling**

- Shuttle booking remains accessible without auth checks
- "Ride Now" works in current guest mode (no auth yet)
- Profile page already shows "Guest User" with sign-in prompt

### Technical Details

- **New files**: `Splash.tsx`, `Onboarding.tsx`, `Wallet.tsx`, `use-theme.tsx`
- **Modified files**: `App.tsx`, `Index.tsx`, `BottomNav.tsx`, `Profile.tsx`, `main.tsx`
- **No new dependencies** — uses existing framer-motion, lucide-react, tailwind
- Theme toggle applies `dark` class to `<html>` element, leveraging existing CSS variables