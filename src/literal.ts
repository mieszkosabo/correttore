import { Fn } from "hotscript";
import { Primitive } from "./shared.types";

interface Literal extends Fn {
  return: this["arg1"];
}

export const literal = <P extends Primitive>(lit: P) => ({
  name: "literal" as const,
  $inputType: "root" as unknown as unknown,
  $outputType: "general" as unknown as Literal,
  parse: (arg: unknown) => {
    if (lit !== arg) {
      throw new Error(`${String(arg)} does not match ${String(lit)}`);
    }

    return arg;
  },
});
