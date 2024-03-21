export type Validator<Input, Output> = {
  name: string;
  $inputType: Input;
  $outputType: Output;
  processChain?: (chain: Validator<any, any> | null) => Validator<any, any>[];
  nonCallable?: true;
  parse: (arg: Input) => Output;
};

export type Infer<Schema extends Validator<any, any>> = Schema["$outputType"];

export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;
