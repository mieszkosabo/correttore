import { ParserWithExtensions } from "../utils";
import { EmailValidator } from "./email";

export type MinLengthValidator = {
  minLength: (
    v: number
  ) => ParserWithExtensions<typeof minLength, [EmailValidator]>;
};

export const minLength = (minLength: number) => ({
  parse(arg: string): string {
    if (arg.length < minLength) {
      throw new Error(`Value is too short!`);
    }
    return arg;
  },
});
