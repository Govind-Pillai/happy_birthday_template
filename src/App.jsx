import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated Background Gradient
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <motion.div
        animate={{
          background: [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

// Floating Hearts
const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const left = Math.random() * 100;
      const size = Math.random() * (25 - 15) + 15;
      const duration = Math.random() * (6 - 4) + 4;

      setHearts(prev => [...prev.slice(-12), { id, left, size, duration }]);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ bottom: -50, opacity: 0, rotate: 0 }}
          animate={{
            bottom: '110%',
            opacity: [0, 1, 1, 0],
            rotate: 360,
            x: [0, Math.random() * 80 - 40]
          }}
          transition={{
            duration: heart.duration,
            ease: 'linear',
          }}
          className="absolute text-pink-300"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
          }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
};

// Confetti Explosion
const Confetti = ({ active }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;

    const colors = ['#ff6b9d', '#c44569', '#ffa502', '#ff6348', '#ff4757', '#ffd93d', '#6c5ce7', '#00d2d3'];
    const newPieces = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      scale: Math.random() * 0.6 + 0.4,
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 7000);
    return () => clearTimeout(timer);
  }, [active]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(piece => (
        <motion.div
          key={piece.id}
          initial={{ x: piece.x, y: piece.y, rotate: 0, opacity: 1, scale: piece.scale }}
          animate={{
            y: window.innerHeight + 100,
            x: piece.x + (Math.random() - 0.5) * 500,
            rotate: piece.rotation + 1080,
            opacity: 0
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            ease: 'easeIn',
            delay: Math.random() * 0.5
          }}
          className="absolute w-4 h-4 rounded"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
};

// Interactive Cake - Mobile Optimized
const InteractiveCake = ({ onBlown }) => {
  const [blowing, setBlowing] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [showInstruction, setShowInstruction] = useState(true);

  const handleBlow = () => {
    if (!candleLit) return;

    setBlowing(true);
    setCandleLit(false);
    setShowInstruction(false);

    setTimeout(() => {
      onBlown();
    }, 1200);
  };

  // Mobile: Swipe up to blow
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
    setShowInstruction(false);
  };

  const handleTouchMove = (e) => {
    if (!touchStart || !candleLit) return;

    const currentTouch = e.touches[0].clientY;
    const diff = touchStart - currentTouch;

    if (diff > 60) {
      handleBlow();
      setTouchStart(null);
    }
  };

  useEffect(() => {
    // Hide instruction after 5 seconds
    const timer = setTimeout(() => setShowInstruction(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none px-4 w-full max-w-2xl mx-auto">
      {/* Premium Cake Card Container */}
      <motion.div
        animate={{ scale: blowing ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="w-full bg-white/10 backdrop-blur-3xl rounded-3xl p-8 border-2 border-white/30 shadow-2xl mb-8 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Background glow effects */}
        {candleLit && (
          <>
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 via-orange-400/40 to-pink-400/40 blur-3xl"
            />
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1.2, 1.4, 1.2] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 bg-gradient-to-tl from-purple-400/30 via-pink-400/30 to-yellow-400/30 blur-3xl"
            />
          </>
        )}

        {/* Cake Container */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Cake */}
          <motion.div
            className="text-9xl relative"
            animate={candleLit ? { rotate: [0, -3, 3, 0] } : { rotate: 360 }}
            transition={candleLit ? { repeat: Infinity, duration: 2.5 } : { duration: 0.6 }}
          >
            🎂
          </motion.div>
        </div>
      </motion.div>

      {candleLit && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-5 w-full max-w-md"
        >
          {/* Main button - HUGE for mobile */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleBlow}
            className="w-full py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-3xl font-bold text-2xl cursor-pointer shadow-2xl border-4 border-white/60 backdrop-blur-sm transform transition-all active:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
            }}
          >
            <span className="flex items-center justify-center gap-3 px-2">
              💨 Blow the Candle! 💨
            </span>
          </motion.button>

          {/* Swipe instruction - pulse animation */}
          {showInstruction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-center"
            >
              <p className="text-white/90 text-lg font-semibold bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/40">
                👆 Tap button OR swipe up on cake! ☝️
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

      {!candleLit && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-center"
        >
          <p className="text-white text-3xl font-bold mt-6 px-4">
            🎉 Making your wishes come true! 🎉
          </p>
        </motion.div>
      )}
    </div>
  );
};

// Countdown Timer - Mobile Optimized
const CountdownTimer = ({ timeLeft }) => {
  return (
    <div className="w-full max-w-xl mx-auto px-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(timeLeft).map(([unit, value], idx) => (
          <motion.div
            key={unit}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15, type: 'spring' }}
            className="bg-white/15 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/40 shadow-2xl"
          >
            <motion.div
              key={value}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl font-bold text-white mb-2"
            >
              {String(value).padStart(2, '0')}
            </motion.div>
            <div className="text-base text-purple-200 capitalize font-semibold tracking-wide">
              {unit}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Main App
export default function App() {
  const [screen, setScreen] = useState('countdown');
  const [selectedGift, setSelectedGift] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [birthdayReached, setBirthdayReached] = useState(false);
  const [config, setConfig] = useState(null);
  const [audio] = useState(new Audio('/music.mp3'));

  // Load config from JSON
  useEffect(() => {
    fetch('/config.json')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error('Error loading config:', err));
  }, []);

  // Setup audio
  useEffect(() => {
    audio.loop = true;
    audio.volume = 0.5;
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  useEffect(() => {
    if (!config) return;

    // Set to IST timezone from config
    const targetDate = new Date(config.targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setBirthdayReached(true);
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [config]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const screens = {
    countdown: (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center space-y-8 px-4 py-8"
      >
        <motion.h1
          className="text-4xl font-bold leading-tight px-2"
          style={{
            background: 'linear-gradient(135deg, #ffd93d 0%, #ff6b9d 50%, #c44569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          ✨ Counting Down to Your Special Day! 🎂
        </motion.h1>

        <CountdownTimer timeLeft={timeLeft} />

        {birthdayReached && (
          <motion.button
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setScreen('intro');
              // Play music when clicking IT'S YOUR DAY
              if (config?.enableMusic) {
                audio.play().catch(err => console.log('Audio play failed:', err));
              }
            }}
            className="w-full max-w-md mx-auto mt-8 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-3xl font-bold text-2xl shadow-2xl border-4 border-white/60"
          >
            🎉 IT'S YOUR DAY! 🎉
          </motion.button>
        )}
      </motion.div>
    ),

    intro: (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center space-y-8 px-4 py-8"
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 15, 0],
            scale: [1, 1.15, 1, 1.15, 1]
          }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="text-9xl"
        >
          <motion.div
            animate={{ x: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 12 }}
            className="w-64 h-64 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30"
          >
            <img src="/kitten-ask.gif" alt="Ask Kitten" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        <h1 className="text-4xl font-bold text-white leading-tight px-2">
          Will you accept my<br />birthday surprise? 💝
        </h1>

        <div className="flex flex-col gap-4 px-4 max-w-md mx-auto pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('cake')}
            className="w-full py-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-3xl font-bold text-2xl shadow-2xl border-4 border-white/50"
          >
            YES! 🎊
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('no')}
            className="w-full py-6 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-3xl font-bold text-2xl shadow-2xl border-4 border-white/50"
          >
            No...
          </motion.button>
        </div>
      </motion.div>
    ),

    no: (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center space-y-8 px-4 py-8"
      >
        <motion.div
          animate={{
            rotate: [0, -15, 15, -15, 0],
            scale: [1, 1.25, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.7 }}
          className="text-9xl"
        >
          <img src="/kitten-angry.gif" alt="Angry Kitten" className="w-full h-full object-cover" />
        </motion.div>

        <h1 className="text-5xl font-bold text-white px-2 leading-tight">
          HOW DARE YOU! 💢
        </h1>

        <p className="text-2xl text-purple-200 px-4">
          That's not very cash money of you...
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setScreen('intro')}
          className="w-full max-w-md mx-auto py-6 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-3xl font-bold text-xl shadow-2xl border-4 border-white/50"
        >
          I'm sorry! Take me back 🥺
        </motion.button>
      </motion.div>
    ),

    cake: (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center space-y-8 px-4 py-8"
      >
        {showConfetti ? (
          <motion.div
            className="text-center space-y-2"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">🎉</span>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Happy
              </h1>
              <span className="text-4xl">🎉</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className="text-4xl">🎊</span>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Birthday!
              </h1>
              <span className="text-4xl">🎊</span>
            </div>
          </motion.div>
        ) : (
          <motion.h1 className="text-3xl font-bold text-white px-2 leading-tight">
            Make a wish & blow the candle!
          </motion.h1>
        )}

        <InteractiveCake
          onBlown={() => {
            setShowConfetti(true);
            setTimeout(() => {
              setScreen('card');
              setShowConfetti(false);
            }, 6000);
          }}
        />
      </motion.div>
    ),

    card: (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-lg mx-auto px-4 py-8"
      >
        <motion.div
          className="bg-white/15 backdrop-blur-2xl rounded-3xl p-8 border-2 border-white/40 shadow-2xl text-center space-y-6"
        >
          {/* Happy Birthday with emojis */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-center gap-4">
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >🎉</motion.span>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Happy
              </h1>
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >🎉</motion.span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, -15, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              >🎊</motion.span>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Birthday!
              </h1>
              <motion.span
                className="text-5xl"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              >🎊</motion.span>
            </div>
          </div>
          <p className="text-xl text-white leading-relaxed px-2 whitespace-pre-line">
            {config?.personalMessage || "To the most amazing person I know! 🌟\nMay your day be filled with laughter, love, and all your favorite things.\nYou deserve the world and more! 💖"}
          </p>
          <div className="text-4xl space-x-2 py-2">
            ✨🎈🎉🎁🎊🎈✨
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('gifts')}
            className="w-full mt-6 py-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-3xl font-bold text-xl shadow-2xl border-4 border-white/50"
          >
            Open Your Gifts! 🎁
          </motion.button>
        </motion.div>
      </motion.div>
    ),

    gifts: (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center space-y-8 px-4 py-8"
      >
        <h1 className="text-4xl font-bold text-white px-2">
          Choose Your Gift! 🎁✨
        </h1>

        <div className="grid grid-cols-1 gap-5 max-w-md mx-auto">
          {[1, 2, 3].map((id) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: id * 0.15, type: 'spring' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedGift(id);
                setScreen('reward');
              }}
              className="bg-white/15 backdrop-blur-2xl rounded-3xl p-10 border-2 border-white/40 shadow-2xl cursor-pointer active:bg-white/25 transition-all"
            >
              <motion.div
                className="text-8xl mb-3"
                animate={{ rotate: [0, -12, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, delay: id * 0.3 }}
              >
                🎁
              </motion.div>
              <p className="text-white text-2xl font-bold">Gift #{id}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),

    reward: (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="text-center space-y-8 max-w-lg mx-auto px-4 py-8"
      >
        {(() => {
          const rewards = {
            1: { gif: '/kitten-hug.gif', text: 'Unlimited Hugs Coupon!', desc: 'Redeemable anytime, anywhere, forever!' },
            2: { gif: '/kitten-love.gif', text: "You're Royalty!", desc: 'The best friend in the entire universe!' },
            3: { gif: '/kitten-coffee.gif', text: 'Coffee on Me!', desc: 'Unlimited coffee dates whenever you want!' }
          };
          const reward = rewards[selectedGift] || rewards[1];

          return (
            <>
              <motion.div
                animate={{
                  rotate: [0, 20, -20, 0],
                  scale: [1, 1.25, 1]
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-64 h-64 mx-auto"
              >
                <img src={reward.gif} alt={reward.text} className="w-full h-full object-cover rounded-3xl shadow-2xl border-4 border-white/30" />
              </motion.div>
              <h2 className="text-4xl font-bold text-white px-2">{reward.text}</h2>
              <p className="text-2xl text-purple-200 px-4">{reward.desc}</p>
            </>
          );
        })()}

        <div className="flex flex-col gap-4 px-4 pt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('gifts')}
            className="w-full py-6 bg-white/20 backdrop-blur-lg text-white rounded-3xl font-bold text-lg border-2 border-white/40"
          >
            Try Another Gift
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('letter')}
            className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-3xl font-bold text-lg shadow-2xl border-4 border-white/50"
          >
            Send Me a Message ✉️
          </motion.button>
        </div>
      </motion.div>
    ),

    letter: (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-lg mx-auto px-4 py-8"
      >
        <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-6 border-2 border-white/40 shadow-2xl space-y-6">
          <h1 className="text-4xl font-bold text-white text-center">Write Me a Note 📝</h1>
          <textarea
            id="birthday-message"
            className="w-full h-64 bg-white/25 backdrop-blur-lg text-white placeholder-purple-200 rounded-2xl p-5 border-2 border-white/40 focus:outline-none focus:ring-4 focus:ring-pink-500/60 resize-none text-lg"
            placeholder="Share your thoughts, wishes, or anything on your mind..."
          />
          <div className="flex flex-col gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen('reward')}
              className="w-full py-5 bg-white/20 backdrop-blur-lg text-white rounded-3xl font-bold border-2 border-white/40 text-lg"
            >
              Back
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const message = document.getElementById('birthday-message').value;
                const email = config?.email || 'govitheflash@gmail.com';
                window.location.href = `mailto:${email}?subject=Birthday Message&body=${encodeURIComponent(message)}`;
              }}
              className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-3xl font-bold shadow-2xl text-lg border-4 border-white/50"
            >
              Send Email ✉️
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="w-full py-5 bg-red-500/80 backdrop-blur-lg text-white rounded-3xl font-bold border-2 border-white/40 text-lg hover:bg-red-600/80 transition-colors"
            >
              Exit
            </motion.button>
          </div>
        </div>
      </motion.div>
    ),
  };

  return (
    <div className="min-h-screen overflow-hidden relative">
      <AnimatedBackground />
      <FloatingHearts />
      <Confetti active={showConfetti} />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={screen} className="w-full">
            {screens[screen]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}