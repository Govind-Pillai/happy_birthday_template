import { motion } from "framer-motion";
import { useRoute, useLocation } from "wouter";
import { useConfig } from "@/hooks/use-config";
import { ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect } from "react";

export default function Reward() {
  const [, params] = useRoute("/reward/:id");
  const [, setLocation] = useLocation();
  const { data: config } = useConfig();

  const giftId = params?.id;
  const gift = config?.gifts.find(g => g.id === giftId) || {
    id: "0",
    label: "Bonus Gift",
    content: "Unlimited Happiness! 😄",
    image: "https://images.unsplash.com/photo-1549488497-69b52a79248f?w=600&h=400&fit=crop"
  };

  useEffect(() => {
    // Huge confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="glass-panel max-w-2xl w-full p-8 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 pointer-events-none" />
        
        <div className="relative z-10">
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-accent p-4 rounded-full shadow-lg shadow-accent/30 animate-bounce">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h1 className="text-3xl font-hand font-bold text-muted-foreground mb-4">
            You got...
          </h1>
          
          <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-8 font-display">
            {gift.content}
          </h2>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white mb-8 mx-auto max-w-md aspect-video">
            {/* HTML comment for stock image replacement */}
            {/* joyful celebration or gift image */}
            <img 
              src={gift.image || "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600&h=400&fit=crop"} 
              alt={gift.label} 
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Take a screenshot to redeem this gift from me anytime!
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation("/letter")}
            className="px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl shadow-sm hover:shadow-md flex items-center gap-2 mx-auto"
          >
            One Last Thing... <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
