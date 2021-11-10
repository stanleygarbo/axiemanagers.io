import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import ModalWrapper from "./ModalWrapper";

const MaintenanceModal = () => {
  const { colors } = useTheme();

  return (
    <ModalWrapper>
      <Container colors={colors}>
        <img src="/maintenance.svg" alt="maintenace" />
        <h1>Server under maintenance</h1>
        <p>Please come back later after 12:30 pm PH time.</p>
      </Container>
    </ModalWrapper>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
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
  `}
`;

export default MaintenanceModal;
