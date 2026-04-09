import { createContext, useContext, useState, ReactNode } from "react";

export type VehicleType = "bike" | "car" | "premium" | "truck";
export type PaymentMethod = "cash" | "card" | "wallet" | "bank_transfer" | "ewallet" | "credit_card" | "qris";
export type RideStatus = "idle" | "searching" | "found" | "arriving" | "on_trip" | "completed" | "timeout";

interface RideData {
  pickup: { name: string; latlng: [number, number] | null };
  destination: { name: string; latlng: [number, number] | null };
  vehicle: VehicleType;
  payment: PaymentMethod;
  fare: string;
  status: RideStatus;
}

interface RideContextType {
  ride: RideData;
  setRide: (update: Partial<RideData>) => void;
  resetRide: () => void;
}

const defaultRide: RideData = {
  pickup: { name: "", latlng: null },
  destination: { name: "", latlng: null },
  vehicle: "car",
  payment: "cash",
  fare: "Rp 25,000",
  status: "idle",
};

const RideContext = createContext<RideContextType | null>(null);

export function RideProvider({ children }: { children: ReactNode }) {
  const [ride, setRideState] = useState<RideData>(defaultRide);

  const setRide = (update: Partial<RideData>) =>
    setRideState((prev) => ({ ...prev, ...update }));

  const resetRide = () => setRideState(defaultRide);

  return (
    <RideContext.Provider value={{ ride, setRide, resetRide }}>
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  const ctx = useContext(RideContext);
  if (!ctx) throw new Error("useRide must be used within RideProvider");
  return ctx;
}
