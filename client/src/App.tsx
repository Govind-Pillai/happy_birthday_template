import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";

// Pages
import Countdown from "@/pages/Countdown";
import Intro from "@/pages/Intro";
import Cake from "@/pages/Cake";
import Card from "@/pages/Card";
import GiftSelection from "@/pages/GiftSelection";
import Reward from "@/pages/Reward";
import Letter from "@/pages/Letter";
import NotFound from "@/pages/not-found";

// Components
import { MusicPlayer } from "@/components/MusicPlayer";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Countdown} />
        <Route path="/intro" component={Intro} />
        <Route path="/cake" component={Cake} />
        <Route path="/card" component={Card} />
        <Route path="/gifts" component={GiftSelection} />
        <Route path="/reward/:id" component={Reward} />
        <Route path="/letter" component={Letter} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MusicPlayer />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
