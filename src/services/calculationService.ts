import type { DistributionItem } from "../store/incomeStore";
/**
 * 연간 필요 저축액 계산
 * @param targetAmount 목표 금액
 * @param targetYears 목표 기간 (년)
 * @returns 연간 필요 저축액
 */
export const calculateRequiredAnnualSavings = (
  targetAmount: number,
  targetYears: number
): number => {
  if (targetYears <= 0 || targetAmount <= 0) return 0;
  return targetAmount / targetYears;
};

/**
 * 월간 필요 저축액 계산
 * @param requiredAnnualSavings 연간 필요 저축액
 * @returns 월간 필요 저축액
 */
export const calculateRequiredMonthlySavings = (
  requiredAnnualSavings: number
): number => {
  if (requiredAnnualSavings <= 0) return 0;
  return requiredAnnualSavings / 12;
};

/**
 * 예상 연간 저축 가능액 계산
 * @param netMonthlyIncome 월 실수령액
 * @param estimatedMonthlyExpenses (가정) 월간 예상 생활비
 * @returns 예상 연간 저축 가능액
 */
export const calculateEstimatedAnnualSavingsCapacity = (
  netMonthlyIncome: number,
  estimatedMonthlyExpenses: number = 0
): number => {
  if (netMonthlyIncome <= 0) return 0;
  const monthlySavingsCapacity = netMonthlyIncome - estimatedMonthlyExpenses;
  return monthlySavingsCapacity > 0 ? monthlySavingsCapacity * 12 : 0;
};

/**
 * 예상 월간 저축 가능액 계산
 * @param netMonthlyIncome 월 실수령액
 * @param estimatedMonthlyExpenses (가정) 월간 예상 생활비
 * @returns 예상 월간 저축 가능액
 */
export const calculateEstimatedMonthlySavingsCapacity = (
  netMonthlyIncome: number,
  estimatedMonthlyExpenses: number = 0
): number => {
  if (netMonthlyIncome <= 0) return 0;
  const monthlySavingsCapacity = netMonthlyIncome - estimatedMonthlyExpenses;
  return monthlySavingsCapacity > 0 ? monthlySavingsCapacity : 0;
};

// 월급 분배 계산 관련 인터페이스 및 함수
export interface CalculatedDistribution {
  planWithAllocations: (DistributionItem & {
    allocatedAmount: number;
    isAutoAllocated?: boolean;
  })[];
  totalAllocated: number;
  remainingAmount: number;
  warnings: string[];
}

