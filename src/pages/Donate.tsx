import React from "react";
import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import copy from "copy-to-clipboard";
import { BiClipboard } from "react-icons/bi";
import Button from "../components/Button";

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    p {
      max-width: 700px;
      font-size: 1rem;
      line-height: 1.4rem;
      margin-top: 20px;
      color: ${colors.textNotSoIntense};
    }
    .field {
      margin-top: 20px;
      font-size: 1rem;
      color: ${colors.textNotSoIntense};
      button {
        width: 30px;
        height: 30px;
        margin-right: 10px;
      }
      section {
        display: flex;
        width: 100%;
      }
      &__content {
        background-color: ${colors.BGDark};
        border: 1px solid ${colors.textIntense + 20};
        padding: 2px 10px;
        border-radius: 5px;
        overflow-x: scroll;
        font-size: 1rem;
        width: 100%;
        display: flex;
        align-items: center;
        &::-webkit-scrollbar {
          display: none;
        }
      }
    }
  `}
`;

const Donate = () => {
  const { colors } = useTheme();

  const clipboardButtonStyles = {
    padding: 2,
    borderRadius: 5,
    color: colors.textNotSoIntense,
  };

  return (
    <Container colors={colors}>
      {/* <p>
        Developed by Digital Mad Lad, a computer science student from the
        Philippines. Your donations will gladly be appreciated as it will help
        with the computing costs of this tracker and keep our proxy servers up
        and running.
      </p> */}
      <div className="field">
        Gcash:{" "}
        <section>
          <Button
            bgColor={colors.textIntense + 20}
            style={clipboardButtonStyles}
            onClick={() => copy("0916 585 8589 (Stanley Garbo)")}
          >
            <BiClipboard size={25} />
          </Button>
          <div className="field__content"> 0916 585 8589 (Stanley G.)</div>
        </section>
      </div>
      <div className="field">
        Ethereum:
        <section>
          <Button
            bgColor={colors.textIntense + 20}
            style={clipboardButtonStyles}
            onClick={() => copy("0xe1E362fc8984c9E550eF52C8d03Ca41987A9E4Ff")}
          >
            <BiClipboard size={25} />
          </Button>
          <div className="field__content">
            {" "}
            0xe1E362fc8984c9E550eF52C8d03Ca41987A9E4Ff
          </div>
        </section>
      </div>
      <div className="field">
        Ronin:
        <section>
          <Button
            bgColor={colors.textIntense + 20}
            style={clipboardButtonStyles}
            onClick={() =>
              copy("ronin:23ec98ca5e0f1610bbdede7455e7862cfb66e7ae")
            }
          >
            <BiClipboard size={25} />
          </Button>
          <div className="field__content">
            {" "}
            ronin:23ec98ca5e0f1610bbdede7455e7862cfb66e7ae
          </div>
        </section>
      </div>

      <p>
        Further improvements will come to axiemanagers.io, I will be adding gas
        fees, bulk import and much more! thank you so much! Want to get in
        touch? Email me:{" "}
        <a
          style={{ color: colors.accent2 }}
          href="mailto:contact@axiemanagers.io"
        >
          contact@axiemanagers.io
        </a>
      </p>
    </Container>
  );
};

export default Donate;
