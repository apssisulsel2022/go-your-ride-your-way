import { MapPin, Navigation, Car, Bike, Truck, ChevronRight, Star, Clock } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const vehicleTypes = [
  { id: "bike", icon: Bike, label: "Bike", eta: "3 min", price: "Rp 8K" },
  { id: "car", icon: Car, label: "Car", eta: "5 min", price: "Rp 25K" },
  { id: "premium", icon: Car, label: "Premium", eta: "7 min", price: "Rp 45K" },
  { id: "truck", icon: Truck, label: "Truck", eta: "12 min", price: "Rp 60K" },
];

const recentPlaces = [
  { name: "Office - Sudirman Tower", address: "Jl. Jend. Sudirman No. 52", icon: Clock },
  { name: "Home", address: "Jl. Kemang Raya No. 15", icon: Star },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="relative">
        {/* Map placeholder */}
        <div className="h-[45vh] bg-gradient-to-br from-primary/10 via-primary/5 to-secondary relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="grid grid-cols-6 gap-4 p-8 w-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="h-8 rounded bg-primary/20" />
              ))}
            </div>
          </div>
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-card rounded-2xl px-4 py-2 shadow-lg"
            >
              <span className="text-lg font-extrabold text-primary">PYU</span>
              <span className="text-lg font-extrabold text-accent">GO</span>
            </motion.div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/40 animate-pulse" />
          </div>
        </div>

        {/* Bottom sheet */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative -mt-6 rounded-t-3xl bg-background px-4 pt-5 pb-4 space-y-5"
        >
          <div className="w-10 h-1 rounded-full bg-border mx-auto" />

          {/* Where to? */}
          <button
            onClick={() => navigate("/ride/book")}
            className="w-full flex items-center gap-3 bg-card rounded-2xl p-4 shadow-sm border border-border hover:border-primary/30 transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded-xl">
              <Navigation className="h-5 w-5 text-primary" />
            </div>
            <span className="text-muted-foreground font-medium flex-1 text-left">
              Where are you going?
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Vehicle types */}
          <div className="grid grid-cols-4 gap-2">
            {vehicleTypes.map((v) => (
              <button
                key={v.id}
                onClick={() => navigate("/ride/book")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <v.icon className="h-6 w-6 text-foreground" />
                <span className="text-xs font-semibold">{v.label}</span>
                <span className="text-[10px] text-muted-foreground">{v.eta}</span>
              </button>
            ))}
          </div>

          {/* Recent places */}
          <div>
            <h3 className="text-sm font-bold mb-2">Recent Places</h3>
            <div className="space-y-1">
              {recentPlaces.map((place) => (
                <button
                  key={place.name}
                  onClick={() => navigate("/ride/book")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
                >
                  <div className="p-2 bg-secondary rounded-lg">
                    <place.icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">{place.name}</p>
                    <p className="text-xs text-muted-foreground">{place.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
}
