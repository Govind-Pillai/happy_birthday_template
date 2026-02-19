import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Gift, Package } from "lucide-react";
import { useConfig } from "@/hooks/use-config";
import { useState } from "react";

export default function GiftSelection() {
  const [, setLocation] = useLocation();
  const { data: config } = useConfig();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // If no config, fallback to defaults
  const gifts = config?.gifts || [
    { id: "1", label: "Mystery Box 1", content: "A big warm hug! 🤗" },
    { id: "2", label: "Mystery Box 2", content: "Dinner on me! 🍕" },
    { id: "3", label: "Mystery Box 3", content: "Movie night choice! 🎬" },
  ];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setTimeout(() => {
      setLocation(`/reward/${id}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-hand font-bold text-foreground mb-4">
          Choose Your Gift!
        </h1>
        <p className="text-muted-foreground">
          Pick one box to reveal your special treat
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {gifts.map((gift, index) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ 
              scale: 1.05, 
              rotate: [0, -2, 2, -2, 2, 0],
              transition: { rotate: { repeat: Infinity, duration: 0.5 } }
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(gift.id)}
            className={`
              relative aspect-square cursor-pointer rounded-3xl flex flex-col items-center justify-center p-8 transition-all
              ${selectedId === gift.id 
                ? 'bg-primary text-white shadow-[0_0_50px_rgba(236,72,153,0.5)] z-20 scale-110' 
                : 'bg-white/40 border-2 border-white hover:border-primary/50 shadow-xl backdrop-blur-sm'}
            `}
          >
            {selectedId === gift.id ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1.5, rotate: 360 }}
                transition={{ type: "spring" }}
              >
                <Gift className="w-24 h-24" />
              </motion.div>
            ) : (
              <Package className="w-20 h-20 text-primary/80 mb-4" />
            )}
            
            <h3 className="text-2xl font-hand font-bold mt-4">
              {gift.label}
            </h3>
            
            {selectedId === gift.id && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="mt-2 font-bold"
              >
                Opening...
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
