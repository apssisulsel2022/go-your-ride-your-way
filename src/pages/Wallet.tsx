import { Wallet as WalletIcon, Plus, CreditCard, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const transactions = [
  { id: 1, label: "Ride to Sudirman", amount: -25000, date: "Today, 14:30", type: "out" },
  { id: 2, label: "Top Up", amount: 100000, date: "Today, 10:00", type: "in" },
  { id: 3, label: "Shuttle - Bandung", amount: -75000, date: "Yesterday", type: "out" },
  { id: 4, label: "Cashback Reward", amount: 5000, date: "Yesterday", type: "in" },
  { id: 5, label: "Ride to Kemang", amount: -18000, date: "Apr 7", type: "out" },
];

export default function Wallet() {
  return (
    <MobileLayout>
      <div className="px-4 pt-6 space-y-5">
        <h1 className="text-xl font-extrabold">Wallet</h1>

        {/* Balance Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-5 rounded-2xl bg-primary text-primary-foreground">
            <p className="text-sm font-medium opacity-80">Your Balance</p>
            <p className="text-3xl font-extrabold mt-1">Rp 180.000</p>
            <Button
              variant="secondary"
              className="mt-4 h-10 rounded-xl font-bold gap-2"
            >
              <Plus className="h-4 w-4" />
              Top Up
            </Button>
          </Card>
        </motion.div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-sm font-bold mb-2">Payment Methods</h3>
          <Card className="rounded-2xl divide-y divide-border">
            {[
              { label: "PYUGO Wallet", sub: "Rp 180.000", icon: WalletIcon },
              { label: "Visa •••• 4821", sub: "Expires 08/27", icon: CreditCard },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-3 p-4">
                <div className="p-2 rounded-lg bg-secondary">
                  <m.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-sm font-bold mb-2">Recent Transactions</h3>
          <div className="space-y-1">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/60 transition-colors"
              >
                <div className={`p-2 rounded-lg ${tx.type === "in" ? "bg-primary/10" : "bg-secondary"}`}>
                  {tx.type === "in" ? (
                    <ArrowDownLeft className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{tx.label}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <span className={`text-sm font-bold ${tx.type === "in" ? "text-primary" : "text-foreground"}`}>
                  {tx.type === "in" ? "+" : ""}Rp {Math.abs(tx.amount).toLocaleString("id-ID")}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
