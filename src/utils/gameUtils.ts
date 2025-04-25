
// Validation functions
export const isValidGuess = (guess: string): boolean => {
  if (guess.length !== 4) return false;
  if (!/^[1-9]{4}$/.test(guess)) return false;
  
  // Check for repeated digits
  const digitSet = new Set(guess.split(''));
  return digitSet.size === 4;
};

export const generateRandomNumber = (): string => {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const shuffled = [...digits].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4).join('');
};

export const calculateFeedback = (secretNumber: string, guess: string): { bulls: number; cows: number } => {
  let bulls = 0;
  let cows = 0;

  // Convert strings to arrays for easier manipulation
  const secretArray = secretNumber.split('');
  const guessArray = guess.split('');

  // Count bulls (correct digit in correct position)
  for (let i = 0; i < 4; i++) {
    if (guessArray[i] === secretArray[i]) {
      bulls++;
      // Mark processed digits to avoid counting them as cows
      secretArray[i] = 'x';
      guessArray[i] = 'y';
    }
  }

  // Count cows (correct digit in wrong position)
  for (let i = 0; i < 4; i++) {
    if (guessArray[i] !== 'y') {
      const index = secretArray.indexOf(guessArray[i]);
      if (index !== -1) {
        cows++;
        secretArray[index] = 'x';
      }
    }
  }

  return { bulls, cows };
};

// Computer AI strategy implementation
type Permutation = string;

export class ComputerAI {
  private possibleNumbers: Permutation[];
  
  constructor() {
    this.possibleNumbers = this.generateAllPossibleNumbers();
  }

  private generateAllPossibleNumbers(): Permutation[] {
    const result: Permutation[] = [];
    
    // Generate all 4-digit numbers with no repeats and no zeros
    for (let i = 1000; i <= 9999; i++) {
      const numStr = i.toString();
      if (numStr.includes('0')) continue;
      
      const digitSet = new Set(numStr);
      if (digitSet.size === 4) {
        result.push(numStr);
      }
    }
    
    return result;
  }

  // Return the number of possibilities left
  public getPossibilitiesCount(): number {
    return this.possibleNumbers.length;
  }

  // Make a guess based on current possibilities
  public makeGuess(): string {
    const randomIndex = Math.floor(Math.random() * this.possibleNumbers.length);
    return this.possibleNumbers[randomIndex];
  }

  // Update possibilities based on feedback
  public updatePossibilities(guess: string, cows: number, bulls: number): void {
    this.possibleNumbers = this.possibleNumbers.filter(candidate => {
      const feedback = calculateFeedback(candidate, guess);
      return feedback.cows === cows && feedback.bulls === bulls;
    });
  }

  // Reset the AI
  public reset(): void {
    this.possibleNumbers = this.generateAllPossibleNumbers();
  }
}

// Save and load game state
export interface GameHistory {
  guess: string;
  bulls: number;
  cows: number;
}

export interface GameState {
  mode: 'two-player' | 'computer';
  playerSecretNumber: string;
  opponentSecretNumber: string;
  playerGuessHistory: GameHistory[];
  opponentGuessHistory: GameHistory[];
  currentTurn: 'player' | 'opponent';
  gameOver: boolean;
  winner: 'player' | 'opponent' | null;
}

export const saveGameState = (state: GameState): void => {
  localStorage.setItem('cowsbulls_gamestate', JSON.stringify(state));
};

export const loadGameState = (): GameState | null => {
  const savedState = localStorage.getItem('cowsbulls_gamestate');
  return savedState ? JSON.parse(savedState) : null;
};

export const clearGameState = (): void => {
  localStorage.removeItem('cowsbulls_gamestate');
};
