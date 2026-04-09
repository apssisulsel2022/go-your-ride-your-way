

## Plan: Structured State Management, API Layer & Models

Riverpod is Flutter-specific. The React equivalent is React Context + custom hooks (already used in this project). This plan adds the missing pieces: an **AuthContext**, a **ShuttleContext**, structured **TypeScript models**, and a centralized **API service layer** with error handling and token management.

### What Will Be Built

**1. TypeScript Models (`src/types/models.ts`)**
Strongly-typed interfaces for all domain entities:
- `User` — id, name, email, phone, avatar, role
- `Driver` — extends User with vehicle info, status, rating, location
- `Trip` — id, passenger, driver, pickup/dropoff, status, fare, timestamps
- `Booking` — id, user, schedule, seats, status, payment reference
- `RouteInfo` — origin, destination, waypoints, distance, duration, polyline
- `Payment` — id, amount, method, status, transactionRef, timestamps

**2. API Service Layer (`src/lib/api.ts`)**
- Centralized `ApiClient` class with `get`, `post`, `put`, `delete` methods
- Token storage and auto-injection via `Authorization` header
- Error handling interceptor that maps HTTP errors to typed `ApiError` objects
- Response parsing with generic typing (`api.get<Trip[]>("/trips")`)
- Request/response logging in dev mode
- Currently returns mock data; ready to swap to real endpoints

**3. Auth Context (`src/context/AuthContext.tsx`)**
- `AuthProvider` with login (phone+OTP), logout, session persistence
- Stores `User` model and auth token
- `useAuth()` hook exposing `user`, `isAuthenticated`, `login()`, `logout()`
- Guards for protected routes

**4. Shuttle Booking Context (`src/context/ShuttleContext.tsx`)**
- Extract booking state from `Shuttle.tsx` into a dedicated provider
- `useShuttle()` hook exposing `bookings`, `createBooking()`, `getBooking()`
- Booking history persisted in session

**5. Refactor Existing Contexts**
- `RideContext` — align with `Trip` model types
- `DriverContext` — align with `Driver` model, use `ApiClient` for mock requests
- `PaymentContext` — align with `Payment` model

**6. Update `App.tsx`**
- Wrap with `AuthProvider` and `ShuttleProvider`
- Add route guards for authenticated sections

### Files

| Action | File |
|--------|------|
| Create | `src/types/models.ts` |
| Create | `src/lib/api.ts` |
| Create | `src/context/AuthContext.tsx` |
| Create | `src/context/ShuttleContext.tsx` |
| Modify | `src/context/RideContext.tsx` — use Trip model |
| Modify | `src/context/DriverContext.tsx` — use Driver model |
| Modify | `src/context/PaymentContext.tsx` — use Payment model |
| Modify | `src/App.tsx` — add providers |

