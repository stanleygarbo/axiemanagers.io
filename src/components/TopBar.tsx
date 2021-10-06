import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { FiSearch, FiSettings } from "react-icons/fi";
// import { CgArrowsExchangeV } from "react-icons/cg";

import { useScreenSize } from "../contexts/screenSizeContext";
import SearchScholar from "./SearchScholar";
import { Link, useHistory, useLocation, withRouter } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

const TopBar = () => {
  const { colors } = useTheme();
  const { pathname } = useLocation();
  const { goBack, push } = useHistory();

  const { screenWidth } = useScreenSize();

  return (
    <Container colors={colors}>
      <div className="announcement">
        <div className="announcement__content">
          <div className="announcement__content__text">
            <span>
              <Link to="/donate">DONATE</Link>
              {/* NOTICE */}
            </span>
            <div
              className="announcement__content__text__moving"
              dangerouslySetInnerHTML={{
                __html:
                  '<marquee behavior="scroll" scrollamount="2" direction="left">If you find this app useful please consider donating.</marquee>',
              }}
            ></div>
          </div>
          <ul className="announcement__content__links">
            {screenWidth > 500 && (
              <li>
                <a href="mailto:digitalmadlad@gmail.com">Contact</a>
              </li>
            )}
            {/* <li>
              <Link to="/about">About</Link>
            </li> */}
            <li>
              <Link to="/converter">Converter</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrapper">
        <div className="wrapper__logo">
          {pathname === "/" ? (
            "axiemanagers.io"
          ) : (
            <MdArrowBack className="icon" onClick={goBack} size={30} />
          )}
          {pathname === "/add-scholar"
            ? "Add Scholar"
            : pathname === "/donate"
            ? "Donate"
            : pathname === "/about"
            ? "About"
            : pathname === "/converter"
            ? "Converter"
            : pathname.includes("/scholar")
            ? "Account details"
            : pathname.includes("/settings") && "Settings"}
        </div>
        {pathname !== "/search" && (
          <div className="wrapper__controls">
            <button
              onClick={() =>
                push(screenWidth > 1000 ? "/settings/bulk-import" : "/settings")
              }
            >
              <FiSettings size={22} />
            </button>

            {/* <button onClick={() => push("/converter")}>
              <CgArrowsExchangeV size={22} />
            </button> */}
            {screenWidth > 708 ? (
              <SearchScholar />
            ) : (
              <button onClick={() => push("/search")}>
                <FiSearch size={22} />
              </button>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

const Container = styled.nav<{ colors: IColors }>`
  ${({ colors }) => css`
    background: ${colors.BGLight};
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;

    .announcement {
      width: 100%;
      color: ${colors.textIntense};
      font-size: 13px;
      border-bottom: 1px solid ${colors.textIntense + 20};
      padding: 5px 0;

      &__content {
        max-width: 1200px;
        padding: 0 20px;

        margin: 0 auto;
        display: flex;
        justify-content: space-between;

        &__text {
          display: flex;
          align-items: center;

          &__moving {
            display: flex;
            align-items: center;
          }

          span {
            font-size: 11px;
            background-color: ${colors.danger};
            padding: 1px 5px;
            margin-right: 5px;
            border-radius: 5px;

            a {
              color: #fff;
              text-decoration: underline;
            }
          }
          a {
            color: ${colors.accent2};
          }
        }

        ul {
          display: flex;
          list-style-type: none;

          a {
            text-decoration: none;
            color: ${colors.textNotSoIntense};
            margin-left: 10px;
            padding: 5px;
          }
        }
      }
    }

    .wrapper {
      max-width: 1200px;

      height: 56px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid ${colors.BGDark};
      padding: 0px 20px;

      &__logo {
        color: ${colors.textIntense};
        font-size: 18px;
        font-weight: 500;
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          cursor: pointer;

          &:active {
            /* background-color: ${colors.textIntense + 20}; */
            opacity: 0.6;
          }

          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          -webkit-tap-highlight-color: transparent;
        }
      }

      &__controls {
        display: flex;

        button {
          background-color: ${colors.textIntense + "05"};
          border: 1px solid ${colors.textIntense + 10};
          color: ${colors.textNotSoIntense};
          width: 37px;
          height: 37px;
          border-radius: 5px;

          display: grid;
          place-items: center;
          margin-left: 10px;
        }
      }
    }

    @media (max-width: 493px) {
      .announcement {
        &__content {
          padding: 0 10px;
        }
      }
      .wrapper {
        padding: 0px 10px;
      }
    }
  `}
`;

export default withRouter(TopBar);
