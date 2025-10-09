import styled, { css } from "styled-components";

const Row = styled.div`
  display: flex;

  ${({ type }) =>
    type === "vertical"
      ? css`
          flex-direction: column;
          gap: 1.6rem;
        `
      : css`
          justify-content: space-between;
          align-items: center;
        `}
`;

export default Row;
