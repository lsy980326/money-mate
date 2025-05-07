import React, { useState, useEffect } from "react";
// import styled from 'styled-components'; // 페이지 내 스타일 정의 삭제
import useGoalStore from "../store/goalStore";
import PageContainer from "../components/common/PageContainer"; // 공통 컴포넌트 import
import Card from "../components/common/Card"; // 공통 컴포넌트 import
import {
  FormContainer,
  FormGroup,
  StyledButton,
} from "../components/common/StyledForm"; // 공통 컴포넌트 import

// 페이지 내에 있던 스타일 컴포넌트 정의들(PageContainer, Form, FormGroup, Button, InfoDisplay)은 삭제합니다.

const GoalPage: React.FC = () => {
  const {
    targetAmount,
    targetYears,
    currentSavings,
    setTargetAmount,
    setTargetYears,
    setCurrentSavings,
  } = useGoalStore();

  const [localTargetAmount, setLocalTargetAmount] = useState<string>(
    targetAmount.toString()
  );
  const [localTargetYears, setLocalTargetYears] = useState<string>(
    targetYears.toString()
  );
  const [localCurrentSavings, setLocalCurrentSavings] = useState<string>(
    currentSavings.toString()
  );

  useEffect(() => {
    setLocalTargetAmount(targetAmount.toString());
  }, [targetAmount]);
  useEffect(() => {
    setLocalTargetYears(targetYears.toString());
  }, [targetYears]);
  useEffect(() => {
    setLocalCurrentSavings(currentSavings.toString());
  }, [currentSavings]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = parseFloat(localTargetAmount);
    const years = parseInt(localTargetYears, 10);
    const savings = parseFloat(localCurrentSavings);

    if (!isNaN(amount)) setTargetAmount(amount);
    if (!isNaN(years)) setTargetYears(years);
    if (!isNaN(savings)) setCurrentSavings(savings);

    alert("목표가 저장되었습니다!"); // 나중에 토스트 메시지 등으로 개선 가능
  };

  const requiredAnnualSavings =
    targetYears > 0 ? (targetAmount - currentSavings) / targetYears : 0;
  const requiredMonthlySavings =
    requiredAnnualSavings > 0 ? requiredAnnualSavings / 12 : 0;
  const isGoalAchieved = currentSavings >= targetAmount && targetAmount > 0;

  return (
    <PageContainer>
      {" "}
      {/* 공통 PageContainer 사용 */}
      <h2>목표 설정</h2>
      <FormContainer onSubmit={handleSubmit}>
        {" "}
        {/* 공통 FormContainer 사용 */}
        <FormGroup>
          {" "}
          {/* 공통 FormGroup 사용 */}
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
          <label htmlFor="currentSavings">현재까지 모은 금액 (원):</label>
          <input
            type="number"
            id="currentSavings"
            value={localCurrentSavings}
            onChange={(e) => setLocalCurrentSavings(e.target.value)}
            placeholder="예: 5000000"
            min="0"
          />
        </FormGroup>
        <StyledButton type="submit">목표 저장</StyledButton>{" "}
        {/* 공통 StyledButton 사용 */}
      </FormContainer>
      <Card title="설정된 목표">
        {" "}
        {/* 공통 Card 사용, title prop 활용 */}
        <p>목표 금액: {targetAmount.toLocaleString()} 원</p>
        <p>목표 기간: {targetYears} 년</p>
        <p>현재까지 모은 금액: {currentSavings.toLocaleString()} 원</p>
        {(targetAmount > 0 || currentSavings > 0) && ( // 목표 금액이나 현재 저축액이 있을 때만 표시
          <>
            <hr style={{ margin: "10px 0" }} />
            {!isGoalAchieved && targetYears > 0 && (
              <>
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
              </>
            )}
            {isGoalAchieved && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                🎉 목표를 이미 달성하셨습니다!
              </p>
            )}
          </>
        )}
        {targetAmount <= 0 && currentSavings <= 0 && (
          <p>목표를 설정해주세요.</p>
        )}
      </Card>
    </PageContainer>
  );
};

export default GoalPage;
