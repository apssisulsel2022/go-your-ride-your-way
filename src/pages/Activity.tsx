import { Car, Bus, MapPin, Clock, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const trips = [
  { id: "1", type: "ride" as const, from: "Sudirman Tower", to: "Grand Indonesia", date: "Today, 14:30", price: "Rp 25,000", status: "completed" },
  { id: "2", type: "shuttle" as const, from: "Jakarta", to: "Bandung", date: "Yesterday, 06:00", price: "Rp 85,000", status: "completed" },
  { id: "3", type: "ride" as const, from: "Home", to: "Office", date: "Apr 7, 08:00", price: "Rp 18,000", status: "completed" },
  { id: "4", type: "ride" as const, from: "Monas", to: "Kemang", date: "Apr 6, 19:30", price: "Rp 32,000", status: "cancelled" },
  { id: "5", type: "shuttle" as const, from: "Bandung", to: "Jakarta", date: "Apr 5, 14:00", price: "Rp 85,000", status: "completed" },
];

export default function Activity() {
  return (
    <MobileLayout>
      <div className="px-4 pt-6 space-y-4">
        <h1 className="text-2xl font-extrabold">Activity</h1>

        <div className="space-y-2">
          {trips.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2.5 rounded-xl",
                    trip.type === "ride" ? "bg-primary/10" : "bg-accent/10"
                  )}>
                    {trip.type === "ride" ? (
                      <Car className="h-5 w-5 text-primary" />
                    ) : (
                      <Bus className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm">{trip.type === "ride" ? "PYU Ride" : "PYU Shuttle"}</p>
                      <span className={cn(
                        "text-xs font-semibold px-2 py-0.5 rounded-full",
                        trip.status === "completed" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      )}>
                        {trip.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {trip.date}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs">
                      <MapPin className="h-3 w-3 text-primary shrink-0" />
                      <span className="truncate">{trip.from}</span>
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                      <span className="truncate">{trip.to}</span>
                    </div>
                  </div>
                  <p className="font-bold text-sm whitespace-nowrap">{trip.price}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
