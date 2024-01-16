import { cn } from "@/lib/utils";
import { selectConfig } from "./config";
import { Fragment, ReactNode } from "react";
import { SelectOptionValue, SelectProps } from "./types";
import { Trash2 } from "lucide-react";

const containerStyles = "flex flex-wrap gap-1";

type Props<Option extends SelectOptionValue, isMulti extends boolean> = Pick<
  SelectProps<Option, isMulti>,
  "renderSelected"
>;

export const useSelectComponents = <
  Option extends SelectOptionValue,
  isMulti extends boolean
>({
  renderSelected,
  handleToggleOption,
}: Props<Option, isMulti> & {
  handleToggleOption: (selected: Option) => void;
}) => {
  const generateSelectedOptionListCustom = (
    selectedOptions: Option[]
  ): ReactNode => {
    if (typeof renderSelected !== "function") {
      return null;
    }

    return (
      <div className={cn(containerStyles, selectConfig.triggerContainer)}>
        {selectedOptions.map((option, index) => (
          <Fragment key={index}>
            {renderSelected(option, handleToggleOption)}
          </Fragment>
        ))}
      </div>
    );
  };

  const generateSelectedOptionList = (selectedOptions: Option[]) => {
    return (
      <div
        className={cn("flex gap-1 flex-wrap", selectConfig.triggerContainer)}
      >
        {selectedOptions.map((option, index) => (
          <div
            key={index}
            className={cn(
              "relative flex items-center overflow-hidden border rounded-md text-sm group py-1",
              selectConfig.optionSelectedClassName
            )}
          >
            <div className="px-2">
              {String(option[renderSelected as keyof Option])}
            </div>
            <div
              aria-roledescription="button"
              className={cn(
                "absolute inset-0 opacity-0 bg-red-500/90 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleOption(option);
              }}
            >
              <Trash2 className="w-4 h-4 text-background" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return {
    generateSelectedOptionListCustom,
    generateSelectedOptionList,
  };
};
