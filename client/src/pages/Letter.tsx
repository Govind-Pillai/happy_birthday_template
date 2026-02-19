import { useState } from "react";
import { motion } from "framer-motion";
import { useCreateMessage } from "@/hooks/use-messages";
import { useConfig } from "@/hooks/use-config";
import { Send, Mail, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Letter() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const createMessage = useCreateMessage();
  const { data: config } = useConfig();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      // 1. Send to backend DB
      await createMessage.mutateAsync({
        content: message,
        sender: config?.recipientName || "Birthday Star"
      });

      // 2. Try to open mail client
      if (config?.senderEmail) {
        const subject = encodeURIComponent("Re: Best Birthday Ever!");
        const body = encodeURIComponent(message);
        window.location.href = `mailto:${config.senderEmail}?subject=${subject}&body=${body}`;
      }

      setSent(true);
      toast({
        title: "Message Sent! 💌",
        description: "Your reply has been delivered with love.",
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description: "Failed to send message, but I know you loved it!",
        variant: "destructive"
      });
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-hand font-bold mb-4">Thanks for Playing!</h1>
          <p className="text-muted-foreground">Have the best birthday ever! ❤️</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel max-w-lg w-full p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-hand">Write a Reply</h1>
        </div>

        <p className="text-muted-foreground mb-6">
          Did you like your surprise? Write a quick message to send back to me!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full min-h-[150px] p-4 rounded-xl border-2 border-white/50 bg-white/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none font-body text-lg"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={createMessage.isPending}
            className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {createMessage.isPending ? "Sending..." : "Send Reply"}
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
