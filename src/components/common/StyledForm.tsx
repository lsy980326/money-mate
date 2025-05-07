// src/components/common/StyledForm.tsx
import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.medium};
  max-width: 450px; // 폼 최대 너비
  margin-bottom: ${({ theme }) => theme.spacings.large};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: ${({ theme }) => theme.spacings.xsmall};
    font-weight: bold;
    font-size: ${({ theme }) => theme.fontSizes.small}; // 레이블 폰트 조정
  }
  input[type="number"],
  input[type="text"] {
    // 다른 타입의 input도 고려
    padding: ${({ theme }) => theme.spacings.small}
      ${({ theme }) => theme.spacings.medium};
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
      outline: none;
      box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
    }
  }
  /* 추가: 입력 필드 아래 설명 텍스트 등 */
  small {
    font-size: ${({ theme }) => theme.fontSizes.small};
    color: ${({ theme }) => theme.colors.secondary};
    margin-top: ${({ theme }) => theme.spacings.xsmall};
  }
`;

export const StyledButton = styled.button`
  padding: ${({ theme }) => theme.spacings.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.dark}; // 좀 더 어두운 primary 색으로 변경 가능
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary};
    cursor: not-allowed;
  }
`;
