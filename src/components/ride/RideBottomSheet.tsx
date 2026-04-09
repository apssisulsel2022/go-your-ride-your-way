import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RideBottomSheetProps {
  children: ReactNode;
  animationKey: string;
}

export function RideBottomSheet({ children, animationKey }: RideBottomSheetProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000]">
      <AnimatePresence mode="wait">
        <motion.div
          key={animationKey}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="rounded-t-3xl bg-background px-4 pt-5 pb-6 shadow-[0_-4px_30px_rgba(0,0,0,0.1)]"
        >
          <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
