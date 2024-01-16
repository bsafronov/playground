import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { SelectConfig } from "./types";

export const selectConfig: SelectConfig = {
  triggerClassName: "",
  triggerContainer: "flex items-center flex-wrap gap-1",
  triggerPlaceholder: "Выбрать...",
  triggerChevronIcon: ({ open }) => (
    <ChevronsUpDown
      className={cn("w-4 h-4 opacity-50 shrink-0", open && "opacity-100")}
    />
  ),
  optionClassName: cn("justify-between"),
  optionIcon: ({ isSelected }) => (
    <Check className={cn("w-4 h-4 opacity-0", isSelected && "opacity-100")} />
  ),
  searchPlaceholder: "Поиск...",
  emptyPlaceholder: "Ничего не найдено...",
  popoverClassName: "p-0 w-full",
  drawerClassName: "mt-4 border-t",
};
