// DefaultTheme을 직접 import 하는 대신, styled.d.ts 파일에서 확장된 타입을 사용합니다.
// 따라서 이 파일에서는 DefaultTheme import가 필요 없습니다.

// theme 객체의 타입을 명시적으로 지정하고 싶다면,
// 아래와 같이 styled-components에서 제공하는 타입을 직접 사용하거나,
// 아니면 styled.d.ts에 정의된 타입을 사용할 수 있습니다.
// 여기서는 별도의 import 없이 타입 추론에 맡기거나,
// styled.d.ts에 정의된 DefaultTheme을 사용할 수 있도록 합니다.

// 예시: theme 객체에 타입 명시 (선택 사항)
// import { DefaultTheme } from 'styled-components'; // 이 라인 삭제
// const theme: DefaultTheme = { ... }; // 이렇게 하면 styled.d.ts가 필수입니다.

// 또는 이렇게 타입을 명시하지 않고, styled.d.ts 파일이 타입 추론을 돕도록 합니다.
const theme = {
  // DefaultTheme import 제거
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    light: "#f8f9fa",
    dark: "#343a40",
    text: "#212529",
    background: "#ffffff",
    appBackground: "#f4f7f6",
  },
  fontSizes: {
    small: "0.875rem",
    medium: "1rem",
    large: "1.25rem",
    xlarge: "1.5rem",
  },
  spacings: {
    xsmall: "4px",
    small: "8px",
    medium: "16px",
    large: "24px",
    xlarge: "32px",
  },
  breakpoints: {
    mobile: "576px",
    tablet: "768px",
    desktop: "992px",
  },
};

// styled.d.ts 파일은 그대로 유지해야 합니다.
// src/styled.d.ts
/*
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme { // 이 부분이 중요합니다.
    colors: {
      primary: string;
      // ... (나머지 속성들)
    };
    // ... (나머지 속성들)
  }
}
*/

export default theme;
