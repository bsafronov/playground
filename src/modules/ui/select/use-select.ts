import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  RenderOptionSelectedProps,
  SelectOptionValue,
  SelectProps,
} from "./types";

export const useSelect = <
  Option extends Record<string, unknown>,
  isMulti extends boolean
>({
  renderSelected,
  isMulti,
  placeholder,
  value,
}: SelectProps<Option, isMulti>) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isMounted, setMounted] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useOptionValue();
  useRenderOption();

  const { getRenderSelected } = useRenderSelected<Option, isMulti>({
    renderSelected,
    isMulti,
    placeholder,
    value,
  });

  return {
    isDesktop,
    isMounted,
    open,
    setOpen,
    getRenderSelected,
  };
};

const useOptionValue = () => {
  const getOptionValue = () => {};
};

const useRenderOption = () => {};

const useRenderSelected = <
  Option extends SelectOptionValue,
  isMulti extends boolean
>({
  renderSelected,
  isMulti,
  placeholder,
  value,
}: RenderOptionSelectedProps<Option, isMulti>) => {
  const getRenderSelected = () => {
    if (!value) {
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
      return selectedValues.map((option) => renderSelected(option));
    }

    return selectedValues
      .map((option) => option[renderSelected as keyof Option])
      .join(", ");
  };

  return {
    getRenderSelected,
  };
};
