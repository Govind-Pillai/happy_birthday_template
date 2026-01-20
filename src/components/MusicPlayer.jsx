import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import "./MusicPlayer.css";

const MusicPlayer = forwardRef((props, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleMusic = () => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                audio.pause();
                setIsPlaying(false);
            } else {
                audio
                    .play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.error("Error playing audio:", error);
                        setIsPlaying(false);
                    });
            }
        }
    };

    useImperativeHandle(ref, () => ({
        play: () => {
            const audio = audioRef.current;
            if (audio && !isPlaying) {
                audio
                    .play()
                    .then(() => {
                        setIsPlaying(true);
                    })
                    .catch((error) => {
                        console.error("Error playing audio:", error);
                    });
            }
        },
        pause: () => {
            const audio = audioRef.current;
            if (audio && isPlaying) {
                audio.pause();
                setIsPlaying(false);
            }
        },
        toggle: () => {
            toggleMusic();
        },
    }));

    return (
        <>
            <audio ref={audioRef} loop preload="auto">
                <source src="/music.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            <button
                className="music-toggle"
                onClick={toggleMusic}
                aria-label={isPlaying ? "Pause music" : "Play music"}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    borderRadius: '30px',
                    border: 'none',
                    background: 'rgba(255, 105, 180, 0.8)',
                    color: 'white',
                    cursor: 'pointer',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
            >
                {isPlaying ? "⏸ Music" : "🎵 Music"}
            </button>
        </>
    );
});

MusicPlayer.displayName = "MusicPlayer";

export default MusicPlayer;
