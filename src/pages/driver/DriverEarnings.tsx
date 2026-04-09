import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDriver } from "@/context/DriverContext";
import { DriverLayout } from "@/components/driver/DriverLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Calendar, Clock, MapPin, Navigation } from "lucide-react";

export default function DriverEarnings() {
  const navigate = useNavigate();
  const { isAuthenticated, earnings, tripHistory, driverName } = useDriver();
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  useEffect(() => {
    if (!isAuthenticated) navigate("/driver/login");
  }, [isAuthenticated, navigate]);

  const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const currentEarnings = earnings[period];
  const tripCount = period === "today" ? tripHistory.filter((t) => t.date === "2026-04-09").length
    : period === "week" ? tripHistory.length
    : tripHistory.length;

  // Simple bar chart data
  const barData = period === "today"
    ? [45, 32, 18, 55, 35]
    : period === "week"
    ? [120, 185, 95, 210, 170, 140, 195]
    : [850, 1200, 980, 1100, 750, 1300, 1050, 900, 1150, 1400, 800, 1250];

  const maxBar = Math.max(...barData);
  const barLabels = period === "today"
    ? ["8am", "10am", "12pm", "2pm", "4pm"]
    : period === "week"
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <DriverLayout>
      <div className="min-h-screen pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-2">
          <button onClick={() => navigate("/driver/home")} className="p-2 hover:bg-secondary rounded-lg">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Earnings</h1>
        </div>

        {/* Period tabs */}
        <div className="flex gap-2 mb-5">
          {(["today", "week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Earnings</span>
            </div>
            <p className="text-xl font-bold text-foreground">{formatRupiah(currentEarnings)}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Trips</span>
            </div>
            <p className="text-xl font-bold text-foreground">{tripCount}</p>
          </Card>
        </div>

        {/* Bar chart */}
        <Card className="p-4 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Earnings Overview</h3>
          <div className="flex items-end gap-1 h-32">
            {barData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary/80 rounded-t-sm min-h-[4px] transition-all"
                  style={{ height: `${(val / maxBar) * 100}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{barLabels[i]}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Trip history */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Trips</h3>
        <div className="space-y-2">
          {tripHistory.map((trip) => (
            <Card key={trip.id} className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm text-foreground">{trip.passengerName}</span>
                <span className="font-bold text-sm text-primary">{formatRupiah(trip.fare)}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{trip.pickup}</span>
                <span className="flex items-center gap-1"><Navigation className="h-3 w-3" />{trip.dropoff}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{trip.date} • {trip.time}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DriverLayout>
  );
}
