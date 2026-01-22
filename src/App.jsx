import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Floating Hearts Background
const HeartsBackground = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const left = Math.random() * 100;
      const size = Math.random() * (30 - 15) + 15;
      const duration = Math.random() * (5 - 3) + 3;

      setHearts(prev => [...prev.slice(-20), { id, left, size, duration }]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ bottom: -50, opacity: 0 }}
          animate={{ bottom: '110%', opacity: [0, 1, 1, 0] }}
          transition={{ duration: heart.duration, ease: 'linear' }}
          className="absolute text-pink-400"
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

// Animated Confetti
const Confetti = ({ active }) => {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) return;

    const colors = ['#ff6b9d', '#c44569', '#ffa502', '#ff6348', '#ff4757'];
    const newPieces = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 5000);
    return () => clearTimeout(timer);
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces.map(piece => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: piece.x, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: piece.rotation + 720,
            opacity: 0
          }}
          transition={{
            duration: 3,
            delay: piece.delay,
            ease: 'easeIn'
          }}
          className="absolute w-3 h-3 rounded"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
};

// Simple 3D Cake with Candle
const InteractiveCake = ({ onBlown }) => {
  const [blowing, setBlowing] = useState(false);
  const [candleLit, setCandleLit] = useState(true);
  const [hasBlown, setHasBlown] = useState(false);

  const handleBlow = () => {
    if (hasBlown) return; // Prevent multiple clicks

    setHasBlown(true);
    setBlowing(true);
    setCandleLit(false);

    setTimeout(() => {
      onBlown();
    }, 800);
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={{ scale: blowing ? 1.1 : 1 }}
        className="text-center mb-8"
      >
        {/* Candle flame */}
        {candleLit && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 z-10"
          >
            <div className="text-4xl">🕯️</div>
          </motion.div>
        )}

        {/* Cake */}
        <div className="text-9xl relative z-10">🎂</div>

        {/* Glow effect */}
        {candleLit && (
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 bg-yellow-400 blur-3xl rounded-full opacity-40 -z-10"
          />
        )}
      </motion.div>

      {candleLit && !hasBlown && (
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0 20px 60px rgba(236, 72, 153, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBlow}
          style={{
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            border: '3px solid white',
            color: 'white',
            padding: '20px 40px',
            borderRadius: '50px',
            fontSize: '24px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}
        >
          💨 Click Here to Blow the Candle! 💨
        </motion.button>
      )}

      {!candleLit && (
        <p className="text-white text-2xl font-bold mt-4">
          🎉 Candle blown! Wait for the magic... 🎉
        </p>
      )}
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

  // Get environment variables
  const birthdayDate = import.meta.env.VITE_TIMESTAMP;
  const recipient = import.meta.env.VITE_RECIPIENT || 'Friend';
  const sender = import.meta.env.VITE_SENDER || 'Your Friend';

  // Countdown logic
  useEffect(() => {
    const targetDate = new Date(birthdayDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setBirthdayReached(true);
        clearInterval(interval);
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
  }, []);

  const screens = {
    countdown: (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center space-y-8"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Counting Down to Your Special Day 🎂
        </motion.h1>

        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <motion.div
              key={unit}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl"
            >
              <div className="text-4xl md:text-5xl font-bold text-white">{value}</div>
              <div className="text-sm md:text-base text-purple-200 capitalize mt-2">{unit}</div>
            </motion.div>
          ))}
        </div>

        {birthdayReached && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setScreen('intro')}
            className="mt-8 px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full font-bold text-2xl shadow-2xl hover:shadow-pink-500/50 transition-all"
          >
            🎉 IT'S TIME! Click Here!
          </motion.button>
        )}
      </motion.div>
    ),

    intro: (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        className="text-center space-y-8"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
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

        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Will you accept my birthday surprise? 💝
        </h1>

        <div className="flex gap-4 justify-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setScreen('cake')}
            className="px-12 py-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full font-bold text-2xl shadow-xl"
          >
            YES! 🎊
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setScreen('no')}
            className="px-12 py-6 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full font-bold text-2xl shadow-xl"
          >
            No...
          </motion.button>
        </div>
      </motion.div>
    ),

    no: (
      <motion.div
        initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 10, scale: 0.8, opacity: 0 }}
        className="text-center space-y-8"
      >
        <motion.div
          animate={{ x: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="w-64 h-64 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30"
        >
          <img src="/kitten-angry.gif" alt="Angry Kitten" className="w-full h-full object-cover" />
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-bold text-white">
          HOW DARE YOU! 💢
        </h1>

        <p className="text-2xl text-purple-200">
          That's not very cash money of you...
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setScreen('intro')}
          className="px-10 py-5 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-xl shadow-xl"
        >
          I'm sorry! Take me back 🥺
        </motion.button>
      </motion.div>
    ),

    cake: (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center space-y-8"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-white"
          animate={{ scale: showConfetti ? [1, 1.1, 1] : 1 }}
        >
          {showConfetti ? "🎊 HAPPY BIRTHDAY! 🎊" : "Make a wish and blow the candle! 🕯️"}
        </motion.h1>

        <InteractiveCake
          onBlown={() => {
            setShowConfetti(true);
            setTimeout(() => {
              setScreen('card');
              setShowConfetti(false);
            }, 4000);
          }}
        />
      </motion.div>
    ),

    card: (
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        exit={{ rotateY: -90, opacity: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl text-center space-y-6">
          <div className="text-6xl">🎂</div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Happy Birthday!
          </h1>
          <p className="text-xl text-white leading-relaxed">
            Dear {recipient},<br />
            To the most amazing person I know! 🌟<br />
            May your day be filled with laughter, love, and all your favorite things.<br />
            You deserve the world and more! 💖
            <br /><br />
            With love,<br />
            {sender}
          </p>
          <div className="text-4xl space-x-2">
            ✨🎈🎉🎁🎊🎈✨
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('gifts')}
            className="mt-6 px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold text-xl shadow-xl"
          >
            Open Your Gifts! 🎁
          </motion.button>
        </div>
      </motion.div>
    ),

    gifts: (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.2, opacity: 0 }}
        className="text-center space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Choose Your Gift! 🎁✨
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[1, 2, 3].map((id) => (
            <motion.div
              key={id}
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedGift(id);
                setScreen('reward');
              }}
              className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-xl cursor-pointer hover:bg-white/20 transition-all"
            >
              <div className="text-8xl">🎁</div>
              <p className="text-white text-xl mt-4 font-semibold">Gift #{id}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ),

    reward: (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="text-center space-y-8 max-w-2xl mx-auto"
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
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-64 h-64 mx-auto mb-8 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30"
              >
                <img src={reward.gif} alt={reward.text} className="w-full h-full object-cover" />
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-white">{reward.text}</h2>
              <p className="text-2xl text-purple-200">{reward.desc}</p>
            </>
          );
        })()}

        <div className="flex gap-4 justify-center flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('gifts')}
            className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white rounded-full font-bold text-lg border border-white/30"
          >
            Try Another Gift
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('letter')}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold text-lg shadow-xl"
          >
            Send Me a Message ✉️
          </motion.button>
        </div>
      </motion.div>
    ),

    letter: (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">
          <h1 className="text-4xl font-bold text-white text-center">Write Me a Note 📝</h1>
          <textarea
            className="w-full h-64 bg-white/20 backdrop-blur-lg text-white placeholder-purple-200 rounded-2xl p-6 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none text-lg"
            placeholder="Share your thoughts, wishes, or anything on your mind..."
          />
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen('reward')}
              className="px-8 py-4 bg-white/20 backdrop-blur-lg text-white rounded-full font-bold border border-white/30"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const message = document.querySelector('textarea').value;
                window.location.href = `mailto:govitheflash@gmail.com?subject=Birthday Message&body=${encodeURIComponent(message)}`;
              }}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold shadow-xl"
            >
              Send Email ✉️
            </motion.button>
          </div>
        </div>
      </motion.div>
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900 overflow-hidden">
      <HeartsBackground />
      <Confetti active={showConfetti} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div key={screen} className="w-full max-w-6xl">
            {screens[screen]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}