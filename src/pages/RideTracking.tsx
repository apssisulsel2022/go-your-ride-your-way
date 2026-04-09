import { useState, useEffect } from "react";
import { ArrowLeft, Phone, MessageCircle, Star, Shield, Navigation } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const stages = ["Finding driver", "Driver on the way", "Driver arrived", "On trip", "Arrived"];

export default function RideTracking() {
  const navigate = useNavigate();
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex < 4) {
      const t = setTimeout(() => setStageIndex((s) => s + 1), 3000);
      return () => clearTimeout(t);
    }
  }, [stageIndex]);

  const isComplete = stageIndex === 4;

  return (
    <MobileLayout hideNav>
      <div className="min-h-screen bg-background">
        {/* Map area */}
        <div className="h-[55vh] bg-gradient-to-br from-primary/10 via-primary/5 to-secondary relative">
          <div className="absolute top-4 left-4">
            <button onClick={() => navigate("/")} className="p-2 rounded-xl bg-card border border-border shadow-sm">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-card rounded-xl px-3 py-1.5 shadow-sm border border-border">
              <p className="text-xs font-bold text-primary flex items-center gap-1">
                <Shield className="h-3 w-3" /> SOS
              </p>
            </div>
          </div>

          {/* Animated car icon */}
          <motion.div
            className="absolute bottom-16 left-1/2"
            animate={{ x: ["-50%", "-40%", "-50%"], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
              <Navigation className="h-4 w-4 text-primary-foreground" />
            </div>
          </motion.div>
        </div>

        {/* Bottom panel */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative -mt-6 rounded-t-3xl bg-background px-4 pt-5 pb-6 space-y-4"
        >
          <div className="w-10 h-1 rounded-full bg-border mx-auto" />

          {/* Status */}
          <div className="text-center">
            <p className="text-lg font-bold">{stages[stageIndex]}</p>
            {!isComplete && (
              <div className="flex justify-center gap-1.5 mt-2">
                {stages.slice(0, 4).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i <= stageIndex ? "w-8 bg-primary" : "w-4 bg-border"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {!isComplete ? (
            <>
              {/* Driver info */}
              {stageIndex >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-card rounded-2xl border border-border"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    AR
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Ahmad Rizki</p>
                    <p className="text-xs text-muted-foreground">Toyota Avanza • B 1234 XYZ</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      <span className="text-xs font-semibold">4.9</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 rounded-xl bg-primary/10">
                      <Phone className="h-4 w-4 text-primary" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-primary/10">
                      <MessageCircle className="h-4 w-4 text-primary" />
                    </button>
                  </div>
                </motion.div>
              )}

              <Button variant="destructive" className="w-full h-12 rounded-2xl font-bold" onClick={() => navigate("/")}>
                Cancel Ride
              </Button>
            </>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <p className="font-bold">You've arrived!</p>
                <p className="text-sm text-muted-foreground">Rate your trip with Ahmad Rizki</p>
                <div className="flex justify-center gap-2 py-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-8 w-8 text-accent fill-accent cursor-pointer hover:scale-110 transition-transform" />
                  ))}
                </div>
              </div>
              <Button onClick={() => navigate("/")} className="w-full h-12 rounded-2xl font-bold">
                Done
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
