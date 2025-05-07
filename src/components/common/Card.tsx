import React, { ReactNode } from "react";
import styled from "styled-components";

interface CardProps {
  children: ReactNode;
  title?: string | ReactNode; // title도 ReactNode로 변경하여 아이콘 등 포함 가능
  className?: string;
  footer?: ReactNode; // << 추가: 카드 하단에 고정될 내용 (예: 버튼)
}

const CardWrapper = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacings.medium};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: ${({ theme }) => theme.spacings.large};
  display: flex; // << 추가
  flex-direction: column; // << 추가
  height: 100%; // << 추가: 그리드 아이템으로서 높이 채우기
`;

const CardHeader = styled.div`
  // title prop 사용 시 (별도 헤더 영역으로 분리하여 스타일링 용이)
  h3,
  h4 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: ${({ theme }) => theme.spacings.medium};
    display: flex; // 아이콘과 텍스트 정렬을 위해
    align-items: center; // 아이콘과 텍스트 정렬을 위해
  }
`;

const CardBody = styled.div`
  flex-grow: 1; // 내용이 남은 공간을 채우도록
  // p, div 등 카드 내용 관련 기본 스타일 추가 가능
  p {
    line-height: 1.6;
    margin-bottom: ${({ theme }) => theme.spacings.small};
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CardFooterStyled = styled.div`
  margin-top: auto; // 내용을 위로 밀고 푸터는 하단에
  padding-top: ${({ theme }) => theme.spacings.medium}; // 내용과 푸터 사이 간격
`;

const Card: React.FC<CardProps> = ({ children, title, className, footer }) => {
  return (
    <CardWrapper className={className}>
      {title && (
        <CardHeader>
          {typeof title === "string" ? <h3>{title}</h3> : title}
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
      {footer && <CardFooterStyled>{footer}</CardFooterStyled>}
    </CardWrapper>
  );
};

export default Card;
