export const min = (minDate: Date) => ({
  name: "min" as const,
  $inputType: "Date" as unknown as Date,
  $outputType: "Date" as unknown as Date,
  parse: (arg: Date) => {
    if (arg < minDate) throw new Error(`${arg} is earlier than ${minDate}.`);
    return arg;
  },
});

export const max = (maxDate: Date) => ({
  name: "max" as const,
  $inputType: "Date" as unknown as Date,
  $outputType: "Date" as unknown as Date,
  parse: (arg: Date) => {
    if (arg > maxDate) throw new Error(`${arg} is later than ${maxDate}.`);
    return arg;
  },
});
