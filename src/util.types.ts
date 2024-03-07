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
