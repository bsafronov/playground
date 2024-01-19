"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { PopoverResponsive } from "../popover-responsive";

const VALUE_SEPARATOR = " ||| ";

type OptionRecord<Option> = {
  readonly [Prop in keyof Option]: Option[Prop];
};

type Props<Option, isMulti> = {
  isMulti?: isMulti;
  options: readonly Option[];
  value: isMulti extends true ? readonly Option[] : Option | null;
  onChange: (value: isMulti extends true ? Option[] : Option | null) => void;
  renderSelected:
    | keyof Option
    | ((option: Option, handleDelete: () => void) => ReactNode);
  renderOption: keyof Option | ((option: Option) => ReactNode);
  searchBy?: keyof Option | (keyof Option)[];
  placeholder?: string;
  emptyPlaceholder?: string;
  searchPlaceholder?: string;
  className?: string;
  classNames?: {
    selectedContainer?: string;
    selectedOption?: string;
    option?: string;
  };
};

export const Select = <
  Option extends OptionRecord<Option>,
  isMulti extends boolean = false
>(
  props: Props<Option, isMulti>
) => {
  const { open, setOpen, ...logicProps } = useSelect(props);

  return (
    <PopoverResponsive
      open={open}
      setOpen={setOpen}
      content={<SelectList {...props} {...logicProps} />}
      className="p-0"
    >
      <Button
        variant={"outline"}
        aria-roledescription="select"
        className={cn(
          "justify-between gap-4 pl-4 pr-2 h-auto",
          props.className
        )}
      >
        <div
          className={cn(
            "flex flex-wrap gap-1",
            props.classNames?.selectedContainer
          )}
        >
          <ButtonContent {...props} {...logicProps} />
        </div>
        <ChevronsUpDown
          className={cn("w-4 h-4 opacity-50 shrink-0", {
            "opacity-100": open,
          })}
        />
      </Button>
    </PopoverResponsive>
  );
};

const ButtonContent = <
  Option extends OptionRecord<Option>,
  isMulti extends boolean = false
>({
  value,
  placeholder,
  renderSelected,
  classNames,
  deleteOption,
}: Pick<
  Props<Option, isMulti>,
  "value" | "placeholder" | "renderSelected" | "classNames"
> &
  Pick<ReturnType<typeof useSelect<Option, isMulti>>, "deleteOption">) => {
  const noValue = !value || (Array.isArray(value) && value.length === 0);
  const isMulti = Array.isArray(value);
  const isCustom = typeof renderSelected === "function";

  if (noValue) {
    return placeholder ?? "Выбрать...";
  }

  if (isMulti && !isCustom) {
    return value.map((v, index) => (
      <div
        key={index}
        className={cn(
          "px-2 py-0.5 rounded-md border bg-background",
          classNames?.selectedOption
        )}
      >
        {v[renderSelected as keyof Option]}
      </div>
    ));
  }

  if (isMulti && isCustom) {
    return value.map((v, index) => (
      <div key={index} className={cn(classNames?.selectedOption)}>
        {renderSelected(v, () => {
          deleteOption(v);
        })}
      </div>
    ));
  }

  if (!isMulti && isCustom) {
    return (
      <div className={classNames?.selectedOption}>
        {renderSelected(value as Option, () => {
          deleteOption(value as Option);
        })}
      </div>
    );
  }

  if (!isMulti && !isCustom) {
    return (
      <div className={classNames?.selectedOption}>
        {String((value as Option)[renderSelected as keyof Option])}
      </div>
    );
  }

  return null;
};

const SelectList = <
  Option extends OptionRecord<Option>,
  isMulti extends boolean = false
