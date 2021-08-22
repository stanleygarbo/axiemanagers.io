import React from "react";
import { ILayout } from "../interfaces/ILayout";
import styled, { createGlobalStyle, css } from "styled-components";
import TopBar from "../components/TopBar";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { Helmet } from "react-helmet-async";

const Layout: React.FC<ILayout> = ({ children }) => {
  const { colors } = useTheme();

  return (
    <Container>
      <Helmet>
        <meta name="theme" content={colors.BGLight} />
        <meta name="theme-color" content={colors.BGLight} />
      </Helmet>
      <TopBar />
      {children}
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

const Container = styled.div``;

export default Layout;
