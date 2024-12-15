import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "./axios";

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
    center: { lat: 33.450701, lng: 126.570667 },
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get("/user/coordinate");
  //       const data = res.data.data;
  //       setCoordinate({
  //         center: { lat: data.lat, lng: data.lng },
  //         isPanto: false,
  //       })
  //       console.log('Request Headers:', res.config.headers);
  //     } catch(err) {
  //       console.log(err);
  //     }
  //   }
  //   if (sessionStorage.getItem('accessToken')) {
  //     fetchData();
  //   }
  // },[])

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
