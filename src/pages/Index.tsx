
import { useState, useEffect } from "react";
import GameHeader from "@/components/GameHeader";
import GameSetup from "@/components/GameSetup";
import GamePlay from "@/components/GamePlay";
import RulesDialog from "@/components/RulesDialog";
import VictoryDialog from "@/components/VictoryDialog";
import PlayerNameInput from "@/components/PlayerNameInput";
import { 
  GameHistory, 
  GameState,
  clearGameState,
  loadGameState, 
  saveGameState 
} from "@/utils/gameUtils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showRules, setShowRules] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [playerName, setPlayerName] = useState<string>('');
  const { toast } = useToast();

  // Load saved game state on component mount
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setGameState(savedState);
      
      // If the game was already over, show the victory dialog
      if (savedState.gameOver && savedState.winner) {
        setShowVictory(true);
      }
    }
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState) {
      saveGameState(gameState);
    }
  }, [gameState]);

  const handleStartGame = (mode: 'two-player' | 'computer', playerNumber: string, opponentNumber: string) => {
    const newGameState: GameState = {
      mode,
      playerName,
      playerSecretNumber: playerNumber,
      opponentSecretNumber: opponentNumber,
      playerGuessHistory: [],
      opponentGuessHistory: [],
      currentTurn: 'player',
      gameOver: false,
      winner: null
    };
    
    setGameState(newGameState);
    toast({
      title: "Game started!",
      description: mode === 'two-player' 
        ? "Player 1 goes first" 
        : "Make your first guess",
    });
  };

  const handleGameOver = (winner: 'player' | 'opponent') => {
    setGameState(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        gameOver: true,
        winner
      };
    });
    
    setShowVictory(true);
  };

  const handleGuessHistoryUpdate = (
    playerGuessHistory: GameHistory[], 
    opponentGuessHistory: GameHistory[]
  ) => {
    setGameState(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        playerGuessHistory,
        opponentGuessHistory,
        currentTurn: playerGuessHistory.length <= opponentGuessHistory.length ? 'player' : 'opponent'
      };
    });
  };

  const handlePlayAgain = () => {
    setShowVictory(false);
    
    // Reset the game with the same mode and new random numbers
    if (gameState) {
      handleStartGame(
        gameState.mode, 
        gameState.playerSecretNumber, 
        gameState.opponentSecretNumber
      );
    }
  };

  const handleNewGame = () => {
    setShowVictory(false);
    setGameState(null);
    clearGameState();
  };

  return (
    <div className="min-h-screen bg-cowbulls-cream p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <GameHeader 
          onOpenRules={() => setShowRules(true)} 
          onRestart={handleNewGame} 
        />
        
        <main className="mt-8">
          {!playerName ? (
            <PlayerNameInput onNameSubmit={setPlayerName} />
          ) : !gameState ? (
            <GameSetup onStartGame={handleStartGame} />
          ) : (
            <GamePlay 
              mode={gameState.mode}
              playerName={gameState.playerName}
              playerSecretNumber={gameState.playerSecretNumber}
              opponentSecretNumber={gameState.opponentSecretNumber}
              onGameOver={handleGameOver}
              playerGuessHistory={gameState.playerGuessHistory}
              opponentGuessHistory={gameState.opponentGuessHistory}
              onGuessHistoryUpdate={handleGuessHistoryUpdate}
            />
          )}
        </main>
        
        <RulesDialog 
          open={showRules} 
          onOpenChange={setShowRules} 
        />
        
        {gameState && gameState.winner && (
          <VictoryDialog 
            open={showVictory}
            onOpenChange={setShowVictory}
            winner={gameState.winner}
            secretNumber={gameState.opponentSecretNumber}
            guessCount={gameState.playerGuessHistory.length}
            opponentGuessCount={gameState.opponentGuessHistory.length}
            onPlayAgain={handlePlayAgain}
            onNewGame={handleNewGame}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
