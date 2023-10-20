import { Symbol } from "@/components/symbol";
import { Symbol as SymbolType } from "@/types/player";
import { Fragment } from "react";

interface GameProps {
  winner?: SymbolType;
  handleContinue(): void;
}
export const WinnerModal = ({ winner, handleContinue }: GameProps) => {
  return (
    <div className="bg-gray-900/90 z-10 min-h-screen w-full absolute top-0 left-0">
      <div className="w-[500px] h-[250px] rounded-xl bg-[#1f3540] space-y-10 px-6 py-4 mx-auto mt-52 flex items-center justify-center flex-col">
        <h2 className="flex flex-col items-center justify-center space-y-6 text-2xl md:text-4xl font-bold">
          {!!winner ? (
            <Fragment>
              <Symbol value={winner} />
              <p className="uppercase text-[#30c4bd]">Venceu!</p>
            </Fragment>
          ) : (
            <p className="uppercase text-white">Deu velha!</p>
          )}
        </h2>

        <div className="flex items-center justify-center space-x-16">
          <button
            onClick={handleContinue}
            className="button px-4 rounded-md py-1 bg-[#a8bdc8] hover:bg-[#718087] hover:ring-4 hover:ring-gray-400"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};
