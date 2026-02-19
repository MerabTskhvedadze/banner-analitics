import React, { JSX } from "react";

const typeScale = {
  h1: { fontSize: 60, lineHeight: 1.15, fontWeight: 900 },
  h2: { fontSize: 48, lineHeight: 1.15, fontWeight: 800 },
  h3: { fontSize: 40, lineHeight: 1.15, fontWeight: 800 },
  h4: { fontSize: 36, lineHeight: 1.2, fontWeight: 800 },
  h5: { fontSize: 28, lineHeight: 1.25, fontWeight: 700 },
  h6: { fontSize: 24, lineHeight: 1.2, fontWeight: 800 },
  h7: { fontSize: 20, lineHeight: 1.3, fontWeight: 700 },
  h8: { fontSize: 18, lineHeight: 1.35, fontWeight: 700 },
  h9: { fontSize: 16, lineHeight: 1.4, fontWeight: 700 },

  body: { fontSize: 14, lineHeight: 1.6, fontWeight: 400 },
  body2: { fontSize: 13, lineHeight: 1.6, fontWeight: 400 },
  caption: { fontSize: 12, lineHeight: 1.45, fontWeight: 400 },
  overline: { fontSize: 11, lineHeight: 1.3, fontWeight: 600, letterSpacing: "0.08em" },
} as const;

type Variant = keyof typeof typeScale;

const defaultTag: Record<Variant, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  h7: "h6", // no native h7: map to a semantic heading tag
  h8: "p",
  h9: "p",
  body: "p",
  body2: "p",
  caption: "span",
  overline: "span",
};


type TypographyColor =
  | "default"
  | "muted"
  | "primary"
  | "danger"
  | "inherit"
  | "success";

const colors: Record<TypographyColor, string | undefined> = {
  default: "#111827",
  muted: "#6B7280",
  primary: "#137FEC",
  danger: "#DC2626",
  inherit: undefined, // use parent color
  success: "#16A34A",
};

type TypographyProps<T extends React.ElementType = "span"> = {
  as?: T;
  variant?: Variant;
  color?: TypographyColor;
  weight?: 300 | 400 | 500 | 600 | 700 | 800;
  align?: "left" | "center" | "right" | "justify";
  italic?: boolean;
  underline?: boolean;
  noWrap?: boolean; // single-line truncate
  clampLines?: number; // multi-line clamp
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  muted?: boolean;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "color" | "children">;

function Typography<T extends React.ElementType = "span">({
  as,
  variant = "body",
  color = "default",
  weight,
  align,
  italic,
  underline,
  noWrap,
  clampLines,
  className,
  style,
  children,
  muted,
  ...props
}: TypographyProps<T>) {
  const Component = (as ?? defaultTag[variant]) as React.ElementType;
  const v = typeScale[variant];

  const composed: React.CSSProperties = {
    margin: 0,
    fontSize: v.fontSize,
    lineHeight: v.lineHeight as any,
    fontWeight: weight ?? (v.fontWeight as any),
    letterSpacing: (v as any).letterSpacing,
    textTransform: variant === "overline" ? "uppercase" : undefined,

    color: muted ? colors.muted : colors[color],
    textAlign: align,
    fontStyle: italic ? "italic" : undefined,
    textDecoration: underline ? "underline" : undefined,

    ...(noWrap
      ? { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
      : null),

    ...(clampLines
      ? {
        overflow: "hidden",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: clampLines,
      }
      : null),

    ...style,
  };

  return (
    <Component className={className} style={composed} {...props}>
      {children}
    </Component>
  );
}

export default Typography;