import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Booking, ShuttleSchedule, ShuttlePassenger, BookingStatus } from "@/types/models";

interface ShuttleContextType {
  bookings: Booking[];
  activeBooking: Booking | null;
  createBooking: (data: {
    schedule: ShuttleSchedule;
    seats: number[];
    passengers: ShuttlePassenger[];
    totalPrice: number;
  }) => string;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  setPaymentRef: (bookingId: string, paymentId: string) => void;
  getBooking: (id: string) => Booking | undefined;
}

const ShuttleContext = createContext<ShuttleContextType | null>(null);

export function ShuttleProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);

  const createBooking = useCallback(
    (data: { schedule: ShuttleSchedule; seats: number[]; passengers: ShuttlePassenger[]; totalPrice: number }) => {
      const id = "PYU-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const booking: Booking = {
        id,
        userId: "USR-001", // would come from AuthContext in production
        schedule: data.schedule,
        seats: data.seats,
        passengers: data.passengers,
        status: "pending",
        totalPrice: data.totalPrice,
        createdAt: new Date().toISOString(),
      };
      setBookings((prev) => [booking, ...prev]);
      setActiveBooking(booking);
      return id;
    },
    []
  );

  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    setActiveBooking((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }, []);

  const setPaymentRef = useCallback((bookingId: string, paymentId: string) => {
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, paymentId } : b)));
  }, []);

  const getBooking = useCallback((id: string) => bookings.find((b) => b.id === id), [bookings]);

  return (
    <ShuttleContext.Provider value={{ bookings, activeBooking, createBooking, updateBookingStatus, setPaymentRef, getBooking }}>
      {children}
    </ShuttleContext.Provider>
  );
}

export function useShuttle() {
  const ctx = useContext(ShuttleContext);
  if (!ctx) throw new Error("useShuttle must be used within ShuttleProvider");
  return ctx;
}
