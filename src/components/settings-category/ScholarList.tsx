import styled, { css } from "styled-components";
import { useScholars } from "../../contexts/scholarsContext";
import { useTheme } from "../../contexts/themeContext";
import { IColors } from "../../interfaces/IColors";
import { IScholars } from "../../interfaces/IScholarsContext";
import SelectCategory from "./SelectCategory";

const ScholarList = () => {
  const { scholars, updateScholar } = useScholars();
  const { colors } = useTheme();

  const onSelect = ({
    category,
    nickname,
    color,
    ronin,
    managerShare,
  }: IScholars) => {
    updateScholar({ nickname, ronin, color, managerShare, category });
  };

  return (
    <Container colors={colors}>
      <div className="scholar">
        <div className="scholar__name">Name</div>
        <div className="scholar__color">Color</div>
        <div className="scholar__category">Category</div>
      </div>
      {scholars?.map((i, idx) => (
        <div className="scholar" key={idx}>
          <div className="scholar__name">{i.nickname}</div>
          <div className="scholar__color" style={{ color: i.color }}>
            {i.color}
          </div>
          <div className="scholar__category">
            <SelectCategory
              onSelect={(category) => onSelect({ ...i, category })}
              size="small"
              currentCategory={i.category}
            />
          </div>
        </div>
      ))}
    </Container>
  );
};

const Container = styled.div<{ colors: IColors }>`
  ${({ colors }) => css`
    border-radius: 5px;
    overflow: hidden;

    .scholar {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      padding: 5px 10px;

      &:nth-child(odd) {
        background-color: ${colors.BGLight};
      }
      &:nth-child(even) {
        background-color: ${colors.BGLighter + 30};
      }
    }
  `}
`;

export default ScholarList;
