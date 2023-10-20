import React from "react";
import { Symbol } from "../symbol";
import { RestartButton } from "../restart-button";
import { CurrentPlayer } from "@/types/player";

interface PlayerProp {
  isProcessingPlay: boolean;
  currentPlayer: CurrentPlayer;
  positions: Array<Array<string | null>>;
  handlePlayerPlay(row: number, column: number): void;
  handleRestartGame(): void;
}

interface SquareProp {
  value: JSX.Element | string | null;
  onClick(): void;
}

export const Board = ({
  isProcessingPlay,
  positions,
  currentPlayer,
  handlePlayerPlay,
  handleRestartGame,
}: PlayerProp) => {
  function Position({ value, onClick }: SquareProp) {
    return (
      <button
        className="square"
        onClick={onClick}
        disabled={isProcessingPlay ? true : false}
      >
        {value}
      </button>
    );
  }

  function value(row: number, column: number) {
    let value;
    if (positions[row][column] === "x") {
      value = <Symbol value="x" />;
    } else if (positions[row][column] === "o") {
      value = <Symbol value="o" />;
    } else {
      value = null;
    }

    return value;
  }

  const renderPosition = (row: number, column: number) => {
    return (
      <Position
        value={value(row, column)}
        onClick={() => handlePlayerPlay(row, column)}
      />
    );
  };

  return (
    <div>
      <div className="board">
        <h1 className="text-white text-2xl">Tic Tac Toe</h1>

        <div className="flex gap-2">
          <div className="text-white bg-gray-700 text-xl px-4 py-1 rounded-lg font-medium uppercase">
            Player{" "}
            <span className={`text-[#30c4bd] text-2xl font-bold`}>
              {currentPlayer.symbol.toUpperCase()}
            </span>
          </div>

          <div className="rounded-lg flex items-center space-x-10">
            <RestartButton onClick={handleRestartGame} />
          </div>
        </div>

        {positions.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((_, colIndex) => renderPosition(rowIndex, colIndex))}
          </div>
        ))}
      </div>
    </div>
  );
};
