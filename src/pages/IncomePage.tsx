import React, { useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
} from "recharts";
import useIncomeStore, { DistributionItem } from "../store/incomeStore";
import PageContainer from "../components/common/PageContainer";
import Card from "../components/common/Card";
import {
  FormContainer,
  FormGroup,
  StyledButton,
} from "../components/common/StyledForm";
import { calculateMonthlyDistribution } from "../services/calculationService";
import {
  FaPlusCircle,
  FaTrashAlt,
  FaEdit,
  FaSave,
  FaLockOpen,
  FaLock,
} from "react-icons/fa";

const IncomeSectionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(450px, 1fr)
  ); /* 카드 최소 너비 조정 */
  gap: ${({ theme }) => theme.spacings.large};
`;

interface DistributionItemRowProps {
  isMarkedForAuto?: boolean;
}

const DistributionItemRow = styled.div<DistributionItemRowProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.small};
  margin-bottom: ${({ theme }) => theme.spacings.medium};
  padding: ${({ theme }) => theme.spacings.small};
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: 4px;
  background-color: #f9f9f9;

  ${({ isMarkedForAuto }) =>
    isMarkedForAuto &&
    css`
      background-color: #e6ffed;
      border-left: 3px solid ${({ theme }) => theme.colors.success};
      /* outline: 1px solid ${({ theme }) => theme.colors.success}33; */
    `}

  input, select {
    padding: ${({ theme }) => theme.spacings.xsmall}
      ${({ theme }) => theme.spacings.small};
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
    &:disabled {
      background-color: #eee;
      color: #777;
      cursor: not-allowed;
    }
  }
  input[type="text"] {
    flex-grow: 1;
    min-width: 100px;
  }
  select {
    min-width: 100px;
  }
  input[type="number"] {
    width: 80px;
  }
  .item-name-display {
    flex-grow: 1;
    min-width: 100px;
    font-weight: 500;
  }
  .item-config-display {
    min-width: 100px;
    color: #555;
    font-size: 0.85rem;
  }
  .allocated-amount {
    min-width: 100px;
    text-align: right;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacings.xsmall};
  margin-left: auto;
  button {
    background: none;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.secondary};
    padding: 4px; // 클릭 영역 확보
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
    font-size: 1.1rem;
    &.active {
      color: ${({ theme }) => theme.colors.success};
    }
    &:disabled {
      color: #ccc;
      cursor: not-allowed;
    }
  }
`;

const SummaryText = styled.p`
  font-weight: bold;
  margin-top: ${({ theme }) => theme.spacings.small};
  font-size: 1.1rem;
  &.warning {
    color: ${({ theme }) => theme.colors.danger};
  }
  &.success {
    color: ${({ theme }) => theme.colors.success};
  }
`;

const COLORS_PIE = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#A28D1F",
  "#FF3E88",
];

