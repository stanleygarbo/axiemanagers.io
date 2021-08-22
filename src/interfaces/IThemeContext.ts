import {IColors} from "./IColors";

export interface IThemeContext {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: IColors
}