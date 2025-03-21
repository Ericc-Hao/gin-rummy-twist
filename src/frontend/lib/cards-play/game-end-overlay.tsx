// components/GameOverOverlay.tsx
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { decimalToDozenal } from "@/components/count-dozenal"; // 你自己已有的函数

interface GameOverOverlayProps {
  isWin: boolean;
  p1TotalScore: number;
  p2TotalScore: number;
  onReturn?: () => void; // 可选，支持自定义跳转逻辑
}

export default function GameOverOverlay({ isWin, p1TotalScore, p2TotalScore, onReturn }: GameOverOverlayProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex flex-col items-center justify-center text-white text-center px-4 pointer-events-auto">
      <h1 className="text-5xl font-extrabold mb-6">
        {isWin ? "🎉 You Win the Game!" : "😢 You Lose the Game!"}
      </h1>
      <p className="text-lg mb-6">
        {/* Final Score: {decimalToDozenal(p1TotalScore)} - {decimalToDozenal(p2TotalScore)} */}
      </p>
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
  );
}
