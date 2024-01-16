import { Dispatch, ReactNode, SetStateAction } from "react";

export type SelectOptionValue = Record<string, unknown>;

export type SelectProps<
  Option extends SelectOptionValue,
  isMulti extends boolean
> = {
  options: Option[];
  value: isMulti extends true ? Option[] : Option | null;
  onChange: (value: isMulti extends true ? Option[] : Option) => void;
  renderSelected:
    | ((option: Option, handleDelete: (option: Option) => void) => ReactNode)
    | keyof Option;
  renderOption: ((option: Option) => ReactNode) | keyof Option;
  isMulti?: isMulti;
  searchBy?: keyof Option | (keyof Option)[];
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  listType?: "popover" | "drawer";
};

export type SelectButtonProps = {
  className?: string;
  open: boolean;
  getRenderSelected: () => ReactNode;
};

export type SelectListProps<
  Option extends SelectOptionValue,
  isMulti extends boolean = false
> = {
  getOptionValue: (option: Option, index: number) => string;
  getRenderOption: (option: Option) => ReactNode;
  handleOptionChange: (newValue: string) => void;
} & Pick<
  SelectProps<Option, isMulti>,
  "options" | "value" | "searchBy" | "searchPlaceholder"
>;

export type SelectOptionChangeProps<
  Option extends SelectOptionValue,
  isMulti extends boolean
> = {
  setOpen: Dispatch<SetStateAction<boolean>>;
} & Pick<
  SelectProps<Option, isMulti>,
  "value" | "onChange" | "options" | "isMulti" | "searchBy"
>;

export type SelectConfig = {
  triggerClassName?: string;
  triggerContainer?: string;
  triggerPlaceholder?: string;
  triggerChevronIcon?: ({ open }: { open: boolean }) => ReactNode;

  optionClassName?: string;
  optionSelectedClassName?: string;
  optionIcon?: ({ isSelected }: { isSelected: boolean }) => ReactNode;

  searchClassName?: string;
  searchPlaceholder?: string;

  emptyClassName?: string;
  emptyPlaceholder?: string;

  popoverClassName?: string;
  drawerClassName?: string;

  listClassName?: string;
};
