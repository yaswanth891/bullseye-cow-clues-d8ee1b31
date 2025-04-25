
import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VictoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  winner: 'player' | 'opponent' | null;
  secretNumber: string;
  guessCount: number;
  opponentGuessCount: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

const VictoryDialog = ({
  open,
  onOpenChange,
  winner,
  secretNumber,
  guessCount,
  opponentGuessCount,
  onPlayAgain,
  onNewGame
}: VictoryDialogProps) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (winner) {
        onOpenChange(true);
      }
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [winner, onOpenChange]);

  if (!winner) return null;
  
  const isPlayerWinner = winner === 'player';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`text-2xl ${isPlayerWinner ? 'text-cowbulls-green' : 'text-cowbulls-orange'}`}>
            {isPlayerWinner ? '🎉 You Won! 🎉' : 'Game Over'}
          </DialogTitle>
          <DialogDescription>
            {isPlayerWinner 
              ? "Congratulations! You guessed the number correctly!"
              : "Your opponent guessed your number first."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-3">
          <div className="text-center">
            <p className="text-sm text-gray-500">The secret number was</p>
            <p className="font-mono text-3xl font-bold">{secretNumber}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Your guesses</p>
              <p className="text-xl font-bold">{guessCount}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">Opponent guesses</p>
              <p className="text-xl font-bold">{opponentGuessCount}</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={onPlayAgain} 
            variant="outline" 
            className="w-full sm:w-auto border-cowbulls-brown hover:bg-cowbulls-yellow"
          >
            Play Again
          </Button>
          <Button 
            onClick={onNewGame} 
            className="w-full sm:w-auto bg-cowbulls-orange hover:bg-cowbulls-brown"
          >
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VictoryDialog;
