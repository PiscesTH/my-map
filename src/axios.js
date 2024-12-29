import axios from "axios";
axios.defaults.withCredentials = true;

// Axios 기본 설정
const axiosInstance = axios.create({
  baseURL: "/api", // localtest url
  // baseURL: "http://192.168.200.188:8080/api",
  timeout: 10000, // 요청 타임아웃 설정(10초)
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    // 쿠키에서 accessToken 가져오기
    const token = sessionStorage.getItem("accessToken");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && sessionStorage.getItem("accessToken") && !originalRequest._retry) {
      // 토큰이 만료된 경우
      originalRequest._retry = true; // 무한 루프 방지
      try {
        await handleTokenRefresh(); 
        const newToken = sessionStorage.getItem("accessToken"); 
        originalRequest.headers.Authorization = `Bearer ${newToken}`; // 갱신된 토큰으로 요청 헤더 설정
        return axiosInstance(originalRequest); // 실패한 요청 재시도
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // 갱신 실패 시 로그아웃 처리 또는 에러 처리
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function handleTokenRefresh() {
  const response = await axiosInstance.get("/user/refresh-token");
  const accessToken = response.data.data.accessToken;
  // 새로운 access token을 쿠키에 저장
  sessionStorage.setItem("accessToken", accessToken);

  return accessToken;
}

export default axiosInstance;
