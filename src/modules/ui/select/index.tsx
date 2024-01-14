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
import { SelectListProps, SelectProps } from "./types";
import { useSelect } from "./use-select";

const VALUE_SEPARATOR = " *!& ";

export const Select = <
  Option extends Record<string, unknown>,
  isMulti extends boolean = false
>(
  props: SelectProps<Option, isMulti>
) => {
  const {
    options,
    value,
    className,
    placeholder,
    renderSelected,
    isMulti,
    ...rest
  } = props;

  const { isDesktop, isMounted, open, setOpen, getRenderSelected } =
    useSelect(props);

  if (!isMounted) {
    return null;
  }

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", className)}
          >
            {getRenderSelected()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <List
            options={options}
            value={value}
            setOpen={setOpen}
            renderSelected={renderSelected}
            {...rest}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {getRenderSelected()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <List
            options={options}
            value={value}
            setOpen={setOpen}
            renderSelected={renderSelected}
            {...rest}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

const List = <
  Option extends Record<string, unknown>,
  isMulti extends boolean = false
>({
  onChange,
  options,
  setOpen,
  value,
  renderOption,
  searchBy,
  searchPlaceholder,
  isMulti,
}: SelectListProps<Option, isMulti>) => {
  const handleChange = (newValue: string) => {
    if (!isMulti && !searchBy) {
      // TODO: Single option selection by index
    }

    if (!isMulti && searchBy) {
      // TODO: Single option selection by keyof Option or keyof Option[]
    }

    if (isMulti && !searchBy) {
      // TODO: Multiple option selection by index
    }

    if (isMulti && searchBy) {
      // TODO: Multiple option selection by keyof Option or keyof Option[]
    }

    if (Array.isArray(searchBy)) {
      const newOptionValues = newValue.split(VALUE_SEPARATOR);
      const newOptionKeyValuesArrays = searchBy.map((key, index) => [
        key,
        newOptionValues[index],
      ]);
      const newOption = Object.fromEntries(newOptionKeyValuesArrays);

      const selectedOption = options.find((option) =>
        searchBy.every((key) => {
          const optionValue = String(option[key as keyof Option]).toLowerCase();
          const newOptionValue = String(
            newOption[key as keyof Option]
          ).toLowerCase();

          return optionValue === newOptionValue;
        })
      )!;
      onChange(selectedOption);
      setOpen(false);
      return;
    }

    if (typeof searchBy === "string") {
      const selectedOption = options.find(
        (option) =>
          String(option[searchBy as keyof Option]).toLowerCase() === newValue
      ) as Option;

      onChange(selectedOption);
      setOpen(false);
      return;
    }

    onChange(options[parseInt(newValue)]);
    setOpen(false);
  };

  const getOptionValue = (option: Option, index: number) => {
    if (Array.isArray(searchBy)) {
      return searchBy
        .map((key) => option[key as keyof Option])
        .join(VALUE_SEPARATOR);
    }

    if (typeof searchBy === "string") {
      return String(option[searchBy as keyof Option]);
    }

    return index.toString();
  };

  const getRenderValue = (option: Option) => {
    if (typeof renderOption === "function") {
      return renderOption(option);
    }

    return String(option[renderOption as keyof Option]);
  };

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
            onSelect={(v) => handleChange(searchBy ? v : index.toString())}
          >
            {getRenderValue(option)}
            <Check
              className={cn(
                "ml-auto h-4 w-4",
                value === option ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  );
};
