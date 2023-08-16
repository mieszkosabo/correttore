import { ParserWithExtensions } from "../utils";
import { MaxValidator } from "../validations/max";
import { MinValidator } from "../validations/min";

function isNumber(x: unknown): asserts x is number {
  if (typeof x !== "number") {
    throw new Error("Not a number!");
  }
}

export type NumberParser = ParserWithExtensions<
  number,
  [MinValidator, MaxValidator]
>;

export const number = () => ({
  parse(arg: unknown): number {
    isNumber(arg);
    return arg;
  },
});
