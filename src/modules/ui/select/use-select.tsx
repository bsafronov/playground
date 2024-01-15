import { Fragment, ReactNode, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { selectStyles } from "./styles";
import {
  SelectOptionChangeProps,
  SelectOptionValue,
  SelectOptionValueProps,
  SelectProps,
  SelectRenderOptionProps,
  SelectRenderOptionSelectedProps,
} from "./types";

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
  });

  const { handleOptionChange } = useOptionChange({
    onChange,
    options,
    isMulti,
    value,
    setOpen,
    searchBy,
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
}: SelectOptionValueProps<Option, isMulti>) => {
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
}: SelectRenderOptionProps<Option, isMulti>) => {
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
}: SelectRenderOptionSelectedProps<Option, isMulti>) => {
  const getRenderSelected = () => {
    if (!value || !value.length) {
      return placeholder ?? "Выбрать...";
    }

    if (isMulti) {
      return getRenderSelectedMulti();
    }

    if (!isMulti) {
      return getRenderSelectedSingle();
    }
  };

  const getRenderSelectedSingle = () => {
    const selectedValue = value as Option;

    if (typeof renderSelected === "function") {
      return renderSelected(selectedValue);
    }

    return String(selectedValue[renderSelected as keyof Option]);
  };

  const getRenderSelectedMulti = () => {
    const selectedValues = value as Option[];

    if (typeof renderSelected === "function") {
      return (
        <div className={selectStyles.optionSelectedContainer}>
          {selectedValues.map((option, index) => (
            <Fragment key={index}>{renderSelected(option)}</Fragment>
          ))}
        </div>
      );
    }

    return (
      <div className={selectStyles.optionSelectedContainer}>
        {selectedValues.map((option, index) => (
          <div className={selectStyles.optionSelected} key={index}>
            {String(option[renderSelected as keyof Option])}
          </div>
        ))}
      </div>
    );
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
    const onChangeMulti = onChange as (value: Option[]) => void;
    const currentOptions = value as Option[];
    let updatedOptions: Option[] = [];

    const getUpdatedOptionsMulti = (selected: Option) => {
      const hasSelected = !!currentOptions.find(
        (option) => option === selected
      );

      if (hasSelected) {
        return currentOptions.filter((option) => option !== selected);
      } else {
        return [...currentOptions, selected];
      }
    };

    if (!searchBy) {
      const index = Number(newValue);
      const selectedOption = options[index];
      updatedOptions = getUpdatedOptionsMulti(selectedOption);
    }

    if (Array.isArray(searchBy)) {
      const selectedOption = options.find(
        (option) =>
          searchBy
            .map((key) => String(option[key as keyof Option]).toLowerCase())
            .join(VALUE_SEPARATOR) === newValue
      )!;
      updatedOptions = getUpdatedOptionsMulti(selectedOption);
    }

    if (typeof searchBy === "string") {
      const selectedOption = options.find(
        (option) =>
          String(option[searchBy as keyof Option]).toLowerCase() === newValue
      )!;
      updatedOptions = getUpdatedOptionsMulti(selectedOption);
    }

    onChangeMulti(updatedOptions);
  };

  const handleOptionChangeSingle = (newValue: string) => {
    let selectedOption: Option | undefined;
    const onChangeSingle = onChange as (value: Option) => void;

    if (!searchBy) {
      const index = Number(newValue);
      selectedOption = options[index];
    }

    if (Array.isArray(searchBy)) {
      selectedOption = options.find(
        (option) =>
          searchBy
            .map((key) => String(option[key as keyof Option]).toLowerCase())
            .join(VALUE_SEPARATOR) === newValue
      );
    }

    if (typeof searchBy === "string") {
      selectedOption = options.find(
        (option) =>
          String(option[searchBy as keyof Option]).toLowerCase() === newValue
      );
    }

    if (!selectedOption) return;

    onChangeSingle(selectedOption);
    setOpen(false);
  };

  return {
    handleOptionChange,
  };
};
