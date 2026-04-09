import { useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, ArrowLeft } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { usePayment } from "@/context/PaymentContext";

function formatRp(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

const methodLabels: Record<string, string> = {
  cash: "Cash",
  wallet: "PYUGO Wallet",
  bank_transfer: "Bank Transfer",
  ewallet: "E-Wallet",
  credit_card: "Credit Card",
  qris: "QRIS",
};

export default function PaymentStatus() {
  const navigate = useNavigate();
  const { activeTransaction } = usePayment();

  if (!activeTransaction) {
    navigate("/home");
    return null;
  }

  const { status, amount, id, description, method, returnPath } = activeTransaction;

  const config = {
    success: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", title: "Payment Successful!", sub: "Your transaction has been completed" },
    failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", title: "Payment Failed", sub: "Something went wrong. Please try again." },
    processing: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", title: "Payment Pending", sub: "Waiting for confirmation..." },
    pending: { icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", title: "Payment Pending", sub: "Waiting for confirmation..." },
  }[status];

  const Icon = config.icon;

  return (
    <MobileLayout hideNav>
      <div className="px-4 pt-4 pb-6 flex flex-col items-center justify-center min-h-[80vh] space-y-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center space-y-3"
        >
          <div className={`w-20 h-20 rounded-full ${config.bg} mx-auto flex items-center justify-center`}>
            <Icon className={`h-10 w-10 ${config.color}`} />
          </div>
          <h1 className="text-xl font-extrabold">{config.title}</h1>
          <p className="text-sm text-muted-foreground">{config.sub}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="w-full">
          <Card className="p-4 rounded-2xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-xs font-bold">{id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Description</span>
              <span className="font-medium text-right max-w-[60%] truncate">{description}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium">{methodLabels[method] || method}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold">Amount</span>
              <span className="font-extrabold text-primary">{formatRp(amount)}</span>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="w-full space-y-2">
          {status === "success" && (
            <Button onClick={() => navigate(returnPath || "/home")} className="w-full h-12 rounded-2xl text-base font-bold">
              Continue
            </Button>
          )}
          {status === "failed" && (
            <>
              <Button onClick={() => navigate("/payment")} className="w-full h-12 rounded-2xl text-base font-bold">
                Try Again
              </Button>
              <Button onClick={() => navigate("/home")} variant="outline" className="w-full h-11 rounded-2xl font-bold">
                Back to Home
              </Button>
            </>
          )}
          {(status === "pending" || status === "processing") && (
            <Button onClick={() => navigate("/home")} variant="outline" className="w-full h-11 rounded-2xl font-bold">
              Back to Home
            </Button>
          )}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
