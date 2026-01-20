import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from './components/Countdown';
import Cake3D from './components/Cake3D';
import ParticleSystem from './components/ParticleSystem';
import FluidSimulation from './components/FluidSimulation';
import MusicPlayer from './components/MusicPlayer';
import './App.css';

const HeartsBackground = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      const left = Math.random() * 100;
      const size = Math.random() * (30 - 10) + 10;
      const duration = Math.random() * (6 - 3) + 3;

      setHearts(prev => [...prev, { id, left, size, duration }]);

      // Remove heart after animation
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== id));
      }, duration * 1000);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hearts-container">
      {hearts.map(heart => (
        <span
          key={heart.id}
          className="heart"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
};

export default function App() {
  const [birthdayReached, setBirthdayReached] = useState(() => {
    const saved = localStorage.getItem("birthdayReached");
    return saved === "true";
  });
  const [screen, setScreen] = useState(birthdayReached ? 'start' : 'timer'); // timer, start, cake, card, boxes, reward, letter
  const [selectedGift, setSelectedGift] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const musicPlayerRef = React.useRef(null);

  const handleBirthdayReached = () => {
    setBirthdayReached(true);
    localStorage.setItem("birthdayReached", "true");
    setScreen('start');
  };

  // --- SCREENS ---

  const StartScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="container"
    >
      <img src="/kitten-ask.gif" alt="Asking Kitten" className="main-gif" />
      <h1>Will you accept my birthday gift? 🎀</h1>
      <div className="button-group">
        <button className="yes-btn" onClick={() => setScreen('cake')}>Yes!</button>
        <button className="no-btn" onClick={() => setScreen('no')}>No</button>
      </div>
    </motion.div>
  );

  const NoScreen = () => (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="container"
    >
      <img src="/kitten-angry.gif" alt="Angry Kitten" className="main-gif" />
      <h1>HOW DARE YOU! 🔫</h1>
      <button onClick={() => setScreen('start')}>I'm sorry, take me back 🥺</button>
    </motion.div>
  );

  const CakeScreen = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container"
    >
      <h1 className="instruction-text">
        {showCelebration ? "🎊 WISHES COMING TRUE! 🎊" : "Blow the candles to see your gifts! 🕯️"}
      </h1>
      <Cake3D onCelebration={() => {
        setShowCelebration(true);
        if (musicPlayerRef.current) musicPlayerRef.current.play();
        setTimeout(() => {
          setScreen('card');
          setShowCelebration(false);
        }, 5000);
      }} />
      <button className="skip-btn" onClick={() => setScreen('card')}>Skip</button>
    </motion.div>
  );

  const BirthdayCard = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 1.2, opacity: 0 }}
      className="container birthday-card"
    >
      <div className="card-inner">
        <h1>Happy Birthday! 🎂</h1>
        <p className="card-msg">To the best friend anyone could ask for. May your day be filled with as much joy as you bring to others! 💖</p>
        <div className="card-decoration">✨🎈✨</div>
        <button className="yes-btn" onClick={() => setScreen('boxes')}>See Your Gifts 🎁</button>
      </div>
    </motion.div>
  );

  const BoxScreen = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      className="container"
    >
      <h1>Pick a box, Bestie! ✨</h1>
      <div className="box-grid">
        {[1, 2, 3].map((id) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="gift-box"
            onClick={() => {
              setSelectedGift(id);
              setScreen('reward');
            }}
          >
            🎁
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const RewardScreen = () => {
    const rewards = {
      1: { text: "A lifetime supply of hugs!", img: "/kitten-hug.gif" },
      2: { text: "You're the best friend ever!", img: "/kitten-love.gif" },
      3: { text: "Unlimited coffee dates on me!", img: "/kitten-coffee.gif" }
    };
    return (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="container"
      >
        <img src={rewards[selectedGift].img} alt="Reward" className="main-gif" />
        <h2>{rewards[selectedGift].text}</h2>
        <div className="button-group">
          <button onClick={() => setScreen('boxes')}>Open another?</button>
          <button className="yes-btn" onClick={() => setScreen('letter')}>Write a Letter ✍️</button>
        </div>
      </motion.div>
    );
  };

  const LetterScreen = () => {
    const [message, setMessage] = useState('');

    const sendEmail = () => {
      const subject = encodeURIComponent("A special birthday message for you!");
      const body = encodeURIComponent(message);
      window.location.href = `mailto:govitheflash@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        className="container"
      >
        <h1>Write a Letter 📝</h1>
        <div className="notepad-container">
          <textarea
            className="notepad"
            placeholder="What do you need, bestie?..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="button-group">
            <button className="secondary-btn" onClick={() => setScreen('reward')}>Back</button>
            <button className="send-btn" onClick={sendEmail}>Send via Email ✉️</button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="app-wrapper">
      <MusicPlayer ref={musicPlayerRef} />
      <FluidSimulation />
      <ParticleSystem active={showCelebration} />
      <AnimatePresence mode="wait">
        {screen === 'timer' && (
          <motion.div
            key="timer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container"
          >
            <h1>Counting down to your special day... 🎂</h1>
            <Countdown
              onBirthdayReached={handleBirthdayReached}
              birthdayReached={birthdayReached}
            />
            {birthdayReached && (
              <button className="yes-btn" onClick={() => setScreen('start')}>
                🎀 Let's Celebrate
              </button>
            )}
          </motion.div>
        )}
        {screen === 'start' && <StartScreen key="start" />}
        {screen === 'cake' && <CakeScreen key="cake" />}
        {screen === 'card' && <BirthdayCard key="card" />}
        {screen === 'no' && <NoScreen key="no" />}
        {screen === 'boxes' && <BoxScreen key="boxes" />}
        {screen === 'reward' && <RewardScreen key="reward" />}
        {screen === 'letter' && <LetterScreen key="letter" />}
      </AnimatePresence>
    </div>
  );
}