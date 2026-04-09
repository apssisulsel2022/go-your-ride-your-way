## Plan: Payment Module

### Summary

Build a centralized payment module that integrates with both the Ride Booking and Shuttle Booking flows. Since this is a client-side demo without a real backend, payment gateway integration (Midtrans/Xendit) will be simulated with realistic UI flows — actual gateway integration would require Supabase Edge Functions and API keys which can be added later.

### Architecture

```text
New context:  PaymentContext  — manages transactions, payment methods, status
New page:     /payment        — payment processing screen (gateway simulation)
New page:     /payment/status — payment result page (success/pending/failed)
Modified:     RideBooking     — uses PaymentContext at booking step
Modified:     Shuttle         — uses PaymentContext at payment step  
Modified:     Wallet          — reads transaction history from PaymentContext
Modified:     RideContext     — expand PaymentMethod type
```

### Changes

**1. Create `src/context/PaymentContext.tsx**`

- Payment methods: `cash`, `wallet`, `bank_transfer`, `ewallet`, `credit_card`
- Transaction state: `{ id, amount, method, status, description, createdAt }`
- Status flow: `pending → processing → success | failed`
- Functions: `createTransaction()`, `processPayment()`, `getTransactions()`
- Store transaction history (in-memory, persists during session)

**2. Create `src/pages/Payment.tsx**` — Payment processing screen

- Receives transaction details via context or route state
- Payment method selection UI with icons:
  - Cash (immediate success)
  - PYUGO Wallet (balance check → deduct)
  - Bank Transfer (simulated VA number + countdown)
  - E-Wallet (simulated redirect + auto-complete)
  - QRCODE PAYMENT
  - Credit Card (simulated card form)
- "Pay Now" button triggers simulated processing (2s spinner)
- Redirects to status page on completion

**3. Create `src/pages/PaymentStatus.tsx**` — Result page

- Success: green checkmark, transaction ID, amount, "Back to Home" button
- Failed: red X, retry button
- Pending: clock icon, "Check Status" button (for bank transfer)
- Animated entry with framer-motion

**4. Modify `src/pages/RideBooking.tsx**`

- Replace inline payment toggle with navigation to `/payment`
- Pass fare amount and ride details to PaymentContext before navigating

**5. Modify `src/pages/Shuttle.tsx**`

- Replace inline payment step with navigation to `/payment`
- Pass shuttle booking amount and details to PaymentContext

**6. Modify `src/pages/Wallet.tsx**`

- Read transaction history from PaymentContext
- Show real transactions alongside mock data
- Wallet balance adjusts based on wallet payments

**7. Modify `src/App.tsx**`

- Add PaymentProvider wrapper
- Add `/payment` and `/payment/status` routes

### Payment Flow

```text
User confirms ride/shuttle
  → PaymentContext.createTransaction({ amount, description })
  → Navigate to /payment
  → User selects method + confirms
  → Simulated processing (2s delay)
  → PaymentContext updates status
  → Navigate to /payment/status
  → Success → back to tracking/ticket
```

### Security Note

This implementation is client-side simulation only. For real payment gateway integration (Midtrans/Xendit), you would need:

- A Supabase Edge Function to create payment tokens server-side
- Webhook handler for payment callbacks
- Server-side transaction verification
These can be added when you're ready to connect a real payment provider.

### Files

- **Create**: `src/context/PaymentContext.tsx`, `src/pages/Payment.tsx`, `src/pages/PaymentStatus.tsx`
- **Modify**: `src/App.tsx`, `src/pages/RideBooking.tsx`, `src/pages/Shuttle.tsx`, `src/pages/Wallet.tsx`, `src/context/RideContext.tsx`