const IncomePage: React.FC = () => {
  const {
    annualSalary,
    netMonthlyIncome,
    expectedAnnualRaiseRate,
    distributionPlan,
    autoAllocateItemIds,
    setAnnualSalary,
    setNetMonthlyIncome,
    setExpectedAnnualRaiseRate,
    addDistributionItem,
    updateDistributionItem,
    removeDistributionItem,
    resetDistributionPlan,
    toggleAutoAllocateItem,
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
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<DistributionItem>>(
    {}
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

  const handleIncomeInfoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const salary = parseFloat(localAnnualSalary);
    const monthlyIncome = parseFloat(localNetMonthlyIncome);
    const raiseRate = parseFloat(localExpectedRaiseRate);
    if (!isNaN(salary)) setAnnualSalary(salary);
    if (!isNaN(monthlyIncome)) setNetMonthlyIncome(monthlyIncome);
    if (!isNaN(raiseRate)) setExpectedAnnualRaiseRate(raiseRate);
    alert("수입 정보가 저장되었습니다!");
  };

  const calculatedDistribution = useMemo(() => {
    if (netMonthlyIncome <= 0) {
      return {
        planWithAllocations: distributionPlan.map((p) => ({
          ...p,
          allocatedAmount: 0,
          isAutoAllocated: autoAllocateItemIds.includes(p.id),
        })),
        totalAllocated: 0,
        remainingAmount: 0,
        warnings: ["월 실수령액을 먼저 입력해주세요."],
      };
    }
    return calculateMonthlyDistribution(
      netMonthlyIncome,
      distributionPlan,
      autoAllocateItemIds
    );
  }, [netMonthlyIncome, distributionPlan, autoAllocateItemIds]);

  const handleAddItem = () => {
    addDistributionItem({ name: "새 항목", type: "percentage", value: 0 });
  };

  const handleStartEdit = (item: DistributionItem) => {
    // 자동 할당 중인 항목은 편집 모드로 들어가지 않음 (토글로 해제 후 편집)
    if (autoAllocateItemIds.includes(item.id)) return;
    setEditingItemId(item.id);
    setEditFormData({ name: item.name, type: item.type, value: item.value });
  };

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type: inputType } = e.target;
    let processedValue: string | number | "percentage" | "fixed" =
      value as string;

    if (name === "value" && inputType === "number") {
      processedValue = parseFloat(value) || 0;
    } else if (name === "type") {
      processedValue = value as "percentage" | "fixed";
    }
    setEditFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSaveEdit = (id: string) => {
    if (
      editFormData.name &&
      editFormData.type &&
      editFormData.value !== undefined
    ) {
      const type = editFormData.type as "percentage" | "fixed";
      updateDistributionItem(id, {
        name: editFormData.name,
        type: type,
        value: editFormData.value,
      });
    }
    setEditingItemId(null);
    setEditFormData({});
  };

  const handleToggleAuto = (itemId: string) => {
    setEditingItemId(null); // 자동 할당 토글 시 편집 모드 해제
    toggleAutoAllocateItem(itemId);
  };

  const chartData = calculatedDistribution.planWithAllocations
    .filter((item) => item.allocatedAmount > 0)
    .map((item) => ({
      name: item.name,
      value: Math.round(item.allocatedAmount),
    }));

  return (
    <PageContainer>
      <h2>수입 정보 및 월급 분배 계획</h2>
      <IncomeSectionsGrid>
        <Card title="수입 정보">
          <FormContainer onSubmit={handleIncomeInfoSubmit}>
            <FormGroup>
              <label htmlFor="annualSalary">연봉 (세전, 원):</label>
              <input
                type="number"
                id="annualSalary"
                value={localAnnualSalary}
                onChange={(e) => setLocalAnnualSalary(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="netMonthlyIncome">월 실수령액 (원):</label>
              <input
                type="number"
                id="netMonthlyIncome"
                value={localNetMonthlyIncome}
                onChange={(e) => setLocalNetMonthlyIncome(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <label htmlFor="expectedRaiseRate">예상 연봉 상승률 (%):</label>
              <input
                type="number"
                id="expectedRaiseRate"
                value={localExpectedRaiseRate}
                onChange={(e) => setLocalExpectedRaiseRate(e.target.value)}
                min="0"
                max="100"
              />
            </FormGroup>
            <StyledButton type="submit">수입 정보 저장</StyledButton>
          </FormContainer>
          <h4 style={{ marginTop: "20px" }}>현재 수입 정보</h4>
          <p>연봉 (세전): {annualSalary.toLocaleString()} 원</p>
          <p>월 실수령액: {netMonthlyIncome.toLocaleString()} 원</p>
          <p>예상 연봉 상승률: {expectedAnnualRaiseRate} %</p>
        </Card>

        <Card title="월급 분배 계획">
          {distributionPlan.map((item) => {
            const allocatedItemData =
              calculatedDistribution.planWithAllocations.find(
                (p) => p.id === item.id
              );
            const isMarkedAuto = autoAllocateItemIds.includes(item.id);

            return (
              <DistributionItemRow key={item.id} isMarkedForAuto={isMarkedAuto}>
                {editingItemId === item.id && !isMarkedAuto ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name || ""}
                      onChange={handleEditFormChange}
                      placeholder="항목명"
                    />
                    <select
                      name="type"
                      value={editFormData.type || "percentage"}
                      onChange={handleEditFormChange}
                    >
                      <option value="percentage">비율(%)</option>
                      <option value="fixed">고정(원)</option>
                    </select>
                    <input
                      type="number"
                      name="value"
                      value={editFormData.value || 0}
                      onChange={handleEditFormChange}
                      min="0"
                      step={editFormData.type === "percentage" ? 1 : 1000}
                    />
                    <ItemActions>
                      <button
                        onClick={() => handleSaveEdit(item.id)}
                        title="저장"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => setEditingItemId(null)}
                        title="취소"
                      >
                        <FaEdit style={{ transform: "rotate(45deg)" }} />
                      </button>{" "}
                      {/* 임시 취소 아이콘 */}
                    </ItemActions>
                  </>
                ) : (
                  <>
                    <span className="item-name-display">{item.name}</span>
                    <span className="item-config-display">
                      (
                      {isMarkedAuto
                        ? "자동 분배"
                        : item.type === "percentage"
                        ? `${item.value}%`
                        : `${item.value.toLocaleString()}원`}
                      )
                    </span>
                    <span className="allocated-amount">
                      {allocatedItemData
                        ? allocatedItemData.allocatedAmount.toLocaleString()
                        : 0}{" "}
                      원
                    </span>
                    <ItemActions>
                      <button
                        onClick={() => handleToggleAuto(item.id)}
                        title={
                          isMarkedAuto
                            ? "자동 분배 해제"
                            : "자동 분배 대상 선택"
                        }
                        className={isMarkedAuto ? "active" : ""}
                      >
                        {isMarkedAuto ? <FaLock /> : <FaLockOpen />}
                      </button>
                      <button
                        onClick={() => handleStartEdit(item)}
                        title="수정"
                        disabled={isMarkedAuto}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => removeDistributionItem(item.id)}
                        title="삭제"
                      >
                        <FaTrashAlt />
                      </button>
                    </ItemActions>
                  </>
                )}
              </DistributionItemRow>
            );
          })}
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <StyledButton
              onClick={handleAddItem}
              style={{ backgroundColor: "#6c757d" }}
            >
              <FaPlusCircle style={{ marginRight: "5px" }} /> 항목 추가
            </StyledButton>
            <StyledButton
              onClick={resetDistributionPlan}
              style={{ backgroundColor: "#dc3545" }}
            >
              기본값으로 리셋
            </StyledButton>
          </div>

          <h4 style={{ marginTop: "20px" }}>분배 결과 요약</h4>
          {calculatedDistribution.warnings.map((warning, index) => (
            <SummaryText key={index} className="warning">
              {warning}
            </SummaryText>
          ))}
          <SummaryText>
            총 분배액: {calculatedDistribution.totalAllocated.toLocaleString()}{" "}
            원
          </SummaryText>
          {calculatedDistribution.remainingAmount >= 0 ? (
            <SummaryText className="success">
              남은 금액:{" "}
              {calculatedDistribution.remainingAmount.toLocaleString()} 원
            </SummaryText>
          ) : (
            <SummaryText className="warning">
              초과된 금액:{" "}
              {Math.abs(
                calculatedDistribution.remainingAmount
              ).toLocaleString()}{" "}
              원 ({netMonthlyIncome.toLocaleString()}원 중)
            </SummaryText>
          )}

          {chartData.length > 0 && netMonthlyIncome > 0 && (
            <div style={{ height: "300px", marginTop: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    labelLine={false}
                    label={({ name, percent, value }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    } // 라벨 간소화
                    fill="#8884d8"
                  >
                    {chartData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_PIE[index % COLORS_PIE.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, name: string, props: any) => {
                      const percentage = props.payload.percent * 100;
                      return [
                        `${value.toLocaleString()} 원 (${percentage.toFixed(
                          1
                        )}%)`,
                        name,
                      ];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </IncomeSectionsGrid>
    </PageContainer>
  );
};

export default IncomePage;
