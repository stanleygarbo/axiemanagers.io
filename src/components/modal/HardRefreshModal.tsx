import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import Button from "../Button";
import ModalWrapper from "./ModalWrapper";

const HardRefreshModal = () => {
  const { colors } = useTheme();

  const [hasRefreshed, setHasRefreshed] = useState<boolean>(true);

  const onRefreshClickHandler = () => {
    localStorage.setItem("hasRefreshed", "true");
    window.location.reload(true);
  };

  useEffect(() => {
    const alreadyRefreshed = localStorage.getItem("hasRefreshed");
    if (alreadyRefreshed && alreadyRefreshed === "true") {
      setHasRefreshed(true);
    } else {
      setHasRefreshed(false);
    }
  }, []);

  if (!hasRefreshed)
    return (
      <ModalWrapper>
        <Container colors={colors}>
          <h1>Please hard refresh the page</h1>
          <p>The page turning white when adding new scholars is now fixed.</p>
          <Button
            onClick={onRefreshClickHandler}
            bgColor={colors.accent}
            style={{ width: "100%" }}
          >
            Hard Refresh
          </Button>
        </Container>
      </ModalWrapper>
    );

  return null;
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    z-index: 2;
    background-color: ${colors.BGLight};
    border-radius: 20px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-width: 350px;
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
      padding: 20px 10px;
    }
  `}
`;

export default HardRefreshModal;
