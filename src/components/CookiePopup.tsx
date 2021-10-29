import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { IoMdClose } from "react-icons/io";

const CookiePopup = () => {
  const { colors } = useTheme();
  const [didAcceptCookiePolicy, setDidAcceptCookiePolicy] = useState(true);

  const acceptCookieClickHandler = () => {
    localStorage.setItem("didAcceptCookiePolicy", "true");
    setDidAcceptCookiePolicy(true);
  };

  useEffect(() => {
    const alreadyRefreshed = localStorage.getItem("didAcceptCookiePolicy");
    if (alreadyRefreshed && alreadyRefreshed === "true") {
      setDidAcceptCookiePolicy(true);
    } else {
      setDidAcceptCookiePolicy(false);
    }
  }, []);

  if (didAcceptCookiePolicy) return null;

  return (
    <Container colors={colors}>
      <div className="cookie-header">
        <img src="/cookie.svg" alt="cookie" />
        Yet another cookie disclaimer!
      </div>
      <p>
        We use cookies to improve your experience on our website (using google
        analytics to find out page views). By using this website, you agree to
        our use of cookies.
      </p>
      <button onClick={acceptCookieClickHandler} className="cookie-close">
        <IoMdClose />
      </button>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    width: 350px;
    border-radius: 20px;
    padding: 40px 30px 30px 30px;

    background-color: ${colors.BGLighter};
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

    position: fixed;
    bottom: 20px;
    right: 20px;

    z-index: 100;

    .cookie-header {
      color: ${colors.textNotSoIntense};
      font-size: 16px;
      display: flex;
      align-items: center;
      font-weight: 600;

      img {
        margin-right: 8px;
        width: 70px;
      }
    }

    p {
      font-size: 13px;
      margin-top: 20px;
      color: ${colors.textNotSoIntense};
    }

    .cookie-close {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 35px;
      height: 35px;
      border-radius: 20px;
      border: none;

      font-size: 25px;

      display: flex;
      justify-content: center;
      align-items: center;

      background-color: ${colors.BGLight};
      color: ${colors.textNotSoIntense};
      cursor: pointer;
    }

    @media (max-width: 400px) {
      width: calc(100% - 20px);
      right: 10px;
      bottom: 10px;
    }
  `}
`;

export default CookiePopup;
