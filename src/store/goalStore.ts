import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface GoalState {
  targetAmount: number;
  targetYears: number;
  currentSavings: number;
  estimatedMonthlyExpenses: number; // << 추가됨
}

interface GoalActions {
  setTargetAmount: (amount: number) => void;
  setTargetYears: (years: number) => void;
  setCurrentSavings: (savings: number) => void;
  setEstimatedMonthlyExpenses: (expenses: number) => void; // << 추가됨
  setGoal: (goal: Partial<GoalState>) => void;
  resetGoal: () => void;
}

const initialState: GoalState = {
  targetAmount: 0,
  targetYears: 10,
  currentSavings: 0,
  estimatedMonthlyExpenses: 0, // << 초기값 추가
};

const useGoalStore = create(
  persist<GoalState & GoalActions>(
    (set) => ({
      // 초기 상태값들을 직접 할당
      targetAmount: initialState.targetAmount,
      targetYears: initialState.targetYears,
      currentSavings: initialState.currentSavings,
      estimatedMonthlyExpenses: initialState.estimatedMonthlyExpenses, // << 초기값 할당

      setTargetAmount: (amount) =>
        set((state) => ({ targetAmount: amount > 0 ? amount : 0 })),

      setTargetYears: (years) =>
        set((state) => ({ targetYears: years > 0 ? years : 1 })),

      setCurrentSavings: (savings) =>
        set((state) => ({ currentSavings: savings >= 0 ? savings : 0 })),

      setEstimatedMonthlyExpenses: (
        expenses // << 액션 정의 추가
      ) =>
        set((state) => ({
          estimatedMonthlyExpenses: expenses >= 0 ? expenses : 0,
        })),

      setGoal: (goal) => set((state) => ({ ...state, ...goal })),

      resetGoal: () => set(initialState),
    }),
    {
      name: "money-mate-goal-storage", // LocalStorage 키 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGoalStore;
