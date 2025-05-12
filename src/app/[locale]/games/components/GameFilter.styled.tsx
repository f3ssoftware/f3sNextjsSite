import { Card } from "primereact/card";
import styled from "styled-components";

export const GameFilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  width: 100%;
  padding: 1rem;
`;

export const GameCard = styled(Card)`
  aspect-ratio: 1;
  width: 100%;
  height: 100%;
  min-height: 200px;
  max-height: 300px;
  overflow: hidden;
  
  .p-card-body {
    padding: 0;
    height: 100%;
  }
  
  .p-card-content {
    padding: 0;
    height: 100%;
  }
`;
