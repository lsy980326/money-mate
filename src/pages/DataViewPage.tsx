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
  calculateRequiredAnnualSavings, // 이 함수는 이제 GoalPage에서 남은 금액 기준으로 사용되므로, 여기서의 의미가 조금 다를 수 있음
  calculateRequiredMonthlySavings, // 위와 동일
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
  .highlight {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.success};
  }
  .warning {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacings.medium};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  min-height: 300px;

  h4 {
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacings.large};
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

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
  const { targetAmount, targetYears, currentSavings } = useGoalStore(); // << currentSavings 추가
  const { netMonthlyIncome } = useIncomeStore();

  const [estimatedMonthlyExpenses, setEstimatedMonthlyExpenses] =
    useState<number>(0);

  const handleExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setEstimatedMonthlyExpenses(isNaN(value) || value < 0 ? 0 : value);
  };

  // "앞으로" 더 모아야 할 금액
  const remainingAmountToSave =
    targetAmount - currentSavings > 0 ? targetAmount - currentSavings : 0;

  // "앞으로" 기간 내에 모으기 위한 필요 저축액
  const requiredAnnualForFuture = calculateRequiredAnnualSavings(
    remainingAmountToSave,
    targetYears
  );
  const requiredMonthlyForFuture = calculateRequiredMonthlySavings(
    requiredAnnualForFuture
  );

  const estimatedAnnualCapacity = calculateEstimatedAnnualSavingsCapacity(
    netMonthlyIncome,
    estimatedMonthlyExpenses
  );
  const estimatedMonthlyCapacity = calculateEstimatedMonthlySavingsCapacity(
    netMonthlyIncome,
    estimatedMonthlyExpenses
  );

  // 목표 달성률
  const achievementRate =
    targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
  const isGoalAchieved = currentSavings >= targetAmount && targetAmount > 0;

  const monthlyComparisonData = [
    {
      name: "목표 월 저축액 (앞으로)",
      value: Math.round(requiredMonthlyForFuture),
    },
    {
      name: "예상 월 저축 가능액",
      value: Math.round(estimatedMonthlyCapacity),
    },
  ];

  const progressData = [
    { name: "현재 달성액", value: currentSavings },
    { name: "남은 목표액", value: remainingAmountToSave },
  ];
  const COLORS_PIE = ["#00C49F", "#FFBB28"]; // Pie Chart 색상 (초록, 노랑)
  const COLORS_BAR = ["#8884d8", "#82ca9d"]; // Bar Chart 색상 (보라, 연두)

  const isValidData = targetAmount > 0 && netMonthlyIncome > 0; // targetYears는 이제 남은 기간 계산에만 영향

  // 예상 목표 달성까지 남은 기간 (개월)
  let monthsToGoal = Infinity;
  if (estimatedMonthlyCapacity > 0 && remainingAmountToSave > 0) {
    monthsToGoal = Math.ceil(remainingAmountToSave / estimatedMonthlyCapacity);
  } else if (isGoalAchieved) {
    monthsToGoal = 0;
  }

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
          <p>
            먼저 '목표 설정' 페이지에서 목표금액을, '수입 관리' 페이지에서 수입
            정보를 입력해주세요.
          </p>
        </SummarySection>
      )}

      {isValidData && (
        <>
          <SummarySection>
            <h3>목표 현황</h3>
            <p>
              <strong>총 목표 금액:</strong> {targetAmount.toLocaleString()} 원
            </p>
            <p>
              <strong>현재까지 모은 금액:</strong>{" "}
              <span className={isGoalAchieved ? "highlight" : ""}>
                {currentSavings.toLocaleString()}
              </span>{" "}
              원
            </p>
            <p>
              <strong>목표 달성률:</strong>{" "}
              <span className={isGoalAchieved ? "highlight" : ""}>
                {achievementRate.toFixed(1)}%
              </span>
            </p>
            {!isGoalAchieved && (
              <p>
                <strong>목표까지 남은 금액:</strong>{" "}
                {remainingAmountToSave.toLocaleString()} 원
              </p>
            )}
            {isGoalAchieved && (
              <p className="highlight">🎉 목표를 이미 달성하셨습니다!</p>
            )}
          </SummarySection>

          {!isGoalAchieved && (
            <SummarySection>
              <h3>목표 달성을 위한 필요 저축액 (앞으로 남은 기간 기준)</h3>
              <p>
                <strong>남은 목표 기간:</strong> {targetYears} 년
              </p>
              <p>
                <strong>연간 필요 저축액:</strong>{" "}
                {requiredAnnualForFuture.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                원
              </p>
              <p>
                <strong>월간 필요 저축액:</strong>{" "}
                {requiredMonthlyForFuture.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                원
              </p>
            </SummarySection>
          )}

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
            {!isGoalAchieved && estimatedMonthlyCapacity > 0 && (
              <p>
                현재 저축페이스라면 목표 달성까지 약
                <span className="highlight">
                  {" "}
                  {monthsToGoal !== Infinity
                    ? `${Math.floor(monthsToGoal / 12)}년 ${
                        monthsToGoal % 12
                      }개월`
                    : "오랜 시간"}{" "}
                </span>
                소요 예상됩니다.
              </p>
            )}
            {!isGoalAchieved &&
              estimatedMonthlyCapacity < requiredMonthlyForFuture &&
              estimatedMonthlyCapacity > 0 && (
                <p className="warning">
                  ⚠️ 목표 달성을 위해 월{" "}
                  {(
                    requiredMonthlyForFuture - estimatedMonthlyCapacity
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  원이 더 필요합니다.
                </p>
              )}
            {!isGoalAchieved && estimatedMonthlyCapacity <= 0 && (
              <p className="warning">
                ⚠️ 현재 생활비로는 저축이 어렵습니다. 생활비 조절이 필요합니다.
              </p>
            )}
            {!isGoalAchieved &&
              estimatedMonthlyCapacity >= requiredMonthlyForFuture && (
                <p className="highlight">
                  🎉 현재 수입으로 목표 월 저축액 달성이 가능합니다!
                </p>
              )}
          </SummarySection>

          {!isGoalAchieved && (
            <ChartContainer>
              <h4>월간 저축액 비교 (앞으로 필요한 금액 vs 가능액)</h4>
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
                    formatter={(value: number) =>
                      `${value.toLocaleString()} 원`
                    }
                  />
                  <Legend />
                  <Bar dataKey="value" name="금액 (원)">
                    {monthlyComparisonData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_BAR[index % COLORS_BAR.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}

          <ChartContainer>
            <h4>목표 달성도</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={progressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100} // 크기 약간 키움
                  fill="#8884d8"
                  dataKey="value"
                >
                  {progressData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS_PIE[index % COLORS_PIE.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${value.toLocaleString()} 원`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}
    </PageContainer>
  );
};

export default DataViewPage;
