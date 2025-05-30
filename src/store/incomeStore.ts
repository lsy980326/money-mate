import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid"; // npm install uuid @types/uuid

// 분배 항목 타입
export interface DistributionItem {
  id: string;
  name: string;
  type: "percentage" | "fixed" | "auto";
  value: number; // 'auto' 타입일 경우 이 값은 무시되거나, 분배된 비율/금액으로 업데이트될 수 있음
}

// 수입 정보 상태 타입 정의
interface IncomeState {
  annualSalary: number;
  netMonthlyIncome: number;
  expectedAnnualRaiseRate: number;
  distributionPlan: DistributionItem[];
  autoAllocateItemIds: string[]; // 자동 할당될 항목들의 ID 배열
}

// 액션 타입 정의
interface IncomeActions {
  setAnnualSalary: (salary: number) => void;
  setNetMonthlyIncome: (income: number) => void;
  setExpectedAnnualRaiseRate: (rate: number) => void;
  setIncomeDetails: (
    details: Partial<
      Omit<IncomeState, "distributionPlan" | "autoAllocateItemIds">
    >
  ) => void;
  resetIncomeInfo: () => void;

  setDistributionPlan: (plan: DistributionItem[]) => void;
  addDistributionItem: (item: Omit<DistributionItem, "id">) => void;
  updateDistributionItem: (
    id: string,
    updatedItem: Partial<Omit<DistributionItem, "id">>
  ) => void;
  removeDistributionItem: (id: string) => void;
  resetDistributionPlan: () => void;
  toggleAutoAllocateItem: (id: string) => void; // ID를 토글하는 액션
}

const initialIncomeInfoState = {
  annualSalary: 0,
  netMonthlyIncome: 0,
  expectedAnnualRaiseRate: 0,
};

const initialDistributionPlanState: DistributionItem[] = [
  { id: uuidv4(), name: "생활비", type: "percentage", value: 50 },
  { id: uuidv4(), name: "비상금", type: "percentage", value: 10 },
  { id: uuidv4(), name: "투자", type: "percentage", value: 20 },
  { id: uuidv4(), name: "적금", type: "percentage", value: 20 },
];

const useIncomeStore = create(
  persist<IncomeState & IncomeActions>(
    (set, get) => ({
      // get 함수 사용을 위해 추가
      ...initialIncomeInfoState,
      distributionPlan: initialDistributionPlanState,
      autoAllocateItemIds: [], // 초기값 빈 배열

      setAnnualSalary: (salary) =>
        set({ annualSalary: salary > 0 ? salary : 0 }),
      setNetMonthlyIncome: (income) =>
        set({ netMonthlyIncome: income > 0 ? income : 0 }),
      setExpectedAnnualRaiseRate: (rate) =>
        set({ expectedAnnualRaiseRate: rate >= 0 && rate <= 100 ? rate : 0 }),
      setIncomeDetails: (details) => set((state) => ({ ...state, ...details })),
      resetIncomeInfo: () => set(initialIncomeInfoState),

      setDistributionPlan: (plan) => set({ distributionPlan: plan }),
      addDistributionItem: (item) =>
        set((state) => ({
          distributionPlan: [
            ...state.distributionPlan,
            { ...item, id: uuidv4() },
          ],
        })),
      updateDistributionItem: (id, updatedItem) =>
        set((state) => {
          let newAutoAllocateIds = [...state.autoAllocateItemIds];
          const newPlan = state.distributionPlan.map((item) => {
            if (item.id === id) {
              // 만약 'auto'가 아닌 타입으로 변경되면 자동 할당 목록에서 제거
              // (이 로직은 toggleAutoAllocateItem에서 더 명확하게 처리됨)
              if (
                updatedItem.type &&
                updatedItem.type !== "auto" &&
                newAutoAllocateIds.includes(id)
              ) {
                // newAutoAllocateIds = newAutoAllocateIds.filter(autoId => autoId !== id);
                // 이 부분은 toggleAutoAllocateItem에 의해 관리되므로, 여기서는 타입/값만 업데이트
              }
              return { ...item, ...updatedItem };
            }
            return item;
          });
          return {
            distributionPlan: newPlan,
            autoAllocateItemIds: newAutoAllocateIds,
          };
        }),
      removeDistributionItem: (id) =>
        set((state) => ({
          distributionPlan: state.distributionPlan.filter(
            (item) => item.id !== id
          ),
          autoAllocateItemIds: state.autoAllocateItemIds.filter(
            (autoId) => autoId !== id
          ),
        })),
      resetDistributionPlan: () =>
        set({
          distributionPlan: initialDistributionPlanState,
          autoAllocateItemIds: [],
        }),
      toggleAutoAllocateItem: (id) => {
        const currentPlan = [...get().distributionPlan]; // get() 사용
        const currentAutoIds = [...get().autoAllocateItemIds]; // get() 사용
        let newAutoIds = [...currentAutoIds];
        let targetItemIndex = currentPlan.findIndex((item) => item.id === id);

        if (targetItemIndex === -1) return;

        const isCurrentlyAuto = newAutoIds.includes(id);

        if (isCurrentlyAuto) {
          // 자동 할당 해제
          newAutoIds = newAutoIds.filter((autoId) => autoId !== id);
          // 해제 시 타입을 percentage, value 0으로 (또는 사용자가 마지막으로 설정했던 값으로 복원 - 복잡)
          currentPlan[targetItemIndex] = {
            ...currentPlan[targetItemIndex],
            type: "percentage",
            value: 0,
          };
        } else {
          // 자동 할당 설정
          newAutoIds.push(id);
          currentPlan[targetItemIndex] = {
            ...currentPlan[targetItemIndex],
            type: "auto",
            value: 0,
          }; // 자동 할당 시 value는 0
        }
        set({ autoAllocateItemIds: newAutoIds, distributionPlan: currentPlan });
      },
    }),
    {
      name: "money-mate-income-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useIncomeStore;
