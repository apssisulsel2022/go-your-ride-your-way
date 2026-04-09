import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Bus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    icon: Car,
    title: "Ride Anywhere",
    description: "On-demand rides at your fingertips. Choose from bikes, cars, or premium vehicles.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Bus,
    title: "Shuttle Booking",
    description: "Book intercity shuttle trips easily — no login required for guest booking.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: MapPin,
    title: "Track in Real-Time",
    description: "Follow your driver on a live map with real-time updates and ETA.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

export default function Onboarding() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const finish = () => {
    localStorage.setItem("pyugo_onboarded", "true");
    navigate("/home", { replace: true });
  };

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
    else finish();
  };

  const slide = slides[current];

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      <div className="flex-1 flex items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-6"
          >
            <div className={`w-28 h-28 rounded-3xl ${slide.bg} flex items-center justify-center`}>
              <slide.icon className={`h-14 w-14 ${slide.color}`} />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground">{slide.title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-10 space-y-6">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        <Button onClick={next} className="w-full h-12 rounded-xl font-bold text-base">
          {current < slides.length - 1 ? "Next" : "Get Started"}
        </Button>

        {current < slides.length - 1 && (
          <button
            onClick={finish}
            className="w-full text-center text-sm text-muted-foreground font-medium"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
