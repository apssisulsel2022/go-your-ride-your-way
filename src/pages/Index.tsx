import { Navigation, Car, Bike, Truck, ChevronRight, Star, Clock } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { MapView } from "@/components/MapView";
import { useNavigate } from "react-router-dom";

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
        {/* Real map */}
        <div className="h-[45vh] relative overflow-hidden">
          <MapView />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-[1000]">
            <div className="bg-card rounded-2xl px-4 py-2 shadow-lg">
              <span className="text-lg font-extrabold text-primary">PYU</span>
              <span className="text-lg font-extrabold text-accent">GO</span>
            </div>
          </div>
        </div>

        {/* Bottom sheet */}
        <div className="relative -mt-6 rounded-t-3xl bg-background px-4 pt-5 pb-4 space-y-5 z-10">
          <div className="w-10 h-1 rounded-full bg-border mx-auto" />

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
        </div>
      </div>
    </MobileLayout>
  );
}
