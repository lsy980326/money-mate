import React, { useState, useEffect } from "react";
import styled from "styled-components";
import useIncomeStore from "../store/incomeStore"; // incomeStore import

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

const IncomePage: React.FC = () => {
  const {
    annualSalary,
    netMonthlyIncome,
    expectedAnnualRaiseRate,
    setAnnualSalary,
    setNetMonthlyIncome,
    setExpectedAnnualRaiseRate,
  } = useIncomeStore();

  // 로컬 상태로 입력 값 관리
  const [localAnnualSalary, setLocalAnnualSalary] = useState<string>(
    annualSalary.toString()
  );
  const [localNetMonthlyIncome, setLocalNetMonthlyIncome] = useState<string>(
    netMonthlyIncome.toString()
  );
  const [localExpectedRaiseRate, setLocalExpectedRaiseRate] = useState<string>(
    expectedAnnualRaiseRate.toString()
  );

  // Zustand 상태가 변경되면 로컬 상태도 업데이트
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

    alert("수입 정보가 저장되었습니다!");
  };

  return (
    <PageContainer>
      <h2>수입 정보 관리</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
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
        <Button type="submit">수입 정보 저장</Button>
      </Form>

      <InfoDisplay>
        <h3>현재 수입 정보</h3>
        <p>연봉 (세전): {annualSalary.toLocaleString()} 원</p>
        <p>월 실수령액: {netMonthlyIncome.toLocaleString()} 원</p>
        <p>예상 연봉 상승률: {expectedAnnualRaiseRate} %</p>
      </InfoDisplay>
    </PageContainer>
  );
};

export default IncomePage;
