export type Validator<Input, Output> = {
  name: string;
  $inputType: Input;
  $outputType: Output;
  processChain?: (chain: Validator<any, any> | null) => Validator<any, any>[];
  parse: (arg: Input) => Output;
};

export type Infer<Schema extends Validator<any, any>> = Schema["$outputType"];
