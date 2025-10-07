import styled, { css } from "styled-components";

// If we want to include js expressions inside the template then we need to use css from styled-components
// If not only the string will suffice
// const test = css`
//     background-color: ${1>2 ? 'red':'black'};
// `
//WE can then include the string into the template string

const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}

    line-height: 1.4;
`;

export default Heading;
