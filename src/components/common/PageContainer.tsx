// src/components/common/PageContainer.tsx
import styled from "styled-components";

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacings.large};
  max-width: 1000px; // 예시 최대 너비
  margin: 0 auto; // 가운데 정렬
`;

export default PageContainer;
