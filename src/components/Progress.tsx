import React from "react";
import styled, { css } from "styled-components";
import { useScholars } from "../contexts/scholarsContext";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { IProgress } from "../interfaces/IProgress";

const Container = styled.div<{
  colors: IColors;
  percentage: number;
  progressColor: string;
}>`
  ${({ colors, percentage, progressColor }) => css`
    margin-top: -5px;
    .progress-wrapper {
      width: 67px;
      height: 5px;
      border-radius: 101px;
      background-color: ${colors.textNotSoIntense + "25"};
      &__progress {
        width: ${percentage}%;
        height: 100%;
        background-color: ${progressColor};
        border-radius: 101px;
        position: relative;
        &__point {
          height: 10px;
          width: 10px;
          position: absolute;
          right: -2px;
          top: -2px;
          border-radius: 101px;
          background-color: ${progressColor};
          &::before {
            position: absolute;
            content: "";
            width: 20px;
            height: 20px;
            background-color: ${progressColor + 20};
            border-radius: 101px;
            right: -5px;
            top: -5px;
          }
        }
      }
    }
    .progress-caption {
      color: ${colors.textNotSoIntense};
      text-transform: capitalize;
      margin-bottom: 10px;
    }
  `}
`;

const Progress: React.FC<IProgress> = ({ earned, showText = true }) => {
  const { minQuota } = useScholars();
  const { colors } = useTheme();

  const progress =
    Number(earned) <= minQuota
      ? Number(((earned / minQuota) * 100).toFixed(2))
      : 100;

  const progressColor = progress > 99 ? colors.success : colors.accent2;

  return (
    <Container
      colors={colors}
      percentage={progress}
      progressColor={progressColor}
    >
      {showText && <div className="progress-caption">progress</div>}
      <div className="progress-wrapper">
        <div className="progress-wrapper__progress">
          <div className="progress-wrapper__progress__point"></div>
        </div>
      </div>
    </Container>
  );
};

export default Progress;
