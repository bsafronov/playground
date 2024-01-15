"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from "@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";
import { selectStyles } from "./styles";
import { SelectButtonProps, SelectListProps, SelectProps } from "./types";
import { useSelect } from "./use-select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "cmdk";

export const Select = <
  Option extends Record<string, unknown>,
  isMulti extends boolean = false
>(
  props: SelectProps<Option, isMulti>
) => {
  const { options, value, searchBy, searchPlaceholder, className, listType } =
    props;

  const {
    isDesktop,
    isMounted,
    open,
    setOpen,
    getRenderSelected,
    getOptionValue,
    getRenderOption,
    handleOptionChange,
  } = useSelect(props);

  const listProps: SelectListProps<Option, isMulti> = {
    getOptionValue,
    getRenderOption,
    handleOptionChange,
    options,
    value,
    searchBy,
    searchPlaceholder,
  };

  if (!isMounted) {
    return null;
  }

  const isPopover = listType ? listType === "popover" : isDesktop;

  if (isPopover) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <SelectButton
            getRenderSelected={getRenderSelected}
            open={open}
            className={className}
          />
        </PopoverTrigger>
        <PopoverContent className="p-0 w-full" align="start">
          <List {...listProps} />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <SelectButton
          getRenderSelected={getRenderSelected}
          open={open}
          className={className}
        />
      </DrawerTrigger>
      <DrawerContent>
        <div className={selectStyles.drawerListContainer}>
          <List {...listProps} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const SelectButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentPropsWithoutRef<typeof Button> & SelectButtonProps
>(({ getRenderSelected, open, className, ...rest }, ref) => {
  return (
    <button
      ref={ref}
      aria-expanded={open}
      aria-roledescription="select"
      className={cn(selectStyles.button, className)}
      {...rest}
    >
      {getRenderSelected()}
      {selectStyles.chevron}
    </button>
  );
});

SelectButton.displayName = "SelectButton";

const List = <
  Option extends Record<string, unknown>,
  isMulti extends boolean = false
>({
  options,
  value,
  getOptionValue,
  getRenderOption,
  handleOptionChange,
  searchBy,
  searchPlaceholder,
}: SelectListProps<Option, isMulti>) => {
  return (
    <Command className="max-h-[30vh] overflow-hidden">
      {searchBy &&
        selectStyles.search({
          field: ({ className, placeholder }) => (
            <CommandInput
              placeholder={searchPlaceholder ?? placeholder}
              className={cn(className)}
            />
          ),
        })}
      <CommandEmpty>Ничего не найдено...</CommandEmpty>
      <CommandGroup className="overflow-y-auto">
        {options.map((option, index) => (
          <CommandItem
            key={index}
            value={getOptionValue(option, index)}
            onSelect={(v) =>
              handleOptionChange(searchBy ? v : index.toString())
            }
          >
            {selectStyles.option({
              active:
                value === option ||
                (Array.isArray(value) && value.includes(option)),
              children: getRenderOption(option),
            })}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};
