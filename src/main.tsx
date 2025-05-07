import React from "react";
import ReactDOM from "react-dom/client";
// import { Provider } from 'react-redux'; // Provider import 제거
import App from "./App.tsx";
// import { store } from './store'; // Redux 스토어 import 제거

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <Provider store={store}> </Provider> Redux Provider 제거 */}
    <App />
  </React.StrictMode>
);
