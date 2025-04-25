
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { History } from 'lucide-react';

interface PlayerNameInputProps {
  onNameSubmit: (name: string) => void;
}

const PlayerNameInput = ({ onNameSubmit }: PlayerNameInputProps) => {
  const [name, setName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <Label htmlFor="playerName" className="text-lg font-semibold text-cowbulls-brown">
            Enter Your Name
          </Label>
          <History className="w-6 h-6 text-cowbulls-brown" />
        </div>
        <Input
          id="playerName"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-cowbulls-brown/30"
          required
        />
        <button
          type="submit"
          className="w-full bg-cowbulls-orange hover:bg-cowbulls-brown text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default PlayerNameInput;
