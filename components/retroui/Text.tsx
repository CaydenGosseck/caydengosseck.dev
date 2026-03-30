import { ElementType, HTMLAttributes } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textVariants = cva("font-head", {
  variants: {
    as: {
      p: "font-sans",
      li: "font-sans",
      a: "font-sans hover:underline underline-offset-2 decoration-primary",
      h1: "font-bold",
      h2: "font-semibold",
      h3: "font-medium",
      h4: "font-normal",
      h5: "font-normal",
      h6: "font-normal",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  compoundVariants: [
    { as: "h1", size: undefined, className: "text-4xl lg:text-5xl" },
    { as: "h2", size: undefined, className: "text-3xl lg:text-4xl" },
    { as: "h3", size: undefined, className: "text-2xl" },
    { as: "h4", size: undefined, className: "text-xl" },
    { as: "h5", size: undefined, className: "text-lg" },
    { as: "h6", size: undefined, className: "text-base" },
    { as: "p", size: undefined, className: "text-base" },
    { as: "li", size: undefined, className: "text-base" },
    { as: "a", size: undefined, className: "text-base" },
  ],
  defaultVariants: {
    as: "p",
  },
});

type TextProps = Omit<HTMLAttributes<HTMLElement>, "className"> &
  VariantProps<typeof textVariants> & {
    className?: string;
  };

export const Text = (props: TextProps) => {
  const { className, as, size, ...otherProps } = props;
  const Tag: ElementType = as || "p";

  return (
    <Tag className={cn(textVariants({ as, size }), className)} {...otherProps} />
  );
};
