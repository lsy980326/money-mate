import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 수입 정보 상태 타입 정의
interface IncomeState {
  annualSalary: number; // 연봉 (세전)
  netMonthlyIncome: number; // 월 실수령액
  expectedAnnualRaiseRate: number; // 예상 연봉 상승률 (%)
  // salaryHistory: { year: number, salary: number }[]; // (선택적 확장) 연봉 변경 이력
}

// 액션 타입 정의
interface IncomeActions {
  setAnnualSalary: (salary: number) => void;
  setNetMonthlyIncome: (income: number) => void;
  setExpectedAnnualRaiseRate: (rate: number) => void;
  setIncomeDetails: (details: Partial<IncomeState>) => void;
  resetIncome: () => void;
}

// 초기 상태
const initialState: IncomeState = {
  annualSalary: 0,
  netMonthlyIncome: 0,
  expectedAnnualRaiseRate: 0, // 0%
};

// 스토어 생성 (persist 미들웨어 적용)
const useIncomeStore = create(
  persist<IncomeState & IncomeActions>(
    (set) => ({
      ...initialState,

      setAnnualSalary: (salary) =>
        set({ annualSalary: salary > 0 ? salary : 0 }),

      setNetMonthlyIncome: (income) =>
        set({ netMonthlyIncome: income > 0 ? income : 0 }),

      setExpectedAnnualRaiseRate: (rate) =>
        set({ expectedAnnualRaiseRate: rate >= 0 && rate <= 100 ? rate : 0 }), // 0~100% 사이 값

      setIncomeDetails: (details) => set((state) => ({ ...state, ...details })),

      resetIncome: () => set(initialState),
    }),
    {
      name: "money-mate-income-storage", // LocalStorage 키 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useIncomeStore;
