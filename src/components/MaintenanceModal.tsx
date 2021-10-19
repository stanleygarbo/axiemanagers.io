import { useState } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const MaintenanceModal = () => {
  const { colors } = useTheme();

  const [isOpen, setIsOpen] = useState(true);

  if (isOpen)
    return (
      <Container colors={colors}>
        <div className="modal-content">
          <img src="/maintenance.svg" alt="maintenace" />
          <h1>Server under maintenance</h1>
          <p>
            Please come back later once axie infinity's server maintenance is
            over.
          </p>
        </div>
        <div onClick={() => setIsOpen(false)} className="modal-backdrop"></div>
      </Container>
    );

  return null;
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: -11;
      cursor: pointer;
    }
    .modal-content {
      z-index: 2;
      background-color: ${colors.BGLight};
      border-radius: 20px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      max-width: 450px;
      margin: 0 20px;
      align-items: center;
      text-align: center;

      color: ${colors.textNotSoIntense};
      img {
        width: 300px;
      }

      h1 {
        font-size: 20px;
      }

      p {
        padding: 5px 10px;
      }
    }
  `}
`;

export default MaintenanceModal;
