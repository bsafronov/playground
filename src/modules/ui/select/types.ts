import { Dispatch, ReactNode, SetStateAction } from "react";

export type SelectOptionValue = Record<string, unknown>;

export type SelectProps<
  Option extends SelectOptionValue,
  isMulti extends boolean
> = {
  options: Option[];
  value: isMulti extends true ? Option[] : Option | null;
  onChange: (value: isMulti extends true ? Option[] : Option) => void;
  renderSelected: ((option: Option) => React.ReactNode) | keyof Option;
  renderOption: ((option: Option) => React.ReactNode) | keyof Option;
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
  getRenderSelected: () =>
    | string
    | number
    | boolean
    | React.JSX.Element
    | Iterable<React.ReactNode>
    | React.PromiseLikeOfReactNode
    | null
    | undefined;
};
export type SelectListProps<
  Option extends SelectOptionValue,
  isMulti extends boolean = false
> = {
  getOptionValue: (option: Option, index: number) => string;
  getRenderOption: (option: Option) => React.ReactNode;
  handleOptionChange: (newValue: string) => void;
} & Pick<
  SelectProps<Option, isMulti>,
  "options" | "value" | "searchBy" | "searchPlaceholder"
>;

export type SelectRenderOptionSelectedProps<
  Option extends SelectOptionValue,
  isMulti extends boolean
> = Pick<
  SelectProps<Option, isMulti>,
  "renderSelected" | "isMulti" | "placeholder" | "value"
>;

export type SelectRenderOptionProps<
  Option extends SelectOptionValue,
  isMulti extends boolean
> = Pick<SelectProps<Option, isMulti>, "renderOption">;

export type SelectOptionValueProps<
  Option extends SelectOptionValue,
  isMulti extends boolean
> = Pick<SelectProps<Option, isMulti>, "searchBy">;

export type SelectOptionChangeProps<
  Option extends SelectOptionValue,
  isMulti extends boolean
> = {
  setOpen: Dispatch<SetStateAction<boolean>>;
} & Pick<
  SelectProps<Option, isMulti>,
  "value" | "onChange" | "options" | "isMulti" | "searchBy"
>;

export type SelectStyleProps = {
  button?: string;
  optionSelected?: string;
  optionSelectedContainer?: string;
  drawerListContainer?: string;
  chevron?: ReactNode;
  option: ({
    active,
    children,
  }: {
    children?: ReactNode;
    active?: boolean;
  }) => ReactNode;
  search: SelectStyleSearchRender;
  searchPlaceholder?: string;
};

type SelectStyleSearchRender = (props: SelectStyleSearchProps) => ReactNode;
type SelectStyleSearchProps = {
  field: (props: SelectStyleSearchPropField) => ReactNode;
};
type SelectStyleSearchPropField = {
  placeholder: string;
  className: string;
};
