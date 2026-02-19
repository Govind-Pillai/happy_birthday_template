import { useState, useRef, useEffect } from "react";
import { Music, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Use a royalty-free happy track URL
  const trackUrl = "https://cdn.pixabay.com/download/audio/2022/10/25/audio_b207563148.mp3?filename=happy-birthday-jazz-118838.mp3"; 

  useEffect(() => {
    audioRef.current = new Audio(trackUrl);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Autoplay prevented", e));
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border border-white/50 backdrop-blur-md transition-all duration-300
          ${isPlaying ? 'bg-primary text-primary-foreground' : 'bg-white/80 text-foreground'}
        `}
      >
        <Music className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-bold font-hand hidden sm:inline">
          {isPlaying ? "Playing Birthday Jazz" : "Play Music"}
        </span>
        
        {isPlaying && (
          <div 
            onClick={toggleMute}
            className="ml-2 p-1 hover:bg-black/10 rounded-full cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </div>
        )}
      </motion.button>
    </div>
  );
}
