import { ParserWithExtensions } from "../utils";
import { MinValidator } from "./min";

export type MaxValidator = {
  max: (v: number) => ParserWithExtensions<typeof max, [MinValidator]>;
};

export const max = (v: number) => ({
  parse(arg: number): number {
    if (arg > v) {
      throw new Error(`Value is too big!`);
    }
    return arg;
  },
});
