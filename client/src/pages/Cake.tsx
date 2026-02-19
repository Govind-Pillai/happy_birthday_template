import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useLocation } from "wouter";
import confetti from "canvas-confetti";
import { Wind } from "lucide-react";

export default function Cake() {
  const [, setLocation] = useLocation();
  const [blown, setBlown] = useState(false);
  const controls = useAnimation();

  const handleBlow = async () => {
    if (blown) return;
    setBlown(true);
    
    // Confetti explosion
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff69b4', '#87ceeb', '#ffd700']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff69b4', '#87ceeb', '#ffd700']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Wait for celebration then navigate
    await new Promise(r => setTimeout(r, 4000));
    setLocation("/card");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-50 to-purple-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <h1 className="text-4xl md:text-5xl font-hand text-primary mb-8 font-bold">
          Make a Wish!
        </h1>
        
        {/* Interactive Cake */}
        <div className="relative w-64 h-64 mx-auto mb-12 group cursor-pointer" onClick={handleBlow}>
          {/* Cake Base */}
          <div className="absolute bottom-0 w-full h-32 bg-amber-100 rounded-xl border-4 border-amber-200 shadow-xl"></div>
          <div className="absolute bottom-16 w-[90%] left-[5%] h-24 bg-pink-300 rounded-xl border-4 border-pink-400"></div>
          <div className="absolute bottom-32 w-[80%] left-[10%] h-20 bg-white rounded-xl border-4 border-gray-200 flex items-center justify-center text-4xl">
            🎂
          </div>

          {/* Candle */}
          <div className="absolute bottom-[13rem] left-1/2 -translate-x-1/2 w-4 h-16 bg-red-400 border border-red-500 rounded-sm">
            {/* Flame */}
            <motion.div 
              animate={blown ? { opacity: 0, scale: 0 } : { scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
              transition={blown ? { duration: 0.5 } : { repeat: Infinity, duration: 0.5 }}
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-6 bg-yellow-400 rounded-full blur-[2px] shadow-[0_0_10px_#ffd700]"
            >
               <div className="w-full h-full bg-orange-500 rounded-full opacity-50 animate-pulse"></div>
            </motion.div>
          </div>
        </div>

        <motion.button
          onClick={handleBlow}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={blown}
          className={`
            px-8 py-4 rounded-full font-bold font-hand text-xl shadow-xl flex items-center gap-3 mx-auto transition-all
            ${blown ? 'bg-green-500 text-white opacity-0' : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'}
          `}
        >
          <Wind className="w-6 h-6" />
          Blow the Candle!
        </motion.button>
        
        {blown && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-2xl font-hand text-primary font-bold"
          >
            Yay! Your wish is on its way! ✨
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
