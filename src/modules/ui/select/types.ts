export type SelectOptionValue = Record<string, unknown>;

export type SelectProps<
  Option extends SelectOptionValue,
  isMulti extends boolean = false
> = {
  options: Option[];
  value: isMulti extends true ? Option[] : Option | null;
  onChange: isMulti extends true
    ? (value: Option[]) => void
    : (value: Option) => void;
  renderSelected: ((option: Option) => React.ReactNode) | keyof Option;
  renderOption: ((option: Option) => React.ReactNode) | keyof Option;
  isMulti?: isMulti;
  searchBy?: keyof Option | (keyof Option)[];
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
};

export type SelectListProps<
  Option extends SelectOptionValue,
  isMulti extends boolean = false
> = {
  setOpen: (open: boolean) => void;
} & SelectProps<Option, isMulti>;

export type RenderOptionSelectedProps<
  Option extends SelectOptionValue,
  isMulti extends boolean
> = Pick<
  SelectProps<Option, isMulti>,
  "renderSelected" | "isMulti" | "placeholder" | "value"
>;
