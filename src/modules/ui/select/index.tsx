"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";
import { SelectButtonProps, SelectListProps, SelectProps } from "./types";
import { useSelect } from "./use-select";

export const Select = <
  Option extends Record<string, unknown>,
  isMulti extends boolean = false
>(
  props: SelectProps<Option, isMulti>
) => {
  const { options, value, searchBy, searchPlaceholder, className } = props;

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

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <SelectButton
            getRenderSelected={getRenderSelected}
            open={open}
            className={className}
          />
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
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
        <div className="mt-4 border-t">
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
    <Button
      ref={ref}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className={cn("justify-between h-auto min-h-10 truncate", className)}
      {...rest}
    >
      {getRenderSelected()}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
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
      {searchBy && (
        <CommandInput
          placeholder={searchPlaceholder ?? "Поиск..."}
          className="h-9"
        />
      )}
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
            {getRenderOption(option)}
            <Check
              className={cn(
                "ml-auto h-4 w-4",
                value === option ||
                  (Array.isArray(value) && value.includes(option))
                  ? "opacity-100"
                  : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};
