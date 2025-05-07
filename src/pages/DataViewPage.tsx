import React from "react"; // useState는 이제 여기서 직접 사용 안함
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
import PageContainer from "../components/common/PageContainer";
import Card from "../components/common/Card";
import { FormGroup } from "../components/common/StyledForm";

const ChartWrapper = styled(Card)`
  min-height: 350px;
  display: flex;
  flex-direction: column;
  h4 {
    text-align: center;
    margin-bottom: ${({ theme }) => theme.spacings.large};
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const HighlightText = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.success};
`;

const WarningText = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.danger};
`;

const DataViewPage: React.FC = () => {
  const {
    targetAmount,
    targetYears,
    currentSavings,
    estimatedMonthlyExpenses, // << goalStore에서 가져옴
    setEstimatedMonthlyExpenses, // << goalStore에서 가져옴
  } = useGoalStore();
  const { netMonthlyIncome } = useIncomeStore();

  const handleExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setEstimatedMonthlyExpenses(isNaN(value) || value < 0 ? 0 : value);
  };

  const remainingAmountToSave =
    targetAmount - currentSavings > 0 ? targetAmount - currentSavings : 0;
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
  const COLORS_PIE = ["#00C49F", "#FFBB28"];
  const COLORS_BAR = ["#8884d8", "#82ca9d"];

  const isValidData = targetAmount > 0 && netMonthlyIncome > 0;
  let monthsToGoal = Infinity;
  if (estimatedMonthlyCapacity > 0 && remainingAmountToSave > 0) {
    monthsToGoal = Math.ceil(remainingAmountToSave / estimatedMonthlyCapacity);
  } else if (isGoalAchieved) {
    monthsToGoal = 0;
  }

  return (
    <PageContainer>
      <h2>데이터 요약 및 분석</h2>

      <Card title="월간 예상 생활비 설정">
        <FormGroup style={{ maxWidth: "300px" }}>
          <label htmlFor="monthlyExpenses">생활비 입력 (원):</label>
          <input
            type="number"
            id="monthlyExpenses"
            value={estimatedMonthlyExpenses} // 스토어 값 바인딩
            onChange={handleExpensesChange} // 스토어 업데이트
            placeholder="예: 1500000"
          />
        </FormGroup>
      </Card>

      {!isValidData && (
        <Card>
          <p>
            먼저 '목표 설정' 페이지에서 목표금액을, '수입 관리' 페이지에서 수입
            정보를 입력해주세요.
          </p>
        </Card>
      )}

      {isValidData && (
        <>
          <Card title="목표 현황">
            <p>
              <strong>총 목표 금액:</strong> {targetAmount.toLocaleString()} 원
            </p>
            <p>
              <strong>현재까지 모은 금액:</strong>{" "}
              <HighlightText>{currentSavings.toLocaleString()}</HighlightText>{" "}
              원
            </p>
            <p>
              <strong>목표 달성률:</strong>{" "}
              <HighlightText>{achievementRate.toFixed(1)}%</HighlightText>
            </p>
            {!isGoalAchieved && (
              <p>
                <strong>목표까지 남은 금액:</strong>{" "}
                {remainingAmountToSave.toLocaleString()} 원
              </p>
            )}
            {isGoalAchieved && (
              <p>
                <HighlightText>🎉 목표를 이미 달성하셨습니다!</HighlightText>
              </p>
            )}
          </Card>

          {!isGoalAchieved && (
            <Card title="목표 달성을 위한 필요 저축액 (앞으로 남은 기간 기준)">
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
            </Card>
          )}

          <Card title="현재 수입 기준 예상 저축 가능액">
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
                <HighlightText>
                  {" "}
                  {monthsToGoal !== Infinity
                    ? `${Math.floor(monthsToGoal / 12)}년 ${
                        monthsToGoal % 12
                      }개월`
                    : "오랜 시간"}
                </HighlightText>
                소요 예상됩니다.
              </p>
            )}
            {!isGoalAchieved &&
              estimatedMonthlyCapacity < requiredMonthlyForFuture &&
              estimatedMonthlyCapacity > 0 && (
                <p>
                  <WarningText>
                    ⚠️ 목표 달성을 위해 월{" "}
                    {(
                      requiredMonthlyForFuture - estimatedMonthlyCapacity
                    ).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    원이 더 필요합니다.
                  </WarningText>
                </p>
              )}
            {!isGoalAchieved &&
              estimatedMonthlyCapacity <= 0 &&
              netMonthlyIncome > 0 && (
                <p>
                  <WarningText>
                    ⚠️ 현재 생활비로는 저축이 어렵습니다. 생활비 조절이
                    필요합니다.
                  </WarningText>
                </p>
              )}
            {!isGoalAchieved &&
              estimatedMonthlyCapacity >= requiredMonthlyForFuture && (
                <p>
                  <HighlightText>
                    🎉 현재 수입으로 목표 월 저축액 달성이 가능합니다!
                  </HighlightText>
                </p>
              )}
          </Card>

          {!isGoalAchieved && (
            <ChartWrapper title="">
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
            </ChartWrapper>
          )}

          <ChartWrapper title="">
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
                  outerRadius={100}
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
          </ChartWrapper>
        </>
      )}
    </PageContainer>
  );
};

export default DataViewPage;
