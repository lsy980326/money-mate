import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useGoalStore from "../store/goalStore";

// 스타일 컴포넌트는 이전과 동일하게 유지 (또는 공통 컴포넌트로 분리)
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
  const {
    targetAmount,
    targetYears,
    currentSavings, // << 추가됨
    setTargetAmount,
    setTargetYears,
    setCurrentSavings, // << 추가됨
  } = useGoalStore();

  const [localTargetAmount, setLocalTargetAmount] = useState<string>(
    targetAmount.toString()
  );
  const [localTargetYears, setLocalTargetYears] = useState<string>(
    targetYears.toString()
  );
  const [localCurrentSavings, setLocalCurrentSavings] = useState<string>(
    currentSavings.toString()
  ); // << 추가됨

  useEffect(() => {
    setLocalTargetAmount(targetAmount.toString());
  }, [targetAmount]);
  useEffect(() => {
    setLocalTargetYears(targetYears.toString());
  }, [targetYears]);
  useEffect(() => {
    setLocalCurrentSavings(currentSavings.toString());
  }, [currentSavings]); // << 추가됨

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = parseFloat(localTargetAmount);
    const years = parseInt(localTargetYears, 10);
    const savings = parseFloat(localCurrentSavings); // << 추가됨

    if (!isNaN(amount)) setTargetAmount(amount);
    if (!isNaN(years)) setTargetYears(years);
    if (!isNaN(savings)) setCurrentSavings(savings); // << 추가됨

    alert("목표가 저장되었습니다!");
  };

  const requiredAnnualSavings =
    targetYears > 0 ? (targetAmount - currentSavings) / targetYears : 0; // << 수정됨: 남은 금액 기준
  const requiredMonthlySavings =
    requiredAnnualSavings > 0 ? requiredAnnualSavings / 12 : 0;

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
        <FormGroup>
          {" "}
          {/* << 추가된 부분 시작 */}
          <label htmlFor="currentSavings">현재까지 모은 금액 (원):</label>
          <input
            type="number"
            id="currentSavings"
            value={localCurrentSavings}
            onChange={(e) => setLocalCurrentSavings(e.target.value)}
            placeholder="예: 5000000"
            min="0"
          />
        </FormGroup>{" "}
        {/* << 추가된 부분 끝 */}
        <Button type="submit">목표 저장</Button>
      </Form>

      <InfoDisplay>
        <h3>설정된 목표</h3>
        <p>목표 금액: {targetAmount.toLocaleString()} 원</p>
        <p>목표 기간: {targetYears} 년</p>
        <p>현재까지 모은 금액: {currentSavings.toLocaleString()} 원</p>{" "}
        {/* << 추가됨 */}
        {targetAmount > 0 && targetYears > 0 && (
          <>
            <hr style={{ margin: "10px 0" }} />
            <p>
              <strong>앞으로</strong> 연간 필요 저축액:{" "}
              {requiredAnnualSavings > 0
                ? requiredAnnualSavings.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })
                : "0"}{" "}
              원
            </p>
            <p>
              <strong>앞으로</strong> 월간 필요 저축액:{" "}
              {requiredMonthlySavings > 0
                ? requiredMonthlySavings.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })
                : "0"}{" "}
              원
            </p>
            {currentSavings >= targetAmount && (
              <p style={{ color: "green" }}>🎉 목표를 이미 달성하셨습니다!</p>
            )}
          </>
        )}
      </InfoDisplay>
    </PageContainer>
  );
};

export default GoalPage;
