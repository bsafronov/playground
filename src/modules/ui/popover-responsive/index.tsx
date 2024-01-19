"use client";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  type?: "popover" | "drawer";
  content?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  align?: "center" | "start" | "end";
};

export const PopoverResponsive = ({
  children,
  type,
  className,
  content,
  open,
  setOpen,
  align,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const isPopover = type ? type === "popover" : isDesktop;

  if (isPopover) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className={className} align={align ?? "start"}>
          {content}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>

      <DrawerContent>
        <div className={cn("mt-4 border-t", className)}>{content}</div>
      </DrawerContent>
    </Drawer>
  );
};
