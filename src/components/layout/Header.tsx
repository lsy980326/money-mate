import React from "react";
import { Link } from "react-router-dom";
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

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: bold;
  color: white;
  text-decoration: none;
`;

const Nav = styled.nav`
  a {
    color: white;
    margin-left: ${({ theme }) => theme.spacings.medium};
    text-decoration: none;
    font-size: ${({ theme }) => theme.fontSizes.medium};

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo to="/">Money Mate</Logo>
      <Nav>
        <Link to="/">대시보드</Link>
        <Link to="/goal">목표 설정</Link>
        <Link to="/income">수입 관리</Link>
        <Link to="/summary">데이터 보기</Link>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
