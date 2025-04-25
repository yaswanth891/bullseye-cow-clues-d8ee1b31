
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateRandomNumber, isValidGuess } from "@/utils/gameUtils";
import NumberInput from "./NumberInput";
import { useToast } from "@/hooks/use-toast";

interface GameSetupProps {
  onStartGame: (mode: 'two-player' | 'computer', playerNumber: string, opponentNumber: string) => void;
}

const GameSetup = ({ onStartGame }: GameSetupProps) => {
  const [mode, setMode] = useState<'two-player' | 'computer'>('two-player');
  const [playerNumber, setPlayerNumber] = useState("");
  const [player2Number, setPlayer2Number] = useState("");
  const [showPlayer2Input, setShowPlayer2Input] = useState(false);
  const { toast } = useToast();

  const handleRandomNumber = (forPlayer = true) => {
    const randomNum = generateRandomNumber();
    if (forPlayer) {
      setPlayerNumber(randomNum);
    } else {
      setPlayer2Number(randomNum);
    }
  };

  const handleStartGame = () => {
    if (!playerNumber) {
      toast({
        title: "Missing number",
        description: "Please enter your secret number or generate one randomly.",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'two-player' && !player2Number) {
      toast({
        title: "Missing number",
        description: "Please enter Player 2's secret number or generate one randomly.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidGuess(playerNumber)) {
      toast({
        title: "Invalid number",
        description: "Your number must be 4 digits (1-9) with no repeating digits.",
        variant: "destructive",
      });
      return;
    }

    if (mode === 'two-player' && !isValidGuess(player2Number)) {
      toast({
        title: "Invalid number",
        description: "Player 2's number must be 4 digits (1-9) with no repeating digits.",
        variant: "destructive",
      });
      return;
    }

    // For computer mode, generate a random number for the computer
    const opponentNumber = mode === 'computer' 
      ? generateRandomNumber()
      : player2Number;
    
    onStartGame(mode, playerNumber, opponentNumber);
  };

  const handleModeChange = (value: string) => {
    setMode(value as 'two-player' | 'computer');
    setPlayer2Number("");
    setShowPlayer2Input(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-cowbulls-brown/30 bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-cowbulls-brown">Game Setup</CardTitle>
          <CardDescription>Choose game mode and enter your secret number</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="two-player" onValueChange={handleModeChange}>
            <TabsList className="w-full mb-6">
              <TabsTrigger className="w-1/2" value="two-player">2-Player Mode</TabsTrigger>
              <TabsTrigger className="w-1/2" value="computer">Computer Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="two-player" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-center mb-2 font-medium">Player 1's Secret Number</h3>
                  <NumberInput 
                    onComplete={setPlayerNumber} 
                    label="Enter a 4-digit number (1-9, no repeats)" 
                    autofocus
                  />
                </div>
                
                {!showPlayer2Input ? (
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={() => setShowPlayer2Input(true)}
                      className="bg-cowbulls-orange hover:bg-cowbulls-brown"
                    >
                      Continue
                    </Button>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <h3 className="text-center mb-2 font-medium">Player 2's Secret Number</h3>
                    <NumberInput 
                      onComplete={setPlayer2Number}
                      label="Enter a 4-digit number (1-9, no repeats)"
                    />
                    <div className="mt-2 flex justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => handleRandomNumber(false)}
                        className="text-sm border-cowbulls-brown"
                      >
                        Random Number
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="computer" className="space-y-6">
              <div>
                <h3 className="text-center mb-2 font-medium">Your Secret Number</h3>
                <NumberInput 
                  onComplete={setPlayerNumber} 
                  label="Enter a 4-digit number (1-9, no repeats)"
                  autofocus
                />
                <div className="mt-2 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => handleRandomNumber(true)}
                    className="text-sm border-cowbulls-brown"
                  >
                    Random Number
                  </Button>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">
                <p>The computer will generate its own secret number.</p>
                <p>You'll take turns guessing each other's numbers.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter>
          <Button 
            onClick={handleStartGame}
            className="w-full bg-cowbulls-orange hover:bg-cowbulls-brown"
          >
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GameSetup;
