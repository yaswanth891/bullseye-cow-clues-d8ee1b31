
import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  onOpenRules: () => void;
  onRestart: () => void;
}

const GameHeader = ({ onOpenRules, onRestart }: GameHeaderProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <header className="w-full flex flex-col items-center mb-6">
      <div className="flex items-center gap-2 mb-2">
        <h1 
          className="text-4xl md:text-5xl font-bold text-cowbulls-brown"
          onMouseEnter={() => setIsAnimating(true)}
          onAnimationEnd={() => setIsAnimating(false)}
        >
          <span className={`inline-block ${isAnimating ? 'animate-bounce-short' : ''}`}>Cows</span>
          <span> & </span>
          <span className={`inline-block ${isAnimating ? 'animate-bounce-short' : ''} animation-delay-100`}>Bulls</span>
        </h1>
      </div>
      
      <div className="flex gap-2 mt-3">
        <Button 
          onClick={onOpenRules}
          variant="outline" 
          className="text-sm bg-white hover:bg-cowbulls-yellow border-cowbulls-brown"
        >
          How to Play
        </Button>
        <Button 
          onClick={onRestart}
          variant="outline" 
          className="text-sm bg-white hover:bg-cowbulls-yellow border-cowbulls-brown"
        >
          New Game
        </Button>
      </div>
    </header>
  );
};

export default GameHeader;
