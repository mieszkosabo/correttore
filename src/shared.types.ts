export type Validator<Input, Output> = {
  name: string;
  $inputType: Input;
  $outputType: Output;
  parse: (arg: Input) => Output;
};

export type Infer<Schema extends Validator<any, any>> = Schema["$outputType"];
