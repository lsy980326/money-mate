import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import PageContainer from "../components/common/PageContainer";
import Card from "../components/common/Card";
import { StyledButton } from "../components/common/StyledForm";
import { FormGroup } from "../components/common/StyledForm"; // 생활비 입력용
import useGoalStore from "../store/goalStore";
import useIncomeStore from "../store/incomeStore";
import { calculateEstimatedMonthlySavingsCapacity } from "../services/calculationService";
import {
  FaChartLine,
  FaPiggyBank,
  FaBullseye,
  FaLightbulb,
  FaDollarSign,
} from "react-icons/fa";
import tipJson from "../assets/content/tips.json"; // 팁 JSON 파일 경로

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacings.large};
  align-items: stretch; // 카드의 높이를 같게 만드려고 시도
`;

const SummaryValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacings.xsmall};
`;

const QuickLinkButton = styled(StyledButton)`
  display: block;
  width: 100%;
`;

const IconWrapper = styled.span`
  margin-right: ${({ theme }) => theme.spacings.small};
  vertical-align: middle;
  color: ${({ theme }) => theme.colors.primary}; // 아이콘 색상 통일
`;

const DashboardPage: React.FC = () => {
  const {
    targetAmount,
    currentSavings,
    estimatedMonthlyExpenses, // << 스토어에서 가져옴
    setEstimatedMonthlyExpenses, // << 스토어에서 가져옴
  } = useGoalStore();
  const { netMonthlyIncome } = useIncomeStore();

  const monthlyCapacity = calculateEstimatedMonthlySavingsCapacity(
    netMonthlyIncome,
    estimatedMonthlyExpenses
  );
  const achievementRate =
    targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
  const isGoalAchieved = currentSavings >= targetAmount && targetAmount > 0;

  const tips = tipJson.map(
    (tip: { id: number; category: string; content: string }) => tip.content
  );
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  const handleExpensesChangeDashboard = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setEstimatedMonthlyExpenses(isNaN(value) || value < 0 ? 0 : value);
  };

  return (
    <PageContainer>
      <h2 style={{ marginBottom: "24px" }}>대시보드</h2>
      <DashboardGrid>
        <Card
          title={
            <>
              <IconWrapper>
                <FaBullseye />
              </IconWrapper>
              목표 달성 현황
            </>
          }
          footer={
            // Card 컴포넌트의 footer prop 사용
            <Link to="/goal">
              <QuickLinkButton>목표 관리</QuickLinkButton>
            </Link>
          }
        >
          {targetAmount > 0 ? (
            <>
              <SummaryValue>{achievementRate.toFixed(1)}%</SummaryValue>
              <p>총 목표: {targetAmount.toLocaleString()} 원</p>
              <p>현재 달성액: {currentSavings.toLocaleString()} 원</p>
              {isGoalAchieved && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  🎉 목표 달성!
                </p>
              )}
            </>
          ) : (
            <p>
              아직 설정된 목표가 없습니다.{" "}
              <Link
                to="/goal"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                목표를 설정
              </Link>
              해주세요.
            </p>
          )}
        </Card>

        <Card
          title={
            <>
              <IconWrapper>
                <FaPiggyBank />
              </IconWrapper>
              월 저축 여력
            </>
          }
          footer={
            <Link to="/income">
              <QuickLinkButton>수입 관리</QuickLinkButton>
            </Link>
          }
        >
          {netMonthlyIncome > 0 ? (
            <>
              <SummaryValue>{monthlyCapacity.toLocaleString()} 원</SummaryValue>
              <p>(월 실수령액 - 현재 설정된 월 생활비)</p>
              <p>
                현재 설정 생활비: {estimatedMonthlyExpenses.toLocaleString()} 원
              </p>
            </>
          ) : (
            <p>
              수입 정보를 입력해주세요.{" "}
              <Link
                to="/income"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                수입 관리
              </Link>
              로 이동.
            </p>
          )}
        </Card>

        <Card
          title={
            <>
              <IconWrapper>
                <FaDollarSign />
              </IconWrapper>
              월 생활비 설정
            </>
          }
          footer={
            // 데이터 보기 페이지로 연결하여 생활비 포함 상세 분석 유도
            <Link to="/summary">
              <QuickLinkButton>상세 분석 보기</QuickLinkButton>
            </Link>
          }
        >
          <FormGroup>
            <label htmlFor="dashboardMonthlyExpenses">
              월 예상 생활비 (원):
            </label>
            <input
              type="number"
              id="dashboardMonthlyExpenses"
              value={estimatedMonthlyExpenses}
              onChange={handleExpensesChangeDashboard}
              placeholder="예: 1500000"
            />
            <small>입력된 생활비는 모든 계산에 반영됩니다.</small>
          </FormGroup>
        </Card>

        <Card
          title={
            <>
              <IconWrapper>
                <FaChartLine />
              </IconWrapper>
              종합 분석
            </>
          }
          footer={
            <Link to="/summary">
              <QuickLinkButton>데이터 보기</QuickLinkButton>
            </Link>
          }
        >
          <p>
            설정된 목표, 수입, 생활비를 바탕으로 상세한 재정 분석 및 차트를
            확인해보세요.
          </p>
        </Card>

        <Card
          title={
            <>
              <IconWrapper>
                <FaLightbulb />
              </IconWrapper>
              오늘의 절약 팁
            </>
          }
        >
          <p style={{ fontStyle: "italic", lineHeight: 1.6 }}>"{randomTip}"</p>
          {/* 팁 카드에는 별도 버튼이 필요 없을 수 있음 */}
        </Card>
      </DashboardGrid>
    </PageContainer>
  );
};

export default DashboardPage;
