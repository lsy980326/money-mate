import React, { useState } from "react";
import styled from "styled-components";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import useGoalStore from "../store/goalStore";
import useIncomeStore from "../store/incomeStore";
import {
  calculateRequiredAnnualSavings,
  calculateRequiredMonthlySavings,
  calculateEstimatedAnnualSavingsCapacity,
  calculateEstimatedMonthlySavingsCapacity,
} from "../services/calculationService";

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacings.large};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.xlarge};
`;

const SummarySection = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacings.medium};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  h3 {
    margin-bottom: ${({ theme }) => theme.spacings.medium};
    color: ${({ theme }) => theme.colors.primary};
  }
  p {
    font-size: ${({ theme }) => theme.fontSizes.medium};
    line-height: 1.8;
    margin-bottom: ${({ theme }) => theme.spacings.xsmall};
    strong {
      font-weight: bold;
    }
  }
`;

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacings.medium};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: 300px; /* 차트 최소 높이 */

  h4 {
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacings.large};
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

// 월간 예상 생활비 입력 (임시)
const ExpenseInputContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacings.medium};
  label {
    margin-right: ${({ theme }) => theme.spacings.small};
  }
  input {
    padding: ${({ theme }) => theme.spacings.xsmall};
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const DataViewPage: React.FC = () => {
  const { targetAmount, targetYears } = useGoalStore();
  const { netMonthlyIncome } = useIncomeStore();

  // 임시로 월간 예상 생활비 상태 관리
  const [estimatedMonthlyExpenses, setEstimatedMonthlyExpenses] =
    useState<number>(0);

  const handleExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setEstimatedMonthlyExpenses(isNaN(value) || value < 0 ? 0 : value);
  };

  // 계산된 값들
  const requiredAnnual = calculateRequiredAnnualSavings(
    targetAmount,
    targetYears
  );
  const requiredMonthly = calculateRequiredMonthlySavings(requiredAnnual);

  const estimatedAnnualCapacity = calculateEstimatedAnnualSavingsCapacity(
    netMonthlyIncome,
    estimatedMonthlyExpenses
  );
  const estimatedMonthlyCapacity = calculateEstimatedMonthlySavingsCapacity(
    netMonthlyIncome,
    estimatedMonthlyExpenses
  );

  // 차트 데이터 (월간 기준 비교)
  const monthlyComparisonData = [
    { name: "목표 월 저축액", value: Math.round(requiredMonthly) },
    {
      name: "예상 월 저축 가능액",
      value: Math.round(estimatedMonthlyCapacity),
    },
  ];

  // 목표 달성까지 남은 금액 (간단화된 버전, 현재 저축액 없다고 가정)
  const remainingAmount = targetAmount > 0 ? targetAmount : 0;
  const progressData = [
    { name: "현재 달성액 (가상)", value: 0 }, // 실제 저축액 기능 추가 시 변경
    { name: "남은 목표액", value: remainingAmount },
  ];
  const COLORS = ["#00C49F", "#FF8042"]; // 초록, 주황

  const isValidData =
    targetAmount > 0 && targetYears > 0 && netMonthlyIncome > 0;

  return (
    <PageContainer>
      <h2>데이터 요약 및 분석</h2>

      <ExpenseInputContainer>
        <label htmlFor="monthlyExpenses">월간 예상 생활비 (원):</label>
        <input
          type="number"
          id="monthlyExpenses"
          value={estimatedMonthlyExpenses}
          onChange={handleExpensesChange}
          placeholder="예: 1500000"
        />
      </ExpenseInputContainer>

      {!isValidData && (
        <SummarySection>
          <p>먼저 '목표 설정' 및 '수입 관리' 페이지에서 정보를 입력해주세요.</p>
        </SummarySection>
      )}

      {isValidData && (
        <>
          <SummarySection>
            <h3>목표 달성을 위한 필요 저축액</h3>
            <p>
              <strong>연간 필요 저축액:</strong>{" "}
              {requiredAnnual.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              원
            </p>
            <p>
              <strong>월간 필요 저축액:</strong>{" "}
              {requiredMonthly.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              원
            </p>
          </SummarySection>

          <SummarySection>
            <h3>현재 수입 기준 예상 저축 가능액</h3>
            <p>
              <strong>예상 연간 저축 가능액:</strong>{" "}
              {estimatedAnnualCapacity.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              원
            </p>
            <p>
              <strong>예상 월간 저축 가능액:</strong>{" "}
              {estimatedMonthlyCapacity.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}{" "}
              원
            </p>
            {estimatedMonthlyCapacity < requiredMonthly && (
              <p style={{ color: "red", marginTop: "10px" }}>
                ⚠️ 목표 달성을 위해 월{" "}
                {(requiredMonthly - estimatedMonthlyCapacity).toLocaleString(
                  undefined,
                  { maximumFractionDigits: 0 }
                )}{" "}
                원이 더 필요합니다.
              </p>
            )}
            {estimatedMonthlyCapacity >= requiredMonthly && (
              <p style={{ color: "green", marginTop: "10px" }}>
                🎉 현재 수입으로 목표 월 저축액 달성이 가능합니다!
              </p>
            )}
          </SummarySection>

          <ChartContainer>
            <h4>월간 저축액 비교</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyComparisonData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) =>
                    `${(value / 10000).toLocaleString()} 만원`
                  }
                />
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString()} 원`}
                />
                <Legend />
                <Bar dataKey="value" name="금액 (원)">
                  {monthlyComparisonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* 간단한 목표 달성도 (현재 저축액이 없으므로 항상 0%로 표시됨) */}
          {/* <ChartContainer>
            <h4>목표 달성도 (가상)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} 원`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer> */}
        </>
      )}
    </PageContainer>
  );
};

export default DataViewPage;
