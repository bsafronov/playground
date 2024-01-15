import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Search, Smile } from "lucide-react";
import { buttonVariants } from "../button";
import { SelectStyleProps } from "./types";

export const selectStyles: SelectStyleProps = {
  button: cn(
    buttonVariants({ variant: "outline" }),
    "h-auto min-h-10 text-sm max-w-full"
  ),
  optionSelected: "border rounded-md bg-background px-2 py-0.5 text-sm",
  optionSelectedContainer: "flex flex-wrap gap-1",
  drawerListContainer: "mt-4 border-t",
  chevron: <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />,
  option: ({ active, children }) => (
    <div className="flex justify-between w-full">
      <div className="w-full">{children}</div>
      <Check
        className={cn("ml-auto h-4 w-4 opacity-0", active && "opacity-100")}
      />
    </div>
  ),
  search: ({ field }) => (
    <div className="flex items-center gap-2 border-b px-2 py-3 text-sm">
      <Search className="opacity-50 h-4 w-4" />
      {field({
        className:
          "flex w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        placeholder: "Поиск...",
      })}
    </div>
  ),
};
