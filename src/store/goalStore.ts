import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // persist와 createJSONStorage import

// 목표 상태의 타입 정의
interface GoalState {
  targetAmount: number;
  targetYears: number;
}

// 액션 타입 정의
interface GoalActions {
  setTargetAmount: (amount: number) => void;
  setTargetYears: (years: number) => void;
  setGoal: (goal: Partial<GoalState>) => void;
  resetGoal: () => void;
}

// 초기 상태 (persist 미들웨어 사용 시, 초기값은 persist 옵션 내에서 설정 가능)
const initialState: GoalState = {
  targetAmount: 0,
  targetYears: 10,
};

// 스토어 생성
const useGoalStore = create(
  persist<GoalState & GoalActions>( // persist 미들웨어로 감싸기
    (set) => ({
      ...initialState, // 초기 상태는 여기서도 정의할 수 있지만, persist 옵션에서 하는 것이 일반적

      setTargetAmount: (amount) =>
        set((state) => ({ targetAmount: amount > 0 ? amount : 0 })),

      setTargetYears: (years) =>
        set((state) => ({ targetYears: years > 0 ? years : 1 })),

      setGoal: (goal) => set((state) => ({ ...state, ...goal })),

      resetGoal: () => set(initialState), // resetGoal은 초기 상태(initialState)로 돌림
    }),
    {
      name: "money-mate-goal-storage", // LocalStorage에 저장될 때 사용될 키 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useGoalStore;
