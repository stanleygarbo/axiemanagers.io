export type ISelectCategorySizes = "small" | "medium" | "large";

export interface ISelectCategory {
  size: ISelectCategorySizes;
  onSelect?: (category: string) => void;
  currentCategory?: string;
}
