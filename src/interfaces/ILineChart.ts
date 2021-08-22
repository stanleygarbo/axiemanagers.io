export interface ILineChart {
  data?: string[];
  labels?: string[];
  label?: string;
  isMiniature?: boolean;
  title: string;
  showLabels?: boolean;
  color: string;
  showPoints?: boolean;
  showLegend?: boolean;
  maintainAspectRatio?: boolean;
  setHoveredElements?: React.Dispatch<
    React.SetStateAction<{ x: string; y: string } | null>
  >;
  showTooltips?: boolean;
}
