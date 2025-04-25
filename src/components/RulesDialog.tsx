
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RulesDialog = ({ open, onOpenChange }: RulesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cowbulls-brown">How to Play Cows & Bulls</DialogTitle>
          <DialogDescription>
            A classic number guessing game with simple rules.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-1 text-cowbulls-brown">Objective:</h3>
            <p>Guess your opponent's 4-digit secret number before they guess yours!</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1 text-cowbulls-brown">Rules:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Secret numbers must be 4 digits long</li>
              <li>Only use digits 1-9 (no zeros)</li>
              <li>No repeated digits (each digit can only be used once)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1 text-cowbulls-brown">Feedback:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Bulls:</strong> Correct digits in the correct position</li>
              <li><strong>Cows:</strong> Correct digits in the wrong position</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1 text-cowbulls-brown">Example:</h3>
            <p>Secret number: <span className="font-mono">3456</span></p>
            <p>Guess: <span className="font-mono">3765</span></p>
            <p>Feedback: <span className="font-semibold">1 Bull</span> (digit 3) and <span className="font-semibold">2 Cows</span> (digits 5 and 6)</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1 text-cowbulls-brown">Game Modes:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>2-Player Mode:</strong> Play against a friend</li>
              <li><strong>Computer Mode:</strong> Play against the computer AI</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)} 
            className="bg-cowbulls-orange hover:bg-cowbulls-brown"
          >
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RulesDialog;
