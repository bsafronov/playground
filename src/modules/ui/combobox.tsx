"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";

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
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerTrigger } from "./drawer";

type Props<T> = {
  options: T[];
  value: T | null;
  onChange: (value: T) => void;
  renderSelected: ((option: T) => React.ReactNode) | keyof T;
  render: ((option: T) => React.ReactNode) | keyof T;
  searchBy: keyof T;

  disableSearch?: boolean;
  className?: string;
  placeholder?: string;
  searchPlaceholder?: string;
};

export const Combobox = <T extends unknown>({
  options,
  value,
  className,
  placeholder,
  renderSelected,
  ...rest
}: Props<T>) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);

  const getSelectedLabel = () => {
    const defaultPlaceholder = placeholder ?? "Выбрать...";

    if (!value) return defaultPlaceholder;

    if (typeof renderSelected === "function") {
      return renderSelected(value);
    }

    return String(value[renderSelected as keyof T]);
  };

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
            {getSelectedLabel()}
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
      <DrawerTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {getSelectedLabel()}
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

type ListProps<T> = {
  setOpen: (open: boolean) => void;
} & Props<T>;

const List = <T extends unknown>({
  onChange,
  options,
  setOpen,
  value,
  render,
  searchBy,
  disableSearch,
  searchPlaceholder,
}: ListProps<T>) => {
  const handleChange = (newValue: string) => {};

  const getOptionValue = (option: T) => {
    // if (searchBy) {
    //   return String(option[searchBy]).toLowerCase();
    // }

    // if (typeof option === "string") {
    //   return option;
    // }

    // if (
    //   typeof option === "object" &&
    //   !Array.isArray(option) &&
    //   option !== null
    // ) {
    //   const defaultKey = Object.values(option)[0];
    //   return String(option[defaultKey as keyof T]);
    // }

    // return "";
    return String(option[searchBy as keyof T]);
  };

  const getRenderValue = (option: T) => {
    if (typeof render === "function") {
      return render(option);
    }

    return String(option[render as keyof T]);
  };

  return (
    <Command className="max-h-[30vh] overflow-hidden">
      {!disableSearch && (
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
            value={getOptionValue(option)}
            onSelect={handleChange}
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
