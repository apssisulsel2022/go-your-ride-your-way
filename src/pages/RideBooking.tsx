import { useState } from "react";
import { ArrowLeft, MapPin, Navigation, Clock, Car, Bike, Truck, CreditCard, Wallet, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const vehicles = [
  { id: "bike", icon: Bike, label: "PYU Bike", eta: "3 min", price: "Rp 8,000", desc: "Affordable motorcycle ride" },
  { id: "car", icon: Car, label: "PYU Car", eta: "5 min", price: "Rp 25,000", desc: "Comfortable car ride" },
  { id: "premium", icon: Car, label: "PYU Premium", eta: "7 min", price: "Rp 45,000", desc: "Luxury experience" },
  { id: "truck", icon: Truck, label: "PYU Truck", eta: "12 min", price: "Rp 60,000", desc: "Large cargo delivery" },
];

const paymentMethods = [
  { id: "cash", icon: Wallet, label: "Cash" },
  { id: "card", icon: CreditCard, label: "Card •••• 4242" },
];

export default function RideBooking() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [step, setStep] = useState<"location" | "vehicle">("location");
  const [payment, setPayment] = useState("cash");

  const handleConfirmLocation = () => {
    if (pickup && destination) setStep("vehicle");
  };

  const handleBook = () => {
    navigate("/ride/tracking");
  };

  return (
    <MobileLayout hideNav>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <button onClick={() => step === "vehicle" ? setStep("location") : navigate(-1)} className="p-2 rounded-xl bg-card border border-border">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold">{step === "location" ? "Set Location" : "Choose Ride"}</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === "location" ? (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-4 space-y-4"
            >
              {/* Location inputs */}
              <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <div className="w-px h-8 bg-border" />
                    <div className="w-3 h-3 bg-accent rounded-sm" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Pickup location"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="border-0 bg-secondary/50 rounded-xl h-11"
                    />
                    <Input
                      placeholder="Where to?"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="border-0 bg-secondary/50 rounded-xl h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Suggested */}
              <div>
                <h3 className="text-sm font-bold mb-2 text-muted-foreground">Suggestions</h3>
                {[
                  { name: "Grand Indonesia Mall", addr: "Jl. MH Thamrin No. 1" },
                  { name: "Monas", addr: "Gambir, Central Jakarta" },
                  { name: "Blok M Plaza", addr: "Jl. Sultan Hasanuddin, Kebayoran Baru" },
                ].map((s) => (
                  <button
                    key={s.name}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
                    onClick={() => {
                      if (!pickup) setPickup(s.name);
                      else setDestination(s.name);
                    }}
                  >
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.addr}</p>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleConfirmLocation}
                disabled={!pickup || !destination}
                className="w-full h-12 rounded-2xl text-base font-bold"
              >
                Confirm Location
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="vehicle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="px-4 space-y-4"
            >
              {/* Route summary */}
              <Card className="p-4 rounded-2xl border-primary/20">
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                    <div className="w-px h-5 bg-border" />
                    <div className="w-2.5 h-2.5 bg-accent rounded-sm" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="font-semibold truncate">{pickup}</p>
                    <p className="font-semibold truncate">{destination}</p>
                  </div>
                </div>
              </Card>

              {/* Vehicles */}
              <div className="space-y-2">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-2xl border transition-all",
                      selectedVehicle === v.id
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-primary/20"
                    )}
                  >
                    <div className={cn(
                      "p-2.5 rounded-xl",
                      selectedVehicle === v.id ? "bg-primary/10" : "bg-secondary"
                    )}>
                      <v.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-sm">{v.label}</p>
                      <p className="text-xs text-muted-foreground">{v.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{v.price}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="h-3 w-3" /> {v.eta}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment */}
              <div className="flex items-center gap-3 p-3 bg-card rounded-2xl border border-border">
                {paymentMethods.find(p => p.id === payment)?.id === "cash" ? (
                  <Wallet className="h-5 w-5 text-primary" />
                ) : (
                  <CreditCard className="h-5 w-5 text-primary" />
                )}
                <span className="flex-1 text-sm font-semibold">
                  {paymentMethods.find(p => p.id === payment)?.label}
                </span>
                <button
                  onClick={() => setPayment(payment === "cash" ? "card" : "cash")}
                  className="text-xs text-primary font-bold"
                >
                  Change
                </button>
              </div>

              <Button onClick={handleBook} className="w-full h-12 rounded-2xl text-base font-bold">
                Book {vehicles.find(v => v.id === selectedVehicle)?.label}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}
