import styled, { css } from "styled-components";
import { useScholars } from "../../contexts/scholarsContext";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { FiDelete } from "react-icons/fi";

const CategoriesList = () => {
  const { colors } = useTheme();
  const { categories, removeCategory } = useScholars();

  return (
    <Container colors={colors}>
      <div className="category">
        <div className="category__name">Name</div>

        <div className="category__quota">Quota</div>

        <div className="category__color">Color</div>
      </div>

      {categories
        ?.slice()
        .reverse()
        .map((i, idx) => (
          <div key={idx} className="category">
            <div className="category__name">{i.name}</div>

            <div className="category__quota">{i.quota}</div>

            <div className="category__color" style={{ color: i.color }}>
              {i.color}
            </div>
            <button onClick={() => removeCategory(i.name)}>
              <FiDelete />
            </button>
          </div>
        ))}
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    border-radius: 5px;
    overflow: hidden;

    .category {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 30px;
      padding: 5px 10px;

      &:nth-child(odd) {
        background-color: ${colors.BGLight};
      }
      &:nth-child(even) {
        background-color: ${colors.BGLighter + 30};
      }

      button {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: ${colors.danger};
        background-color: transparent;
        border: none;
        cursor: pointer;

        &:hover {
          background-color: ${colors.BGLighter};
          border-radius: 5px;
        }
      }
    }
  `}
`;

export default CategoriesList;
