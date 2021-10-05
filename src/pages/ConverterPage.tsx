import styled from "styled-components";
import Converter from "../components/Converter";

const ConverterPage = () => {
  return (
    <Container>
      <Converter />
    </Container>
  );
};

const Container = styled.div`
  padding-top: 20px;
`;

export default ConverterPage;
