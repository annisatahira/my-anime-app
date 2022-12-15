import styled from "@emotion/styled";
import { breakPointMediaQuery } from "../utils/helpers";

const mq = breakPointMediaQuery();

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  align-items: center;
  justify-content: center;
  justify-items: center;
  @media (max-width: 300px) {
    grid-template-columns: repeat(1, 1fr);
  }
  ${mq[0]} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${mq[1]} {
    grid-template-columns: repeat(4, 1fr);
  }
  ${mq[2]} {
    grid-template-columns: repeat(5, 1fr);
  }
  margin-bottom: 2rem;
`;

export const LargeList = styled(List)`
  width: 100%;

  grid-template-columns: repeat(1, 1fr);
  row-gap: 2rem;
  ${mq[0]} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${mq[2]} {
    grid-template-columns: repeat(4, 1fr);
  }
`;
