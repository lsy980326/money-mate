import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyle";
import theme from "./styles/theme"; // 방금 만든 theme 파일
import MainLayout from "./layouts/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import GoalPage from "./pages/GoalPage";
import IncomePage from "./pages/IncomePage";
import DataViewPage from "./pages/DataViewPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            }
          />
          <Route
            path="/goal"
            element={
              <MainLayout>
                <GoalPage />
              </MainLayout>
            }
          />
          <Route
            path="/income"
            element={
              <MainLayout>
                <IncomePage />
              </MainLayout>
            }
          />
          <Route
            path="/summary"
            element={
              <MainLayout>
                <DataViewPage />
              </MainLayout>
            }
          />
          <Route
            path="*"
            element={
              <MainLayout>
                <NotFoundPage />
              </MainLayout>
            }
          />{" "}
          {/* 404 페이지 */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
