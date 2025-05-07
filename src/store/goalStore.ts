import { create } from "zustand";

// 목표 상태의 타입 정의
interface GoalState {
  targetAmount: number;
  targetYears: number;
  // currentSavings: number; // 나중에 추가할 수 있음
}

// 액션 타입 정의 (선택 사항이지만, 가독성을 위해 권장)
interface GoalActions {
  setTargetAmount: (amount: number) => void;
  setTargetYears: (years: number) => void;
  setGoal: (goal: Partial<GoalState>) => void;
  resetGoal: () => void;
}

// 초기 상태
const initialState: GoalState = {
  targetAmount: 0,
  targetYears: 10, // 기본 10년
};

// 스토어 생성
// create 함수의 콜백은 (set, get, api)를 인자로 받습니다.
// set: 상태를 업데이트하는 함수
// get: 현재 상태를 가져오는 함수 (주로 미들웨어나 스토어 내부 로직에서 사용)
const useGoalStore = create<GoalState & GoalActions>((set) => ({
  ...initialState, // 초기 상태 설정

  // 액션 정의
  setTargetAmount: (amount) =>
    set((state) => ({ targetAmount: amount > 0 ? amount : 0 })),

  setTargetYears: (years) =>
    set((state) => ({ targetYears: years > 0 ? years : 1 })),

  setGoal: (goal) => set((state) => ({ ...state, ...goal })),

  resetGoal: () => set(initialState),
}));

export default useGoalStore;
