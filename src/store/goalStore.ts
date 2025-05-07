import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 목표 상태의 타입 정의
interface GoalState {
  targetAmount: number;
  targetYears: number;
  currentSavings: number; // << 추가됨
}

// 액션 타입 정의
interface GoalActions {
  setTargetAmount: (amount: number) => void;
  setTargetYears: (years: number) => void;
  setCurrentSavings: (savings: number) => void; // << 추가됨
  setGoal: (goal: Partial<GoalState>) => void;
  resetGoal: () => void;
}

// 초기 상태
const initialState: GoalState = {
  targetAmount: 0,
  targetYears: 10,
  currentSavings: 0, // << 추가됨
};

// 스토어 생성
const useGoalStore = create(
  persist<GoalState & GoalActions>(
    (set) => ({
      // 초기 상태값들을 직접 할당
      targetAmount: initialState.targetAmount,
      targetYears: initialState.targetYears,
      currentSavings: initialState.currentSavings, // << 추가됨

      setTargetAmount: (amount) =>
        set((state) => ({ targetAmount: amount > 0 ? amount : 0 })),

      setTargetYears: (years) =>
        set((state) => ({ targetYears: years > 0 ? years : 1 })),

      setCurrentSavings: (
        savings // << 추가됨
      ) => set((state) => ({ currentSavings: savings >= 0 ? savings : 0 })),

      setGoal: (goal) => set((state) => ({ ...state, ...goal })),

      resetGoal: () => set(initialState),
    }),
    {
      name: "money-mate-goal-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGoalStore;
