import React, { ReactNode } from "react";
import styled from "styled-components";
import Header from "../components/layout/Header";
interface MainLayoutProps {
  children: ReactNode;
}

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.main`
  flex-grow: 1;
  padding: ${({ theme }) => theme.spacings.medium};
  max-width: 1200px; /* 콘텐츠 최대 너비 (예시) */
  margin: 0 auto; /* 가운데 정렬 */
  width: 100%;
`;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Content>{children}</Content>
      {/* <Footer /> */} {/* 필요하다면 푸터 추가 */}
    </LayoutContainer>
  );
};

export default MainLayout;
