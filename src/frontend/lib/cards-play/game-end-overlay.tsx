'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ScoreRound {
  round: number;
  p1Score?: number;
  p1Bonus?: number;
  p1Total?: number;
  p2Score?: number;
  p2Bonus?: number;
  p2Total?: number;
  result?: string;
}

interface ScoreSummary {
  rounds: ScoreRound[];
  p1TotalScore: number;
  p2TotalScore: number;
}

interface GameOverOverlayProps {
  isWin: boolean;
  p1TotalScore: number;
  p2TotalScore: number;
  onReturn?: () => void;
  scoreSummary: ScoreSummary;
  host: string;
  whosTurn: string;
  roomId: string;
  decimalToDozenal: (num: number) => string;
}

export default function GameOverOverlay({
  isWin,
  p1TotalScore,
  p2TotalScore,
  onReturn,
  scoreSummary,
  host,
  whosTurn,
  roomId,
  decimalToDozenal,
}: GameOverOverlayProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex flex-col items-center justify-center text-white text-center px-4 pointer-events-auto overflow-y-auto">
      <h1 className="text-5xl font-extrabold mb-6">
        {isWin ? "🎉 You Win the Game!" : "😢 You Lose the Game!"}
      </h1>

      {/* 表格内容 */}
      <div className="grid gap-4 py-4 bg-white rounded-xl text-black p-6 mt-6 max-w-full overflow-x-auto">
        <table className="w-full text-sm text-center border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th></th>
              <th colSpan={3}>
                {roomId === 'tutorial' ? 'Robot' : 'Opponent'}
              </th>
              <th colSpan={3}>You</th>
              <th></th>
            </tr>
            <tr>
              <th>Round</th>
              <th>Score</th>
              <th>Bonus</th>
              <th>Total</th>
              <th>Score</th>
              <th>Bonus</th>
              <th>Total</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {scoreSummary?.rounds.map((round, index) => (
              <tr key={index}>
                <td>{round.round}</td>
                <td>{decimalToDozenal(round.p1Score || 0)}</td>
                <td>{decimalToDozenal(round.p1Bonus || 0)}</td>
                <td>{decimalToDozenal(round.p1Total || 0)}</td>
                <td>{decimalToDozenal(round.p2Score || 0)}</td>
                <td>{decimalToDozenal(round.p2Bonus || 0)}</td>
                <td>{decimalToDozenal(round.p2Total || 0)}</td>
                <td>{round.result}</td>
              </tr>
            ))}
            <tr className="font-bold">
              <td>Total Score</td>
              <td></td>
              <td></td>
              <td>{decimalToDozenal(scoreSummary?.p1TotalScore || 0)}</td>
              <td></td>
              <td></td>
              <td>{decimalToDozenal(scoreSummary?.p2TotalScore || 0)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 按钮 */}
      <div className="mt-6">
        {onReturn ? (
          <Button className="w-[300px]" onClick={onReturn}>
            Return to Home
          </Button>
        ) : (
          <Link href="/home" passHref legacyBehavior>
            <a className="block w-[300px]">
              <Button className="w-full">Return to Home</Button>
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
