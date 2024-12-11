import React, { createContext, useState, useContext } from "react";

// 1. Context 생성
const AppContext = createContext();

// 2. Context 제공자 컴포넌트
export function AppProvider({ children }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [coordinate, setCoordinate] = useState({
    // 지도의 초기 위치
    center: { lat: 33.450701, lng: 126.570667 },
    // 지도 위치 변경시 panto를 이용할지에 대해서 정의
    isPanto: false,
  });

  const [openMarkerId, setOpenMarkerId] = useState(null);
  const openInfo = (id) => {
    setOpenMarkerId(id);
    setIsModalOpen(false);
  }

  const closeInfo = () => {
    setOpenMarkerId(null);
  }

  return (
    <AppContext.Provider
      value={{
        coordinate,
        setCoordinate,
        isModalOpen,
        openModal,
        closeModal,
        openMarkerId,
        openInfo,
        closeInfo
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// 3. Context를 쉽게 가져오도록 Custom Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
