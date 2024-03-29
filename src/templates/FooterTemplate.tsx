import { useLocation } from "react-router";
import styled, { css } from "styled-components";

import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const FooterTemplate = () => {
  const { colors } = useTheme();

  const { pathname } = useLocation();

  if (pathname !== "/") return null;

  return (
    <Container colors={colors}>
      <div className="footer-wrapper">
        <div className="footer-wrapper__notice">
          <div className="footer-wrapper__notice__message">
            <div className="footer-wrapper__notice__message__title">
              Got any questions or suggestions?
            </div>
            <div className="footer-wrapper__notice__message__description">
              Hit me up directly on&nbsp;
              <a
                target="_blank"
                href="https://discord.com/users/756368831944982599"
                rel="noreferrer"
              >
                discord
              </a>{" "}
              so that I can assist you with any concerns you have.
            </div>
          </div>
          <div className="footer-wrapper__notice__message">
            <div className="footer-wrapper__notice__message__title">
              How daily SLP is calculated
            </div>
            <div className="footer-wrapper__notice__message__description">
              This feature needs historical data for it to function, that is why
              during the first day prior to adding your scholar there is no data
              shown for the daily SLP.
            </div>
          </div>
          <div className="footer-wrapper__notice__message">
            <div className="footer-wrapper__notice__message__title">About</div>
            <div className="footer-wrapper__notice__message__description">
              axiemanagers.io is a fan-made tracking tool for the community.
              axiemanagers.io is not affiliated with axie infinity.
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.footer<{ colors: IColors }>`
  ${({ colors }) => css`
    /* background-color: ${colors.BGLight}; */

    .footer-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      a {
        color: ${colors.textNotSoIntense};
        text-decoration: underline;
      }

      &__notice {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        grid-gap: 20px;

        &__message {
          border-radius: 5px;
          border: 1px dashed ${colors.textIntense + 30};
          padding: 15px;

          &__title {
            color: ${colors.textNotSoIntense};
            font-size: 16px;
            font-weight: 500;
            margin-bottom: 10px;
          }
          &__description {
            font-size: 14px;
            color: ${colors.textIntense + 90};
          }
        }
      }
    }

    @media (max-width: 492px) {
      .footer-wrapper {
        padding: 10px;
      }
    }
  `}
`;

export default FooterTemplate;
