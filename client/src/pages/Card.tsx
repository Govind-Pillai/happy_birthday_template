import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import { useConfig } from "@/hooks/use-config";

export default function Card() {
  const [, setLocation] = useLocation();
  const { data: config } = useConfig();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-20">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="glass-panel max-w-2xl w-full p-8 md:p-12 relative overflow-visible"
      >
        {/* Decorative elements */}
        <Star className="absolute -top-6 -right-6 w-12 h-12 text-accent fill-accent animate-spin-slow" />
        <Star className="absolute -bottom-6 -left-6 w-8 h-8 text-primary fill-primary animate-bounce" />

        <motion.div variants={item} className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-hand font-bold text-primary mb-2">
            Happy Birthday!
          </h1>
          <h2 className="text-2xl md:text-4xl font-hand text-secondary-foreground">
            {config?.recipientName}
          </h2>
        </motion.div>

        <motion.div variants={item} className="prose prose-lg mx-auto text-center font-body text-muted-foreground mb-10 leading-relaxed">
          {config?.birthdayMessage ? (
            <p>{config.birthdayMessage}</p>
          ) : (
            <p>
              Another year around the sun! You bring so much joy to everyone around you.
              May this year be filled with laughter, adventure, and everything you've ever wished for.
              You deserve the world! 🌍❤️
            </p>
          )}
        </motion.div>

        <motion.div variants={item} className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLocation("/gifts")}
            className="group px-8 py-4 bg-gradient-to-r from-primary to-purple-500 text-white rounded-full font-bold text-lg shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            <span>Time for Gifts!</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
