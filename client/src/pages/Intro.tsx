import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useState } from "react";
import { Heart, X } from "lucide-react";
import { useConfig } from "@/hooks/use-config";

export default function Intro() {
  const [, setLocation] = useLocation();
  const { data: config } = useConfig();
  const [noCount, setNoCount] = useState(0);

  const handleYes = () => {
    setLocation("/cake");
  };

  const handleNo = () => {
    setNoCount((prev) => prev + 1);
  };

  const getNoText = () => {
    if (noCount === 0) return "No";
    if (noCount === 1) return "Are you sure?";
    if (noCount === 2) return "Really sure?";
    if (noCount === 3) return "Don't do this!";
    if (noCount === 4) return "I'm gonna cry...";
    return "Just click Yes!";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-8 max-w-md w-full text-center flex flex-col items-center"
      >
        {/* Cute Kitten Gif */}
        <div className="relative w-64 h-64 mb-6 rounded-2xl overflow-hidden border-4 border-white shadow-lg rotate-2">
          {/* HTML comment for stock image replacement */}
          {/* cute kitten looking curious */}
          <img 
            src="https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=600&h=600&fit=crop" 
            alt="Cute kitten" 
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-3xl font-hand font-bold text-foreground mb-4">
          Hey {config?.recipientName}!
        </h1>
        <p className="text-lg text-muted-foreground mb-8 font-body">
          Are you ready to see your birthday surprise?
        </p>

        <div className="flex gap-4 w-full justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleYes}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold font-hand shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 fill-current" />
            Yes!
          </motion.button>

          <motion.button
            whileHover={{ x: [0, -5, 5, -5, 5, 0] }}
            onClick={handleNo}
            className="flex-1 bg-white border-2 border-muted hover:border-destructive hover:text-destructive text-muted-foreground py-3 rounded-xl font-bold font-hand transition-colors"
          >
            {getNoText()}
          </motion.button>
        </div>

        {noCount > 0 && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-destructive font-hand"
          >
            There is no escape! 😈
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
