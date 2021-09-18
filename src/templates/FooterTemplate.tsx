import styled, { css } from "styled-components";

import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const FooterTemplate = () => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      <div className="footer-wrapper">
        <div className="footer-wrapper__notice">
          <div className="footer-wrapper__notice__message">
            axiemanagers.io is not affiliated with Axie Infinity, this is a
            fan-made site
          </div>
          <div className="footer-wrapper__notice__stats">
            axiemanagers.io is not affiliated with Axie Infinity, this is a
            fan-made site
          </div>
        </div>
        <div className="footer-wrapper__important">
          <div className="footer-wrapper__important__price">
            <img src="/slp.png" alt="slp" width={30} />
            P4.11
          </div>
          <div className="footer-wrapper__important__price">
            <img src="/eth.svg" alt="eth" width={30} />
            P150,300.21
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.footer<{ colors: IColors }>`
  ${({ colors }) => css`
    min-height: 200px;
    background-color: ${colors.BGLight};

    .footer-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      color: ${colors.textNotSoIntense};
    }
  `}
`;

export default FooterTemplate;
