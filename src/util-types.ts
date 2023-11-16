export type Entries<Obj> = ValueOf<{
  [Key in keyof Obj]: [Key, Obj[Key]];
}>;

export type ValueOf<T> = T[keyof T];

export type FromEntries<Entries extends [any, any]> = {
  [Val in Entries as Val[0]]: Val[1];
};

export type PickByValue<Obj, Condition> = FromEntries<
  Extract<Entries<Obj>, [any, Condition]>
>;

export type OmitByValue<T, Omitted> = FromEntries<
  Exclude<Entries<T>, [any, Omitted]>
>;

export type AnyFunction = (...args: any[]) => any;

export type ValidatorFn = AnyFunction;
export type Parser<T = any> = { parse: ValidatorFn };

export type Validator<
  fromType,
  toType,
  params extends any[] = []
> = params extends []
  ? () => (arg: fromType) => toType
  : (...params: params) => (arg: fromType) => toType;

export type Infer<T extends Parser> = ReturnType<T["parse"]>;
