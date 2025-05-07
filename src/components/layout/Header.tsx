// src/components/layout/Header.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacings.medium}
    ${({ theme }) => theme.spacings.large};
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(NavLink)`
  // 로고도 NavLink로 변경 가능 (홈으로 가므로)
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex; // 링크들을 가로로 배열
  gap: ${({ theme }) => theme.spacings.medium}; // 링크 사이 간격
`;

// NavLink에 직접 스타일을 적용하기 위해 styled(NavLink) 사용
const StyledNavLink = styled(NavLink)`
  color: white;
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  padding: ${({ theme }) => theme.spacings.xsmall}
    ${({ theme }) => theme.spacings.small};
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  // 활성화된 링크 스타일
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: bold;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo to="/">Money Mate</Logo>
      <Nav>
        <StyledNavLink to="/">대시보드</StyledNavLink>
        <StyledNavLink to="/goal">목표 설정</StyledNavLink>
        <StyledNavLink to="/income">수입 관리</StyledNavLink>
        <StyledNavLink to="/summary">데이터 보기</StyledNavLink>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
