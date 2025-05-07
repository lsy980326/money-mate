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
  estimatedMonthlyExpenses: number = 0 // 사용자가 입력하거나 기본값 설정
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

// TODO: 연봉 상승률을 고려한 미래 예상 수입/저축액 계산 함수 등 추가 가능
