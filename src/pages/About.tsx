import styled, { css } from "styled-components";
import { useTheme } from "../contexts/themeContext";
import { IColors } from "../interfaces/IColors";
import { FaDiscord } from "react-icons/fa";
// import { AiFillGithub } from "react-icons/ai";

const About = () => {
  const { colors } = useTheme();

  // https://discord.com/users/756368831944982599

  return (
    <Container colors={colors}>
      <div className="dev">
        <div className="dev__profile">
          <div className="dev__profile__name-img">
            <div
              className="dev__profile__name-img__img"
              style={{
                backgroundImage: `url(/thoma.jpg)`,
              }}
            ></div>
            <div className="dev__profile__name-img__name">
              <span className="dev__profile__name-img__name__first">
                Digital Mad Lad
              </span>{" "}
              <span className="dev__profile__name-img__name__last"></span>
              <div className="dev__profile__name-img__name__discord">
                Digital Mad Lad#4215
              </div>
            </div>
          </div>
          <div className="dev__profile__socials">
            {/* <div className="dev__profile__socials__github">
              <a
                target="_blank"
                href="https://discord.com/users/756368831944982599"
                rel="noreferrer"
              >
                <AiFillGithub size={30} />
              </a>
            </div> */}

            {/* <div className="dev__profile__socials__facebook">
              <a
                target="_blank"
                href="https://facebook.com/stanley.garbo29"
                rel="noreferrer"
              >
                <FaFacebookSquare size={25} />
              </a>
            </div> */}
            <div className="dev__profile__socials__discord">
              <a
                target="_blank"
                href="https://discord.com/users/756368831944982599"
                rel="noreferrer"
              >
                <FaDiscord size={25} />
              </a>
            </div>
          </div>
        </div>
        <div className="dev__about">
          <div className="dev__about__short-bio">
            18 y/o <span>With High Honors</span> Gamer/Programmer
          </div>
          <p>
            I am currently a 1st year college student and I have been a
            consistent honor student when I was in senior highschool. I decided
            to build axiemanagers.io hoping that this would get noticed by
            managers by providing value first.
          </p>

          <p>
            Why must I be your next scholar? Aside from being a well-performing
            student, I'm good at managing my time, I can also provide value and
            be your voluntary community developer/programmer.
          </p>

          <p>
            I made this tool hoping to be noticed by managers and get a
            scholarship.
          </p>

          <p>
            EDIT: I am no longer looking for a manager, I hope you like the site
            :)
          </p>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(378px, 570px));
    grid-gap: 20px;

    .dev {
      padding: 20px;
      position: relative;
      background-color: ${colors.BGLight};
      border-radius: 5px;
      border: 1px solid ${colors.textIntense + 20};

      &__profile {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        padding-bottom: 20px;

        &::before {
          content: "";
          position: absolute;
          bottom: 0px;
          left: 0;
          height: 1px;
          width: 60%;
          background-color: ${colors.textIntense + 20};
        }

        &__name-img {
          display: flex;
          align-items: center;

          &__img {
            width: 60px;
            height: 60px;
            border-radius: 25px;
            background-size: 200%;
            background-position: center 0px;
            background-repeat: no-repeat;
          }
          &__name {
            font-size: 1.2rem;
            font-weight: 600;
            line-height: 1.5rem;
            color: ${colors.textIntense};

            display: flex;
            flex-direction: column;

            margin-left: 10px;

            /* &__last {
              margin-left: 20px;
            } */

            &__discord {
              font-size: 12px;
              color: ${colors.textNotSoIntense};
            }
          }
        }

        &__socials {
          display: flex;
          align-items: center;

          a {
            color: ${colors.textNotSoIntense};
            margin-left: 10px;
          }
        }
      }

      &__about {
        color: ${colors.textNotSoIntense};

        &__short-bio {
          text-align: center;
          font-size: 13px;
          padding: 20px 0;
          position: relative;

          span {
            padding: 0 5px;
            border-left: 1px solid ${colors.textIntense + 20};
            border-right: 1px solid ${colors.textIntense + 20};
          }

          &::before {
            content: "";
            position: absolute;
            bottom: 0px;
            right: 0;
            height: 1px;
            width: 60%;
            background-color: ${colors.textIntense + 20};
          }
        }

        p {
          margin-top: 20px;
          font-size: 15px;
        }
      }
    }

    @media (max-width: 420px) {
      grid-template-columns: repeat(auto-fit, minmax(318px, 1fr));

      .dev {
        padding: 0;
        background-color: transparent;
        border: none;
        margin-bottom: 50px;
      }
    }
  `}
`;

export default About;
