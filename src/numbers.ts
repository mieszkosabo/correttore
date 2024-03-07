export const gt = (min: number) => ({
  name: "gt" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg <= min)
      throw new Error(`${arg} is smaller than or equal to ${min}.`);
    return arg;
  },
});

export const gte = (min: number) => ({
  name: "gte" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg < min) throw new Error(`${arg} is smaller than ${min}.`);
    return arg;
  },
});

export const lt = (max: number) => ({
  name: "lt" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg >= max)
      throw new Error(`${arg} is greater than or equal to ${max}.`);
    return arg;
  },
});

export const lte = (max: number) => ({
  name: "lte" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg > max) throw new Error(`${arg} is greater than ${max}.`);
    return arg;
  },
});

export const int = () => ({
  name: "int" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (!Number.isInteger(arg)) throw new Error(`${arg} is not an integer.`);
    return arg;
  },
});

export const positive = () => ({
  name: "positive" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg <= 0) throw new Error(`${arg} is not a positive number.`);
    return arg;
  },
});

export const nonnegative = () => ({
  name: "nonnegative" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg < 0) throw new Error(`${arg} is not a non-negative number.`);
    return arg;
  },
});

export const negative = () => ({
  name: "negative" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg >= 0) throw new Error(`${arg} is not a negative number.`);
    return arg;
  },
});

export const nonpositive = () => ({
  name: "nonpositive" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg > 0) throw new Error(`${arg} is not a non-positive number.`);
    return arg;
  },
});

export const multipleOf = (multiple: number) => ({
  name: "multipleOf" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg % multiple !== 0)
      throw new Error(`${arg} is not a multiple of ${multiple}.`);
    return arg;
  },
});

export const finite = () => ({
  name: "finite" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (!isFinite(arg)) throw new Error(`${arg} is not a finite number.`);
    return arg;
  },
});

export const safe = () => ({
  name: "safe" as const,
  $inputType: "number" as unknown as number,
  $outputType: "number" as unknown as number,
  parse: (arg: number) => {
    if (arg < Number.MIN_SAFE_INTEGER || arg > Number.MAX_SAFE_INTEGER) {
      throw new Error(`${arg} is not a safe number.`);
    }
    return arg;
  },
});
