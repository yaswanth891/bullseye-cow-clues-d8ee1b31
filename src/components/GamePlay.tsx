import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NumberInput from "./NumberInput";
import GuessHistory from "./GuessHistory";
import { 
  calculateFeedback, 
  ComputerAI, 
  GameHistory, 
  isValidGuess 
} from "@/utils/gameUtils";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface GamePlayProps {
  mode: 'two-player' | 'computer';
  playerSecretNumber: string;
  opponentSecretNumber: string;
  onGameOver: (winner: 'player' | 'opponent') => void;
  playerGuessHistory: GameHistory[];
  opponentGuessHistory: GameHistory[];
  onGuessHistoryUpdate: (
    playerGuessHistory: GameHistory[], 
    opponentGuessHistory: GameHistory[]
  ) => void;
}

const GamePlay = ({
  mode,
  playerSecretNumber,
  opponentSecretNumber,
  onGameOver,
  playerGuessHistory: initialPlayerHistory,
  opponentGuessHistory: initialOpponentHistory,
  onGuessHistoryUpdate
}: GamePlayProps) => {
  const [playerTurn, setPlayerTurn] = useState(true);
  const [currentGuess, setCurrentGuess] = useState("");
  const [playerGuessHistory, setPlayerGuessHistory] = useState<GameHistory[]>(initialPlayerHistory || []);
  const [opponentGuessHistory, setOpponentGuessHistory] = useState<GameHistory[]>(initialOpponentHistory || []);
  const [computerFeedback, setComputerFeedback] = useState<{ bulls: number; cows: number } | null>(null);
  const [computerAI] = useState(() => new ComputerAI());
  const [computerThinking, setComputerThinking] = useState(false);
  const [playerWaitingForFeedback, setPlayerWaitingForFeedback] = useState(false);
  const { toast } = useToast();
  const [showPlayerSecretNumber, setShowPlayerSecretNumber] = useState(mode === 'computer');
  
  // Update local state when props change (e.g., when loading from localStorage)
  useEffect(() => {
    if (initialPlayerHistory) setPlayerGuessHistory(initialPlayerHistory);
    if (initialOpponentHistory) setOpponentGuessHistory(initialOpponentHistory);
  }, [initialPlayerHistory, initialOpponentHistory]);

  // Keep parent component updated with the latest history
  useEffect(() => {
    onGuessHistoryUpdate(playerGuessHistory, opponentGuessHistory);
  }, [playerGuessHistory, opponentGuessHistory, onGuessHistoryUpdate]);

  // Check for win condition
  useEffect(() => {
    // Check if player won
    const playerLastGuess = playerGuessHistory[playerGuessHistory.length - 1];
    if (playerLastGuess && playerLastGuess.bulls === 4) {
      onGameOver('player');
    }
    
    // Check if opponent won
    const opponentLastGuess = opponentGuessHistory[opponentGuessHistory.length - 1];
    if (opponentLastGuess && opponentLastGuess.bulls === 4) {
      onGameOver('opponent');
    }
  }, [playerGuessHistory, opponentGuessHistory, onGameOver]);

  // Computer's turn logic
  useEffect(() => {
    if (mode === 'computer' && !playerTurn && !playerWaitingForFeedback) {
      // Add a small delay to make it feel more realistic
      setComputerThinking(true);
      const timeout = setTimeout(() => {
        makeComputerGuess();
        setComputerThinking(false);
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [mode, playerTurn, playerWaitingForFeedback]);

  const handlePlayerGuess = () => {
    if (!currentGuess) {
      toast({
        title: "Missing number",
        description: "Please enter your guess.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidGuess(currentGuess)) {
      toast({
        title: "Invalid guess",
        description: "Your guess must be 4 digits (1-9) with no repeating digits.",
        variant: "destructive",
      });
      return;
    }

    // Calculate feedback for the player's guess
    const feedback = calculateFeedback(opponentSecretNumber, currentGuess);
    
    // Update player's guess history
    const updatedPlayerHistory = [...playerGuessHistory, {
      guess: currentGuess,
      bulls: feedback.bulls,
      cows: feedback.cows
    }];
    setPlayerGuessHistory(updatedPlayerHistory);
    
    // Clear the current guess
    setCurrentGuess("");
    
    // Check if player won
    if (feedback.bulls === 4) {
      // Player guessed correctly
      return; // The effect will handle the game over state
    }
    
    // Switch to opponent's turn
    setPlayerTurn(false);
    
    if (mode === 'two-player') {
      // In two-player mode, we just switch turns
      toast({
        title: "Player 2's turn",
        description: "Pass the device to Player 2",
      });
    }
  };

  const makeComputerGuess = () => {
    // Get the computer's guess
    const computerGuess = computerAI.makeGuess();
    
    // Calculate feedback for the computer's guess
    const feedback = calculateFeedback(playerSecretNumber, computerGuess);
    
    // Update computer's guess history
    const updatedOpponentHistory = [...opponentGuessHistory, {
      guess: computerGuess,
      bulls: feedback.bulls,
      cows: feedback.cows
    }];
    setOpponentGuessHistory(updatedOpponentHistory);
    
    // Update AI with the feedback to improve next guess
    computerAI.updatePossibilities(computerGuess, feedback.cows, feedback.bulls);

    // Show the computer's guess to the player
    toast({
      title: "Computer's guess",
      description: `The computer guessed: ${computerGuess}`,
    });

    // Check if computer won
    if (feedback.bulls === 4) {
      // Computer guessed correctly
      return; // The effect will handle the game over state
    }
    
    // Switch back to player's turn
    setPlayerTurn(true);
  };

  const handleTwoPlayerOpponentGuess = () => {
    if (!currentGuess) {
      toast({
        title: "Missing number",
        description: "Please enter your guess.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidGuess(currentGuess)) {
      toast({
        title: "Invalid guess",
        description: "Your guess must be 4 digits (1-9) with no repeating digits.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate feedback for the opponent's guess
    const feedback = calculateFeedback(playerSecretNumber, currentGuess);
    
    // Update opponent's guess history
    const updatedOpponentHistory = [...opponentGuessHistory, {
      guess: currentGuess,
      bulls: feedback.bulls,
      cows: feedback.cows
    }];
    setOpponentGuessHistory(updatedOpponentHistory);
    
    // Clear the current guess
    setCurrentGuess("");
    
    // Switch back to player's turn
    setPlayerTurn(true);
    
    toast({
      title: "Player 1's turn",
      description: "Pass the device to Player 1",
    });
  };

  const handleFeedbackInput = (bulls: number, cows: number) => {
    if (bulls < 0 || bulls > 4 || cows < 0 || cows > 4 || (bulls + cows > 4)) {
      toast({
        title: "Invalid feedback",
        description: "The sum of bulls and cows cannot exceed 4",
        variant: "destructive",
      });
      return;
    }
    
    // Get the last computer guess
    const lastGuess = opponentGuessHistory[opponentGuessHistory.length - 1].guess;
    
    // Update the computer's last guess with the correct feedback
    const updatedOpponentHistory = [...opponentGuessHistory];
    updatedOpponentHistory[opponentGuessHistory.length - 1] = {
      ...updatedOpponentHistory[opponentGuessHistory.length - 1],
      bulls,
      cows
    };
    setOpponentGuessHistory(updatedOpponentHistory);
    
    // Update the AI with the feedback
    computerAI.updatePossibilities(lastGuess, cows, bulls);
    
    // Check if computer won
    if (bulls === 4) {
      // Computer guessed correctly
      onGameOver('opponent');
      return;
    }
    
    // Switch back to player's turn and clear feedback
    setPlayerWaitingForFeedback(false);
    setComputerFeedback(null);
    setPlayerTurn(true);
  };

  const togglePlayerSecretNumberVisibility = () => {
    setShowPlayerSecretNumber(!showPlayerSecretNumber);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {mode === 'computer' && (
        <div className="mb-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-center items-center gap-4">
          <h3 className="text-center font-medium">Your Secret Number</h3>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold ${showPlayerSecretNumber ? 'text-black' : 'text-gray-500'}`}>
              {showPlayerSecretNumber ? playerSecretNumber : '****'}
            </span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={togglePlayerSecretNumberVisibility}
              className="text-cowbulls-brown"
            >
              {showPlayerSecretNumber ? <EyeOff size={20} /> : <Eye size={20} />}
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player's guess area */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">
            {playerTurn ? (
              <span className="text-cowbulls-green">Your Turn</span>
            ) : (
              <span className="text-gray-500">Waiting...</span>
            )}
          </h2>

          {playerTurn && (
            <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-center font-medium">Guess your opponent's number</h3>
              
              <div className="flex justify-center">
                <NumberInput 
                  onComplete={setCurrentGuess}
                  isDisabled={!playerTurn}
                  autofocus={playerTurn}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handlePlayerGuess}
                  disabled={!playerTurn || !currentGuess}
                  className="bg-cowbulls-orange hover:bg-cowbulls-brown"
                >
                  Submit Guess
                </Button>
              </div>
            </div>
          )}

          <GuessHistory 
            history={playerGuessHistory} 
            label="Your Guesses" 
          />
        </div>

        {/* Opponent's guess area */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center">
            {!playerTurn ? (
              <span className="text-cowbulls-orange">
                {mode === 'computer' 
                  ? computerThinking 
                    ? 'Computer is thinking...' 
                    : 'Computer\'s Turn'
                  : 'Player 2\'s Turn'
                }
              </span>
            ) : (
              <span className="text-gray-500">Waiting...</span>
            )}
          </h2>

          {!playerTurn && mode === 'two-player' && (
            <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-center font-medium">Guess your opponent's number</h3>
              
              <div className="flex justify-center">
                <NumberInput 
                  onComplete={setCurrentGuess}
                  isDisabled={playerTurn}
                  autofocus={!playerTurn}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleTwoPlayerOpponentGuess}
                  disabled={playerTurn || !currentGuess}
                  className="bg-cowbulls-blue hover:bg-cowbulls-brown"
                >
                  Submit Guess
                </Button>
              </div>
            </div>
          )}

          {playerWaitingForFeedback && mode === 'computer' && (
            <div className="space-y-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
              <h3 className="text-center font-medium">
                Please provide feedback for the computer's guess
              </h3>
              
              <div className="flex justify-center items-center gap-6">
                <div>
                  <p className="text-sm text-center mb-1">Bulls</p>
                  <select 
                    className="p-2 border rounded-md"
                    value={computerFeedback?.bulls || 0}
                    onChange={(e) => setComputerFeedback(prev => ({ 
                      bulls: parseInt(e.target.value), 
                      cows: prev?.cows || 0 
                    }))}
                  >
                    {Array.from({length: 5}, (_, i) => (
                      <option key={`bulls-${i}`} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-sm text-center mb-1">Cows</p>
                  <select 
                    className="p-2 border rounded-md"
                    value={computerFeedback?.cows || 0}
                    onChange={(e) => setComputerFeedback(prev => ({ 
                      bulls: prev?.bulls || 0, 
                      cows: parseInt(e.target.value) 
                    }))}
                  >
                    {Array.from({length: 5}, (_, i) => (
                      <option key={`cows-${i}`} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={() => handleFeedbackInput(
                    computerFeedback?.bulls || 0,
                    computerFeedback?.cows || 0
                  )}
                  className="bg-cowbulls-blue hover:bg-cowbulls-brown"
                >
                  Submit Feedback
                </Button>
              </div>
            </div>
          )}

          <GuessHistory 
            history={opponentGuessHistory} 
            label={mode === 'computer' ? "Computer's Guesses" : "Player 2's Guesses"}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
