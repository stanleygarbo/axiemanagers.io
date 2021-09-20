import React from "react";
import { ILayout } from "../interfaces/ILayout";
import styled, { createGlobalStyle, css } from "styled-components";
import TopBar from "../components/TopBar";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import SettingsNav from "../components/SettingsNav";
import { IoClose } from "react-icons/io5";
import { useScreenSize } from "../contexts/screenSizeContext";
// import FooterTemplate from "./FooterTemplate";

const Layout: React.FC<ILayout> = ({ children }) => {
  const { colors } = useTheme();
  const { pathname } = useLocation();
  const { goBack, push } = useHistory();

  const { screenWidth } = useScreenSize();

  // useEffect(() => {
  //   const ads = document.querySelector<HTMLElement>(".ads");
  //   if (pathname !== "/") {
  //     ads!.style.display = "none";
  //   } else {
  //     ads!.style.display = "flex";
  //   }
  // }, [pathname]);

  return (
    <Container colors={colors}>
      <Helmet>
        <meta name="theme" content={colors.BGLight} />
        <meta name="theme-color" content={colors.BGLight} />
      </Helmet>
      {pathname.includes("/settings/") ? (
        <div className="settings-wrapper">
          {screenWidth > 718 && <SettingsNav />}
          {children}

          <button
            onClick={() => (screenWidth > 718 ? push("/") : goBack())}
            className="settings-wrapper__back"
          >
            <IoClose size={30} />
          </button>
        </div>
      ) : (
        <TopBar />
      )}
      {!pathname.includes("/settings/") && children}
      {/* <FooterTemplate /> */}
      <GlobalStyles colors={colors} />
    </Container>
  );
};

const GlobalStyles = createGlobalStyle<{ colors: IColors }>`
  *{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  ${({ colors }) => css`
    body {
      background-color: ${colors.BGDark};
      padding-top: 87px;
    }

    .picker {
      div {
        background: ${colors.BGLighter};
      }
    }
  `}

  a{
    text-decoration: none;
  }
`;

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    .settings-wrapper {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0 20px;

      &__back {
        position: sticky;
        top: 90px;
        right: 0px;
        width: 50px;
        height: 50px;

        display: flex;
        align-items: center;
        justify-content: center;

        border: 2px solid ${colors.textNotSoIntense};
        border-radius: 100%;

        background: transparent;

        color: ${colors.textNotSoIntense};

        &:hover {
          background: ${colors.textIntense + 20};
        }
      }
    }
    @media (max-width: 718px) {
      .settings-wrapper {
        padding: 0;

        &__back {
          position: fixed;
          top: 20px;
          right: 20px;
        }
      }
    }
  `}
`;

export default Layout;
