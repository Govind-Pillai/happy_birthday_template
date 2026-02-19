import { useEffect, useState } from "react";
import { useConfig } from "@/hooks/use-config";
import { differenceInSeconds, formatDuration, intervalToDuration } from "date-fns";
import { motion } from "framer-motion";
import { Loader2, Gift } from "lucide-react";
import { useLocation } from "wouter";

export default function Countdown() {
  const { data: config, isLoading } = useConfig();
  const [timeLeft, setTimeLeft] = useState<Duration | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!config) return;

    const target = new Date(config.targetDate);
    
    const timer = setInterval(() => {
      const now = new Date();
      if (now >= target) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      setTimeLeft(intervalToDuration({ start: now, end: target }));
    }, 1000);

    return () => clearInterval(timer);
  }, [config]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  const onEnter = () => {
    setLocation("/intro");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl animate-float-delayed" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel p-8 md:p-12 max-w-2xl w-full z-10"
      >
        <h1 className="text-4xl md:text-6xl font-hand mb-2 text-primary">
          Wait for it...
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Something magical is about to happen for {config?.recipientName}!
        </p>

        {!isExpired && timeLeft ? (
          <div className="grid grid-cols-4 gap-4 mb-10">
            {[
              { label: "Days", value: timeLeft.days || 0 },
              { label: "Hours", value: timeLeft.hours || 0 },
              { label: "Mins", value: timeLeft.minutes || 0 },
              { label: "Secs", value: timeLeft.seconds || 0 },
            ].map((item, i) => (
              <motion.div 
                key={item.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="bg-white/60 w-full aspect-square rounded-2xl flex items-center justify-center text-3xl md:text-5xl font-bold shadow-inner border border-white/40 text-foreground">
                  {item.value}
                </div>
                <span className="mt-2 font-hand text-sm md:text-lg text-primary">{item.label}</span>
              </motion.div>
            ))}
          </div>
        ) : isExpired ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8 py-8"
          >
            <h2 className="text-3xl font-bold text-accent font-hand">
              It's Time! 🎉
            </h2>
          </motion.div>
        ) : (
          <div className="h-32 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        <motion.button
          disabled={!isExpired}
          onClick={onEnter}
          whileHover={isExpired ? { scale: 1.05 } : {}}
          whileTap={isExpired ? { scale: 0.95 } : {}}
          className={`
            w-full py-4 rounded-xl text-xl font-bold font-hand flex items-center justify-center gap-3 transition-all
            ${isExpired 
              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 cursor-pointer hover:shadow-xl' 
              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'}
          `}
        >
          <Gift className="w-6 h-6" />
          {isExpired ? "Open Your Surprise" : "Locked until birthday"}
        </motion.button>
      </motion.div>
    </div>
  );
}
