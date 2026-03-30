import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { Text } from "@/components/retroui/Text";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const Card = ({ className, style, ...props }: CardProps) => {
  return (
    <div
      className={cn("block rounded-2xl transition-all", className)}
      style={{
        background: "var(--card-bg)",
        border: "2px solid var(--border-color)",
        ...style
      }}
      {...props}
    />
  );
};

const CardHeader = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn("flex flex-col justify-start px-4 py-3 font-pixel", className)}
      {...props}
    />
  );
};

const CardTitle = ({ className, ...props }: CardProps) => {
  return (
    <Text
      as="h3"
      className={cn("text-sm uppercase tracking-widest font-pixel", className)}
      {...props}
    />
  );
};

const CardDescription = ({ className, ...props }: CardProps) => (
  <p className={cn("text-base font-sans", className)} style={{ color: "var(--muted-text)" }} {...props} />
);

const CardContent = ({ className, ...props }: CardProps) => {
  return <div className={cn("p-4", className)} {...props} />;
};

const CardFooter = ({ className, ...props }: CardProps) => {
  return (
    <div
      className={cn("px-4 py-3 mt-auto", className)}
      {...props}
    />
  );
};

const CardComponent = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});

export { CardComponent as Card };