>({
  options,
  searchBy,
  getCommandItemValue,
  handleChangeOption,
  renderOption,
  value,
  classNames,
  emptyPlaceholder,
  searchPlaceholder,
}: Pick<
  Props<Option, isMulti>,
  | "options"
  | "searchBy"
  | "renderOption"
  | "value"
  | "classNames"
  | "emptyPlaceholder"
  | "searchPlaceholder"
> &
  Pick<
    ReturnType<typeof useSelect<Option, isMulti>>,
    "getCommandItemValue" | "handleChangeOption"
  >) => {
  return (
    <Command>
      {searchBy && <CommandInput placeholder={searchPlaceholder ?? "Поиск"} />}
      <CommandList>
        <CommandEmpty>{emptyPlaceholder ?? "Ничего не найдено"}</CommandEmpty>
        <CommandGroup>
          {options.map((option, index) => (
            <CommandItem
              key={index}
              value={getCommandItemValue(option, index)}
              onSelect={(v) => handleChangeOption(v, index)}
              className={cn(
                "justify-between gap-4 items-center",
                classNames?.option
              )}
            >
              {typeof renderOption === "string" && String(option[renderOption])}
              {typeof renderOption === "function" && (
                <div>{renderOption(option)}</div>
              )}
              <Check
                className={cn("w-4 h-4 opacity-0", {
                  "opacity-100":
                    value === option ||
                    (Array.isArray(value) && value.includes(option)),
                })}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const useSelect = <
  Option extends OptionRecord<Option>,
  isMulti extends boolean = false
>({
  options,
  value,
  onChange,
  isMulti,
  searchBy,
}: Pick<
  Props<Option, isMulti>,
  "options" | "isMulti" | "value" | "onChange" | "searchBy"
>) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleChangeOption = (newOptionString: string, index: number): void => {
    const newOption = getOptionByValue(newOptionString, index);

    if (isMulti) {
      return changeOptionMulti(newOption);
    }
    return changeOptionSingle(newOption);
  };

  const isOptionSelected = (option: Option) => {
    if (isMulti) {
      return (value as Option[]).includes(option);
    }
    return (value as Option) === option;
  };

  const getOptionByValue = (optionString: string, index: number) => {
    if (!searchBy) {
      return options[index];
    }

    if (Array.isArray(searchBy)) {
      return options.find(
        (option) =>
          searchBy
            .map((key) => option[key as keyof Option])
            .join(VALUE_SEPARATOR)
            .toLowerCase() === optionString
      )!;
    }

    return options.find(
      (option) =>
        String(option[searchBy as keyof Option]).toLowerCase() === optionString
    )!;
  };

  const changeOptionSingle = (option: Option) => {
    const onChangeSingle = onChange as Props<Option, false>["onChange"];

    if (isOptionSelected(option)) {
      onChangeSingle(null);
    } else {
      onChangeSingle(option);
    }
    setOpen(false);
  };

  const changeOptionMulti = (option: Option) => {
    const oldOptions = value as Option[];
    const onChangeMulti = onChange as Props<Option, true>["onChange"];

    if (isOptionSelected(option)) {
      return deleteOption(option);
    }

    const updatedOptions = [...oldOptions, option];
    onChangeMulti(updatedOptions);
  };

  const deleteOption = (option: Option) => {
    if (isMulti) {
      const onChangeMulti = onChange as Props<Option, true>["onChange"];
      const updatedOptions = (value as Option[]).filter((o) => o !== option);
      return onChangeMulti(updatedOptions);
    }

    const onChangeSingle = onChange as Props<Option, false>["onChange"];
    return onChangeSingle(null);
  };

  const getCommandItemValue = (option: Option, index: number): string => {
    if (!searchBy) {
      return index.toString();
    }

    if (Array.isArray(searchBy)) {
      return searchBy
        .map((key) => option[key as keyof Option])
        .join(VALUE_SEPARATOR)
        .toLowerCase();
    }

    return String(option[searchBy as keyof Option]);
  };

  return {
    open,
    setOpen,
    handleChangeOption,
    getCommandItemValue,
    deleteOption,
  };
};
