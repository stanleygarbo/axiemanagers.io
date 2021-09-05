import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";

const Announcement = () => {
  const { colors } = useTheme();

  return (
    <Container colors={colors}>
      The reason why "Today SLP" might be removed from our site is because of
      how much addresses we have to track every reset-time. The larger the
      number of addresses in the list the more time it will take to fetch data
      for those addresses in the end of the list. In the developer community of
      axie infinity, I'd say we've been pretty generous on the cache time for
      the data of your scholars in order to prevent spamming the official API.
      We've also heard rumors that sometimes the server gets caught on fire due
      to this, so it might be best if we disable it for now.
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    max-width: 1190px;
    padding: 20px;
    margin: 20px auto;

    color: ${colors.textNotSoIntense};
  `}
`;

export default Announcement;
