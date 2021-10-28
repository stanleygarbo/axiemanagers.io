import { useState } from "react";
import styled from "styled-components";
import { IModalWrapper } from "../../interfaces/modal/IModalWrapper";

const ModalWrapper: React.FC<IModalWrapper> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (isOpen)
    return (
      <Container>
        {children}
        <div onClick={() => setIsOpen(false)} className="modal-backdrop"></div>
      </Container>
    );

  return null;
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -11;
    cursor: pointer;
  }
`;

export default ModalWrapper;
