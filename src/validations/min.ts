import { ParserWithExtensions } from "../utils";
import { MaxValidator } from "./max";

export type MinValidator = {
  min: (v: number) => ParserWithExtensions<typeof min, [MaxValidator]>;
};

export const min = (v: number) => ({
  parse(arg: number): number {
    if (arg < v) {
      throw new Error(`Value is too small!`);
    }
    return arg;
  },
});
