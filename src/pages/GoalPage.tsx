import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useGoalStore from "../store/goalStore"; // Zustand 스토어 import

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacings.large};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.medium};
  max-width: 400px;
  margin-bottom: ${({ theme }) => theme.spacings.large};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  label {
    margin-bottom: ${({ theme }) => theme.spacings.xsmall};
    font-weight: bold;
  }
  input {
    padding: ${({ theme }) => theme.spacings.small};
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacings.medium};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.dark};
  }
`;

const InfoDisplay = styled.div`
  margin-top: ${({ theme }) => theme.spacings.large};
  padding: ${({ theme }) => theme.spacings.medium};
  background-color: ${({ theme }) => theme.colors.light};
  border: 1px solid #eee;
  border-radius: 4px;

  h3 {
    margin-bottom: ${({ theme }) => theme.spacings.small};
  }
  p {
    font-size: ${({ theme }) => theme.fontSizes.medium};
  }
`;

const GoalPage: React.FC = () => {
  // Zustand 스토어에서 상태와 액션 가져오기
  const { targetAmount, targetYears, setTargetAmount, setTargetYears } =
    useGoalStore();

  // 로컬 상태로 입력 값 관리
  const [localTargetAmount, setLocalTargetAmount] = useState<string>(
    targetAmount.toString()
  );
  const [localTargetYears, setLocalTargetYears] = useState<string>(
    targetYears.toString()
  );

  // Zustand 상태가 변경되면 로컬 상태도 업데이트
  useEffect(() => {
    setLocalTargetAmount(targetAmount.toString());
  }, [targetAmount]);

  useEffect(() => {
    setLocalTargetYears(targetYears.toString());
  }, [targetYears]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = parseFloat(localTargetAmount);
    const years = parseInt(localTargetYears, 10);

    if (!isNaN(amount)) {
      setTargetAmount(amount); // Zustand 액션 호출
    }
    if (!isNaN(years)) {
      setTargetYears(years); // Zustand 액션 호출
    }
    alert("목표가 저장되었습니다!");
  };

  const requiredAnnualSavings =
    targetYears > 0 ? targetAmount / targetYears : 0;
  const requiredMonthlySavings = requiredAnnualSavings / 12;

  return (
    <PageContainer>
      <h2>목표 설정</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label htmlFor="targetAmount">목표 금액 (원):</label>
          <input
            type="number"
            id="targetAmount"
            value={localTargetAmount}
            onChange={(e) => setLocalTargetAmount(e.target.value)}
            placeholder="예: 100000000"
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="targetYears">목표 기간 (년):</label>
          <input
            type="number"
            id="targetYears"
            value={localTargetYears}
            onChange={(e) => setLocalTargetYears(e.target.value)}
            placeholder="예: 5"
            min="1"
          />
        </FormGroup>
        <Button type="submit">목표 저장</Button>
      </Form>

      <InfoDisplay>
        <h3>설정된 목표</h3>
        <p>목표 금액: {targetAmount.toLocaleString()} 원</p>
        <p>목표 기간: {targetYears} 년</p>
        {targetAmount > 0 && targetYears > 0 && (
          <>
            <hr style={{ margin: "10px 0" }} />
            <p>
              연간 필요 저축액:{" "}
              {requiredAnnualSavings.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              원
            </p>
            <p>
              월간 필요 저축액:{" "}
              {requiredMonthlySavings.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              원
            </p>
          </>
        )}
      </InfoDisplay>
    </PageContainer>
  );
};

export default GoalPage;
