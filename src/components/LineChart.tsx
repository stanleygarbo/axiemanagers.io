import { Line, defaults } from "react-chartjs-2";
import React from "react";
import { ILineChart } from "../interfaces/ILineChart";
import { useTheme } from "../contexts/themeContext";
import moment from "moment";

defaults.animation = false;

export const LineChart: React.FC<ILineChart> = ({
  label,
  isMiniature = false,
  labels = [],
  title,
  data = [],
  color,
  showLabels = true,
  showLegend = false,
  showPoints = true,
  maintainAspectRatio = true,
  setHoveredElements,
  showTooltips = false,
}) => {
  const { colors } = useTheme();

  const processedData = (canvas: any) => {
    const ctx = canvas.getContext("2d");
    let gradient = { addColorStop: (number: number, string: string) => {} };
    let gradientStroke = {
      addColorStop: (number: number, string: string) => {},
    };

    ctx.height = 300;

    let datasets = [];
    gradient = !isMiniature
      ? ctx.createLinearGradient(0, 0, 0, isMiniature ? 120 : 140)
      : ctx.createLinearGradient(0, 0, 0, isMiniature ? 35 : 90);
    gradient.addColorStop(0, color + "30");
    gradient.addColorStop(1, color + "00");

    gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, color);
    gradientStroke.addColorStop(0.4, color);

    let shortenedLabels = labels;

    if (labels.length > 7) {
      shortenedLabels = labels?.map((i, idx) =>
        moment(new Date(i)).format("DD")
      );
    } else {
      shortenedLabels = labels?.map((i) => moment(new Date(i)).format("MMM D"));
    }

    return {
      labels: labels.length > 1 ? shortenedLabels : ["-", "-"],

      datasets:
        datasets.length > 0
          ? datasets
          : [
              {
                label: label,
                data:
                  data.length > 1
                    ? data
                    : data.length > 0 && data.length < 2
                    ? [data[0], data[0]]
                    : [0, 0],
                fill: true,
                backgroundColor: gradient,
                // borderColor: "#736BF3",
                borderColor: gradientStroke,
                pointHoverBackgroundColor: gradientStroke,
                pointHoverBorderColor: gradientStroke,
                tension: 0.3,
                borderWidth:
                  data.length > 1 || (data.length > 0 && data.length < 2)
                    ? 2
                    : 5,
              },
            ],
    };
  };
  return (
    <Line
      width={105}
      height={isMiniature ? 30 : 52}
      data={processedData}
      plugins={
        setHoveredElements && [
          {
            id: "eventHandler",
            beforeEvent(chart: any, args: any, pluginOptions: any) {
              const event = args.event;

              if (event.type === "mouseout") {
                if (setHoveredElements) {
                  setHoveredElements(null);
                }
              } else {
                if (setHoveredElements) {
                  if (args.event.chart._active[0]?.index !== undefined) {
                    setHoveredElements({
                      x: labels[args.event.chart._active[0].index],
                      y: data[args.event.chart._active[0].index],
                    });
                  }
                }
              }
            },
          },
          {
            id: "verticalLines",
            afterDraw: (chart: any) => {
              if (
                chart.tooltip &&
                chart.tooltip._active &&
                chart.tooltip._active.length
              ) {
                const activePoint = {
                  x: 0,
                  y: 0,
                };

                activePoint.x = chart.tooltip._active[0].element.x;
                activePoint.y = chart.tooltip._active[0].element.y;
                const ctx = chart.ctx;
                const x = activePoint.x;
                const topY = chart.scales.y.top;
                const bottomY = chart.scales.y.bottom;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = 1;
                ctx.strokeStyle = color ? color : colors.textIntense + 50;
                ctx.stroke();
                ctx.restore();
              }
            },
          },
        ]
      }
      options={{
        events: ["mouseout", "mousemove"],
        maintainAspectRatio: maintainAspectRatio,
        spanGaps: true,
        // interaction: {
        //   mode: "nearest",
        //   intersect: false,
        // },

        // maintainAspectRatio: false,
        // responsive: false,
        // maintainAspectRatio: false,
        // onHover: (e: any, activeElements: any) => {
        //   // will continue to execute if mouse stays on chart
        //   // if mouse stays on chart it will be like an infinite loop
        // },
        hover: {
          mode: "index",
          intersect: false,
        },
        scales: {
          y: {
            ticks: {
              color: colors.textNotSoIntense,
              beginAtZero: true,
              display: false,
            },
            grid: {
              // color: theme.textPrimaryDark + "20",
              display: false,
            },
            // display: isMiniature ? false : true,
            display: false,
          },

          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: colors.textNotSoIntense,
              display: !isMiniature,
              maxRotation: 0,
              minRotation: 0,
            },
          },
        },
        plugins: {
          title: {
            display: showLabels && !isMiniature ? true : false,
            text: title,
            color: colors.textIntense,
            align: "center",
          },
          legend: {
            labels: {
              // This more specific font property overrides the global property
              color: colors.textIntense,
            },
            display: showLegend,
          },
          tooltip: {
            enabled: showTooltips,
            mode: "index",
            intersect: false,
          },
        },

        elements: {
          point: {
            hoverRadius: 5,
            radius: isMiniature ? 0 : 0,
            borderColor: color,
            backgroundColor: colors.BGLight,
          },
        },
      }}
    />
  );
};
