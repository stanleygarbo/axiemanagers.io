import { MouseEventHandler } from "react";

export interface IButton {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactChild;
  bgColor?: string;
  style?: React.CSSProperties;
  animated?: boolean;
  foreground?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  disabledBgColor?: string;
  disabledForeground?: string;
}
