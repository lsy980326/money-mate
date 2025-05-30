import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - 페이지를 찾을 수 없습니다.</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <Link to="/">홈으로 돌아가기</Link>
    </div>
  );
};

export default NotFoundPage;
