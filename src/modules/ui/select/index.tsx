"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";
import { selectConfig } from "./config";
import { SelectButtonProps, SelectListProps, SelectProps } from "./types";
import { useSelect } from "./use-select";

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
        <PopoverContent
          className={cn(selectConfig.popoverClassName)}
          align="start"
        >
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
        <div className={cn(selectConfig.drawerClassName)}>
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
      className={cn(
        buttonVariants({ variant: "outline" }),
        "h-auto gap-2 ",
        selectConfig.triggerClassName,
        className
      )}
      {...rest}
    >
      {getRenderSelected()}
      {selectConfig.triggerChevronIcon?.({ open })}
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
    <Command>
      {searchBy && (
        <CommandInput
          placeholder={searchPlaceholder ?? selectConfig.searchPlaceholder}
          className={selectConfig.searchClassName}
        />
      )}
      <CommandList className={selectConfig.listClassName}>
        <CommandEmpty className={selectConfig.emptyClassName}>
          {selectConfig.emptyPlaceholder}
        </CommandEmpty>
        <CommandGroup>
          {options.map((option, index) => (
            <CommandItem
              key={index}
              value={getOptionValue(option, index)}
              onSelect={(v) =>
                handleOptionChange(searchBy ? v : index.toString())
              }
              className={selectConfig.optionClassName}
            >
              {getRenderOption(option)}
              {selectConfig.optionIcon?.({
                isSelected:
                  value === option ||
                  (Array.isArray(value) && value.includes(option)),
              })}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
