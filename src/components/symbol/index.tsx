import React from "react";
import { SymbolProps } from "./symbol.types";

export const Symbol = ({ value }: SymbolProps) => {
  if (value === "x") {
    return (
      <div className="relative h-16 w-16 cursor-pointer ">
        <div className=" absolute origin-top-left rotate-[44deg] ml-2 -mt-[1px] bg-[#30c4bd] h-4 w-20 rounded-l-full rounded-r-full "></div>
        <div className="absolute origin-top-right -rotate-[42deg] -ml-[23px] bg-[#30c4bd] h-4 w-20 rounded-l-full rounded-r-full "></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-16 w-16 cursor-pointer">
      <div className=" h-8 w-8 ring-[18px] ring-[#f3b236] rounded-full"></div>
    </div>
  );
};