export const calculateMonthlyDistribution = (
  netMonthlyIncome: number,
  plan: DistributionItem[],
  autoAllocateItemIds: string[] // 복수형 ID 배열
): CalculatedDistribution => {
  let availableAmountForManualDistribution = netMonthlyIncome; // 고정값 및 명시적 비율 항목에 분배될 수 있는 총액
  const warnings: string[] = [];

  // isAutoAllocated 플래그를 포함하여 plan 복사 및 allocatedAmount 초기화
  const planWithAllocations: (DistributionItem & {
    allocatedAmount: number;
    isAutoAllocated?: boolean;
  })[] = plan.map((item) => ({
    ...item,
    allocatedAmount: 0,
    isAutoAllocated: autoAllocateItemIds.includes(item.id),
  }));

  // 1. 고정 금액 항목 우선 계산 (자동 할당 대상이 아닌 항목만)
  planWithAllocations.forEach((item) => {
    if (item.type === "fixed" && !item.isAutoAllocated) {
      item.allocatedAmount = item.value;
      availableAmountForManualDistribution -= item.value;
    }
  });

  if (availableAmountForManualDistribution < 0) {
    const fixedSum = netMonthlyIncome - availableAmountForManualDistribution;
    warnings.push(
      `고정 지출 합계(${fixedSum.toLocaleString()}원)가 월 실수령액(${netMonthlyIncome.toLocaleString()}원)을 초과합니다! 비율 및 자동 할당은 0원으로 처리됩니다.`
    );
    availableAmountForManualDistribution = 0; // 더 이상 분배할 금액 없음
  }

  // 2. 명시적 비율 항목 계산 (자동 할당 대상이 아닌 항목만)
  let totalPercentageExplicitlySet = 0;

  planWithAllocations.forEach((item) => {
    if (item.type === "percentage" && !item.isAutoAllocated) {
      totalPercentageExplicitlySet += item.value;
      const calculated = Math.max(
        0,
        (availableAmountForManualDistribution * item.value) / 100
      );
      item.allocatedAmount = calculated;
    }
  });

  if (totalPercentageExplicitlySet > 100) {
    warnings.push(
      `자동 할당을 제외한 비율 항목의 총합이 ${totalPercentageExplicitlySet}% 입니다. 100%를 초과했습니다. 각 항목은 사용 가능한 금액 내에서 비율만큼 할당됩니다.`
    );
  }

  // 3. 자동 할당 항목들에 남은 금액 분배
  const autoItems = planWithAllocations.filter((item) => item.isAutoAllocated);
  if (autoItems.length > 0) {
    let sumOfManuallySetAllocations = 0; // 고정값 + 명시적 비율로 이미 할당된 총액
    planWithAllocations.forEach((item) => {
      if (!item.isAutoAllocated) {
        sumOfManuallySetAllocations += item.allocatedAmount;
      }
    });

    const amountToDistributeAmongAutoItems = Math.max(
      0,
      netMonthlyIncome - sumOfManuallySetAllocations
    );
    const amountPerAutoItem =
      autoItems.length > 0
        ? amountToDistributeAmongAutoItems / autoItems.length
        : 0;

    autoItems.forEach((item) => {
      item.allocatedAmount = amountPerAutoItem;
    });

    if (
      netMonthlyIncome - sumOfManuallySetAllocations < 0 &&
      amountToDistributeAmongAutoItems === 0
    ) {
      warnings.push(
        "고정 및 명시적 비율 지출이 이미 월 소득을 초과하여 자동할당 항목은 0원입니다."
      );
    }
  }

  // 4. 최종 총 분배액 및 잔액 계산
  let totalAllocated = 0;
  planWithAllocations.forEach((item) => {
    totalAllocated += item.allocatedAmount;
  });

  const finalRemainingAmount = netMonthlyIncome - totalAllocated;

  if (Math.abs(finalRemainingAmount) > 0.01) {
    // 부동소수점 오차 감안 (1원 미만은 무시 가능)
    if (finalRemainingAmount < -0.01) {
      // 음수인 경우 (초과)
      warnings.push(
        `최종 분배액(${totalAllocated.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}원)이 월 실수령액(${netMonthlyIncome.toLocaleString()}원)을 ${Math.abs(
          finalRemainingAmount
        ).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}원 초과합니다!`
      );
    } else if (finalRemainingAmount > 0.01) {
      // 양수인 경우 (잔액)
      // 자동 할당 항목이 하나라도 있으면, 이론적으로 잔액은 0에 가까워야 함.
      if (autoItems.length === 0) {
        // 자동 할당 없이 잔액 발생
        warnings.push(
          `분배되지 않은 금액 ${finalRemainingAmount.toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}원이 남았습니다.`
        );
      } else if (Math.abs(finalRemainingAmount) > 1) {
        // 자동 할당에도 큰 오차가 남으면 (1원 이상)
        warnings.push(
          `자동 할당 계산 후에도 ${finalRemainingAmount.toLocaleString(
            undefined,
            { maximumFractionDigits: 0 }
          )}원의 잔액/오차가 발생했습니다. 설정을 확인해주세요.`
        );
      }
    }
  }

  return {
    planWithAllocations: planWithAllocations.map((p) => ({
      ...p,
      allocatedAmount: Math.round(p.allocatedAmount),
    })), // 최종 할당액 반올림
    totalAllocated: Math.round(totalAllocated),
    remainingAmount: Math.round(finalRemainingAmount),
    warnings,
  };
};
