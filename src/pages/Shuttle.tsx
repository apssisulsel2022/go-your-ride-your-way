import { useState } from "react";
import { Bus, MapPin, Clock, Users, ChevronRight, CalendarDays, ArrowRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const routes = [
  {
    id: "1",
    name: "Jakarta — Bandung",
    departure: "06:00",
    arrival: "09:30",
    price: "Rp 85,000",
    seats: 12,
    operator: "PYU Express",
  },
  {
    id: "2",
    name: "Jakarta — Bandung",
    departure: "08:00",
    arrival: "11:30",
    price: "Rp 85,000",
    seats: 5,
    operator: "PYU Express",
  },
  {
    id: "3",
    name: "Jakarta — Bandung",
    departure: "10:00",
    arrival: "13:30",
    price: "Rp 90,000",
    seats: 20,
    operator: "PYU Premium",
  },
  {
    id: "4",
    name: "Jakarta — Bandung",
    departure: "14:00",
    arrival: "17:30",
    price: "Rp 85,000",
    seats: 8,
    operator: "PYU Express",
  },
];

export default function Shuttle() {
  const [from, setFrom] = useState("Jakarta");
  const [to, setTo] = useState("Bandung");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  return (
    <MobileLayout>
      <div className="px-4 pt-6 space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold">Shuttle</h1>
          <p className="text-sm text-muted-foreground">Book intercity shuttle — no login required</p>
        </div>

        {/* Search */}
        <Card className="p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="w-3 h-3 rounded-full border-2 border-primary" />
              <div className="w-px h-6 bg-border" />
              <div className="w-3 h-3 rounded-sm bg-accent" />
            </div>
            <div className="flex-1 space-y-2">
              <Input value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 rounded-xl border-0 bg-secondary/50" placeholder="From" />
              <Input value={to} onChange={(e) => setTo(e.target.value)} className="h-10 rounded-xl border-0 bg-secondary/50" placeholder="To" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1 p-2.5 rounded-xl bg-secondary/50">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Today</span>
            </div>
            <div className="flex items-center gap-2 flex-1 p-2.5 rounded-xl bg-secondary/50">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">1 Passenger</span>
            </div>
          </div>
        </Card>

        {/* Results */}
        {booked ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10 space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
              <Bus className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-xl font-bold">Booking Confirmed!</h2>
            <p className="text-sm text-muted-foreground">
              Your shuttle ticket has been booked. Show this screen to the driver.
            </p>
            <Card className="p-4 rounded-2xl text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">TICKET</span>
                <span className="text-xs text-muted-foreground">#PYU-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>{from}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <span>{to}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {routes.find(r => r.id === selectedRoute)?.departure} — {routes.find(r => r.id === selectedRoute)?.operator}
              </p>
            </Card>
            <Button onClick={() => { setBooked(false); setSelectedRoute(null); }} variant="outline" className="rounded-2xl">
              Book Another
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-muted-foreground">Available Shuttles</h3>
            {routes.map((route, i) => (
              <motion.div key={route.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <button
                  onClick={() => setSelectedRoute(route.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all",
                    selectedRoute === route.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/20"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary">{route.operator}</span>
                    <span className="text-sm font-extrabold">{route.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{route.departure}</span>
                    <div className="flex-1 flex items-center gap-1">
                      <div className="h-px flex-1 bg-border" />
                      <Bus className="h-3 w-3 text-muted-foreground" />
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <span className="text-lg font-bold">{route.arrival}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 3h 30m</span>
                    <span className={cn(
                      "flex items-center gap-1",
                      route.seats <= 5 && "text-destructive font-semibold"
                    )}>
                      <Users className="h-3 w-3" /> {route.seats} seats left
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}

            {selectedRoute && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Button onClick={() => setBooked(true)} className="w-full h-12 rounded-2xl text-base font-bold mt-2">
                  Book Shuttle — {routes.find(r => r.id === selectedRoute)?.price}
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
