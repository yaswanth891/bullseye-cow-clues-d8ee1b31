
import { GameHistory } from "@/utils/gameUtils";

interface GuessHistoryProps {
  history: GameHistory[];
  label: string;
}

const GuessHistory = ({ history, label }: GuessHistoryProps) => {
  if (history.length === 0) {
    return (
      <div className="p-4 rounded-lg bg-white border border-gray-200">
        <h3 className="text-lg font-semibold mb-2">{label}</h3>
        <p className="text-center text-gray-500 italic py-4">No guesses yet</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-white border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <div className="overflow-y-auto max-h-[300px]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Guess</th>
              <th className="p-2 text-center">Bulls</th>
              <th className="p-2 text-center">Cows</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, index) => (
              <tr 
                key={index}
                className={index % 2 === 0 ? 'bg-gray-50' : ''}
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2 font-mono">{item.guess}</td>
                <td className="p-2 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-red-100 text-red-700 rounded-full">
                    {item.bulls}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-700 rounded-full">
                    {item.cows}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuessHistory;
