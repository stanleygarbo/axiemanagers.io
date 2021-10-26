import styled, { css } from "styled-components";
import {
  ISelectCategory,
  ISelectCategorySizes,
} from "../../interfaces/settings-category/ISelectCategory";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { useScholars } from "../../contexts/scholarsContext";
import { IoIosArrowDown } from "react-icons/io";
import { useHistory, useLocation } from "react-router";

const SelectCategory: React.FC<ISelectCategory> = ({
  size,
  currentCategory,
  onSelect,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { categories } = useScholars();
  const [searchText, setSearchText] = useState<string>("");
  const history = useHistory();
  const { pathname } = useLocation();

  return (
    <Container size={size} colors={colors}>
      <button
        className="select-btn"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        {currentCategory ? currentCategory : "Not set"}
        <IoIosArrowDown style={{ marginLeft: 7 }} />
      </button>
      {isOpen ? (
        <div className="modal">
          <div
            className="modal__backdrop"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="modal__box">
            <div className="modal__box__header">
              <div className="modal__box__header__title">Select a category</div>
            </div>
            <div className="modal__box__search">
              <input
                autoFocus
                type="text"
                placeholder="Search category"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            {categories.length > 1 && <p>Recently added</p>}
            <div className="modal__box__recent">
              {categories.map(
                (i, idx) =>
                  idx < 3 && (
                    <div
                      onClick={() => {
                        if (onSelect) {
                          onSelect(i.name);
                        }
                        setIsOpen(false);
                      }}
                      className="modal__box__recent__item"
                      key={idx}
                    >
                      <div
                        className="modal__box__recent__item__color"
                        style={{ background: i.color }}
                      ></div>
                      <div className="modal__box__recent__item__name">
                        {i.name}
                      </div>
                    </div>
                  )
              )}
            </div>
            <div className="modal__box__list">
              {categories.map(
                (i, idx) =>
                  i.name.toLowerCase().includes(searchText.toLowerCase()) && (
                    <div
                      onClick={() => {
                        if (onSelect) {
                          onSelect(i.name);
                        }
                        setIsOpen(false);
                      }}
                      key={idx}
                      className="modal__box__list__item"
                    >
                      <div
                        className="modal__box__list__item__color"
                        style={{ background: i.color }}
                      ></div>
                      <div className="modal__box__list__item__text">
                        <div className="modal__box__list__item__text__title">
                          {i.name}
                        </div>
                        <div className="modal__box__list__item__text__subtitle">
                          Quota = {i.quota}
                        </div>
                      </div>
                    </div>
                  )
              )}
              {categories.length < 1 && (
                <p style={{ textAlign: "center" }}>No categories added.</p>
              )}
            </div>
            <div className="modal__box__footer">
              <button
                type="button"
                onClick={() => {
                  if (pathname !== "/settings/min-quota") {
                    history.push("/settings/min-quota");
                  } else {
                    setIsOpen(false);
                  }
                }}
              >
                <BiEdit style={{ fontSize: 20, marginRight: 5 }} />
                Manage categories
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </Container>
  );
};

const Container = styled.div<{ colors: IColors; size: ISelectCategorySizes }>`
  ${({ colors, size }) => css`
    .select-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      background-color: ${colors.textIntense + 20};
      color: ${colors.textIntense};
      border: none;
      border-radius: 5px;
      white-space: nowrap;

      ${size === "small" &&
      css`
        padding: 2px 8px 2px 10px;
      `}
      ${size === "medium" &&
      css`
        padding: 8px 8px 8px 10px;
      `}
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 11;

      display: grid;
      place-items: center;

      &__backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
      }

      &__box {
        z-index: 1;

        background-color: ${colors.BGLight};

        width: 450px;
        padding-top: 20px;
        border-radius: 20px;
        border: 1px solid ${colors.textIntense + 20};
        overflow: hidden;

        &__header,
        &__search {
          padding: 0px 20px;
        }
        p {
          margin: 0px;
          padding: 0px;
          margin-top: 10px;
          margin-left: 20px;
          font-size: 15px;
          color: ${colors.textNotSoIntense};
        }

        &__recent {
          display: flex;
          flex-wrap: wrap;
          padding: 5px 20px 0px 20px;
          color: ${colors.textIntense};

          &__item {
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-right: 10px;
            border: 1px solid ${colors.textIntense + 20};
            padding: 1px 8px;
            border-radius: 5px;
            font-size: 16px;

            &:hover {
              background-color: ${colors.BGLighter};
            }

            &__color {
              width: 17px;
              height: 17px;
              border-radius: 10px;
              margin-right: 5px;
            }
          }
        }

        &__header {
          &__title {
            color: ${colors.textIntense};
            font-size: 16px;
            font-weight: 600;
          }
        }

        &__search {
          margin-top: 15px;
          width: 100%;

          input {
            background-color: ${colors.BGLight};
            border: 1px solid ${colors.textIntense + 20};
            border-radius: 15px;
            padding: 10px 20px;
            font-size: 18px;
            outline: none;
            width: 100%;
            color: ${colors.textIntense};

            &:focus {
              border: 1px solid ${colors.accent};
            }

            &::placeholder {
              color: ${colors.textNotSoIntense};
            }
          }
        }

        &__list {
          margin-top: 20px;
          border-top: 1px solid ${colors.textIntense + 20};
          overflow-y: auto;
          height: 150px;

          &__item {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            cursor: pointer;

            &:hover {
              background-color: ${colors.BGLighter};
            }

            &__color {
              margin-right: 15px;
              width: 25px;
              height: 25px;
              border-radius: 5px;
            }

            &__text {
              line-height: 18px;

              &__title {
                color: ${colors.textIntense};
                font-size: 17px;
              }
              &__subtitle {
                font-size: 12px;
                color: ${colors.textNotSoIntense};
              }
            }
          }
        }

        &__footer {
          padding: 15px 0px;
          width: 100%;
          display: flex;
          justify-content: center;
          background-color: ${colors.BGLighter};

          button {
            display: flex;
            align-items: center;
            font-size: 16px;

            color: ${colors.accent};
            background-color: transparent;

            border: none;
            cursor: pointer;
            padding: 0;
          }
        }
      }
    }

    @media (max-width: 470px) {
      .modal {
        padding: 10px;
        &__box {
          width: 100%;
        }
      }
    }
  `}
`;

export default SelectCategory;
