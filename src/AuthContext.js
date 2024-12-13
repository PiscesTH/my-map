import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "./axios";

// AuthContext 생성
const AuthContext = createContext();

// AuthContext를 사용하기 위한 커스텀 훅
export function useAuth() {
  return useContext(AuthContext);
}

// AuthProvider 컴포넌트
export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token) => {
    sessionStorage.setItem("accessToken", token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await axios.post("/user/sign-out");
    sessionStorage.clear();
    setIsLoggedIn(false);
    window.location.reload();
  };

/*   // 토큰 갱신 함수
  const handleTokenRefresh = async () => {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      // Refresh token이 없으면 로그아웃 처리
      logout();
      return;
    }

    try {
      const response = await axios.get("/user/refresh-token");

      const newAccessToken = response.data.data.accessToken;
      // 새로 발급받은 access token을 쿠키에 저장
      Cookies.set("accessToken", newAccessToken, {
        // HttpOnly: true,
        // Secure: true,
        SameSite: "Strict",
      });
    } catch (error) {
      console.error("다시 로그인 해주세요.");
      logout(); // 토큰 갱신 실패 시 로그아웃 처리
    }
  }; */

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
