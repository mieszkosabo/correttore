import { ParserWithExtensions } from "../utils";
import { MinLengthValidator } from "./minLength";

export type EmailValidator = {
  email: () => ParserWithExtensions<typeof email, [MinLengthValidator]>;
};

export const email = () => ({
  parse(arg: string): string {
    // just a silly check
    if (!arg.includes("@")) {
      throw new Error("Not an email!");
    }
    return arg;
  },
});
