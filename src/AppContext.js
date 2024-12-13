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
  
  const [coordinate, setCoordinate] = useState(null);

  const [openMarkerId, setOpenMarkerId] = useState(null);
  const openInfo = (id) => {
    setOpenMarkerId(id);
    setIsModalOpen(false);
  }

  const closeInfo = () => {
    setOpenMarkerId(null);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/user/coordinate");
        const data = res.data.data;
        console.log(data);
        setCoordinate({
          center: { lat: data.lat, lng: data.lng },
          isPanto: false,
        })
      } catch(err) {
        console.log(err);
      }
    }
    fetchData();
    console.log("target active")
  },[])

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
