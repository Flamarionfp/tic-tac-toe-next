"use client";
import { useState, useEffect, useCallback } from "react";
import { Board } from "@/components/board";
import { CurrentPlayer } from "@/types/player";
import { Positions } from "@/types/board";
import { WinnerModal } from "@/components/winner-modal";
import { Symbol } from "@/types/player";

const getInitialPositions = (): Positions => {
  const DIMENSIONS = 3;
  const positions: Positions = [];

  for (let i = 0; i < DIMENSIONS; i++) {
    positions.push(new Array(DIMENSIONS).fill(null));
  }

  return positions;
};

async function getIaPlay(
  positions: Positions
): Promise<{ aiNextPlay: number[] }> {
  const response = await fetch(
    "https://tic-tac-toe-atpe.onrender.com/ai/next-play",
    {
      method: "POST",
      body: JSON.stringify({ board: positions, iaSymbol: "o" }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();

  return data;
}

async function verifyIsValidPlay(
  row: number,
  column: number,
  positions: Positions
): Promise<boolean> {
  const response = await fetch(
    "https://tic-tac-toe-atpe.onrender.com/play/verify",
    {
      method: "POST",
      body: JSON.stringify({ board: positions, row, column }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const { isValidPlay = false } = await response.json();

  return isValidPlay;
}

async function verifyGameover(
  currentPlayerSymbol: string,
  positions: Positions
) {
  const response = await fetch(
    "https://tic-tac-toe-atpe.onrender.com/game/verify-game-over",
    {
      method: "POST",
      body: JSON.stringify({ board: positions, currentPlayerSymbol }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const { gameover = false, winner = null } = await response.json();

  return { gameover, winner };
}

const players: CurrentPlayer[] = [
  {
    symbol: "x",
    color: "#30c4bd",
    ia: false,
  },
  {
    symbol: "o",
    color: "#f3b236",
    ia: true,
  },
];

export default function Home() {
  const initialPositions = getInitialPositions();
  const [positions, setPositions] = useState<Positions>(initialPositions);
  const [gameover, setGameover] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayer>(players[0]);
  const [isProcessingPlay, setIsProcessingPlay] = useState(false);
  const [winnerSymbol, setWinnerSymbol] = useState<Symbol>();

  const handleRestartGame = () => {
    setPositions(initialPositions);
    setGameover(false);
  };

  const handleVerifyGameover = useCallback(async () => {
    if (gameover) return;

    try {
      const { gameover, winner } = await verifyGameover(
        currentPlayer.symbol === "x" ? "o" : "x",
        positions
      );

      if (gameover) {
        setWinnerSymbol(winner);
        setGameover(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentPlayer.symbol, gameover, positions]);

  const onPlay = (i: number, j: number, symbol: string) => {
    setPositions((prev) => {
      const newPositions = [...prev];
      newPositions[i][j] = symbol;
      return newPositions;
    });
  };

  const handlePlayerPlay = async (row: number, column: number) => {
    if (gameover || currentPlayer.ia) return;

    try {
      const isValidPlay = await verifyIsValidPlay(row, column, positions);

      if (!isValidPlay) {
        throw new Error("Invalid play");
      }

      onPlay(row, column, "x");

      setCurrentPlayer(players[1]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessingPlay(false);
    }
  };

  const handleIAPlay = useCallback(async () => {
    if (!currentPlayer.ia) return;

    try {
      setIsProcessingPlay(true);
      const { aiNextPlay = [] } = await getIaPlay(positions);
      const [rowToPlay, columToPlay] = aiNextPlay;

      onPlay(rowToPlay, columToPlay, "o");

      setCurrentPlayer(players[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessingPlay(false);
    }
  }, [currentPlayer.ia, positions]);

  useEffect(() => {
    handleVerifyGameover();
  }, [handleVerifyGameover]);

  useEffect(() => {
    handleIAPlay();
  }, [handleIAPlay]);

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#1e1f29]">
      {gameover ? (
        <WinnerModal winner={winnerSymbol} handleContinue={handleRestartGame} />
      ) : (
        <Board
          isProcessingPlay={isProcessingPlay}
          currentPlayer={currentPlayer}
          positions={positions}
          handlePlayerPlay={handlePlayerPlay}
          handleRestartGame={handleRestartGame}
        />
      )}
    </div>
  );
}
