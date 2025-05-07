import React, { useState, useEffect } from "react";
// import styled from 'styled-components'; // 페이지 내 스타일 정의 삭제
import useIncomeStore from "../store/incomeStore";
import PageContainer from "../components/common/PageContainer"; // 공통 컴포넌트 import
import Card from "../components/common/Card"; // 공통 컴포넌트 import
import {
  FormContainer,
  FormGroup,
  StyledButton,
} from "../components/common/StyledForm"; // 공통 컴포넌트 import

// 페이지 내에 있던 스타일 컴포넌트 정의들(PageContainer, Form, FormGroup, Button, InfoDisplay)은 삭제합니다.

const IncomePage: React.FC = () => {
  const {
    annualSalary,
    netMonthlyIncome,
    expectedAnnualRaiseRate,
    setAnnualSalary,
    setNetMonthlyIncome,
    setExpectedAnnualRaiseRate,
  } = useIncomeStore();

  const [localAnnualSalary, setLocalAnnualSalary] = useState<string>(
    annualSalary.toString()
  );
  const [localNetMonthlyIncome, setLocalNetMonthlyIncome] = useState<string>(
    netMonthlyIncome.toString()
  );
  const [localExpectedRaiseRate, setLocalExpectedRaiseRate] = useState<string>(
    expectedAnnualRaiseRate.toString()
  );

  useEffect(() => {
    setLocalAnnualSalary(annualSalary.toString());
  }, [annualSalary]);
  useEffect(() => {
    setLocalNetMonthlyIncome(netMonthlyIncome.toString());
  }, [netMonthlyIncome]);
  useEffect(() => {
    setLocalExpectedRaiseRate(expectedAnnualRaiseRate.toString());
  }, [expectedAnnualRaiseRate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const salary = parseFloat(localAnnualSalary);
    const monthlyIncome = parseFloat(localNetMonthlyIncome);
    const raiseRate = parseFloat(localExpectedRaiseRate);

    if (!isNaN(salary)) setAnnualSalary(salary);
    if (!isNaN(monthlyIncome)) setNetMonthlyIncome(monthlyIncome);
    if (!isNaN(raiseRate)) setExpectedAnnualRaiseRate(raiseRate);

    alert("수입 정보가 저장되었습니다!"); // 나중에 토스트 메시지 등으로 개선 가능
  };

  return (
    <PageContainer>
      {" "}
      {/* 공통 PageContainer 사용 */}
      <h2>수입 정보 관리</h2>
      <FormContainer onSubmit={handleSubmit}>
        {" "}
        {/* 공통 FormContainer 사용 */}
        <FormGroup>
          {" "}
          {/* 공통 FormGroup 사용 */}
          <label htmlFor="annualSalary">연봉 (세전, 원):</label>
          <input
            type="number"
            id="annualSalary"
            value={localAnnualSalary}
            onChange={(e) => setLocalAnnualSalary(e.target.value)}
            placeholder="예: 50000000"
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="netMonthlyIncome">월 실수령액 (원):</label>
          <input
            type="number"
            id="netMonthlyIncome"
            value={localNetMonthlyIncome}
            onChange={(e) => setLocalNetMonthlyIncome(e.target.value)}
            placeholder="예: 3500000"
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="expectedRaiseRate">예상 연봉 상승률 (%):</label>
          <input
            type="number"
            id="expectedRaiseRate"
            value={localExpectedRaiseRate}
            onChange={(e) => setLocalExpectedRaiseRate(e.target.value)}
            placeholder="예: 5 (0~100 사이)"
            min="0"
            max="100"
          />
        </FormGroup>
        <StyledButton type="submit">수입 정보 저장</StyledButton>{" "}
        {/* 공통 StyledButton 사용 */}
      </FormContainer>
      <Card title="현재 수입 정보">
        {" "}
        {/* 공통 Card 사용, title prop 활용 */}
        <p>연봉 (세전): {annualSalary.toLocaleString()} 원</p>
        <p>월 실수령액: {netMonthlyIncome.toLocaleString()} 원</p>
        <p>예상 연봉 상승률: {expectedAnnualRaiseRate} %</p>
      </Card>
    </PageContainer>
  );
};

export default IncomePage;
