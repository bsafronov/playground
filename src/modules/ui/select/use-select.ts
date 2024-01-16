import { ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { selectConfig } from "./config";
import {
  SelectOptionChangeProps,
  SelectOptionValue,
  SelectProps,
} from "./types";
import { useSelectComponents } from "./use-select-components";

const VALUE_SEPARATOR = " *!& ";

export const useSelect = <
  Option extends Record<string, unknown>,
  isMulti extends boolean
>({
  renderOption,
  renderSelected,
  searchBy,
  isMulti,
  placeholder,
  value,
  onChange,
  options,
}: SelectProps<Option, isMulti>) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isMounted, setMounted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { handleOptionChange, handleToggleOption } = useOptionChange({
    onChange,
    options,
    isMulti,
    value,
    setOpen,
    searchBy,
  });

  const { getOptionValue } = useOptionValue({
    searchBy,
  });
  const { getRenderOption } = useRenderOption({
    renderOption,
  });

  const { getRenderSelected } = useRenderSelected({
    renderSelected,
    isMulti,
    placeholder,
    value,
    handleToggleOption,
  });

  return {
    isDesktop,
    isMounted,
    open,
    setOpen,
    getRenderOption,
    getRenderSelected,
    getOptionValue,
    handleOptionChange,
  };
};

const useOptionValue = <
  Option extends SelectOptionValue,
  isMulti extends boolean
>({
  searchBy,
}: Pick<SelectProps<Option, isMulti>, "searchBy">) => {
  const getOptionValue = (option: Option, index: number): string => {
    if (!searchBy) {
      return index.toString();
    }

    if (Array.isArray(searchBy)) {
      return searchBy
        .map((key) => option[key as keyof Option])
        .join(VALUE_SEPARATOR);
    }

    return String(option[searchBy as keyof Option]);
  };

  return {
    getOptionValue,
  };
};

const useRenderOption = <
  Option extends SelectOptionValue,
  isMulti extends boolean
>({
  renderOption,
}: Pick<SelectProps<Option, isMulti>, "renderOption">) => {
  const getRenderOption = (option: Option): ReactNode => {
    if (typeof renderOption === "string") {
      return String(option[renderOption as keyof Option]);
    }

    if (typeof renderOption === "function") {
      return renderOption(option);
    }
  };

  return {
    getRenderOption,
  };
};

const useRenderSelected = <
  Option extends SelectOptionValue,
  isMulti extends boolean
>({
  renderSelected,
  isMulti,
  placeholder,
  value,
  handleToggleOption,
}: Pick<
  SelectProps<Option, isMulti>,
  "renderSelected" | "isMulti" | "placeholder" | "value"
> & {
  handleToggleOption: (selected: Option) => void;
}) => {
  const { generateSelectedOptionListCustom, generateSelectedOptionList } =
    useSelectComponents({
      renderSelected,
      handleToggleOption,
    });

  const getRenderSelected = () => {
    const empty = !value || (isMulti && !value.length);
    if (empty) {
      return placeholder ?? selectConfig.triggerPlaceholder;
    }

    if (isMulti) {
      return getRenderSelectedMulti();
    }

    if (!isMulti) {
      return getRenderSelectedSingle();
    }
  };

  const getRenderSelectedSingle = (): ReactNode => {
    const selectedValue = value as Option;

    if (typeof renderSelected === "function") {
      return renderSelected(selectedValue, (e) => {
        handleToggleOption(selectedValue);
      });
    }

    return String(selectedValue[renderSelected as keyof Option]);
  };

  const getRenderSelectedMulti = (): ReactNode => {
    const selectedOptions = value as Option[];

    if (typeof renderSelected === "function") {
      return generateSelectedOptionListCustom(selectedOptions);
    }

    return generateSelectedOptionList(selectedOptions);
  };

  return {
    getRenderSelected,
  };
};

const useOptionChange = <
  Option extends SelectOptionValue,
  isMulti extends boolean
>({
  onChange,
  value,
  searchBy,
  setOpen,
  options,
  isMulti,
}: SelectOptionChangeProps<Option, isMulti>) => {
  const handleOptionChange = (newValue: string) => {
    if (isMulti) {
      return handleOptionChangeMulti(newValue);
    } else {
      return handleOptionChangeSingle(newValue);
    }
  };

  const handleOptionChangeMulti = (newValue: string) => {
    if (!searchBy) {
      const index = Number(newValue);
      const selectedOption = options[index];
      handleToggleOption(selectedOption);
    }

    if (Array.isArray(searchBy)) {
      const selectedOption = options.find(
        (option) =>
          searchBy
            .map((key) => String(option[key as keyof Option]).toLowerCase())
            .join(VALUE_SEPARATOR) === newValue
      )!;
      handleToggleOption(selectedOption);
    }

    if (typeof searchBy === "string") {
      const selectedOption = options.find(
        (option) =>
          String(option[searchBy as keyof Option]).toLowerCase() === newValue
      )!;
      handleToggleOption(selectedOption);
    }
  };

  const handleOptionChangeSingle = (newValue: string) => {
    if (!searchBy) {
      const index = Number(newValue);
      const selectedOption = options[index];
      selectedOption && handleToggleOption(selectedOption);
    }

    if (Array.isArray(searchBy)) {
      const selectedOption = options.find(
        (option) =>
          searchBy
            .map((key) => String(option[key as keyof Option]).toLowerCase())
            .join(VALUE_SEPARATOR) === newValue
      );

      selectedOption && handleToggleOption(selectedOption);
    }

    if (typeof searchBy === "string") {
      const selectedOption = options.find(
        (option) =>
          String(option[searchBy as keyof Option]).toLowerCase() === newValue
      );
      selectedOption && handleToggleOption(selectedOption);
    }

    setOpen(false);
  };

  const handleToggleOption = (selected: Option) => {
    if (isMulti) {
      return handleToggleOptionMulti(selected);
    } else {
      return handleToggleOptionSingle(selected);
    }
  };

  const handleToggleOptionSingle = (selected: Option) => {
    const selectedOption = value as Option;
    const onChangeSingle = onChange as (option: Option) => void;
    const hasSelected = selectedOption === selected;

    if (hasSelected) {
      return;
      // TODO: handle unselect?
    }

    onChangeSingle(selected);
    setOpen(false);
  };

  const handleToggleOptionMulti = (selected: Option) => {
    const selectedOptions = value as Option[];
    const onChangeMulti = onChange as (option: Option[]) => void;
    const hasSelected = selectedOptions.find((option) => option === selected);

    if (hasSelected) {
      const updatedOptions = selectedOptions.filter(
        (option) => option !== selected
      );
      onChangeMulti(updatedOptions);
      return;
    }

    const updatedOptions = [...selectedOptions, selected];
    onChangeMulti(updatedOptions);
  };

  return {
    handleOptionChange,
    handleToggleOption,
  };
};
