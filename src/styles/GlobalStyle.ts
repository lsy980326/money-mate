import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 간단한 CSS 리셋 */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    line-height: 1.6;
    background-color: #f4f7f6; /* 앱 전체 배경색 (예시) */
    color: #333; /* 기본 텍스트 색상 (예시) */
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ul, ol {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  input, textarea, select, button {
    font-family: inherit;
    font-size: inherit;
  }
`;

export default GlobalStyle;
